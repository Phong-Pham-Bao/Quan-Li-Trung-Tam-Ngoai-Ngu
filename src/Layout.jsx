import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const loadUser = async () => {
      const me = await base44.auth.me();
      setUser(me);

      const notifications = await base44.entities.Notification.filter({
        target_email: me.email,
        is_read: false
      });
      setNotificationCount(notifications.length);
    };
    loadUser();
  }, [currentPageName]);

  const role = user?.role || 'student';

  const handleLogout = () => {
    base44.auth.logout();
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
          {React.cloneElement(children, { currentUser: user })}
        </main>
      </div>
    </div>
  );
}