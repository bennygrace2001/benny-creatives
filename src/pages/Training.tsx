import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase, hasSupabaseConfig } from '../lib/supabase';
import { useContent } from '../contexts/ContentContext';
import { useData } from '../contexts/DataContext';

export default function Training() {
  const { content } = useContent();
  const { projects } = useData();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    selectedProject: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 20 * 1024 * 1024) {
        setError("File is too large. Max size is 20MB.");
        setFile(null);
        e.target.value = '';
      } else {
        setError(null);
        setFile(selectedFile);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError("Please upload a proof of payment.");
      return;
    }

    if (!hasSupabaseConfig) {
      // Simulate success if no supabase config
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setSuccess(true);
        triggerWhatsAppRedirect();
      }, 1500);
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `payment_proofs/${fileName}`;

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('training')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('training')
        .getPublicUrl(filePath);

      // 2. Save application record to database
      const { error: dbError } = await supabase
        .from('training_applications')
        .insert([
          {
            name: formData.fullName,
            email: formData.email,
            phone: formData.phoneNumber,
            payment_proof_url: publicUrl,
            status: 'pending'
          }
        ]);

      if (dbError) throw dbError;

      setSuccess(true);
      triggerWhatsAppRedirect();

    } catch (err: any) {
      console.error("Submission error:", err);
      setError(err.message || "An error occurred during submission. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerWhatsAppRedirect = () => {
    const selectedTitle = projects.find(p => p.id === formData.selectedProject)?.title || "your training program";
    const message = `Hello, this is the proof of my payment. I am interested in joining the ${selectedTitle} Training Program.`;
    const url = `https://wa.me/2348039542598?text=${encodeURIComponent(message)}`;
    // Wait a brief moment for the user to see the success message, then redirect
    setTimeout(() => {
      window.open(url, '_blank');
    }, 2000);
  };

  return (
    <div className="w-full pt-16 pb-24">
      <section className="py-20 bg-gray-50 dark:bg-zinc-950 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Digital Training</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Master Graphics Design & AI Web Design.
        </p>
        <div className="w-20 h-1 bg-red-600 mx-auto rounded-full mt-8"></div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16">
          
          {/* Course Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="inline-flex items-center justify-center p-3 bg-red-600/10 text-red-600 rounded-2xl mb-6">
              <BookOpen size={32} />
            </div>
            <h2 className="text-3xl font-bold mb-6">Learn The Skills of The Future</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 leading-relaxed">
              Join our comprehensive training program designed to take you from a beginner to a professional in digital creativity. 
              We cover industry-standard tools, AI-powered design workflows, and modern web development practices.
            </p>

            <div className="bg-gray-50 dark:bg-zinc-900 rounded-3xl p-8 mb-8 border border-gray-100 dark:border-gray-800">
              <h3 className="text-xl font-bold mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">Enrollment Process</h3>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="font-bold text-lg">Make Payment</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">Pay the enrollment fee to our designated bank account:</p>
                    <div className="bg-white dark:bg-black p-4 rounded-xl border border-gray-200 dark:border-gray-800 text-sm mb-2 shadow-sm">
                      <p className="mb-1"><span className="font-semibold text-gray-500">Bank:</span> {content.bankName}</p>
                      <p className="mb-1"><span className="font-semibold text-gray-500">Account No:</span> <span className="font-mono text-base font-bold tracking-wider text-black dark:text-white">{content.accountNumber}</span></p>
                      <p><span className="font-semibold text-gray-500">Account Name:</span> {content.accountName}</p>
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="font-bold text-lg">Upload Proof</h4>
                    <p className="text-gray-600 dark:text-gray-400">Fill the form and upload your payment receipt.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="font-bold text-lg">Get Access</h4>
                    <p className="text-gray-600 dark:text-gray-400">You will be redirected to WhatsApp for immediate onboarding.</p>
                  </div>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Upload Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl p-8 lg:p-12 shadow-xl border border-gray-100 dark:border-gray-800"
          >
            <h3 className="text-2xl font-bold mb-6">Payment Upload Form</h3>
            
            {!hasSupabaseConfig && (
              <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-xl flex items-start gap-3 text-sm">
                <AlertCircle className="shrink-0 mt-0.5" size={16} />
                <p>Database connection is not configured. Submissions will be simulated for this preview.</p>
              </div>
            )}

            {success ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h4 className="text-2xl font-bold mb-2">Upload Successful!</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Redirecting you to WhatsApp to complete your enrollment...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Select Program (From Portfolio)</label>
                  <select
                    name="selectedProject"
                    required
                    value={formData.selectedProject}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData(prev => ({ ...prev, selectedProject: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                  >
                    <option value="" disabled>Select a program...</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>{project.title}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input 
                    type="text" 
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phoneNumber"
                    required
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                    placeholder="+234..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Upload Proof of Payment</label>
                  <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <input 
                      type="file" 
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="mx-auto text-gray-400 mb-3" size={32} />
                    <p className="text-sm font-medium">
                      {file ? file.name : "Click or drag file to upload"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">JPEG, PNG, or PDF (Max 20MB)</p>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed shadow-lg shadow-red-600/20"
                >
                  {isSubmitting ? 'Uploading...' : 'Submit Payment Proof'}
                </button>
              </form>
            )}
          </motion.div>

        </div>
      </section>
    </div>
  );
}
