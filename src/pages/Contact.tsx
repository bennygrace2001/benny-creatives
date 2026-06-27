import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';

export default function Contact() {
  const { content } = useContent();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In a real app without a backend to send emails directly, 
    // we use mailto: or a service like Formspree.
    // For this demonstration, we'll format a mailto link.
    const mailtoUrl = `mailto:bennygrace2001@gmail.com?subject=${encodeURIComponent(formData.subject || 'Website Inquiry')}&body=${encodeURIComponent(
      `Name: ${formData.fullName}\nEmail: ${formData.email}\nPhone: ${formData.phoneNumber}\n\nMessage:\n${formData.message}`
    )}`;

    window.location.href = mailtoUrl;
    
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="w-full pt-16 pb-24">
      <section className="py-20 bg-gray-50 dark:bg-zinc-950 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Contact Us</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Get in touch with us for your next big project.
        </p>
        <div className="w-20 h-1 bg-red-600 mx-auto rounded-full mt-8"></div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-3 gap-16">
          
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold mb-8">Get In Touch</h3>
              
              <div className="space-y-6">
                <a href="tel:08039542598" className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-red-600/10 text-red-600 rounded-full flex items-center justify-center shrink-0 group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">Phone Number</h4>
                    <p className="text-gray-600 dark:text-gray-400">{content.contactPhone}</p>
                  </div>
                </a>
                
                <a href={`mailto:${content.contactEmail}`} className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-red-600/10 text-red-600 rounded-full flex items-center justify-center shrink-0 group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">Email Address</h4>
                    <p className="text-gray-600 dark:text-gray-400 break-all">{content.contactEmail}</p>
                  </div>
                </a>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-600/10 text-red-600 rounded-full flex items-center justify-center shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">Business Location</h4>
                    <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">{content.contactAddress}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
              <h4 className="font-bold mb-4">Instant Reply</h4>
              <a 
                href="https://wa.me/2348039542598?text=Hello,%20I%20would%20like%20to%20discuss%20a%20project."
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-[#25D366] text-white font-bold hover:bg-[#1ebd5a] transition-all transform hover:-translate-y-1 shadow-lg shadow-[#25D366]/20"
              >
                <MessageCircle size={24} />
                Chat With Me Now
              </a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-3xl p-8 lg:p-12 shadow-sm border border-gray-100 dark:border-gray-800"
          >
            <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
            
            {submitted ? (
              <div className="text-center py-12">
                <h4 className="text-2xl font-bold mb-2">Message Prepared!</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Your default email client should open shortly to send the message.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-red-600 font-medium hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input 
                      type="text" 
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <input 
                      type="text" 
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea 
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-10 py-4 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  Send Message
                </button>
              </form>
            )}
          </motion.div>

        </div>
      </section>
    </div>
  );
}
