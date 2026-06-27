import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, hasSupabaseConfig } from '../lib/supabase';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('benny_grace_theme') as Theme) || 'dark';
  });

  const getUserId = () => {
    let id = localStorage.getItem('benny_grace_user_id');
    if (!id) {
      id = 'user_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('benny_grace_user_id', id);
    }
    return id;
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('benny_grace_theme', theme);
  }, [theme]);

  useEffect(() => {
    async function fetchCloudTheme() {
      if (!hasSupabaseConfig) return;
      try {
        const userId = getUserId();
        const { data, error } = await supabase
          .from('user_preferences')
          .select('theme')
          .eq('id', userId)
          .single();
        
        if (data?.theme && data.theme !== theme) {
          setTheme(data.theme as Theme);
        }
      } catch (err) {
        console.warn("Cloud theme fetch skipped (table may not exist)");
      }
    }
    fetchCloudTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    
    if (hasSupabaseConfig) {
      try {
        const userId = getUserId();
        await supabase
          .from('user_preferences')
          .upsert({ id: userId, theme: newTheme });
      } catch (err) {
        console.warn("Cloud theme save failed");
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
