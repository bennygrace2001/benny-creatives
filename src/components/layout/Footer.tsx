import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Phone, Mail, Settings } from 'lucide-react'; // TikTok icon isn't in lucide, using custom/similar
import { useContent } from '../../contexts/ContentContext';

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { content } = useContent();

  return (
    <footer className="bg-gray-50 dark:bg-zinc-950 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-2xl font-bold tracking-tighter text-black dark:text-white transition-colors inline-block mb-4">
              BENNY<span className="text-red-600">GRACE</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm">
              {content.footerDescription}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-red-600 transition-colors transform hover:-translate-y-1">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-600 transition-colors transform hover:-translate-y-1">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-600 transition-colors transform hover:-translate-y-1">
                <TikTokIcon className="w-6 h-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-black dark:text-white font-semibold mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-3">
              {['Home', 'About Us', 'Services', 'Portfolio', 'Training', 'Vision'].map((item) => (
                <li key={item}>
                  <Link 
                    to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-600 dark:text-gray-400 hover:text-red-600 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-black dark:text-white font-semibold mb-4 text-lg">Contact</h3>
            <ul className="space-y-3">
              <li>
                <a href={`mailto:${content.contactEmail}`} className="flex items-center text-gray-600 dark:text-gray-400 hover:text-red-600 transition-colors group break-all">
                  <Mail size={18} className="mr-3 shrink-0 group-hover:scale-110 transition-transform" />
                  {content.contactEmail}
                </a>
              </li>
              <li>
                <a href={`https://wa.me/${content.contactPhone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-red-600 transition-colors group">
                  <Phone size={18} className="mr-3 shrink-0 group-hover:scale-110 transition-transform" />
                  {content.contactPhone}
                </a>
              </li>
              <li>
                <span className="flex items-start text-gray-600 dark:text-gray-400 mt-2 whitespace-pre-line">
                  {content.contactAddress}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} Benny Grace. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 relative group">
            <Link 
              to="/admin/login" 
              className="text-gray-400 hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-400 opacity-20 hover:opacity-100 transition-opacity p-2 block"
              aria-label="Admin Dashboard"
            >
              <Settings size={16} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
