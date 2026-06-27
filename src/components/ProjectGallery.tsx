import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Search } from 'lucide-react';
import { useData } from '../contexts/DataContext';

interface ProjectGalleryProps {
  limit?: number;
  showFilters?: boolean;
}

export default function ProjectGallery({ limit, showFilters = true }: ProjectGalleryProps) {
  const { projects, loading } = useData();
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];
  
  const filteredProjects = projects
    .filter(p => filter === 'All' || p.category === filter)
    .filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.description?.toLowerCase().includes(searchTerm.toLowerCase()));

  const displayProjects = limit ? filteredProjects.slice(0, limit) : filteredProjects;

  if (loading && projects.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {showFilters && (
        <div className="mb-12 space-y-6">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                  filter === cat 
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' 
                    : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-800 hover:border-red-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all"
            />
          </div>
        </div>
      )}

      {displayProjects.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 font-medium">No projects found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group relative bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:shadow-red-600/10 transition-all duration-500"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={project.image_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                  alt={project.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-8">
                  <a 
                    href={`https://wa.me/2348039542598?text=${encodeURIComponent(`Hello Benny Grace, I'm interested in "${project.title}" and would like to discuss a project.`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition-colors shadow-xl"
                  >
                    Discuss Project <ExternalLink size={18} />
                  </a>
                </div>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-3">
                  <span className="px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                    {project.category}
                  </span>
                  {project.price && (
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      ₦{project.price}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-red-600 transition-colors line-clamp-1">
                  {project.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
