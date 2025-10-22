import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Player } from '@lottiefiles/react-lottie-player';

const ContextualHelpSystem = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [helpMode, setHelpMode] = useState('tutorial'); // tutorial, hints, contextual
  const [currentSection, setCurrentSection] = useState('getting-started');
  const [userProgress, setUserProgress] = useState({
    completedSteps: [],
    currentTutorial: 'resume-basics',
    helpUsed: 0
  });

  // Interactive tutorial steps
  const tutorials = {
    'resume-basics': {
      title: 'Resume Building Basics',
      description: 'Learn the fundamentals of creating a professional resume',
      icon: '📝',
      color: '#3b82f6',
      steps: [
        {
          id: 'personal-info',
          title: 'Personal Information',
          description: 'Start with your contact details and professional summary',
          target: '[data-tutorial="personal-info"]',
          content: 'Your personal information is the first thing recruiters see. Include your full name, professional email, phone number, and LinkedIn profile.',
          tips: [
            'Use a professional email address',
            'Include your LinkedIn profile URL',
            'Add your location (city, state)',
            'Consider adding a professional website'
          ],
          animation: 'user-profile',
          estimatedTime: '2 min'
        },
        {
          id: 'work-experience',
          title: 'Work Experience',
          description: 'Add your professional experience with quantified achievements',
          target: '[data-tutorial="work-experience"]',
          content: 'Focus on achievements rather than job duties. Use action verbs and quantify your impact whenever possible.',
          tips: [
            'Start with action verbs (Led, Developed, Implemented)',
            'Include numbers and percentages',
            'Focus on achievements, not responsibilities',
            'Use reverse chronological order'
          ],
          animation: 'work-experience',
          estimatedTime: '5 min'
        },
        {
          id: 'skills-section',
          title: 'Skills & Technologies',
          description: 'Highlight your technical and soft skills',
          target: '[data-tutorial="skills"]',
          content: 'List relevant skills that match the job requirements. Group them by category for better readability.',
          tips: [
            'Include both technical and soft skills',
            'Match skills to job requirements',
            'Group by categories (Languages, Frameworks, Tools)',
            'Be honest about your proficiency levels'
          ],
          animation: 'skills',
          estimatedTime: '3 min'
        },
        {
          id: 'ai-enhancement',
          title: 'AI-Powered Enhancement',
          description: 'Use AI to improve your resume content',
          target: '[data-tutorial="ai-enhancement"]',
          content: 'Our AI can help improve your bullet points, suggest better wording, and optimize for ATS systems.',
          tips: [
            'Click the AI enhance button on any section',
            'Review AI suggestions before accepting',
            'Use industry-specific keywords',
            'Keep your authentic voice'
          ],
          animation: 'ai-enhancement',
          estimatedTime: '4 min'
        }
      ]
    },
    'advanced-features': {
      title: 'Advanced Features',
      description: 'Master the advanced tools and customizations',
      icon: '⚡',
      color: '#8b5cf6',
      steps: [
        {
          id: 'template-customization',
          title: 'Template Customization',
          description: 'Customize colors, fonts, and layouts',
          target: '[data-tutorial="templates"]',
          content: 'Choose from our professional templates and customize them to match your personal brand.',
          tips: [
            'Select industry-appropriate templates',
            'Customize colors to match your brand',
            'Choose readable fonts',
            'Maintain consistent spacing'
          ],
          animation: 'customization',
          estimatedTime: '3 min'
        },
        {
          id: 'ats-optimization',
          title: 'ATS Optimization',
          description: 'Ensure your resume passes ATS systems',
          target: '[data-tutorial="ats"]',
          content: 'Optimize your resume to pass through Applicant Tracking Systems used by most companies.',
          tips: [
            'Use standard section headings',
            'Include relevant keywords',
            'Avoid complex formatting',
            'Use a clean, simple layout'
          ],
          animation: 'ats-optimization',
          estimatedTime: '4 min'
        }
      ]
    }
  };

  // Contextual help content
  const contextualHelp = {
    'personal-info': {
      title: 'Personal Information Tips',
      icon: '👤',
      content: 'Make a great first impression with professional contact details',
      quickTips: [
        'Use a professional email format: firstname.lastname@email.com',
        'Include your LinkedIn profile URL',
        'Add your city and state (full address not needed)',
        'Consider adding a professional portfolio website'
      ]
    },
    'experience': {
      title: 'Experience Section Guide',
      icon: '💼',
      content: 'Showcase your professional achievements effectively',
      quickTips: [
        'Use action verbs to start each bullet point',
        'Quantify achievements with numbers and percentages',
        'Focus on results and impact, not just responsibilities',
        'Tailor experience to match job requirements'
      ]
    },
    'skills': {
      title: 'Skills Optimization',
      icon: '🛠️',
      content: 'Highlight skills that matter most to employers',
      quickTips: [
        'Include both hard and soft skills',
        'Match skills to job posting keywords',
        'Group skills by category (Technical, Languages, etc.)',
        'Be honest about proficiency levels'
      ]
    }
  };

  // Keyboard shortcuts
  const keyboardShortcuts = [
    { keys: ['?'], description: 'Show/hide help system', category: 'General' },
    { keys: ['Ctrl', 'S'], description: 'Save resume', category: 'General' },
    { keys: ['Ctrl', 'Z'], description: 'Undo last action', category: 'Editing' },
    { keys: ['Ctrl', 'Y'], description: 'Redo last action', category: 'Editing' },
    { keys: ['Tab'], description: 'Navigate between fields', category: 'Navigation' },
    { keys: ['Shift', 'Tab'], description: 'Navigate backwards', category: 'Navigation' },
    { keys: ['Enter'], description: 'Accept AI suggestion', category: 'AI Features' },
    { keys: ['Escape'], description: 'Close modals/dropdowns', category: 'Navigation' }
  ];

  // Help system visibility based on user behavior
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '?' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        setIsVisible(!isVisible);
      }
      if (e.key === 'Escape') {
        setIsVisible(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  // Track user progress
  const markStepComplete = (stepId) => {
    setUserProgress(prev => ({
      ...prev,
      completedSteps: [...new Set([...prev.completedSteps, stepId])],
      helpUsed: prev.helpUsed + 1
    }));
  };

  // Tutorial navigation
  const goToStep = (stepIndex) => {
    setActiveStep(stepIndex);
    const step = tutorials[userProgress.currentTutorial].steps[stepIndex];
    if (step.target) {
      const element = document.querySelector(step.target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Highlight the target element
        element.style.outline = '3px solid #3b82f6';
        element.style.outlineOffset = '4px';
        setTimeout(() => {
          element.style.outline = 'none';
        }, 3000);
      }
    }
  };

  const nextStep = () => {
    const currentTutorial = tutorials[userProgress.currentTutorial];
    if (activeStep < currentTutorial.steps.length - 1) {
      const currentStepId = currentTutorial.steps[activeStep].id;
      markStepComplete(currentStepId);
      setActiveStep(activeStep + 1);
      goToStep(activeStep + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
      goToStep(activeStep - 1);
    }
  };

  const HelpTooltip = ({ section }) => {
    const help = contextualHelp[section];
    if (!help) return null;

    return (
      <motion.div
        className="absolute z-50 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 p-6"
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="flex items-start space-x-3 mb-4">
          <span className="text-2xl">{help.icon}</span>
          <div>
            <h3 className="font-bold text-gray-800">{help.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{help.content}</p>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center">
            <span className="mr-2">💡</span>
            Quick Tips
          </h4>
          {help.quickTips.map((tip, index) => (
            <motion.div
              key={index}
              className="flex items-start space-x-2 text-sm text-gray-600"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <span className="text-blue-500 font-bold">•</span>
              <span>{tip}</span>
            </motion.div>
          ))}
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1"
        >
          ✕
        </button>
      </motion.div>
    );
  };

  const TutorialModal = () => {
    const currentTutorial = tutorials[userProgress.currentTutorial];
    const currentStep = currentTutorial.steps[activeStep];

    return (
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{currentTutorial.icon}</span>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {currentTutorial.title}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Step {activeStep + 1} of {currentTutorial.steps.length}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                ✕
              </button>
            </div>

            {/* Progress bar */}
            <div className="mt-4 bg-gray-200 rounded-full h-2">
              <motion.div
                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                initial={{ width: 0 }}
                animate={{ width: `${((activeStep + 1) / currentTutorial.steps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Current Step */}
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: currentTutorial.color }}
                >
                  {activeStep + 1}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {currentStep.title}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center">
                    <span className="mr-2">⏱️</span>
                    {currentStep.estimatedTime}
                  </p>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{currentStep.content}</p>

              {/* Tips */}
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                  <span className="mr-2">💡</span>
                  Pro Tips
                </h4>
                <ul className="space-y-2">
                  {currentStep.tips.map((tip, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start space-x-2 text-sm text-blue-700"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <span className="text-blue-500 font-bold mt-1">•</span>
                      <span>{tip}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Animation/Illustration */}
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-6xl mb-2">
                  {currentStep.animation === 'user-profile' ? '👤' :
                   currentStep.animation === 'work-experience' ? '💼' :
                   currentStep.animation === 'skills' ? '🛠️' :
                   currentStep.animation === 'ai-enhancement' ? '🤖' :
                   currentStep.animation === 'customization' ? '🎨' :
                   currentStep.animation === 'ats-optimization' ? '📊' : '✨'}
                </div>
                <p className="text-sm text-gray-600">Visual guide coming soon</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={prevStep}
                disabled={activeStep === 0}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Previous
              </button>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {userProgress.completedSteps.length} of {currentTutorial.steps.length} completed
                </span>
                <div className="flex space-x-1">
                  {currentTutorial.steps.map((_, index) => (
                    <motion.div
                      key={index}
                      className={`w-2 h-2 rounded-full cursor-pointer ${
                        index === activeStep ? 'bg-blue-500' :
                        userProgress.completedSteps.includes(currentTutorial.steps[index].id) ? 'bg-green-500' :
                        'bg-gray-300'
                      }`}
                      onClick={() => goToStep(index)}
                      whileHover={{ scale: 1.2 }}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={nextStep}
                disabled={activeStep === currentTutorial.steps.length - 1}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {activeStep === currentTutorial.steps.length - 1 ? 'Complete' : 'Next →'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const KeyboardShortcutsPanel = () => (
    <motion.div
      className="fixed bottom-4 right-4 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-80"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800 flex items-center">
          <span className="mr-2">⌨️</span>
          Keyboard Shortcuts
        </h3>
        <button
          onClick={() => setHelpMode('tutorial')}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {Object.entries(
          keyboardShortcuts.reduce((acc, shortcut) => {
            if (!acc[shortcut.category]) acc[shortcut.category] = [];
            acc[shortcut.category].push(shortcut);
            return acc;
          }, {})
        ).map(([category, shortcuts]) => (
          <div key={category} className="mb-3">
            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
              {category}
            </h4>
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex items-center justify-between py-1">
                <span className="text-sm text-gray-700">{shortcut.description}</span>
                <div className="flex items-center space-x-1">
                  {shortcut.keys.map((key, keyIndex) => (
                    <React.Fragment key={keyIndex}>
                      <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">
                        {key}
                      </kbd>
                      {keyIndex < shortcut.keys.length - 1 && <span className="text-xs text-gray-400">+</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <>
      {/* Help trigger button */}
      <motion.button
        className="fixed bottom-4 left-4 bg-blue-500 text-white p-3 rounded-full shadow-lg z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsVisible(true)}
        animate={{ 
          boxShadow: ['0 4px 20px rgba(59, 130, 246, 0.3)', '0 8px 30px rgba(59, 130, 246, 0.5)', '0 4px 20px rgba(59, 130, 246, 0.3)']
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-xl">❓</span>
      </motion.button>

      {/* Help system modals */}
      <AnimatePresence>
        {isVisible && helpMode === 'tutorial' && <TutorialModal />}
        {isVisible && helpMode === 'shortcuts' && <KeyboardShortcutsPanel />}
      </AnimatePresence>

      {/* Quick help tooltips */}
      <AnimatePresence>
        {currentSection && helpMode === 'contextual' && (
          <HelpTooltip section={currentSection} />
        )}
      </AnimatePresence>

      {/* Mode switcher */}
      {isVisible && (
        <motion.div
          className="fixed top-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex space-x-2 z-50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {['tutorial', 'shortcuts', 'contextual'].map((mode) => (
            <button
              key={mode}
              onClick={() => setHelpMode(mode)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                helpMode === mode
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </motion.div>
      )}
    </>
  );
};

export default ContextualHelpSystem;