import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, hasSupabaseConfig } from '../lib/supabase';

export interface SiteContent {
  heroHeadlinePart1: string;
  heroHeadlinePart2: string;
  heroHeadlinePart3: string;
  heroSubheadline: string;
  aboutStory: string;
  aboutMission: string;
  aboutVision: string;
  visionFuture: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  footerDescription: string;
  seoTitle: string;
  seoDescription: string;
}

export const defaultContent: SiteContent = {
  heroHeadlinePart1: "Transforming Ideas Into",
  heroHeadlinePart2: "Stunning Designs",
  heroHeadlinePart3: "& AI-Powered Websites",
  heroSubheadline: "We help businesses, brands, and entrepreneurs stand out through professional graphics design, modern websites, branding, and digital innovation.",
  aboutStory: "Benny Grace is a professional digital design and web development brand dedicated to pushing the boundaries of creativity and technology. Born from a passion for visual aesthetics and digital innovation, we have grown into a trusted partner for businesses seeking to establish a commanding online presence.\n\nWe specialize in blending cutting-edge AI web design techniques with timeless graphic design principles to deliver solutions that are not just beautiful, but highly effective.",
  aboutMission: "To empower businesses and individuals through innovative graphic design and AI-powered digital solutions that drive growth and engagement.",
  aboutVision: "To become a leading digital creativity and AI web design brand in Africa, setting the standard for excellence and innovation.",
  visionFuture: "At Benny Grace (Chimuanya Creatives), our long-term vision extends far beyond creating beautiful designs. We are committed to pioneering digital transformation and driving AI adoption across Africa's creative landscape.",
  bankName: "Guaranty Trust Bank (GTB)",
  accountName: "Benny Grace Digital",
  accountNumber: "0123456789",
  contactPhone: "08039542598",
  contactEmail: "bennygrace2001@gmail.com",
  contactAddress: "No 1 ukana street Omaha phase 2",
  footerDescription: "Transforming ideas into stunning designs and AI-powered websites. Your partner in digital creativity and branding solutions.",
  seoTitle: "Benny Grace | Graphic Design & AI Websites",
  seoDescription: "Professional digital design and web development brand dedicated to pushing the boundaries of creativity and technology."
};

interface ContentContextType {
  content: SiteContent;
  updateContent: (newContent: Partial<SiteContent>) => Promise<boolean>;
  loading: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContent>(() => {
    const saved = localStorage.getItem('benny_grace_content');
    return saved ? { ...defaultContent, ...JSON.parse(saved) } : defaultContent;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadContent() {
      if (hasSupabaseConfig) {
        setLoading(true);
        try {
          const { data, error } = await supabase.from('site_content').select('*').single();
          if (data && !error) {
            // merge to ensure all fields exist
            const merged = { ...defaultContent, ...data };
            setContent(merged);
            localStorage.setItem('benny_grace_content', JSON.stringify(merged));
          }
        } catch (e) {
          console.error("Failed to load content from Supabase", e);
        } finally {
          setLoading(false);
        }
      }
    }
    loadContent();
  }, []);

  const updateContent = async (newContent: Partial<SiteContent>) => {
    const updated = { ...content, ...newContent };
    setContent(updated);
    localStorage.setItem('benny_grace_content', JSON.stringify(updated));

    if (hasSupabaseConfig) {
      try {
        const { error } = await supabase.from('site_content').upsert({ id: 1, ...updated });
        if (error) throw error;
        return true;
      } catch (e) {
        console.error("Failed to update content in Supabase", e);
        return false;
      }
    }
    return true; // Pretend success for local storage
  };

  return (
    <ContentContext.Provider value={{ content, updateContent, loading }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}
