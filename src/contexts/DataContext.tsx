import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, hasSupabaseConfig } from '../lib/supabase';

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  price?: string;
  promoPrice?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  items: string[];
  benefits: string;
  waMessage: string;
  image_url: string;
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  message: string;
  image_url: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface TrainingApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  payment_proof_url: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
}

interface DataContextType {
  projects: Project[];
  services: Service[];
  testimonials: Testimonial[];
  trainingApplications: TrainingApplication[];
  addProject: (project: Omit<Project, 'id'>) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
  updateProject: (id: string, project: Partial<Project>) => Promise<boolean>;
  addService: (service: Omit<Service, 'id'>) => Promise<boolean>;
  updateService: (id: string, service: Partial<Service>) => Promise<boolean>;
  deleteService: (id: string) => Promise<boolean>;
  addTestimonial: (testimonial: Omit<Testimonial, 'id' | 'status'> & { status?: 'pending' | 'approved' | 'rejected' }) => Promise<boolean>;
  updateTestimonial: (id: string, testimonial: Partial<Testimonial>) => Promise<boolean>;
  deleteTestimonial: (id: string) => Promise<boolean>;
  updateTestimonialStatus: (id: string, status: 'approved' | 'rejected') => Promise<boolean>;
  deleteTrainingApplication: (id: string) => Promise<boolean>;
  updateTrainingStatus: (id: string, status: 'approved' | 'rejected') => Promise<boolean>;
  syncDataToSupabase: () => Promise<{ success: boolean; message: string }>;
  fetchData: () => Promise<void>;
  loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialServices: Service[] = [
  {
    id: '1',
    title: 'Graphics Design',
    description: 'Visually compelling graphics that capture attention and communicate your message effectively.',
    items: ['Flyers', 'Posters', 'Banners', 'Logos'],
    benefits: 'Enhance brand recognition, improve marketing ROI.',
    waMessage: 'Hello, I need graphics design services.',
    image_url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [trainingApplications, setTrainingApplications] = useState<TrainingApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    // Always load local data first as a baseline/fallback
    const localProjects = localStorage.getItem('benny_grace_projects');
    const localServices = localStorage.getItem('benny_grace_services');
    const localTestimonials = localStorage.getItem('benny_grace_testimonials');
    const localTraining = localStorage.getItem('benny_grace_training');
    
    if (localProjects) setProjects(JSON.parse(localProjects));
    if (localServices) {
      setServices(JSON.parse(localServices));
    } else {
      setServices(initialServices);
    }
    if (localTestimonials) setTestimonials(JSON.parse(localTestimonials));
    if (localTraining) setTrainingApplications(JSON.parse(localTraining));
    
    if (hasSupabaseConfig) {
      try {
        const [projectsRes, servicesRes, testimonialsRes, trainingRes] = await Promise.all([
          supabase.from('projects').select('*').order('created_at', { ascending: false }),
          supabase.from('services').select('*').order('created_at', { ascending: false }),
          supabase.from('testimonials').select('*').order('created_at', { ascending: false }),
          supabase.from('training_applications').select('*').order('created_at', { ascending: false })
        ]);
        
        // Safety check: if cloud returns empty but we have local data, don't overwrite yet.
        // This handles cases where cloud might be empty during setup but local has data.
        if (projectsRes.data && projectsRes.data.length > 0) {
          setProjects(projectsRes.data);
          localStorage.setItem('benny_grace_projects', JSON.stringify(projectsRes.data));
        }
        if (servicesRes.data && servicesRes.data.length > 0) {
          setServices(servicesRes.data);
          localStorage.setItem('benny_grace_services', JSON.stringify(servicesRes.data));
        }
        if (testimonialsRes.data && testimonialsRes.data.length > 0) {
          setTestimonials(testimonialsRes.data);
          localStorage.setItem('benny_grace_testimonials', JSON.stringify(testimonialsRes.data));
        }
        if (trainingRes.data && trainingRes.data.length > 0) {
          setTrainingApplications(trainingRes.data);
          localStorage.setItem('benny_grace_training', JSON.stringify(trainingRes.data));
        }
      } catch (e) {
        console.error("Failed to fetch data from cloud", e);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addProject = async (project: Omit<Project, 'id'>) => {
    let newProject = { ...project, id: Date.now().toString() };
    let success = true;
    
    if (hasSupabaseConfig) {
      const cleanProject = { ...project };
      if (cleanProject.price === '') delete cleanProject.price;
      if (cleanProject.promoPrice === '') delete cleanProject.promoPrice;

      const { data, error } = await supabase.from('projects').insert([cleanProject]).select();
      if (error) {
        console.error("Supabase insert error (projects):", error);
        success = false;
      } else if (data && data.length > 0) {
        newProject = data[0];
      }
    }
    
    setProjects(prev => {
      const updated = [newProject, ...prev];
      localStorage.setItem('benny_grace_projects', JSON.stringify(updated));
      return updated;
    });
    
    return success;
  };

  const deleteProject = async (id: string) => {
    let success = true;
    if (hasSupabaseConfig) {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) {
        console.error("Supabase delete error (projects):", error);
        success = false;
      }
    }
    
    setProjects(prev => {
      const updated = prev.filter(p => p.id !== id);
      localStorage.setItem('benny_grace_projects', JSON.stringify(updated));
      return updated;
    });
    
    return success;
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    let success = true;
    if (hasSupabaseConfig) {
      const { error } = await supabase.from('projects').update(updates).eq('id', id);
      if (error) {
        console.error("Supabase update error (projects):", error);
        success = false;
      }
    }
    
    setProjects(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, ...updates } : p);
      localStorage.setItem('benny_grace_projects', JSON.stringify(updated));
      return updated;
    });
    
    return success;
  };

  const addService = async (service: Omit<Service, 'id'>) => {
    let newService = { ...service, id: Date.now().toString() };
    let success = true;
    
    if (hasSupabaseConfig) {
      const cleanService = { ...service };
      if (!cleanService.image_url) delete (cleanService as any).image_url;

      const { data, error } = await supabase.from('services').insert([cleanService]).select();
      if (error) {
        console.error("Supabase insert error (services):", error);
        success = false;
      } else if (data && data.length > 0) {
        newService = data[0];
      }
    }
    
    setServices(prev => {
      const updated = [newService, ...prev];
      localStorage.setItem('benny_grace_services', JSON.stringify(updated));
      return updated;
    });
    
    return success;
  };

  const updateService = async (id: string, updates: Partial<Service>) => {
    let success = true;
    if (hasSupabaseConfig) {
      const { error } = await supabase.from('services').update(updates).eq('id', id);
      if (error) {
        console.error("Supabase update error (services):", error);
        success = false;
      }
    }
    
    setServices(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, ...updates } : s);
      localStorage.setItem('benny_grace_services', JSON.stringify(updated));
      return updated;
    });
    
    return success;
  };

  const deleteService = async (id: string) => {
    let success = true;
    if (hasSupabaseConfig) {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) {
        console.error("Supabase delete error (services):", error);
        success = false;
      }
    }
    
    setServices(prev => {
      const updated = prev.filter(s => s.id !== id);
      localStorage.setItem('benny_grace_services', JSON.stringify(updated));
      return updated;
    });
    
    return success;
  };

  const addTestimonial = async (testimonial: Omit<Testimonial, 'id' | 'status'> & { status?: 'pending' | 'approved' | 'rejected' }) => {
    let newTestimonial: Testimonial = { 
      ...testimonial, 
      id: Date.now().toString(),
      status: testimonial.status || 'pending'
    };
    let success = true;
    
    if (hasSupabaseConfig) {
      const testimonialToInsert = {
        name: newTestimonial.name,
        company: newTestimonial.company,
        message: newTestimonial.message,
        image_url: newTestimonial.image_url,
        status: newTestimonial.status
      };
      
      if (!testimonialToInsert.image_url) delete (testimonialToInsert as any).image_url;

      const { data, error } = await supabase.from('testimonials').insert([testimonialToInsert]).select();
      if (error) {
        console.error("Supabase insert error (testimonials):", error);
        success = false;
      } else if (data && data.length > 0) {
        newTestimonial = data[0];
      }
    }
    
    setTestimonials(prev => {
      const updated = [newTestimonial, ...prev];
      localStorage.setItem('benny_grace_testimonials', JSON.stringify(updated));
      return updated;
    });
    
    return success;
  };

  const updateTestimonial = async (id: string, updates: Partial<Testimonial>) => {
    let success = true;
    if (hasSupabaseConfig) {
      const { error } = await supabase.from('testimonials').update(updates).eq('id', id);
      if (error) {
        console.error("Supabase update error (testimonials):", error);
        success = false;
      }
    }
    
    setTestimonials(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, ...updates } : t);
      localStorage.setItem('benny_grace_testimonials', JSON.stringify(updated));
      return updated;
    });
    
    return success;
  };

  const deleteTestimonial = async (id: string) => {
    let success = true;
    if (hasSupabaseConfig) {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) {
        console.error("Supabase delete error (testimonials):", error);
        success = false;
      }
    }
    setTestimonials(prev => {
      const updated = prev.filter(t => t.id !== id);
      localStorage.setItem('benny_grace_testimonials', JSON.stringify(updated));
      return updated;
    });
    return success;
  };

  const updateTestimonialStatus = async (id: string, status: 'approved' | 'rejected') => {
    let success = true;
    if (hasSupabaseConfig) {
      const { error } = await supabase.from('testimonials').update({ status }).eq('id', id);
      if (error) {
        console.error("Supabase update error (testimonials):", error);
        success = false;
      }
    }
    
    setTestimonials(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, status } : t);
      localStorage.setItem('benny_grace_testimonials', JSON.stringify(updated));
      return updated;
    });
    
    return success;
  };

  const deleteTrainingApplication = async (id: string) => {
    let success = true;
    if (hasSupabaseConfig) {
      const { error } = await supabase.from('training_applications').delete().eq('id', id);
      if (error) {
        console.error("Supabase delete error (training):", error);
        success = false;
      }
    }
    setTrainingApplications(prev => {
      const updated = prev.filter(t => t.id !== id);
      localStorage.setItem('benny_grace_training', JSON.stringify(updated));
      return updated;
    });
    return success;
  };

  const updateTrainingStatus = async (id: string, status: 'approved' | 'rejected') => {
    let success = true;
    if (hasSupabaseConfig) {
      const { error } = await supabase.from('training_applications').update({ status }).eq('id', id);
      if (error) {
        console.error("Supabase update error (training):", error);
        success = false;
      }
    }
    setTrainingApplications(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, status } : t);
      localStorage.setItem('benny_grace_training', JSON.stringify(updated));
      return updated;
    });
    return success;
  };

  const syncDataToSupabase = async () => {
    if (!hasSupabaseConfig) {
      return { success: false, message: "Supabase is not configured. Data is saved locally." };
    }
    
    try {
      const results = {
        projects: 0,
        services: 0,
        testimonials: 0
      };

      // Sync Projects
      const localProjects = localStorage.getItem('benny_grace_projects');
      if (localProjects) {
        const parsed = JSON.parse(localProjects) as Project[];
        for (const p of parsed) {
          const projectToUpsert: any = {
            title: p.title,
            description: p.description,
            category: p.category,
            image_url: p.image_url
          };
          if (p.price) projectToUpsert.price = p.price;
          if (p.promoPrice) projectToUpsert.promoPrice = p.promoPrice;

          const { error } = await supabase.from('projects').upsert(projectToUpsert, { onConflict: 'title' }); 
          if (error) {
            console.error("Project sync error:", error);
          } else {
            results.projects++;
          }
        }
      }

      // Sync Services
      const localServices = localStorage.getItem('benny_grace_services');
      if (localServices) {
        const parsed = JSON.parse(localServices) as Service[];
        for (const s of parsed) {
          const serviceToUpsert: any = {
            title: s.title,
            description: s.description,
            items: s.items,
            benefits: s.benefits,
            waMessage: s.waMessage
          };
          if (s.image_url) serviceToUpsert.image_url = s.image_url;

          const { error } = await supabase.from('services').upsert(serviceToUpsert, { onConflict: 'title' });
          if (error) {
            console.error("Service sync error:", error);
          } else {
            results.services++;
          }
        }
      }

      // Sync Testimonials
      const localTestimonials = localStorage.getItem('benny_grace_testimonials');
      if (localTestimonials) {
        const parsed = JSON.parse(localTestimonials) as Testimonial[];
        for (const t of parsed) {
          const testimonialToUpsert: any = {
            name: t.name,
            company: t.company,
            message: t.message,
            status: t.status || 'approved'
          };
          if (t.image_url) testimonialToUpsert.image_url = t.image_url;

          const { error } = await supabase.from('testimonials').upsert(testimonialToUpsert, { onConflict: 'name' });
          if (error) {
            console.error("Testimonial sync error:", error);
          } else {
            results.testimonials++;
          }
        }
      }

      // Refresh data
      const [projectsRes, servicesRes, testimonialsRes, trainingRes] = await Promise.all([
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('services').select('*').order('created_at', { ascending: false }),
        supabase.from('testimonials').select('*').order('created_at', { ascending: false }),
        supabase.from('training_applications').select('*').order('created_at', { ascending: false })
      ]);
      if (projectsRes.data) {
        setProjects(projectsRes.data);
        localStorage.setItem('benny_grace_projects', JSON.stringify(projectsRes.data));
      }
      if (servicesRes.data) {
        setServices(servicesRes.data);
        localStorage.setItem('benny_grace_services', JSON.stringify(servicesRes.data));
      }
      if (testimonialsRes.data) {
        setTestimonials(testimonialsRes.data);
        localStorage.setItem('benny_grace_testimonials', JSON.stringify(testimonialsRes.data));
      }
      if (trainingRes.data) {
        setTrainingApplications(trainingRes.data);
        localStorage.setItem('benny_grace_training', JSON.stringify(trainingRes.data));
      }

      return { 
        success: true, 
        message: `Sync complete! Cloud database is now synchronized with all collections.` 
      };
    } catch (e: any) {
      console.error("Sync error:", e);
      return { success: false, message: e.message || "Failed to sync with Supabase." };
    }
  };

  return (
    <DataContext.Provider value={{ 
      projects, services, testimonials, trainingApplications,
      addProject, deleteProject, updateProject, addService, deleteService, updateService,
      addTestimonial, deleteTestimonial, updateTestimonial, updateTestimonialStatus,
      deleteTrainingApplication, updateTrainingStatus,
      syncDataToSupabase, fetchData,
      loading 
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
