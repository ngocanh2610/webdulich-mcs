import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProvincesPage from './pages/ProvincesPage';
import ProvinceDetailPage from './pages/ProvinceDetailPage';
import LocationDetailPage from './pages/LocationDetailPage';
import AuthPage from './pages/AuthPage';
import AdminApprovalPage from './pages/AdminApprovalPage';
import NotFoundPage from './pages/NotFoundPage';
import ChatWidget from './components/ChatWidget';

function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID_HERE";
  
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/provinces" element={<ProvincesPage />} />
          <Route path="/provinces/:slug" element={<ProvinceDetailPage />} />
          <Route path="/locations/:id" element={<LocationDetailPage />} />
          <Route path="/admin/approvals" element={<AdminApprovalPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <ChatWidget />
    </div>
    </GoogleOAuthProvider>
  );
}

export default App;
