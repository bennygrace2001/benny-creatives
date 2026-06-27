import React from 'react';
import { motion } from 'motion/react';
import ProjectGallery from '../components/ProjectGallery';

export default function Portfolio() {
  return (
    <div className="w-full pt-16 pb-24">
      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="py-24 bg-gray-50 dark:bg-zinc-950 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-600 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative z-10 px-4">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">Our <span className="text-red-600">Portfolio</span></h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
            A showcase of digital excellence, creative branding, and innovative AI solutions crafted by the Benny Grace team.
          </p>
          <div className="w-24 h-1.5 bg-red-600 mx-auto rounded-full mt-10"></div>
        </div>
      </motion.section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <ProjectGallery />
      </section>
    </div>
  );
}
