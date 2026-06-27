import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import { useContent } from '../../contexts/ContentContext';
import { useData } from '../../contexts/DataContext';
import { supabase, hasSupabaseConfig } from '../../lib/supabase';
import { 
  LogOut, LayoutDashboard, Image as ImageIcon, Briefcase, 
  Users, FileText, RefreshCw, AlertCircle, Plus, Trash2, Edit, Download, Save, MessageSquare, Check, X, Database
} from 'lucide-react';
import { resizeImage } from '../../utils/imageCompressor';
import FileUpload from '../../components/FileUpload';

export default function Dashboard() {
  const { isAdmin, logout } = useAdmin();
  const { content, updateContent } = useContent();
  const { 
    projects, services, testimonials, trainingApplications,
    addProject, deleteProject, updateProject, 
    addService, deleteService, updateService,
    addTestimonial, deleteTestimonial, updateTestimonial, updateTestimonialStatus,
    deleteTrainingApplication, updateTrainingStatus,
    syncDataToSupabase, fetchData 
  } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Local state for mock items
  const [trainingApps, setTrainingApps] = useState([]);
  
  // Content Form state
  const [contentForm, setContentForm] = useState(content);

  // Modal states
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [isEditServiceModalOpen, setIsEditServiceModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null);
  const [isEditTestimonialModalOpen, setIsEditTestimonialModalOpen] = useState(false);
  
  const [projectForm, setProjectForm] = useState({ title: '', category: 'Web Design', description: '', image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', price: '', promoPrice: '' });
  const [serviceForm, setServiceForm] = useState({ title: '', description: '', benefits: '', waMessage: 'Hello, I need this service.', image_url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', items: 'Feature 1, Feature 2' });
  const [testimonialForm, setTestimonialForm] = useState({ name: '', company: '', message: '', image_url: '' });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    setContentForm(content);
  }, [content]);

  if (!isAdmin) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContentForm(prev => ({ ...prev, [name]: value }));
  };

  const handleContentSave = async () => {
    setLoading(true);
    await updateContent(contentForm);
    setLoading(false);
    showToast('Successfully saved');
  };

  const handleSync = async () => {
    setSyncing(true);
    const res = await syncDataToSupabase();
    setSyncing(false);
    if (res.success) {
      showToast('Successfully sync to cloud database');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleAddProject = () => {
    setIsProjectModalOpen(true);
  };

  const handleAddService = () => {
    setIsServiceModalOpen(true);
  };

  const handleAddTestimonial = () => {
    setIsTestimonialModalOpen(true);
  };

  const submitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSyncing(true);
    const success = await addProject(projectForm);
    setSyncing(false);
    if (success) {
      showToast("Project added successfully!");
      setIsProjectModalOpen(false);
      setProjectForm({ title: '', category: 'Web Design', description: '', image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', price: '', promoPrice: '' });
    } else {
      showToast("Failed to add project", "error");
    }
  };

  const submitService = async (e: React.FormEvent) => {
    e.preventDefault();
    setSyncing(true);
    const itemsArray = serviceForm.items.split(',').map(s => s.trim()).filter(Boolean);
    const success = await addService({ ...serviceForm, items: itemsArray });
    setSyncing(false);
    if (success) {
      showToast("Service added successfully!");
      setIsServiceModalOpen(false);
      setServiceForm({ title: '', description: '', benefits: '', waMessage: 'Hello, I need this service.', image_url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', items: 'Feature 1, Feature 2' });
    } else {
      showToast("Failed to add service", "error");
    }
  };

  const submitTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    setSyncing(true);
    const success = await addTestimonial({ ...testimonialForm, status: 'approved' });
    setSyncing(false);
    if (success) {
      showToast("Testimonial added successfully!");
      setIsTestimonialModalOpen(false);
      setTestimonialForm({ name: '', company: '', message: '', image_url: '' });
    } else {
      showToast("Failed to add testimonial", "error");
    }
  };

  const handleDeleteItem = async (type: string, id: string) => {
    let success = false;
    if (type === 'project') success = await deleteProject(id);
    if (type === 'service') success = await deleteService(id);
    if (type === 'testimonial') success = await deleteTestimonial(id);
    if (type === 'training') success = await deleteTrainingApplication(id);

    if (success) {
      showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`);
    } else {
      showToast(`Failed to delete ${type}`, "error");
    }
  };

  const SidebarButton = ({ icon: Icon, label, id, count }: { icon: any, label: string, id: string, count?: number }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
        activeTab === id 
          ? 'bg-red-600 text-white' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium flex-grow">{label}</span>
      {count !== undefined && count > 0 && (
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === id ? 'bg-white text-red-600' : 'bg-red-600 text-white'}`}>
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-gray-800 p-4 shrink-0 flex flex-col md:min-h-screen">
        <div className="mb-8 px-4 mt-4 text-center md:text-left">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h2>
          <p className="text-sm text-gray-500">Benny Grace</p>
        </div>

        <nav className="space-y-2 flex-grow">
          <SidebarButton icon={LayoutDashboard} label="Overview" id="overview" />
          <SidebarButton icon={ImageIcon} label="Portfolio" id="portfolio" count={projects.length} />
          <SidebarButton icon={Briefcase} label="Services" id="services" count={services.length} />
          <SidebarButton icon={Users} label="Training Apps" id="training" count={trainingApplications.filter(a => a.status === 'pending').length} />
          <SidebarButton icon={MessageSquare} label="Testimonials" id="testimonials" count={testimonials.filter(t => t.status === 'pending').length} />
          <SidebarButton icon={FileText} label="Content Settings" id="content" />
        </nav>

        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors font-medium"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6 lg:p-10 w-full overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold capitalize text-gray-900 dark:text-white">{activeTab.replace('-', ' ')}</h1>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-400 text-xs font-medium border border-green-200 dark:border-green-800">
              <div className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></div>
              Cloud Storage Active
            </div>
            <button 
              onClick={handleSync}
              disabled={syncing}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm"
            >
              {syncing ? <RefreshCw className="animate-spin" size={14} /> : <Database size={14} />}
              Sync & Diagnose
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Projects', value: projects.length, icon: ImageIcon, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/20' },
              { label: 'Total Services', value: services.length, icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/20' },
              { label: 'Testimonials', value: testimonials.length, icon: MessageSquare, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-100/10' },
              { label: 'Applications', value: trainingApplications.length, icon: Users, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/20' },
            ].map((stat, i) => (
              <div key={i} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="space-y-6">
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsBulkUploadOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
                <Plus size={16} /> Bulk Upload
              </button>
              <button onClick={handleAddProject} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                <Plus size={16} /> Add Project
              </button>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-zinc-950 border-b border-gray-200 dark:border-gray-800">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">Image</th>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">Title</th>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">Category</th>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No projects found.</td></tr>
                  ) : (
                    projects.map((p: any) => (
                      <tr key={p.id} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="px-6 py-4"><div className="w-16 h-12 bg-gray-200 dark:bg-zinc-800 rounded overflow-hidden"><img src={p.image_url} alt="" className="w-full h-full object-cover" /></div></td>
                        <td className="px-6 py-4 font-medium">{p.title}</td>
                        <td className="px-6 py-4 text-gray-500">{p.category}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setEditingProject(p);
                              setIsEditProjectModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          >
                            <Edit size={18}/>
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteItem('project', p.id)} 
                            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 size={18}/>
                          </motion.button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'training' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[800px]">
                <thead className="bg-gray-50 dark:bg-zinc-950 border-b border-gray-200 dark:border-gray-800">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">Date</th>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">Name</th>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">Contact</th>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">Proof</th>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">Status</th>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {trainingApplications.length === 0 ? (
                    <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No training applications found.</td></tr>
                  ) : (
                    trainingApplications.map((t: any) => (
                      <tr key={t.id} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="px-6 py-4 text-xs text-gray-500">{t.created_at ? new Date(t.created_at).toLocaleDateString() : 'N/A'}</td>
                        <td className="px-6 py-4 font-medium">{t.name}</td>
                        <td className="px-6 py-4">
                          <div className="text-gray-900 dark:text-white">{t.email}</div>
                          <div className="text-gray-500 text-xs">{t.phone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <a 
                            href={t.payment_proof_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-red-600 hover:underline flex items-center gap-1 font-medium"
                          >
                            <Download size={14} /> View File
                          </a>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                            t.status === 'approved' ? 'bg-green-100 text-green-800' :
                            t.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {t.status || 'pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          {t.status !== 'approved' && (
                            <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => updateTrainingStatus(t.id, 'approved')} 
                              className="text-green-600 hover:text-green-800 font-bold text-xs px-2 py-1 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
                            >
                              Approve
                            </motion.button>
                          )}
                          {t.status !== 'rejected' && (
                            <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => updateTrainingStatus(t.id, 'rejected')} 
                              className="text-orange-600 hover:text-orange-800 font-bold text-xs px-2 py-1 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded"
                            >
                              Reject
                            </motion.button>
                          )}
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteItem('training', t.id)} 
                            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 size={18}/>
                          </motion.button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-6">
             <div className="flex justify-end">
              <button onClick={handleAddService} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                <Plus size={16} /> Add Service
              </button>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
               <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-zinc-950 border-b border-gray-200 dark:border-gray-800">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">Image</th>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">Title</th>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">Description</th>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No services found.</td></tr>
                  ) : (
                    services.map((s: any) => (
                      <tr key={s.id} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="px-6 py-4"><div className="w-16 h-12 bg-gray-200 dark:bg-zinc-800 rounded overflow-hidden"><img src={s.image_url} alt="" className="w-full h-full object-cover" /></div></td>
                        <td className="px-6 py-4 font-medium">{s.title}</td>
                        <td className="px-6 py-4 text-gray-500">{s.description}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setEditingService(s);
                              setIsEditServiceModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          >
                            <Edit size={18}/>
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteItem('service', s.id)} 
                            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 size={18}/>
                          </motion.button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'testimonials' && (
          <div className="space-y-6">
             <div className="flex justify-end">
              <button onClick={handleAddTestimonial} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                <Plus size={16} /> Add Testimonial
              </button>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
               <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-zinc-950 border-b border-gray-200 dark:border-gray-800">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">Image</th>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">Name / Company</th>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">Message</th>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">Status</th>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {testimonials.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No testimonials found.</td></tr>
                  ) : (
                    testimonials.map((t: any) => (
                      <tr key={t.id} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="px-6 py-4">
                          {t.image_url ? (
                            <div className="w-12 h-12 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden"><img src={t.image_url} alt="" className="w-full h-full object-cover" /></div>
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 dark:bg-zinc-800 rounded-full flex items-center justify-center font-bold">{t.name.charAt(0)}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium">{t.name}</div>
                          <div className="text-gray-500">{t.company}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-500 max-w-xs truncate" title={t.message}>{t.message}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                            t.status === 'approved' ? 'bg-green-100 text-green-800' :
                            t.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {t.status || 'pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setEditingTestimonial(t);
                              setIsEditTestimonialModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={18}/>
                          </motion.button>
                          {t.status !== 'approved' && (
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateTestimonialStatus(t.id, 'approved')} 
                              className="text-green-600 hover:text-green-800 p-2 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors" 
                              title="Approve"
                            >
                              <Check size={18}/>
                            </motion.button>
                          )}
                          {t.status !== 'rejected' && (
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateTestimonialStatus(t.id, 'rejected')} 
                              className="text-orange-600 hover:text-orange-800 p-2 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors" 
                              title="Reject"
                            >
                              <X size={18}/>
                            </motion.button>
                          )}
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteItem('testimonial', t.id)} 
                            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" 
                            title="Delete"
                          >
                            <Trash2 size={18}/>
                          </motion.button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-6 pb-20">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Website Content</h3>
                  <p className="text-sm text-gray-500 mt-1">Manage text dynamically across the website frontend.</p>
                </div>
                <button 
                  onClick={handleContentSave}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all shadow-lg shadow-red-600/20 font-bold disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                  Save Changes
                </button>
              </div>

              <div className="space-y-8">
                {/* Hero Section */}
                <div className="p-5 bg-gray-50 dark:bg-zinc-950 rounded-xl border border-gray-100 dark:border-gray-800">
                  <h4 className="font-bold text-lg mb-4 flex items-center gap-2"><LayoutDashboard className="text-red-600" size={18}/> Home - Hero Section</h4>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Headline Part 1</label>
                      <input type="text" name="heroHeadlinePart1" value={contentForm.heroHeadlinePart1} onChange={handleContentChange} className="w-full px-4 py-2 rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-gray-800" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Headline Part 2 (Red)</label>
                      <input type="text" name="heroHeadlinePart2" value={contentForm.heroHeadlinePart2} onChange={handleContentChange} className="w-full px-4 py-2 rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-gray-800" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Headline Part 3</label>
                      <input type="text" name="heroHeadlinePart3" value={contentForm.heroHeadlinePart3} onChange={handleContentChange} className="w-full px-4 py-2 rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-gray-800" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Hero Subheadline</label>
                    <textarea name="heroSubheadline" value={contentForm.heroSubheadline} onChange={handleContentChange} rows={3} className="w-full px-4 py-2 rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-gray-800" />
                  </div>
                </div>

                {/* About Section */}
                <div className="p-5 bg-gray-50 dark:bg-zinc-950 rounded-xl border border-gray-100 dark:border-gray-800">
                  <h4 className="font-bold text-lg mb-4 flex items-center gap-2"><FileText className="text-red-600" size={18}/> About Us Section</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Our Story</label>
                      <textarea name="aboutStory" value={contentForm.aboutStory} onChange={handleContentChange} rows={4} className="w-full px-4 py-2 rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-gray-800" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Our Mission</label>
                      <textarea name="aboutMission" value={contentForm.aboutMission} onChange={handleContentChange} rows={3} className="w-full px-4 py-2 rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-gray-800" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Our Vision</label>
                      <textarea name="aboutVision" value={contentForm.aboutVision} onChange={handleContentChange} rows={3} className="w-full px-4 py-2 rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-gray-800" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">The Future (Vision Page)</label>
                      <textarea name="visionFuture" value={contentForm.visionFuture} onChange={handleContentChange} rows={3} className="w-full px-4 py-2 rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-gray-800" />
                    </div>
                  </div>
                </div>

                {/* Account Details & Training */}
                <div className="p-5 bg-gray-50 dark:bg-zinc-950 rounded-xl border border-gray-100 dark:border-gray-800">
                  <h4 className="font-bold text-lg mb-4 flex items-center gap-2"><Briefcase className="text-red-600" size={18}/> Bank Account Details (Training)</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Bank Name</label>
                      <input type="text" name="bankName" value={contentForm.bankName} onChange={handleContentChange} className="w-full px-4 py-2 rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-gray-800 font-mono" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Account Number</label>
                      <input type="text" name="accountNumber" value={contentForm.accountNumber} onChange={handleContentChange} className="w-full px-4 py-2 rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-gray-800 font-mono" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Account Name</label>
                      <input type="text" name="accountName" value={contentForm.accountName} onChange={handleContentChange} className="w-full px-4 py-2 rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-gray-800 font-mono" />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="p-5 bg-gray-50 dark:bg-zinc-950 rounded-xl border border-gray-100 dark:border-gray-800">
                  <h4 className="font-bold text-lg mb-4 flex items-center gap-2"><Users className="text-red-600" size={18}/> Contact Information & Footer</h4>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Phone Number</label>
                        <input type="text" name="contactPhone" value={contentForm.contactPhone} onChange={handleContentChange} className="w-full px-4 py-2 rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-gray-800" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Email Address</label>
                        <input type="email" name="contactEmail" value={contentForm.contactEmail} onChange={handleContentChange} className="w-full px-4 py-2 rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-gray-800" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Business Address</label>
                      <textarea name="contactAddress" value={contentForm.contactAddress} onChange={handleContentChange} rows={2} className="w-full px-4 py-2 rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-gray-800" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Footer Description</label>
                      <textarea name="footerDescription" value={contentForm.footerDescription} onChange={handleContentChange} rows={2} className="w-full px-4 py-2 rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-gray-800" />
                    </div>
                  </div>
                </div>

                {/* SEO Settings */}
                <div className="p-5 bg-gray-50 dark:bg-zinc-950 rounded-xl border border-gray-100 dark:border-gray-800">
                  <h4 className="font-bold text-lg mb-4 flex items-center gap-2"><FileText className="text-red-600" size={18}/> SEO & Meta Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Site Title</label>
                      <input type="text" name="seoTitle" value={contentForm.seoTitle || ''} onChange={handleContentChange} className="w-full px-4 py-2 rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-gray-800" placeholder="Benny Grace | Graphic Design & AI Websites" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Site Description</label>
                      <textarea name="seoDescription" value={contentForm.seoDescription || ''} onChange={handleContentChange} rows={3} className="w-full px-4 py-2 rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-gray-800" placeholder="Professional digital design and web development brand dedicated to pushing the boundaries of creativity and technology." />
                    </div>
                  </div>
                </div>

              </div>
              
            </div>
          </div>
        )}

      </div>

      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-lg w-full p-6 border border-gray-200 dark:border-gray-800 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">Add Project</h3>
            <form onSubmit={submitProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input required type="text" value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input required type="text" value={projectForm.category} onChange={e => setProjectForm({...projectForm, category: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea required value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800" rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <FileUpload 
                  onUploadStart={() => setIsUploading(true)}
                  onUpload={(urls) => {
                    setIsUploading(false);
                    if (urls.length > 0) {
                      setProjectForm({...projectForm, image_url: urls[0]});
                    }
                  }} 
                  bucketName="projects"
                />
                {isUploading && <p className="text-xs text-red-600 mt-1 animate-pulse">Wait for upload to complete...</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Regular Price (Optional)</label>
                  <input type="text" value={projectForm.price} onChange={e => setProjectForm({...projectForm, price: e.target.value})} placeholder="e.g. $500" className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Promo Price (Optional)</label>
                  <input type="text" value={projectForm.promoPrice} onChange={e => setProjectForm({...projectForm, promoPrice: e.target.value})} placeholder="e.g. $300" className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => { setIsProjectModalOpen(false); setIsUploading(false); }} className="px-4 py-2 text-gray-500 hover:text-gray-900 dark:hover:text-white">Cancel</button>
                <button 
                  type="submit" 
                  disabled={isUploading || syncing}
                  className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {syncing ? (
                    <>
                      <RefreshCw className="animate-spin" size={18} />
                      Adding to Cloud...
                    </>
                  ) : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-lg w-full p-6 border border-gray-200 dark:border-gray-800 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">Add Service</h3>
            <form onSubmit={submitService} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input required type="text" value={serviceForm.title} onChange={e => setServiceForm({...serviceForm, title: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea required value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800" rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Benefits</label>
                <textarea required value={serviceForm.benefits} onChange={e => setServiceForm({...serviceForm, benefits: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800" rows={2} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Features (comma separated)</label>
                <input type="text" value={serviceForm.items} onChange={e => setServiceForm({...serviceForm, items: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">WhatsApp Message</label>
                <input required type="text" value={serviceForm.waMessage} onChange={e => setServiceForm({...serviceForm, waMessage: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <FileUpload 
                  onUploadStart={() => setIsUploading(true)}
                  onUpload={(urls) => {
                    setIsUploading(false);
                    if (urls.length > 0) {
                      setServiceForm({...serviceForm, image_url: urls[0]});
                    }
                  }} 
                  bucketName="services"
                />
                {isUploading && <p className="text-xs text-red-600 mt-1 animate-pulse">Wait for upload to complete...</p>}
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => { setIsServiceModalOpen(false); setIsUploading(false); }} className="px-4 py-2 text-gray-500 hover:text-gray-900 dark:hover:text-white">Cancel</button>
                <button 
                  type="submit" 
                  disabled={isUploading || syncing}
                  className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {syncing ? (
                    <>
                      <RefreshCw className="animate-spin" size={18} />
                      Adding to Cloud...
                    </>
                  ) : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isTestimonialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-lg w-full p-6 border border-gray-200 dark:border-gray-800 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">Add Testimonial</h3>
            <form onSubmit={submitTestimonial} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input required type="text" value={testimonialForm.name} onChange={e => setTestimonialForm({...testimonialForm, name: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Company</label>
                <input required type="text" value={testimonialForm.company} onChange={e => setTestimonialForm({...testimonialForm, company: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea required value={testimonialForm.message} onChange={e => setTestimonialForm({...testimonialForm, message: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800" rows={4} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <FileUpload 
                  onUploadStart={() => setIsUploading(true)}
                  onUpload={(urls) => {
                    setIsUploading(false);
                    if (urls.length > 0) {
                      setTestimonialForm({...testimonialForm, image_url: urls[0]});
                    }
                  }} 
                  bucketName="testimonials"
                />
                {isUploading && <p className="text-xs text-red-600 mt-1 animate-pulse">Wait for upload to complete...</p>}
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => { setIsTestimonialModalOpen(false); setIsUploading(false); }} className="px-4 py-2 text-gray-500 hover:text-gray-900 dark:hover:text-white">Cancel</button>
                <button 
                  type="submit" 
                  disabled={isUploading || syncing}
                  className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {syncing ? (
                    <>
                      <RefreshCw className="animate-spin" size={18} />
                      Adding to Cloud...
                    </>
                  ) : 'Add Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditProjectModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-lg w-full p-6 border border-gray-200 dark:border-gray-800 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">Edit Project</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              const success = await updateProject(editingProject.id, {
                title: editingProject.title,
                category: editingProject.category,
                description: editingProject.description,
                image_url: editingProject.image_url,
                price: editingProject.price,
                promoPrice: editingProject.promoPrice
              });
              setLoading(false);
              if (success) {
                showToast("Project updated successfully");
                setIsEditProjectModalOpen(false);
              } else {
                showToast("Failed to update project", "error");
              }
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input required type="text" value={editingProject.title} onChange={e => setEditingProject({...editingProject, title: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select value={editingProject.category} onChange={e => setEditingProject({...editingProject, category: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800">
                    <option>Design</option>
                    <option>Branding</option>
                    <option>Web Dev</option>
                    <option>Marketing</option>
                    <option>AI Website</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price (Optional)</label>
                  <input type="text" value={editingProject.price || ''} onChange={e => setEditingProject({...editingProject, price: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800" placeholder="e.g. 50,000" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea required value={editingProject.description} onChange={e => setEditingProject({...editingProject, description: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800" rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <FileUpload 
                  onUploadStart={() => setIsUploading(true)}
                  onUpload={(urls) => {
                    setIsUploading(false);
                    if (urls.length > 0) {
                      setEditingProject({...editingProject, image_url: urls[0]});
                    }
                  }} 
                  bucketName="projects"
                />
                {isUploading && <p className="text-xs text-red-600 mt-1 animate-pulse">Wait for upload to complete...</p>}
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => { setIsEditProjectModalOpen(false); setIsUploading(false); }} className="px-4 py-2 text-gray-500 hover:text-gray-900 dark:hover:text-white">Cancel</button>
                <button 
                  type="submit" 
                  disabled={isUploading || loading}
                  className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="animate-spin" size={18} />
                      Saving to Cloud...
                    </>
                  ) : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditServiceModalOpen && editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-lg w-full p-6 border border-gray-200 dark:border-gray-800 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">Edit Service</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              const success = await updateService(editingService.id, {
                title: editingService.title,
                description: editingService.description,
                benefits: editingService.benefits,
                waMessage: editingService.waMessage,
                image_url: editingService.image_url,
                items: Array.isArray(editingService.items) ? editingService.items : editingService.items.split(',').map((i: string) => i.trim())
              });
              setLoading(false);
              if (success) {
                showToast("Service updated successfully");
                setIsEditServiceModalOpen(false);
              } else {
                showToast("Failed to update service", "error");
              }
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input required type="text" value={editingService.title} onChange={e => setEditingService({...editingService, title: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea required value={editingService.description} onChange={e => setEditingService({...editingService, description: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800" rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Benefits</label>
                <input type="text" value={editingService.benefits} onChange={e => setEditingService({...editingService, benefits: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Features (Comma separated)</label>
                <input type="text" value={Array.isArray(editingService.items) ? editingService.items.join(', ') : editingService.items} onChange={e => setEditingService({...editingService, items: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <FileUpload 
                  onUploadStart={() => setIsUploading(true)}
                  onUpload={(urls) => {
                    setIsUploading(false);
                    if (urls.length > 0) {
                      setEditingService({...editingService, image_url: urls[0]});
                    }
                  }} 
                  bucketName="services"
                />
                {isUploading && <p className="text-xs text-red-600 mt-1 animate-pulse">Wait for upload to complete...</p>}
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => { setIsEditServiceModalOpen(false); setIsUploading(false); }} className="px-4 py-2 text-gray-500 hover:text-gray-900 dark:hover:text-white">Cancel</button>
                <button 
                  type="submit" 
                  disabled={isUploading || loading}
                  className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="animate-spin" size={18} />
                      Saving to Cloud...
                    </>
                  ) : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditTestimonialModalOpen && editingTestimonial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-lg w-full p-6 border border-gray-200 dark:border-gray-800 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">Edit Testimonial</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              const success = await updateTestimonial(editingTestimonial.id, {
                name: editingTestimonial.name,
                company: editingTestimonial.company,
                message: editingTestimonial.message,
                image_url: editingTestimonial.image_url,
                status: editingTestimonial.status
              });
              setLoading(false);
              if (success) {
                showToast("Testimonial updated successfully");
                setIsEditTestimonialModalOpen(false);
              } else {
                showToast("Failed to update testimonial", "error");
              }
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input required type="text" value={editingTestimonial.name} onChange={e => setEditingTestimonial({...editingTestimonial, name: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Company</label>
                <input required type="text" value={editingTestimonial.company} onChange={e => setEditingTestimonial({...editingTestimonial, company: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea required value={editingTestimonial.message} onChange={e => setEditingTestimonial({...editingTestimonial, message: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800" rows={4} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <FileUpload 
                  onUploadStart={() => setIsUploading(true)}
                  onUpload={(urls) => {
                    setIsUploading(false);
                    if (urls.length > 0) {
                      setEditingTestimonial({...editingTestimonial, image_url: urls[0]});
                    }
                  }} 
                  bucketName="testimonials"
                />
                {isUploading && <p className="text-xs text-red-600 mt-1 animate-pulse">Wait for upload to complete...</p>}
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => { setIsEditTestimonialModalOpen(false); setIsUploading(false); }} className="px-4 py-2 text-gray-500 hover:text-gray-900 dark:hover:text-white">Cancel</button>
                <button 
                  type="submit" 
                  disabled={isUploading || loading}
                  className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="animate-spin" size={18} />
                      Saving to Cloud...
                    </>
                  ) : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isBulkUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-2xl w-full p-6 border border-gray-200 dark:border-gray-800 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">Bulk Upload Projects</h3>
            <p className="text-gray-500 mb-6">Select multiple images to create auto-generated projects. You can edit their details later.</p>
            
            <FileUpload 
              multiple={true}
              bucketName="projects"
              onUpload={async (urls) => {
                if (urls.length > 0) {
                  setSyncing(true);
                  try {
                    for (let i = 0; i < urls.length; i++) {
                      // Using a more unique title to prevent any conflict issues
                      const timestamp = new Date().getTime();
                      const randomStr = Math.random().toString(36).substring(2, 7);
                      await addProject({
                        title: `Project ${timestamp}_${i}_${randomStr}`,
                        category: "Design",
                        description: "Auto-uploaded project",
                        image_url: urls[i]
                      });
                    }
                    showToast(`Successfully bulk uploaded ${urls.length} images`);
                    setIsBulkUploadOpen(false);
                  } catch (err) {
                    showToast("Bulk upload failed partially", "error");
                  } finally {
                    setSyncing(false);
                  }
                }
              }}
            />
            
            <div className="flex justify-end gap-3 pt-6">
              <button type="button" onClick={() => setIsBulkUploadOpen(false)} className="px-4 py-2 text-gray-500 hover:text-gray-900 dark:hover:text-white">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-6 right-6 px-6 py-3 rounded-xl shadow-xl flex items-center gap-3 text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'} z-50`}
          >
            {toast.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
            <span className="font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
