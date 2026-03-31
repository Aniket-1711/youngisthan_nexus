import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../../context/AuthContext';
import { VideoProvider } from '../../context/VideoContext';
import VideoAIChatbot from '../VideoAIChatbot';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'ngo_admin' && isLightMode) {
        document.body.className = 'theme-ngo_admin_light';
      } else {
        document.body.className = `theme-${currentUser.role}`;
      }
    } else {
      document.body.className = '';
    }
    return () => { document.body.className = ''; };
  }, [currentUser, isLightMode]);

  return (
    <VideoProvider>
      <div className="app-layout">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="main-area">
          <Header 
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
            isLightMode={isLightMode}
            toggleLightMode={() => setIsLightMode(!isLightMode)}
          />
          <main className="page-content">
            <Outlet />
          </main>
        </div>
        {/* Global AI Chatbot — appears on all dashboard pages when a video is playing */}
        <VideoAIChatbot />
      </div>
    </VideoProvider>
  );
}
