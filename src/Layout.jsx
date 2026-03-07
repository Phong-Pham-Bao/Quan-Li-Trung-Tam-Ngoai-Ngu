import React, { useState, useEffect } from 'react';
import { demoClient } from '@/api/demoClient';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import { useAuth } from '@/lib/AuthContext';

export default function Layout({ children, currentPageName }) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const loadNotifications = async () => {
      if (!user?.email) return;
      try {
        const notifications = await demoClient.entities.Notification.filter({
          target_email: user.email,
          is_read: false
        });
        setNotificationCount(notifications.length || 0);
      } catch (notifError) {
        console.warn('Failed to load notifications:', notifError);
        setNotificationCount(0);
      }
    };
    loadNotifications();
  }, [user, currentPageName]);

  const role = user?.role || 'student';

  const handleLogout = () => {
    logout();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Ensure children is a single React element before cloning
  const content = React.isValidElement(children) 
    ? React.cloneElement(children, { currentUser: user })
    : children;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        role={role}
        currentPage={currentPageName}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="lg:ml-64 min-h-screen flex flex-col">
        <TopBar
          user={user}
          onMenuToggle={() => setSidebarOpen(true)}
          onLogout={handleLogout}
          notificationCount={notificationCount}
        />
        <main className="flex-1 p-4 lg:p-6">
          {content}
        </main>
      </div>
    </div>
  );
}
