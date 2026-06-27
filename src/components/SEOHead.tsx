import { useEffect } from 'react';
import { useContent } from '../contexts/ContentContext';

export default function SEOHead() {
  const { content } = useContent();

  useEffect(() => {
    document.title = content.seoTitle || "Benny Grace | Graphic Design & AI Websites";
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', content.seoDescription || "Professional digital design and web development brand.");
  }, [content.seoTitle, content.seoDescription]);

  return null;
}
