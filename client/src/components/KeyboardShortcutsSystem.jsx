import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const KeyboardShortcutsSystem = () => {
  const [shortcutsVisible, setShortcutsVisible] = useState(false);
  const [activeShortcut, setActiveShortcut] = useState(null);
  const [pressedKeys, setPressedKeys] = useState(new Set());
  const [shortcutHistory, setShortcutHistory] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const timeoutRef = useRef(null);

  // Comprehensive keyboard shortcuts mapping
  const shortcuts = {
    // Global shortcuts
    global: [
      {
        keys: ['?'],
        description: 'Show/hide keyboard shortcuts',
        category: 'Help',
        action: () => setShortcutsVisible(!shortcutsVisible),
        icon: '❓'
      },
      {
        keys: ['Ctrl', 'S'],
        description: 'Save current resume',
        category: 'File Operations',
        action: () => console.log('Save resume'),
        icon: '💾'
      },
      {
        keys: ['Ctrl', 'Shift', 'S'],
        description: 'Save resume as...',
        category: 'File Operations',
        action: () => console.log('Save as'),
        icon: '📁'
      },
      {
        keys: ['Ctrl', 'P'],
        description: 'Print or export PDF',
        category: 'File Operations',
        action: () => window.print(),
        icon: '🖨️'
      },
      {
        keys: ['Ctrl', 'Z'],
        description: 'Undo last action',
        category: 'Editing',
        action: () => console.log('Undo'),
        icon: '↶'
      },
      {
        keys: ['Ctrl', 'Y'],
        description: 'Redo last action',
        category: 'Editing',
        action: () => console.log('Redo'),
        icon: '↷'
      },
      {
        keys: ['Ctrl', 'A'],
        description: 'Select all text in active field',
        category: 'Editing',
        action: () => console.log('Select all'),
        icon: '📝'
      }
    ],
    
    // Navigation shortcuts
    navigation: [
      {
        keys: ['Tab'],
        description: 'Move to next field',
        category: 'Navigation',
        action: () => console.log('Next field'),
        icon: '→'
      },
      {
        keys: ['Shift', 'Tab'],
        description: 'Move to previous field',
        category: 'Navigation',
        action: () => console.log('Previous field'),
        icon: '←'
      },
      {
        keys: ['Ctrl', '1'],
        description: 'Go to Personal Info section',
        category: 'Navigation',
        action: () => scrollToSection('personal-info'),
        icon: '👤'
      },
      {
        keys: ['Ctrl', '2'],
        description: 'Go to Experience section',
        category: 'Navigation',
        action: () => scrollToSection('experience'),
        icon: '💼'
      },
      {
        keys: ['Ctrl', '3'],
        description: 'Go to Skills section',
        category: 'Navigation',
        action: () => scrollToSection('skills'),
        icon: '🛠️'
      },
      {
        keys: ['Ctrl', '4'],
        description: 'Go to Education section',
        category: 'Navigation',
        action: () => scrollToSection('education'),
        icon: '🎓'
      },
      {
        keys: ['Home'],
        description: 'Go to top of resume',
        category: 'Navigation',
        action: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
        icon: '⬆️'
      },
      {
        keys: ['End'],
        description: 'Go to bottom of resume',
        category: 'Navigation',
        action: () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }),
        icon: '⬇️'
      }
    ],

    // AI and Enhancement shortcuts
    ai: [
      {
        keys: ['Ctrl', 'I'],
        description: 'Enhance current section with AI',
        category: 'AI Features',
        action: () => console.log('AI enhance'),
        icon: '🤖'
      },
      {
        keys: ['Ctrl', 'Shift', 'A'],
        description: 'AI suggestion for current field',
        category: 'AI Features',
        action: () => console.log('AI suggest'),
        icon: '💡'
      },
      {
        keys: ['Enter'],
        description: 'Accept AI suggestion',
        category: 'AI Features',
        action: () => console.log('Accept suggestion'),
        icon: '✅'
      },
      {
        keys: ['Escape'],
        description: 'Dismiss AI suggestions',
        category: 'AI Features',
        action: () => console.log('Dismiss suggestions'),
        icon: '❌'
      },
      {
        keys: ['Ctrl', 'R'],
        description: 'Regenerate AI suggestions',
        category: 'AI Features',
        action: () => console.log('Regenerate'),
        icon: '🔄'
      }
    ],

    // Template management
    templates: [
      {
        keys: ['Ctrl', 'T'],
        description: 'Open template selector',
        category: 'Templates',
        action: () => console.log('Template selector'),
        icon: '🎨'
      },
      {
        keys: ['Alt', '1'],
        description: 'Switch to Classic template',
        category: 'Templates',
        action: () => console.log('Classic template'),
        icon: '📄'
      },
      {
        keys: ['Alt', '2'],
        description: 'Switch to Modern template',
        category: 'Templates',
        action: () => console.log('Modern template'),
        icon: '✨'
      },
      {
        keys: ['Alt', '3'],
        description: 'Switch to Minimal template',
        category: 'Templates',
        action: () => console.log('Minimal template'),
        icon: '⚪'
      },
      {
        keys: ['Ctrl', 'Shift', 'C'],
        description: 'Customize current template',
        category: 'Templates',
        action: () => console.log('Customize template'),
        icon: '🔧'
      }
    ],

    // Advanced features
    advanced: [
      {
        keys: ['Ctrl', 'Shift', 'P'],
        description: 'Open command palette',
        category: 'Advanced',
        action: () => console.log('Command palette'),
        icon: '🎛️'
      },
      {
        keys: ['Ctrl', 'Shift', 'D'],
        description: 'Toggle developer tools',
        category: 'Advanced',
        action: () => console.log('Dev tools'),
        icon: '🔧'
      },
      {
        keys: ['F11'],
        description: 'Toggle fullscreen mode',
        category: 'Advanced',
        action: () => {
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
          } else {
            document.exitFullscreen();
          }
        },
        icon: '🖥️'
      },
      {
        keys: ['Ctrl', 'Shift', 'L'],
        description: 'Toggle live preview',
        category: 'Advanced',
        action: () => console.log('Toggle preview'),
        icon: '👁️'
      }
    ]
  };

  // Utility function to scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.querySelector(`[data-section="${sectionId}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Get all shortcuts as flat array
  const allShortcuts = Object.values(shortcuts).flat();

  // Key press handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;
      const isModifier = ['Control', 'Shift', 'Alt', 'Meta'].includes(key);
      
      // Add pressed keys to set
      setPressedKeys(prev => new Set([...prev, key]));

      // Clear timeout if exists
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set timeout to clear pressed keys
      timeoutRef.current = setTimeout(() => {
        setPressedKeys(new Set());
      }, 1000);

      // Find matching shortcut
      const pressedKeyArray = Array.from(pressedKeys).concat(key);
      const matchingShortcut = allShortcuts.find(shortcut => {
        if (shortcut.keys.length !== pressedKeyArray.length) return false;
        
        return shortcut.keys.every(shortcutKey => {
          if (shortcutKey === 'Ctrl') return e.ctrlKey;
          if (shortcutKey === 'Shift') return e.shiftKey;
          if (shortcutKey === 'Alt') return e.altKey;
          if (shortcutKey === 'Meta') return e.metaKey;
          return pressedKeyArray.includes(shortcutKey);
        });
      });

      if (matchingShortcut) {
        e.preventDefault();
        setActiveShortcut(matchingShortcut);
        matchingShortcut.action?.();
        
        // Add to history
        setShortcutHistory(prev => [
          { ...matchingShortcut, timestamp: Date.now() },
          ...prev.slice(0, 9) // Keep only last 10
        ]);

        // Clear active shortcut after animation
        setTimeout(() => setActiveShortcut(null), 1000);
      }
    };

    const handleKeyUp = (e) => {
      // Remove key from pressed keys
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(e.key);
        return newSet;
      });
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [pressedKeys, allShortcuts]);

  // Shortcut visualization component
  const ShortcutBadge = ({ keys, isActive = false, size = 'sm' }) => (
    <div className={`flex items-center space-x-1 ${size === 'lg' ? 'space-x-2' : ''}`}>
      {keys.map((key, index) => (
        <React.Fragment key={index}>
          <motion.kbd
            className={`px-2 py-1 rounded border font-mono font-semibold ${
              size === 'lg' ? 'px-3 py-2 text-base' : 'text-xs'
            } ${
              isActive 
                ? 'bg-blue-500 text-white border-blue-600 shadow-lg' 
                : 'bg-white text-gray-700 border-gray-300 shadow-sm'
            }`}
            animate={isActive ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            {key === 'Ctrl' ? '⌘' : 
             key === 'Shift' ? '⇧' : 
             key === 'Alt' ? '⌥' : 
             key === 'Meta' ? '⌘' :
             key === 'Enter' ? '↵' :
             key === 'Escape' ? 'Esc' :
             key === 'Tab' ? '⇥' :
             key === 'Home' ? '⇱' :
             key === 'End' ? '⇲' :
             key}
          </motion.kbd>
          {index < keys.length - 1 && (
            <span className={`text-gray-400 ${size === 'lg' ? 'text-lg' : 'text-xs'}`}>+</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  // Active shortcut indicator
  const ActiveShortcutIndicator = ({ shortcut }) => (
    <motion.div
      className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-6 py-3 rounded-full shadow-2xl z-50"
      initial={{ opacity: 0, y: -50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center space-x-3">
        <span className="text-xl">{shortcut.icon}</span>
        <div>
          <div className="flex items-center space-x-2">
            <ShortcutBadge keys={shortcut.keys} isActive={true} size="lg" />
          </div>
          <div className="text-sm mt-1 text-blue-100">
            {shortcut.description}
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Main shortcuts panel
  const ShortcutsPanel = () => (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setShortcutsVisible(false)}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">⌨️</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Keyboard Shortcuts
                </h2>
                <p className="text-gray-600">
                  Master these shortcuts to work faster and more efficiently
                </p>
              </div>
            </div>
            <button
              onClick={() => setShortcutsVisible(false)}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-6 mt-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>{allShortcuts.length} shortcuts available</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>{shortcutHistory.length} shortcuts used recently</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Shortcuts by category */}
            <div className="space-y-8">
              {Object.entries(shortcuts).map(([categoryKey, categoryShortcuts]) => (
                <motion.div
                  key={categoryKey}
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Object.keys(shortcuts).indexOf(categoryKey) * 0.1 }}
                >
                  <h3 className="text-lg font-bold text-gray-800 capitalize flex items-center">
                    <span className="mr-2">
                      {categoryKey === 'global' ? '🌐' :
                       categoryKey === 'navigation' ? '🧭' :
                       categoryKey === 'ai' ? '🤖' :
                       categoryKey === 'templates' ? '🎨' :
                       categoryKey === 'advanced' ? '⚡' : '📁'}
                    </span>
                    {categoryKey.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  
                  <div className="space-y-3">
                    {categoryShortcuts.map((shortcut, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-xl">{shortcut.icon}</span>
                          <span className="text-gray-800">{shortcut.description}</span>
                        </div>
                        <ShortcutBadge keys={shortcut.keys} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recent shortcuts & pressed keys */}
            <div className="space-y-8">
              {/* Currently pressed keys */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">🔴</span>
                  Currently Pressed
                </h3>
                <div className="min-h-16 p-4 bg-gray-50 rounded-lg flex items-center justify-center">
                  {pressedKeys.size > 0 ? (
                    <ShortcutBadge 
                      keys={Array.from(pressedKeys)} 
                      isActive={true} 
                      size="lg" 
                    />
                  ) : (
                    <span className="text-gray-500">No keys pressed</span>
                  )}
                </div>
              </div>

              {/* Recent shortcuts */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">📈</span>
                  Recent Usage
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {shortcutHistory.length > 0 ? (
                    shortcutHistory.map((shortcut, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="flex items-center space-x-2">
                          <span>{shortcut.icon}</span>
                          <span className="text-sm text-gray-700">
                            {shortcut.description}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <ShortcutBadge keys={shortcut.keys} />
                          <span className="text-xs text-gray-500">
                            {new Date(shortcut.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No shortcuts used yet
                    </p>
                  )}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                  <span className="mr-2">💡</span>
                  Pro Tips
                </h4>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li>• Press <kbd className="px-1 bg-white border rounded">?</kbd> anytime to show this panel</li>
                  <li>• Use <kbd className="px-1 bg-white border rounded">Tab</kbd> to navigate between fields quickly</li>
                  <li>• Hold <kbd className="px-1 bg-white border rounded">Ctrl</kbd> for most shortcuts</li>
                  <li>• Combine with AI shortcuts for maximum efficiency</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <>
      {/* Active shortcut indicator */}
      <AnimatePresence>
        {activeShortcut && <ActiveShortcutIndicator shortcut={activeShortcut} />}
      </AnimatePresence>

      {/* Shortcuts panel */}
      <AnimatePresence>
        {shortcutsVisible && <ShortcutsPanel />}
      </AnimatePresence>

      {/* Floating shortcut hint */}
      <motion.div
        className="fixed bottom-4 right-4 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm z-40"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        Press <kbd className="px-1 bg-gray-700 rounded">?</kbd> for shortcuts
      </motion.div>
    </>
  );
};

export default KeyboardShortcutsSystem;