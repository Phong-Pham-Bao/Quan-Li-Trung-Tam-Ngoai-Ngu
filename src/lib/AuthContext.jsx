import React, { createContext, useState, useContext, useEffect } from 'react';
import { demoClient } from '@/api/demoClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings, setAppPublicSettings] = useState(null); // Contains only { id, public_settings }

  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    try {
      // Set app public settings immediately (don't block)
      setAppPublicSettings({ id: 'demo-app', public_settings: {} });
      setIsLoadingPublicSettings(false);
      
      // Try to fetch user data but don't block loading
      try {
        const currentUser = await Promise.race([
          demoClient.auth.me(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 10000)
          )
        ]);
        setUser(currentUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.log('User not authenticated or timeout');
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoadingAuth(false);
    } catch (error) {
      console.error('Unexpected error:', error);
      setIsLoadingAuth(false);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const logout = (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);
    
    if (shouldRedirect) {
      demoClient.auth.logout(window.location.href);
    } else {
      demoClient.auth.logout();
    }
  };

  const navigateToLogin = () => {
    demoClient.auth.redirectToLogin(window.location.href);
  };

  const login = async (email, password) => {
    setIsLoadingAuth(true);
    setAuthError(null);
    try {
      const user = await demoClient.auth.login(email, password);
      setUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (error) {
      setAuthError(error);
      throw error;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const register = async (data) => {
    setIsLoadingAuth(true);
    setAuthError(null);
    try {
      const user = await demoClient.auth.register(data);
      setUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (error) {
      setAuthError(error);
      throw error;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      login,
      register,
      logout,
      navigateToLogin,
      checkAppState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
