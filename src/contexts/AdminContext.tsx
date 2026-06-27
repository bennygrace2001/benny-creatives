import React, { createContext, useContext, useState } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  // Check local storage for initial state (simple persistence)
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('benny_grace_admin') === 'true';
  });

  const login = (email: string, pass: string) => {
    // Hardcoded credentials as requested for the MVP
    if (email === 'bennygrace2001@gmail.com' && pass === 'chimuanya2001') {
      setIsAdmin(true);
      localStorage.setItem('benny_grace_admin', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('benny_grace_admin');
  };

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
