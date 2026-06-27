import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AdminProvider } from './contexts/AdminContext';
import { ContentProvider } from './contexts/ContentContext';
import { DataProvider } from './contexts/DataContext';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import SEOHead from './components/SEOHead';

// Page placeholders (to be created)
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Training from './pages/Training';
import Vision from './pages/Vision';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';

export default function App() {
  return (
    <ThemeProvider>
      <AdminProvider>
        <ContentProvider>
          <DataProvider>
            <SEOHead />
            <Router>
              <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300 flex flex-col font-sans selection:bg-red-600 selection:text-white">
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/about-us" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/training" element={<Training />} />
                    <Route path="/vision" element={<Vision />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </Router>
          </DataProvider>
        </ContentProvider>
      </AdminProvider>
    </ThemeProvider>
  );
}
