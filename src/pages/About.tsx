import React from 'react';
import { motion } from 'motion/react';
import { Target, Eye, Heart } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';

export default function About() {
  const { content } = useContent();

  return (
    <div className="w-full pt-16 pb-24">
      {/* Header */}
      <section className="py-20 bg-gray-50 dark:bg-zinc-950 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">About Us</h1>
        <div className="w-20 h-1 bg-red-600 mx-auto rounded-full"></div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6 whitespace-pre-line">
              {content.aboutStory}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img 
              src="https://i.ibb.co/b5dSpwL0/20260623-172115.jpg" 
              alt="Team collaboration" 
              className="w-full h-auto object-contain rounded-3xl shadow-xl bg-white dark:bg-black"
            />
          </motion.div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-zinc-900 p-10 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800"
          >
            <Target className="text-red-600 w-12 h-12 mb-6" />
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg whitespace-pre-line">
              {content.aboutMission}
            </p>
          </motion.div>
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-zinc-900 p-10 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800"
          >
            <Eye className="text-red-600 w-12 h-12 mb-6" />
            <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg whitespace-pre-line">
              {content.aboutVision}
            </p>
          </motion.div>
        </div>

        {/* Core Values */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Core Values</h2>
            <div className="w-16 h-1 bg-red-600 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { name: 'Creativity', icon: Heart },
              { name: 'Excellence', icon: Target },
              { name: 'Innovation', icon: Eye },
              { name: 'Professionalism', icon: Target },
              { name: 'Customer Satisfaction', icon: Heart },
            ].map((value, i) => (
              <motion.div 
                key={value.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 bg-gray-50 dark:bg-zinc-950 rounded-2xl"
              >
                <div className="w-12 h-12 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="text-red-600 w-6 h-6" />
                </div>
                <h4 className="font-semibold text-sm md:text-base">{value.name}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
