import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { supabase, hasSupabaseConfig } from '../lib/supabase';
import { resizeImage } from '../utils/imageCompressor';

interface FileUploadProps {
  onUpload: (urls: string[]) => void;
  onUploadStart?: () => void;
  multiple?: boolean;
  maxSizeMB?: number;
  bucketName?: string;
  buttonText?: string;
  className?: string;
}

export default function FileUpload({ 
  onUpload, 
  onUploadStart,
  multiple = false, 
  maxSizeMB = 20,
  bucketName = 'images',
  buttonText = 'Upload Image',
  className = ''
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    setIsUploading(true);
    if (onUploadStart) onUploadStart();
    const uploadedUrls: string[] = [];
    const newPreviews: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File ${file.name} is too large. Max size is ${maxSizeMB}MB.`);
        continue;
      }

      try {
        if (hasSupabaseConfig) {
          const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
          const randomName = Math.random().toString(36).substring(2, 12);
          const timestamp = Date.now();
          const fileName = `${randomName}_${timestamp}.${fileExt}`;
          
          const filePath = fileName;

          const { error: uploadError } = await supabase.storage
            .from(bucketName.trim())
            .upload(filePath, file, { cacheControl: '3600', upsert: false });

          if (uploadError) {
            console.error("Supabase upload error:", uploadError);
            
            // If bucket doesn't exist, try a default bucket or fallback to base64
            if (uploadError.message.includes('not found') || uploadError.message.includes('Invalid path')) {
              // Try falling back to a general 'images' bucket first
              if (bucketName !== 'images') {
                const { error: retryError } = await supabase.storage
                  .from('images')
                  .upload(filePath, file, { cacheControl: '3600', upsert: false });
                
                if (!retryError) {
                  const { data } = supabase.storage.from('images').getPublicUrl(filePath);
                  uploadedUrls.push(data.publicUrl);
                  newPreviews.push(data.publicUrl);
                  continue; // Success with fallback bucket
                }
              }
              
              // If both failed, fallback to base64 locally
              const compressed = await resizeImage(file, 800);
              uploadedUrls.push(compressed);
              newPreviews.push(compressed);
              // Don't show a scary error if we successfully fell back to local storage
              console.warn(`Falling back to local storage for ${file.name} because bucket ${bucketName} was not found.`);
            } else {
              // For other errors, show them but still try to fallback
              setError(uploadError.message);
              const compressed = await resizeImage(file, 800);
              uploadedUrls.push(compressed);
              newPreviews.push(compressed);
            }
          } else {
            const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
            uploadedUrls.push(data.publicUrl);
            newPreviews.push(data.publicUrl);
          }
        } else {
          const compressed = await resizeImage(file, 800);
          uploadedUrls.push(compressed);
          newPreviews.push(compressed);
        }
      } catch (err) {
        console.error("Error processing file:", err);
        setError("Error processing file.");
      }
    }

    setPreviews(multiple ? [...previews, ...newPreviews] : newPreviews);
    onUpload(uploadedUrls);
    setIsUploading(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removePreview = (index: number) => {
    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  return (
    <div className={`w-full ${className}`}>
      <div 
        className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
          isUploading ? 'border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50' : 'border-gray-300 hover:border-red-500 bg-gray-50 dark:border-gray-700 dark:bg-zinc-900'
        } ${error ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : ''}`}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        {isUploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="w-8 h-8 text-red-600 animate-spin mb-2" />
            <span className="text-sm text-gray-500">Uploading...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className={`w-8 h-8 mb-2 ${error ? 'text-red-500' : 'text-gray-400'}`} />
            <span className="text-sm font-medium">{buttonText}</span>
            <span className="text-xs text-gray-500 mt-1">
              Max size: {maxSizeMB}MB {multiple ? '(Multiple allowed)' : ''}
            </span>
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          multiple={multiple} 
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-600 font-medium flex items-center gap-1">
          <AlertCircle size={12} /> {error}
        </p>
      )}

      {previews.length > 0 && (
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-4">
          {previews.map((preview, idx) => (
            <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              {multiple && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removePreview(idx);
                  }}
                  className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
