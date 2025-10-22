import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProgressiveWebApp = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [offlineData, setOfflineData] = useState(null);
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, success, error
  const [updateAvailable, setUpdateAvailable] = useState(false);

  // PWA Installation
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      addNotification('App installed successfully!', 'success');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Online/Offline Detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      addNotification('Connection restored - syncing data...', 'info');
      syncOfflineData();
    };

    const handleOffline = () => {
      setIsOnline(false);
      addNotification('Working offline - changes will sync when connection is restored', 'warning');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Service Worker Registration and Updates
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      registerServiceWorker();
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            setUpdateAvailable(true);
            addNotification('New version available!', 'info');
          }
        });
      });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'OFFLINE_FALLBACK') {
          addNotification('Page cached for offline use', 'success');
        }
      });

    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  };

  // Notification system
  const addNotification = (message, type = 'info', duration = 5000) => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };

    setNotifications(prev => [notification, ...prev.slice(0, 4)]);

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, duration);
  };

  // Install PWA
  const handleInstall = async () => {
    if (!installPrompt) return;

    const result = await installPrompt.prompt();
    if (result.outcome === 'accepted') {
      addNotification('Installing app...', 'info');
    }
    setInstallPrompt(null);
  };

  // Update app
  const handleUpdate = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      });
    }
    window.location.reload();
  };

  // Sync offline data
  const syncOfflineData = async () => {
    setSyncStatus('syncing');
    
    try {
      // Simulate syncing offline data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Get offline data from IndexedDB or localStorage
      const storedData = localStorage.getItem('offlineResumeData');
      if (storedData) {
        // Sync with server
        console.log('Syncing offline data:', JSON.parse(storedData));
        localStorage.removeItem('offlineResumeData');
      }
      
      setSyncStatus('success');
      addNotification('Data synced successfully!', 'success');
    } catch (error) {
      setSyncStatus('error');
      addNotification('Sync failed - will retry later', 'error');
    }
  };

  // Request notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        addNotification('Desktop notifications enabled!', 'success');
        
        // Show welcome notification
        new Notification('ResumeForge AI', {
          body: 'You\'ll now receive notifications about your resume progress',
          icon: '/icons/icon-192x192.png',
          badge: '/icons/badge-72x72.png'
        });
      }
    }
  };

  // Share API
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ResumeForge AI',
          text: 'Check out this amazing AI-powered resume builder!',
          url: window.location.href
        });
        addNotification('Shared successfully!', 'success');
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(window.location.href);
      addNotification('Link copied to clipboard!', 'success');
    }
  };

  // File System Access API (for modern browsers)
  const handleFileDownload = async (resumeData) => {
    if ('showSaveFilePicker' in window) {
      try {
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: 'resume.json',
          types: [{
            description: 'JSON files',
            accept: { 'application/json': ['.json'] }
          }]
        });
        
        const writable = await fileHandle.createWritable();
        await writable.write(JSON.stringify(resumeData, null, 2));
        await writable.close();
        
        addNotification('Resume saved to your computer!', 'success');
      } catch (error) {
        console.error('File save failed:', error);
      }
    }
  };

  const NotificationToast = ({ notification, onClose }) => (
    <motion.div
      className={`p-4 rounded-lg shadow-lg max-w-sm w-full ${
        notification.type === 'success' ? 'bg-green-500 text-white' :
        notification.type === 'error' ? 'bg-red-500 text-white' :
        notification.type === 'warning' ? 'bg-yellow-500 text-black' :
        'bg-blue-500 text-white'
      }`}
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      layout
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <span className="text-xl">
            {notification.type === 'success' ? '✅' :
             notification.type === 'error' ? '❌' :
             notification.type === 'warning' ? '⚠️' : 'ℹ️'}
          </span>
          <div>
            <p className="font-medium">{notification.message}</p>
            <p className="text-xs opacity-75 mt-1">
              {notification.timestamp.toLocaleTimeString()}
            </p>
          </div>
        </div>
        <button
          onClick={() => onClose(notification.id)}
          className="ml-2 opacity-75 hover:opacity-100"
        >
          ✕
        </button>
      </div>
    </motion.div>
  );

  const PWAStatusBar = () => (
    <motion.div
      className="fixed top-0 left-0 right-0 bg-gray-900 text-white px-4 py-2 flex items-center justify-between z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center space-x-4">
        {/* Online/Offline Status */}
        <div className="flex items-center space-x-2">
          <motion.div
            className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`}
            animate={{ scale: isOnline ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-sm">
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>

        {/* Sync Status */}
        {syncStatus !== 'idle' && (
          <div className="flex items-center space-x-2">
            {syncStatus === 'syncing' && (
              <motion.div
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            )}
            <span className="text-sm">
              {syncStatus === 'syncing' ? 'Syncing...' :
               syncStatus === 'success' ? 'Synced ✓' :
               syncStatus === 'error' ? 'Sync Error ✗' : ''}
            </span>
          </div>
        )}

        {/* PWA Status */}
        {isInstalled && (
          <div className="flex items-center space-x-2">
            <span className="text-sm">📱 PWA</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        {/* Update Available */}
        {updateAvailable && (
          <motion.button
            onClick={handleUpdate}
            className="px-3 py-1 bg-blue-500 rounded text-sm hover:bg-blue-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Update Available
          </motion.button>
        )}

        {/* Install Button */}
        {installPrompt && !isInstalled && (
          <motion.button
            onClick={handleInstall}
            className="px-3 py-1 bg-green-500 rounded text-sm hover:bg-green-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Install App
          </motion.button>
        )}

        {/* Share Button */}
        <motion.button
          onClick={handleShare}
          className="px-3 py-1 bg-purple-500 rounded text-sm hover:bg-purple-600 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Share
        </motion.button>
      </div>
    </motion.div>
  );

  const PWAFeaturePanel = () => {
    const [showPanel, setShowPanel] = useState(false);

    return (
      <>
        {/* PWA Features Button */}
        <motion.button
          className="fixed bottom-20 right-4 bg-purple-500 text-white p-3 rounded-full shadow-lg z-40"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowPanel(!showPanel)}
          animate={{ 
            boxShadow: ['0 4px 20px rgba(147, 51, 234, 0.3)', '0 8px 30px rgba(147, 51, 234, 0.5)', '0 4px 20px rgba(147, 51, 234, 0.3)']
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xl">📱</span>
        </motion.button>

        {/* PWA Features Panel */}
        <AnimatePresence>
          {showPanel && (
            <motion.div
              className="fixed bottom-32 right-4 bg-white rounded-xl shadow-2xl border border-gray-200 p-6 w-80 z-50"
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                  <span className="mr-2">📱</span>
                  PWA Features
                </h3>
                <button
                  onClick={() => setShowPanel(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {/* Installation Status */}
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-800">
                      App Installation
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isInstalled ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {isInstalled ? 'Installed' : 'Browser'}
                    </span>
                  </div>
                  {!isInstalled && installPrompt && (
                    <button
                      onClick={handleInstall}
                      className="mt-2 w-full bg-blue-500 text-white py-2 rounded text-sm hover:bg-blue-600"
                    >
                      Install Now
                    </button>
                  )}
                </div>

                {/* Offline Capability */}
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-800">
                      Offline Mode
                    </span>
                    <span className="text-xs px-2 py-1 bg-green-200 text-green-800 rounded-full">
                      Available
                    </span>
                  </div>
                  <p className="text-xs text-green-700 mt-1">
                    Continue working even without internet connection
                  </p>
                </div>

                {/* Notifications */}
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-yellow-800">
                      Push Notifications
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      Notification.permission === 'granted' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {Notification.permission === 'granted' ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  {Notification.permission !== 'granted' && (
                    <button
                      onClick={requestNotificationPermission}
                      className="mt-2 w-full bg-yellow-500 text-white py-2 rounded text-sm hover:bg-yellow-600"
                    >
                      Enable Notifications
                    </button>
                  )}
                </div>

                {/* File System Access */}
                <div className="p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm font-medium text-purple-800 block">
                    Advanced Features
                  </span>
                  <div className="mt-2 space-y-2">
                    <button
                      onClick={handleShare}
                      className="w-full bg-purple-500 text-white py-1 rounded text-xs hover:bg-purple-600"
                    >
                      Share App
                    </button>
                    {'showSaveFilePicker' in window && (
                      <button
                        onClick={() => handleFileDownload({ sample: 'data' })}
                        className="w-full bg-purple-500 text-white py-1 rounded text-xs hover:bg-purple-600"
                      >
                        Save to Device
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  };

  return (
    <>
      {/* PWA Status Bar */}
      <PWAStatusBar />

      {/* Notifications */}
      <div className="fixed top-16 right-4 space-y-2 z-50">
        <AnimatePresence>
          {notifications.map((notification) => (
            <NotificationToast
              key={notification.id}
              notification={notification}
              onClose={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* PWA Features Panel */}
      <PWAFeaturePanel />

      {/* Offline indicator */}
      {!isOnline && (
        <motion.div
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 z-40"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
        >
          <motion.div
            className="w-2 h-2 bg-white rounded-full"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="text-sm">Working Offline</span>
        </motion.div>
      )}
    </>
  );
};

export default ProgressiveWebApp;