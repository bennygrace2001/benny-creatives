import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services', highlight: true },
    { name: 'Portfolio', path: '/portfolio', highlight: true },
    { name: 'Training', path: '/training', badge: 'Join' },
    { name: 'Vision', path: '/vision' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/80 dark:bg-black/80 border-b border-gray-200 dark:border-gray-800 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold tracking-tighter text-black dark:text-white transition-colors">
                BENNY<span className="text-red-600">GRACE</span>
              </Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "text-sm font-semibold transition-all hover:text-red-600 relative py-1",
                    location.pathname === link.path 
                      ? "text-red-600" 
                      : "text-gray-600 dark:text-gray-300"
                  )}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.div 
                      layoutId="nav-active"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-600 rounded-full"
                    />
                  )}
                  {(link as any).badge && (
                    <span className="absolute -top-3 -right-4 px-1.5 py-0.5 bg-red-600 text-[8px] text-white rounded-full font-bold animate-bounce">
                      {(link as any).badge}
                    </span>
                  )}
                </Link>
              ))}
              
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              <a 
                href="https://wa.me/2348039542598?text=Hello,%20I%20would%20like%20to%20hire%20you%20for%20a%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full bg-red-600 text-white font-medium hover:bg-red-700 transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-red-600/20"
              >
                Hire Me
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-600 dark:text-gray-300 hover:text-red-600 transition-colors p-2"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 absolute w-full overflow-hidden transition-colors"
            >
              <div className="px-4 pt-2 pb-6 space-y-1 sm:px-3 flex flex-col">
                {links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "block px-3 py-3 rounded-md text-base font-medium transition-colors",
                      location.pathname === link.path
                        ? "bg-red-600 text-white"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-red-600"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
                <a 
                  href="https://wa.me/2348039542598?text=Hello,%20I%20would%20like%20to%20hire%20you%20for%20a%20project."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-4 text-center px-3 py-3 rounded-md text-base font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Hire Me
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
