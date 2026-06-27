import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import { Settings, Lock, ArrowLeft } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (login(email, password)) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials.');
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-24 flex items-center justify-center bg-gray-50 dark:bg-zinc-950 px-4">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-800">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-600/10 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold">Admin Access</h2>
          <p className="text-gray-500 mt-2">Enter credentials to manage the platform</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-4 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all transform hover:-translate-y-1 shadow-lg shadow-red-600/20 flex items-center justify-center gap-2"
          >
            <Settings size={20} />
            Login to Dashboard
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-100 dark:border-gray-800 pt-6">
          <Link to="/" className="text-sm font-medium text-gray-500 hover:text-red-600 inline-flex items-center gap-1 transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
