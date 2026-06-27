import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useContent } from '../contexts/ContentContext';

export default function Vision() {
  const { content } = useContent();

  return (
    <div className="w-full pt-16 pb-24">
      <section className="py-20 bg-gray-50 dark:bg-zinc-950 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Our Vision</h1>
        <div className="w-20 h-1 bg-red-600 mx-auto rounded-full"></div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="prose prose-lg dark:prose-invert max-w-none"
        >
          <img 
            src="https://i.ibb.co/b5dSpwL0/20260623-172115.jpg" 
            alt="Future vision" 
            className="rounded-3xl shadow-2xl mb-12 w-full h-[400px] object-cover bg-white dark:bg-black"
          />

          <h2 className="text-3xl font-bold mb-6">The Future of Chimuanya Creatives</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8 whitespace-pre-line">
            {content.visionFuture}
          </p>

          <div className="grid md:grid-cols-2 gap-8 my-12">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:border-red-500 transition-colors">
              <h3 className="text-xl font-bold mb-4 text-red-600">Empowering Young Creatives</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Through our comprehensive training programs, we aim to equip the next generation of designers and developers with future-proof skills in AI integration and modern web architecture.
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:border-red-500 transition-colors">
              <h3 className="text-xl font-bold mb-4 text-red-600">Digital Innovation Hub</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We are building a robust ecosystem where businesses can access top-tier digital solutions, from automated workflows to intelligent user interfaces, streamlining their growth.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4">Our Commitment</h2>
          <ul className="space-y-4 mb-12">
            <li className="flex items-start">
              <span className="text-red-600 font-bold mr-3">01.</span>
              <span><strong>Continuous Learning:</strong> Staying ahead of the curve in AI advancements and design trends.</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-600 font-bold mr-3">02.</span>
              <span><strong>Community Building:</strong> Fostering a network of skilled professionals who collaborate and grow together.</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-600 font-bold mr-3">03.</span>
              <span><strong>Ethical AI Use:</strong> Ensuring our AI-powered solutions maintain a human-centric approach, enhancing rather than replacing creativity.</span>
            </li>
          </ul>

          <div className="text-center mt-16 p-10 bg-gray-50 dark:bg-zinc-950 rounded-3xl">
            <h3 className="text-2xl font-bold mb-4">Join Us on This Journey</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Whether you're a business looking to transform, or a creative looking to learn, there's a place for you in our vision.
            </p>
            <a 
              href="https://wa.me/2348039542598?text=Hello,%20I%20read%20about%20your%20vision%20and%20want%20to%20connect." 
              target="_blank" rel="noopener noreferrer"
              className="inline-block px-8 py-4 rounded-full bg-red-600 text-white font-medium hover:bg-red-700 transition-transform transform hover:-translate-y-1"
            >
              Connect With Us
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
