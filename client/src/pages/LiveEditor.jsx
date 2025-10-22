import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LiveResumeEditor from '../components/LiveResumeEditor';
import InteractiveTemplateSelector from '../components/InteractiveTemplateSelector';
import LivePreviewGenerator from '../components/LivePreviewGenerator';
import { SmartDragDrop } from '../components/SmartDragDrop';
import { RealTimeAISuggestions } from '../components/RealTimeAISuggestions';

const LiveEditor = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [resumeData, setResumeData] = useState({
    originalContent: '',
    enhancedContent: '',
    selectedTemplate: 'modern',
    sections: [
      { key: 'summary', title: 'Professional Summary', content: '' },
      { key: 'experience', title: 'Work Experience', content: '' },
      { key: 'education', title: 'Education', content: '' },
      { key: 'skills', title: 'Skills', content: '' },
      { key: 'projects', title: 'Projects', content: '' }
    ]
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const steps = [
    { id: 0, title: 'Import & Edit', icon: '📝', description: 'Upload your resume or start from scratch' },
    { id: 1, title: 'AI Enhancement', icon: '🤖', description: 'Let AI improve your content' },
    { id: 2, title: 'Template Selection', icon: '🎨', description: 'Choose your perfect design' },
    { id: 3, title: 'Live Preview', icon: '👁️', description: 'See your final result' }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setResumeData(prev => ({
        ...prev,
        originalContent: e.target.result
      }));
    };
    reader.readAsText(file);
  };

  const handleTextDrop = (text) => {
    setResumeData(prev => ({
      ...prev,
      originalContent: text
    }));
  };

  const handleSectionChange = (sectionKey, content) => {
    setResumeData(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.key === sectionKey 
          ? { ...section, content }
          : section
      )
    }));
  };

  const handleTemplateChange = (template) => {
    setResumeData(prev => ({
      ...prev,
      selectedTemplate: template
    }));
  };

  const StepIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="flex items-center bg-white rounded-full p-2 shadow-lg">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <motion.div
              className={`flex items-center px-4 py-2 rounded-full cursor-pointer transition-all ${
                currentStep === index 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                  : currentStep > index
                  ? 'bg-green-100 text-green-600'
                  : 'text-gray-500 hover:text-blue-600'
              }`}
              onClick={() => setCurrentStep(index)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-xl mr-2">{step.icon}</span>
              <div className="hidden sm:block">
                <div className="font-medium text-sm">{step.title}</div>
              </div>
            </motion.div>
            {index < steps.length - 1 && (
              <div className={`w-8 h-0.5 mx-2 transition-all ${
                currentStep > index ? 'bg-green-400' : 'bg-gray-300'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const WelcomeScreen = () => (
    <AnimatePresence>
      {showWelcome && (
        <motion.div
          className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="text-center text-white"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="text-8xl mb-6"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                ease: "easeInOut"
              }}
            >
              ⚡
            </motion.div>
            
            <motion.h1
              className="text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Live Resume Editor
            </motion.h1>
            
            <motion.p
              className="text-2xl opacity-80 mb-8"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Watch your resume transform in real-time
            </motion.p>
            
            <motion.div
              className="flex justify-center space-x-8 text-lg"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center space-x-2">
                <span>🤖</span>
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>⚡</span>
                <span>Real-time</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🎨</span>
                <span>Beautiful</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            key="step0"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="grid lg:grid-cols-2 gap-8"
          >
            <SmartDragDrop
              onFileUpload={handleFileUpload}
              onTextDrop={handleTextDrop}
              sections={resumeData.sections}
              onSectionChange={handleSectionChange}
            />
            <RealTimeAISuggestions
              content={resumeData.originalContent}
              onContentUpdate={(content) => setResumeData(prev => ({ ...prev, originalContent: content }))}
            />
          </motion.div>
        );
      
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <LiveResumeEditor />
          </motion.div>
        );
      
      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <InteractiveTemplateSelector
              currentTemplate={resumeData.selectedTemplate}
              onTemplateChange={handleTemplateChange}
            />
          </motion.div>
        );
      
      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <LivePreviewGenerator
              content={resumeData.enhancedContent || resumeData.originalContent}
              template={resumeData.selectedTemplate}
              isGenerating={isProcessing}
            />
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      <WelcomeScreen />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: showWelcome ? 3.2 : 0 }}
          >
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Live Resume Editor
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of resume building with real-time AI enhancements, 
              interactive templates, and instant preview generation
            </p>
          </motion.div>

          {/* Step Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: showWelcome ? 3.4 : 0.2 }}
          >
            <StepIndicator />
          </motion.div>

          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: showWelcome ? 3.6 : 0.4 }}
          >
            <AnimatePresence mode="wait">
              {renderCurrentStep()}
            </AnimatePresence>
          </motion.div>

          {/* Navigation */}
          <motion.div
            className="flex justify-between items-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: showWelcome ? 3.8 : 0.6 }}
          >
            <motion.button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={currentStep > 0 ? { scale: 1.05 } : {}}
              whileTap={currentStep > 0 ? { scale: 0.95 } : {}}
            >
              ← Previous
            </motion.button>

            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentStep 
                      ? 'bg-blue-500 scale-125' 
                      : index < currentStep
                      ? 'bg-green-400'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <motion.button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              disabled={currentStep === steps.length - 1}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={currentStep < steps.length - 1 ? { scale: 1.05 } : {}}
              whileTap={currentStep < steps.length - 1 ? { scale: 0.95 } : {}}
            >
              {currentStep === steps.length - 1 ? 'Complete' : 'Next →'}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LiveEditor;