import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AccessibilitySystem = () => {
  const [screenReaderMode, setScreenReaderMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [keyboardNavigation, setKeyboardNavigation] = useState(true);
  const [voiceCommands, setVoiceCommands] = useState(false);
  const [isAnnouncing, setIsAnnouncing] = useState(null);

  // Accessibility announcements
  const announce = (message, priority = 'polite') => {
    setIsAnnouncing({ message, priority, id: Date.now() });
    setTimeout(() => setIsAnnouncing(null), 3000);
  };

  // Voice command system
  const voiceCommandsData = [
    {
      command: 'save resume',
      description: 'Save the current resume',
      action: () => {
        announce('Resume saved successfully');
        console.log('Save resume');
      }
    },
    {
      command: 'go to experience',
      description: 'Navigate to experience section',
      action: () => {
        const element = document.querySelector('[data-section="experience"]');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          element.focus();
          announce('Navigated to experience section');
        }
      }
    },
    {
      command: 'add new job',
      description: 'Add a new job experience',
      action: () => {
        announce('Adding new job experience');
        console.log('Add new job');
      }
    },
    {
      command: 'enhance with ai',
      description: 'Enhance current section with AI',
      action: () => {
        announce('AI enhancement activated');
        console.log('AI enhance');
      }
    },
    {
      command: 'increase font size',
      description: 'Make text larger',
      action: () => {
        setFontSize(prev => Math.min(prev + 2, 24));
        announce('Font size increased');
      }
    },
    {
      command: 'decrease font size',
      description: 'Make text smaller',
      action: () => {
        setFontSize(prev => Math.max(prev - 2, 12));
        announce('Font size decreased');
      }
    },
    {
      command: 'toggle high contrast',
      description: 'Switch to high contrast mode',
      action: () => {
        setHighContrast(prev => !prev);
        announce(highContrast ? 'High contrast disabled' : 'High contrast enabled');
      }
    }
  ];

  // Voice recognition setup
  useEffect(() => {
    if (voiceCommands && 'webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
        
        const matchedCommand = voiceCommandsData.find(cmd => 
          transcript.includes(cmd.command.toLowerCase())
        );

        if (matchedCommand) {
          matchedCommand.action();
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        announce('Voice recognition error occurred', 'assertive');
      };

      recognition.start();

      return () => {
        recognition.stop();
      };
    }
  }, [voiceCommands, highContrast]);

  // Apply accessibility settings to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Font size
    root.style.setProperty('--base-font-size', `${fontSize}px`);
    
    // High contrast
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Reduced motion
    if (reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // Screen reader mode
    if (screenReaderMode) {
      root.classList.add('screen-reader-mode');
    } else {
      root.classList.remove('screen-reader-mode');
    }
  }, [fontSize, highContrast, reducedMotion, screenReaderMode]);

  // Keyboard navigation enhancement
  useEffect(() => {
    if (!keyboardNavigation) return;

    const handleKeyDown = (e) => {
      // Enhanced focus management
      if (e.key === 'Tab') {
        const focusableElements = document.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
        
        if (e.shiftKey) {
          // Previous element
          if (currentIndex > 0) {
            focusableElements[currentIndex - 1].focus();
          } else {
            focusableElements[focusableElements.length - 1].focus();
          }
        } else {
          // Next element
          if (currentIndex < focusableElements.length - 1) {
            focusableElements[currentIndex + 1].focus();
          } else {
            focusableElements[0].focus();
          }
        }
      }

      // Skip to main content
      if (e.key === 'Enter' && e.ctrlKey) {
        const mainContent = document.querySelector('[role="main"]') || document.querySelector('main');
        if (mainContent) {
          mainContent.focus();
          announce('Jumped to main content');
        }
      }

      // Announce current focus
      if (e.key === 'F1') {
        e.preventDefault();
        const activeElement = document.activeElement;
        const description = activeElement.getAttribute('aria-label') || 
                          activeElement.getAttribute('title') || 
                          activeElement.textContent || 
                          activeElement.placeholder || 
                          'Unlabeled element';
        announce(`Currently focused on: ${description}`);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [keyboardNavigation]);

  // Focus indicators
  const FocusIndicator = () => (
    <style>{`
      .accessibility-focus:focus {
        outline: 3px solid #2563eb !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 5px rgba(37, 99, 235, 0.2) !important;
      }
      
      .high-contrast {
        filter: contrast(150%) brightness(120%);
      }
      
      .high-contrast * {
        color: black !important;
        background-color: white !important;
        border-color: black !important;
      }
      
      .high-contrast button, .high-contrast input, .high-contrast select {
        background-color: yellow !important;
        color: black !important;
        border: 2px solid black !important;
      }
      
      .reduced-motion * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
      
      .screen-reader-mode .sr-only {
        position: static !important;
        width: auto !important;
        height: auto !important;
        overflow: visible !important;
        clip: auto !important;
        white-space: normal !important;
      }
      
      :root {
        font-size: var(--base-font-size, 16px);
      }
    `}</style>
  );

  // Accessibility panel
  const AccessibilityPanel = () => (
    <motion.div
      className="fixed top-4 right-4 bg-white rounded-xl shadow-2xl border border-gray-200 p-6 w-80 z-50"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
          <span className="mr-2">♿</span>
          Accessibility
        </h3>
        <button
          onClick={() => setShowPanel(false)}
          className="text-gray-400 hover:text-gray-600 accessibility-focus"
          aria-label="Close accessibility panel"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        {/* Screen Reader Mode */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Screen Reader Mode
          </label>
          <motion.button
            className={`w-12 h-6 rounded-full transition-colors accessibility-focus ${
              screenReaderMode ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            onClick={() => {
              setScreenReaderMode(!screenReaderMode);
              announce(screenReaderMode ? 'Screen reader mode disabled' : 'Screen reader mode enabled');
            }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Screen reader mode ${screenReaderMode ? 'enabled' : 'disabled'}`}
          >
            <motion.div
              className="w-5 h-5 bg-white rounded-full shadow"
              animate={{ x: screenReaderMode ? 24 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </motion.button>
        </div>

        {/* High Contrast */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            High Contrast
          </label>
          <motion.button
            className={`w-12 h-6 rounded-full transition-colors accessibility-focus ${
              highContrast ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            onClick={() => {
              setHighContrast(!highContrast);
              announce(highContrast ? 'High contrast disabled' : 'High contrast enabled');
            }}
            whileTap={{ scale: 0.95 }}
            aria-label={`High contrast ${highContrast ? 'enabled' : 'disabled'}`}
          >
            <motion.div
              className="w-5 h-5 bg-white rounded-full shadow"
              animate={{ x: highContrast ? 24 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </motion.button>
        </div>

        {/* Font Size */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Font Size: {fontSize}px
          </label>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setFontSize(prev => Math.max(prev - 2, 12));
                announce('Font size decreased');
              }}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 accessibility-focus"
              aria-label="Decrease font size"
            >
              A-
            </button>
            <input
              type="range"
              min="12"
              max="24"
              value={fontSize}
              onChange={(e) => {
                setFontSize(parseInt(e.target.value));
                announce(`Font size set to ${e.target.value} pixels`);
              }}
              className="flex-1 accessibility-focus"
              aria-label="Font size slider"
            />
            <button
              onClick={() => {
                setFontSize(prev => Math.min(prev + 2, 24));
                announce('Font size increased');
              }}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 accessibility-focus"
              aria-label="Increase font size"
            >
              A+
            </button>
          </div>
        </div>

        {/* Reduced Motion */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Reduce Motion
          </label>
          <motion.button
            className={`w-12 h-6 rounded-full transition-colors accessibility-focus ${
              reducedMotion ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            onClick={() => {
              setReducedMotion(!reducedMotion);
              announce(reducedMotion ? 'Motion reduction disabled' : 'Motion reduction enabled');
            }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Reduce motion ${reducedMotion ? 'enabled' : 'disabled'}`}
          >
            <motion.div
              className="w-5 h-5 bg-white rounded-full shadow"
              animate={{ x: reducedMotion ? 24 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </motion.button>
        </div>

        {/* Voice Commands */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Voice Commands
          </label>
          <motion.button
            className={`w-12 h-6 rounded-full transition-colors accessibility-focus ${
              voiceCommands ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            onClick={() => {
              setVoiceCommands(!voiceCommands);
              announce(voiceCommands ? 'Voice commands disabled' : 'Voice commands enabled');
            }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Voice commands ${voiceCommands ? 'enabled' : 'disabled'}`}
          >
            <motion.div
              className="w-5 h-5 bg-white rounded-full shadow"
              animate={{ x: voiceCommands ? 24 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </motion.button>
        </div>

        {/* Voice Commands List */}
        {voiceCommands && (
          <motion.div
            className="mt-4 p-3 bg-blue-50 rounded-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h4 className="text-sm font-semibold text-blue-800 mb-2">
              Available Voice Commands:
            </h4>
            <div className="space-y-1 text-xs text-blue-700">
              {voiceCommandsData.slice(0, 4).map((cmd, index) => (
                <div key={index} className="flex justify-between">
                  <span>"{cmd.command}"</span>
                  <span className="text-blue-600">{cmd.description}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Keyboard Shortcuts Info */}
        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">
            Keyboard Navigation:
          </h4>
          <div className="space-y-1 text-xs text-gray-600">
            <div>• <kbd className="px-1 bg-white border rounded">Tab</kbd> Navigate forward</div>
            <div>• <kbd className="px-1 bg-white border rounded">Shift+Tab</kbd> Navigate backward</div>
            <div>• <kbd className="px-1 bg-white border rounded">F1</kbd> Announce current focus</div>
            <div>• <kbd className="px-1 bg-white border rounded">Ctrl+Enter</kbd> Skip to main content</div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const [showPanel, setShowPanel] = useState(false);

  return (
    <>
      <FocusIndicator />
      
      {/* Accessibility trigger button */}
      <motion.button
        className="fixed top-4 left-4 bg-blue-500 text-white p-3 rounded-full shadow-lg z-40 accessibility-focus"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowPanel(!showPanel)}
        aria-label="Open accessibility options"
        title="Accessibility Options"
      >
        <span className="text-xl">♿</span>
      </motion.button>

      {/* Accessibility panel */}
      <AnimatePresence>
        {showPanel && <AccessibilityPanel />}
      </AnimatePresence>

      {/* Screen reader announcements */}
      {isAnnouncing && (
        <div
          className="sr-only"
          aria-live={isAnnouncing.priority}
          aria-atomic="true"
          key={isAnnouncing.id}
        >
          {isAnnouncing.message}
        </div>
      )}

      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-500 text-white px-4 py-2 rounded z-50"
        onFocus={() => announce('Skip to main content link focused')}
      >
        Skip to main content
      </a>

      {/* Voice command indicator */}
      {voiceCommands && (
        <motion.div
          className="fixed bottom-4 left-4 bg-red-500 text-white px-3 py-2 rounded-full shadow-lg flex items-center space-x-2 z-40"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-2 h-2 bg-white rounded-full"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="text-sm">Listening</span>
        </motion.div>
      )}

      {/* High contrast indicator */}
      {highContrast && (
        <div className="fixed top-16 left-4 bg-yellow-400 text-black px-3 py-1 rounded text-sm font-bold z-40">
          High Contrast Mode
        </div>
      )}
    </>
  );
};

export default AccessibilitySystem;