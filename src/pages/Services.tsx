import React from 'react';
import { motion } from 'motion/react';
import { Palette, Globe, Layers, MessageCircle } from 'lucide-react';
import { useData } from '../contexts/DataContext';

export default function Services() {
  const { services } = useData();

  return (
    <div className="w-full pt-16 pb-24">
      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="py-20 bg-gray-50 dark:bg-zinc-950 text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Our Services</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Comprehensive digital solutions designed to elevate your brand.
        </p>
        <div className="w-20 h-1 bg-red-600 mx-auto rounded-full mt-8"></div>
      </motion.section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-32">
        {services.map((service, idx) => (
          <div key={service.id} className={`grid lg:grid-cols-2 gap-12 items-center ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
            
            <motion.div
              initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`order-2 ${idx % 2 !== 0 ? 'lg:order-1' : 'lg:order-2'}`}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-red-600/20 translate-x-4 translate-y-4 rounded-3xl -z-10"></div>
                <img 
                  src={service.image_url} 
                  alt={service.title} 
                  className="rounded-3xl shadow-xl w-full h-[400px] object-cover border border-gray-200 dark:border-gray-800"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: idx % 2 === 0 ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`order-1 ${idx % 2 !== 0 ? 'lg:order-2' : 'lg:order-1'}`}
            >
              <div className="inline-flex items-center justify-center p-3 bg-red-600/10 text-red-600 rounded-2xl mb-6">
                <Globe size={32} />
              </div>
              <h2 className="text-3xl font-bold mb-4">{service.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-6 leading-relaxed">
                {service.description}
              </p>
              
              <div className="mb-8">
                <h4 className="font-semibold text-lg mb-3">What we offer:</h4>
                <div className="flex flex-wrap gap-2">
                  {service.items && service.items.map(item => (
                    <span key={item} className="px-3 py-1 bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-full text-sm font-medium">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-10 bg-gray-50 dark:bg-zinc-900/50 p-6 rounded-2xl border-l-4 border-red-600">
                <h4 className="font-semibold text-black dark:text-white mb-2">Key Benefits:</h4>
                <p className="text-gray-600 dark:text-gray-400">{service.benefits}</p>
              </div>

              <a 
                href={`https://wa.me/2348039542598?text=${encodeURIComponent(service.waMessage)}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 rounded-full bg-red-600 text-white font-medium hover:bg-red-700 transition-transform transform hover:-translate-y-1 gap-2 shadow-lg shadow-red-600/20"
              >
                <MessageCircle size={20} />
                Request Service
              </a>
            </motion.div>

          </div>
        ))}
      </section>
    </div>
  );
}
