import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EnterpriseUXSystem = () => {
  const [activeMode, setActiveMode] = useState('default');
  const [userPreferences, setUserPreferences] = useState({
    theme: 'light',
    reducedMotion: false,
    fontSize: 'medium',
    highContrast: false,
    autoSave: true,
    smartSuggestions: true,
    voiceCommands: false,
    keyboardShortcuts: true
  });
  const [notifications, setNotifications] = useState([]);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({
    sessionTime: 0,
    actionsPerformed: 0,
    errorsEncountered: 0,
    featuresUsed: new Set()
  });

  // Enterprise theme configurations
  const themes = {
    light: {
      background: '#ffffff',
      surface: '#f8fafc',
      primary: '#6366f1',
      secondary: '#8b5cf6',
      text: '#1f2937',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
      accent: '#10b981'
    },
    dark: {
      background: '#0f172a',
      surface: '#1e293b',
      primary: '#818cf8',
      secondary: '#a78bfa',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      border: '#334155',
      accent: '#34d399'
    },
    highContrast: {
      background: '#000000',
      surface: '#1a1a1a',
      primary: '#ffffff',
      secondary: '#ffff00',
      text: '#ffffff',
      textSecondary: '#cccccc',
      border: '#ffffff',
      accent: '#00ff00'
    },
    corporate: {
      background: '#fafbfc',
      surface: '#ffffff',
      primary: '#0052cc',
      secondary: '#6554c0',
      text: '#172b4d',
      textSecondary: '#5e6c84',
      border: '#dfe1e6',
      accent: '#00875a'
    }
  };

  // Session analytics tracking
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setAnalyticsData(prev => ({
        ...prev,
        sessionTime: Math.floor((Date.now() - startTime) / 1000)
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Error boundary and analytics
  const trackAction = (action, details = {}) => {
    setAnalyticsData(prev => ({
      ...prev,
      actionsPerformed: prev.actionsPerformed + 1,
      featuresUsed: new Set([...prev.featuresUsed, action])
    }));

    // Send to analytics service
    if (window.gtag) {
      window.gtag('event', action, {
        event_category: 'User Interaction',
        event_label: details.label || action,
        value: details.value || 1
      });
    }
  };

  const trackError = (error, context = {}) => {
    setAnalyticsData(prev => ({
      ...prev,
      errorsEncountered: prev.errorsEncountered + 1
    }));

    console.error('Enterprise UX Error:', error, context);
    
    // Send error to monitoring service
    if (window.Sentry) {
      window.Sentry.captureException(error, { contexts: { ux: context } });
    }
  };

  // Smart notification system
  const addNotification = (message, type = 'info', actions = []) => {
    const notification = {
      id: Date.now(),
      message,
      type,
      actions,
      timestamp: new Date(),
      priority: type === 'error' ? 3 : type === 'warning' ? 2 : 1
    };

    setNotifications(prev => {
      const updated = [notification, ...prev.slice(0, 4)];
      return updated.sort((a, b) => b.priority - a.priority);
    });

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, type === 'error' ? 10000 : 5000);
  };

  // Onboarding system
  const onboardingSteps = [
    {
      title: "Welcome to ResumeForge AI Enterprise",
      content: "Let's get you set up with our professional-grade features.",
      target: ".enterprise-welcome",
      position: "center"
    },
    {
      title: "Smart Assistance",
      content: "AI-powered suggestions will help you create the perfect resume.",
      target: ".smart-suggestions",
      position: "right"
    },
    {
      title: "Accessibility Features",
      content: "We support screen readers, voice commands, and keyboard navigation.",
      target: ".accessibility-controls",
      position: "left"
    },
    {
      title: "Keyboard Shortcuts",
      content: "Press Ctrl+? to see all available shortcuts for faster workflow.",
      target: ".shortcuts-hint",
      position: "bottom"
    },
    {
      title: "Enterprise Security",
      content: "Your data is encrypted and stored securely with enterprise-grade protection.",
      target: ".security-badge",
      position: "top"
    }
  ];

  const startOnboarding = () => {
    setShowOnboarding(true);
    setOnboardingStep(0);
    trackAction('onboarding_started');
  };

  const nextOnboardingStep = () => {
    if (onboardingStep < onboardingSteps.length - 1) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      setShowOnboarding(false);
      addNotification('Onboarding completed! You\'re ready to build amazing resumes.', 'success');
      trackAction('onboarding_completed');
    }
  };

  // Performance monitoring
  const performanceMetrics = useRef({
    renderTimes: [],
    interactionLatency: [],
    memoryUsage: []
  });

  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'measure') {
          performanceMetrics.current.renderTimes.push(entry.duration);
        }
      });
    });

    observer.observe({ entryTypes: ['measure'] });

    return () => observer.disconnect();
  }, []);

  // Enterprise security indicators
  const SecurityBadge = () => (
    <motion.div
      className="security-badge fixed top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-2 z-50"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.05 }}
    >
      <span>🔒</span>
      <span>Enterprise Secure</span>
    </motion.div>
  );

  // Advanced notification component
  const EnterpriseNotification = ({ notification, onClose, onAction }) => (
    <motion.div
      className={`bg-white rounded-lg shadow-xl border-l-4 p-4 max-w-md w-full ${
        notification.type === 'error' ? 'border-red-500' :
        notification.type === 'warning' ? 'border-yellow-500' :
        notification.type === 'success' ? 'border-green-500' :
        'border-blue-500'
      }`}
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      layout
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <span className="text-xl">
            {notification.type === 'error' ? '🚨' :
             notification.type === 'warning' ? '⚠️' :
             notification.type === 'success' ? '✅' : 'ℹ️'}
          </span>
          <div className="flex-1">
            <p className="font-medium text-gray-900">{notification.message}</p>
            <p className="text-xs text-gray-500 mt-1">
              {notification.timestamp.toLocaleTimeString()}
            </p>
            {notification.actions && notification.actions.length > 0 && (
              <div className="mt-3 flex space-x-2">
                {notification.actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => onAction(action)}
                    className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => onClose(notification.id)}
          className="ml-2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
    </motion.div>
  );

  // Onboarding overlay
  const OnboardingOverlay = () => {
    if (!showOnboarding) return null;

    const currentStep = onboardingSteps[onboardingStep];

    return (
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">{currentStep.title}</h3>
            <span className="text-sm text-gray-500">
              {onboardingStep + 1} of {onboardingSteps.length}
            </span>
          </div>
          
          <p className="text-gray-700 mb-6">{currentStep.content}</p>
          
          <div className="flex justify-between items-center">
            <div className="flex space-x-1">
              {onboardingSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index <= onboardingStep ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setShowOnboarding(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Skip
              </button>
              <button
                onClick={nextOnboardingStep}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                {onboardingStep === onboardingSteps.length - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // Analytics dashboard (hidden, for admin)
  const AnalyticsDashboard = () => {
    const [showAnalytics, setShowAnalytics] = useState(false);

    return (
      <>
        <button
          className="fixed bottom-4 left-4 w-2 h-2 bg-transparent"
          onClick={(e) => {
            if (e.altKey && e.shiftKey) {
              setShowAnalytics(!showAnalytics);
            }
          }}
        />
        
        <AnimatePresence>
          {showAnalytics && (
            <motion.div
              className="fixed bottom-4 left-4 bg-white rounded-lg shadow-xl p-4 w-64 border z-50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <h4 className="font-bold mb-2">Session Analytics</h4>
              <div className="text-sm space-y-1">
                <p>Time: {Math.floor(analyticsData.sessionTime / 60)}m {analyticsData.sessionTime % 60}s</p>
                <p>Actions: {analyticsData.actionsPerformed}</p>
                <p>Errors: {analyticsData.errorsEncountered}</p>
                <p>Features: {analyticsData.featuresUsed.size}</p>
              </div>
              <button
                onClick={() => setShowAnalytics(false)}
                className="mt-2 text-xs bg-gray-500 text-white px-2 py-1 rounded"
              >
                Close
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  };

  // Feature toggles panel
  const FeatureTogglesPanel = () => {
    const [showPanel, setShowPanel] = useState(false);

    return (
      <>
        <motion.button
          className="fixed top-4 right-4 bg-purple-500 text-white p-2 rounded-full z-40"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowPanel(!showPanel)}
        >
          ⚙️
        </motion.button>

        <AnimatePresence>
          {showPanel && (
            <motion.div
              className="fixed top-16 right-4 bg-white rounded-xl shadow-2xl p-6 w-80 border z-50"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
            >
              <h3 className="text-lg font-bold mb-4">Enterprise Settings</h3>
              
              <div className="space-y-4">
                {Object.entries(userPreferences).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <label className="text-sm font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    {typeof value === 'boolean' ? (
                      <button
                        onClick={() => {
                          setUserPreferences(prev => ({ ...prev, [key]: !value }));
                          trackAction('preference_changed', { preference: key, value: !value });
                        }}
                        className={`w-10 h-6 rounded-full transition-colors ${
                          value ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      >
                        <motion.div
                          className="w-4 h-4 bg-white rounded-full shadow"
                          animate={{ x: value ? 20 : 2 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        />
                      </button>
                    ) : (
                      <select
                        value={value}
                        onChange={(e) => {
                          setUserPreferences(prev => ({ ...prev, [key]: e.target.value }));
                          trackAction('preference_changed', { preference: key, value: e.target.value });
                        }}
                        className="text-sm border rounded px-2 py-1"
                      >
                        {key === 'theme' && (
                          <>
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="highContrast">High Contrast</option>
                            <option value="corporate">Corporate</option>
                          </>
                        )}
                        {key === 'fontSize' && (
                          <>
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                          </>
                        )}
                      </select>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t">
                <button
                  onClick={startOnboarding}
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Restart Onboarding
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  };

  return (
    <div className="enterprise-ux-system">
      {/* Security Badge */}
      <SecurityBadge />

      {/* Feature Toggles */}
      <FeatureTogglesPanel />

      {/* Notifications */}
      <div className="fixed top-4 right-20 space-y-2 z-40">
        <AnimatePresence>
          {notifications.map((notification) => (
            <EnterpriseNotification
              key={notification.id}
              notification={notification}
              onClose={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
              onAction={(action) => {
                trackAction('notification_action', { action: action.id });
                if (action.callback) action.callback();
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Onboarding */}
      <AnimatePresence>
        <OnboardingOverlay />
      </AnimatePresence>

      {/* Analytics Dashboard (Hidden) */}
      <AnalyticsDashboard />

      {/* Enterprise welcome section */}
      <div className="enterprise-welcome" style={{ display: 'none' }} />
      <div className="smart-suggestions" style={{ display: 'none' }} />
      <div className="accessibility-controls" style={{ display: 'none' }} />
      <div className="shortcuts-hint" style={{ display: 'none' }} />

      {/* Global theme application */}
      <style jsx global>{`
        :root {
          --color-background: ${themes[userPreferences.theme]?.background || themes.light.background};
          --color-surface: ${themes[userPreferences.theme]?.surface || themes.light.surface};
          --color-primary: ${themes[userPreferences.theme]?.primary || themes.light.primary};
          --color-secondary: ${themes[userPreferences.theme]?.secondary || themes.light.secondary};
          --color-text: ${themes[userPreferences.theme]?.text || themes.light.text};
          --color-text-secondary: ${themes[userPreferences.theme]?.textSecondary || themes.light.textSecondary};
          --color-border: ${themes[userPreferences.theme]?.border || themes.light.border};
          --color-accent: ${themes[userPreferences.theme]?.accent || themes.light.accent};
          --font-size-base: ${userPreferences.fontSize === 'small' ? '14px' : userPreferences.fontSize === 'large' ? '18px' : '16px'};
        }

        ${userPreferences.reducedMotion ? `
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        ` : ''}

        body {
          background-color: var(--color-background);
          color: var(--color-text);
          font-size: var(--font-size-base);
        }
      `}</style>
    </div>
  );
};

export default EnterpriseUXSystem;