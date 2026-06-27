import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, MessageSquare, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContent } from '../contexts/ContentContext';
import { useData } from '../contexts/DataContext';
import ProjectGallery from '../components/ProjectGallery';
import { resizeImage } from '../utils/imageCompressor';

const whyChooseUs = [
  'Professional Designs',
  'Fast Delivery',
  'Affordable Pricing',
  'Modern Technology',
  'Dedicated Support',
  'Quality Assurance',
];

export default function Home() {
  const { content } = useContent();
  const { services, projects, testimonials, addTestimonial } = useData();

  const [testimonyForm, setTestimonyForm] = useState({
    name: '',
    company: '',
    message: '',
    image_url: ''
  });

  const [isTestimonyFormOpen, setIsTestimonyFormOpen] = useState(false);

  const handleTestimonySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addTestimonial(testimonyForm);
    setIsTestimonyFormOpen(false);
    setTestimonyForm({ name: '', company: '', message: '', image_url: '' });
    alert("Testimonial submitted successfully!");
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight whitespace-pre-line">
                {content.heroHeadlinePart1} <br className="hidden lg:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">
                  {content.heroHeadlinePart2}
                </span> <br className="hidden lg:block"/>
                {content.heroHeadlinePart3}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-xl leading-relaxed whitespace-pre-line">
                {content.heroSubheadline}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="https://wa.me/2348039542598?text=Hello,%20I%20would%20like%20to%20hire%20you%20for%20a%20project." 
                  target="_blank" rel="noopener noreferrer"
                  className="px-8 py-4 rounded-full bg-red-600 text-white font-medium hover:bg-red-700 transition-all text-center transform hover:-translate-y-1 shadow-lg shadow-red-600/30"
                >
                  Hire Me
                </a>
                <a 
                  href="https://wa.me/2348039542598?text=Hello,%20I%20am%20interested%20in%20your%20services." 
                  target="_blank" rel="noopener noreferrer"
                  className="px-8 py-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-gray-900 dark:hover:bg-gray-100 transition-all text-center transform hover:-translate-y-1"
                >
                  Chat on WhatsApp
                </a>
                <Link 
                  to="/training"
                  className="px-8 py-4 rounded-full border border-gray-300 dark:border-gray-700 font-medium hover:border-red-600 hover:text-red-600 transition-all text-center group flex items-center justify-center gap-2"
                >
                  Learn AI Web Design
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-red-600/20 to-transparent rounded-3xl blur-2xl"></div>
              <img 
                src="https://i.ibb.co/9k5wYv1T/file-00000000102871fd92791e2823bce5c9.png" 
                alt="AI Web Design and Graphics" 
                className="relative rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 object-cover h-[600px] w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 bg-gray-50 dark:bg-zinc-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Services</h2>
            <div className="w-20 h-1 bg-red-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.slice(0, 12).map((service, i) => (
              <motion.div 
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:border-red-500 dark:hover:border-red-500 transition-colors group flex flex-col h-full"
              >
                <div className="w-full h-40 mb-4 rounded-xl overflow-hidden">
                  <img src={service.image_url} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-red-600 transition-colors">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow line-clamp-3">{service.description}</p>
                <Link to="/services" className="text-sm font-medium text-red-600 flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
                  Explore <ArrowRight size={16} />
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/services" className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-gray-300 dark:border-gray-700 font-medium hover:border-red-600 hover:text-red-600 transition-all">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="py-24 bg-gray-50/50 dark:bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black mb-6 tracking-tight"
            >
              Featured <span className="text-red-600">Work</span>
            </motion.h2>
            <div className="w-20 h-1.5 bg-red-600 mx-auto rounded-full"></div>
          </div>
          
          <ProjectGallery limit={6} showFilters={false} />
          
          <div className="mt-16 text-center">
            <Link 
              to="/portfolio" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 dark:bg-zinc-800 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/10"
            >
              View Full Portfolio <Plus size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Why Choose Us?</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                At Benny Grace, we blend creativity with modern technology to deliver solutions that not only look stunning but drive actual business results.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {whyChooseUs.map((reason, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="text-red-600 shrink-0" size={20} />
                    <span className="font-medium">{reason}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img 
                src="https://i.ibb.co/qYfvc11V/20260623-172216.jpg" 
                alt="Professional Design Setup" 
                className="w-full h-auto object-contain rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50 dark:bg-zinc-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Client Testimonials</h2>
              <div className="w-20 h-1 bg-red-600 rounded-full"></div>
            </div>
            <button 
              onClick={() => setIsTestimonyFormOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-red-600 text-white font-medium hover:bg-red-700 transition-colors shadow-sm shadow-red-600/20"
            >
              <Plus size={20} />
              Add Testimony
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials && testimonials.filter(t => t.status === 'approved').length > 0 ? (
              testimonials.filter(t => t.status === 'approved').map((testimony, i) => (
                <motion.div
                  key={testimony.id || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800"
                >
                  <MessageSquare className="text-red-500 mb-6" size={32} />
                  <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed italic">
                    "{testimony.message}"
                  </p>
                  <div className="flex items-center gap-4">
                    {testimony.image_url ? (
                      <img src={testimony.image_url} alt={testimony.name} className="w-14 h-14 rounded-full object-cover" />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center text-xl font-bold text-gray-400">
                        {testimony.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-lg">{testimony.name}</h4>
                      <p className="text-sm text-gray-500">{testimony.company}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                No testimonials yet. Be the first to share your experience!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimony Modal */}
      {isTestimonyFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl max-w-lg w-full p-8 border border-gray-200 dark:border-gray-800 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-3xl font-bold mb-6">Share Your Experience</h3>
            <form onSubmit={handleTestimonySubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">Your Name</label>
                <input 
                  required type="text" 
                  value={testimonyForm.name} 
                  onChange={e => setTestimonyForm({...testimonyForm, name: e.target.value})} 
                  className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-red-600 transition-shadow" 
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Company Name</label>
                <input 
                  required type="text" 
                  value={testimonyForm.company} 
                  onChange={e => setTestimonyForm({...testimonyForm, company: e.target.value})} 
                  className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-red-600 transition-shadow" 
                  placeholder="Acme Corp"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Your Message</label>
                <textarea 
                  required 
                  value={testimonyForm.message} 
                  onChange={e => setTestimonyForm({...testimonyForm, message: e.target.value})} 
                  className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-red-600 transition-shadow" 
                  rows={4}
                  placeholder="How was your experience working with us?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Profile Image (Optional)</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const compressed = await resizeImage(file, 400);
                        setTestimonyForm({...testimonyForm, image_url: compressed});
                      } catch (err) {
                        console.error("Failed to process image", err);
                      }
                    }
                  }}
                  className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-red-600 transition-shadow file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-600 hover:file:bg-red-100" 
                />
                {testimonyForm.image_url && (
                  <div className="mt-2">
                    <img src={testimonyForm.image_url} alt="Preview" className="w-16 h-16 object-cover rounded-full" />
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-4 pt-6">
                <button 
                  type="button" 
                  onClick={() => setIsTestimonyFormOpen(false)} 
                  className="px-6 py-3 text-gray-500 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-red-600/20"
                >
                  Submit
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden bg-black text-white">
        <div className="absolute inset-0 bg-red-600/10 mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Ready To Elevate Your Brand?</h2>
            <p className="text-xl text-gray-300 mb-10">
              Let's create something extraordinary together. Reach out today for a consultation.
            </p>
            <a 
              href="https://wa.me/2348039542598?text=Hello,%20I%20would%20like%20to%20start%20a%20project%20with%20you." 
              target="_blank" rel="noopener noreferrer"
              className="inline-block px-10 py-5 rounded-full bg-red-600 text-white font-bold text-lg hover:bg-red-700 transition-all transform hover:scale-105 shadow-xl shadow-red-600/20"
            >
              Start Your Project
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
