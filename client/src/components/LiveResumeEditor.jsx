import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';

const LiveResumeEditor = () => {
  const [leftContent, setLeftContent] = useState('');
  const [rightContent, setRightContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const fileInputRef = useRef(null);

  // Simulate AI enhancement
  const enhanceContent = async (text) => {
    setIsGenerating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const enhanced = text
      .replace(/worked on/gi, 'spearheaded')
      .replace(/responsible for/gi, 'led cross-functional initiatives for')
      .replace(/managed/gi, 'orchestrated and optimized')
      .replace(/developed/gi, 'architected and delivered')
      .replace(/helped/gi, 'collaborated with stakeholders to achieve');
    
    setRightContent(enhanced);
    setIsGenerating(false);
  };

  // Real-time suggestions
  useEffect(() => {
    if (leftContent.length > 10) {
      const mockSuggestions = [
        'Add quantified metrics (e.g., "increased efficiency by 40%")',
        'Include specific technologies used',
        'Mention team size or project scope',
        'Add business impact or revenue generated'
      ];
      setSuggestions(mockSuggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [leftContent]);

  const templates = {
    modern: {
      name: 'Modern',
      bgColor: 'from-blue-50 to-indigo-100',
      textColor: 'text-gray-800',
      accentColor: 'border-blue-500'
    },
    classic: {
      name: 'Classic',
      bgColor: 'from-gray-50 to-slate-100',
      textColor: 'text-gray-900',
      accentColor: 'border-gray-600'
    },
    creative: {
      name: 'Creative',
      bgColor: 'from-purple-50 to-pink-100',
      textColor: 'text-purple-900',
      accentColor: 'border-purple-500'
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setLeftContent(e.target.result);
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <motion.div 
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1 
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Live Resume Editor
          </motion.h1>
          <motion.p 
            className="text-gray-600 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Watch your resume transform in real-time with AI-powered enhancements
          </motion.p>
        </div>

        {/* Template Switcher */}
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex bg-white rounded-full p-2 shadow-lg">
            {Object.entries(templates).map(([key, template]) => (
              <motion.button
                key={key}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedTemplate === key 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
                onClick={() => setSelectedTemplate(key)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {template.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Split Screen Editor */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Left Panel - Input */}
          <motion.div 
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4">
              <h2 className="text-white font-bold text-xl flex items-center">
                <span className="w-3 h-3 bg-white rounded-full mr-3"></span>
                Before (Original)
              </h2>
            </div>
            
            <div className="p-6">
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4 min-h-[300px] transition-colors hover:border-blue-400"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <textarea
                  className="w-full h-full resize-none outline-none text-gray-700 placeholder-gray-400"
                  placeholder="Paste your resume content here or drag & drop a text file..."
                  value={leftContent}
                  onChange={(e) => setLeftContent(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <motion.button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Upload File
                </motion.button>
                
                <motion.button
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all disabled:opacity-50"
                  onClick={() => enhanceContent(leftContent)}
                  disabled={!leftContent || isGenerating}
                  whileHover={!isGenerating ? { scale: 1.05 } : {}}
                  whileTap={!isGenerating ? { scale: 0.95 } : {}}
                >
                  {isGenerating ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Enhancing...
                    </div>
                  ) : (
                    '✨ Enhance with AI'
                  )}
                </motion.button>
              </div>
              
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".txt,.doc,.docx"
                onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
              />
            </div>
          </motion.div>

          {/* Right Panel - Enhanced Output */}
          <motion.div 
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4">
              <h2 className="text-white font-bold text-xl flex items-center">
                <span className="w-3 h-3 bg-white rounded-full mr-3"></span>
                After (AI Enhanced)
              </h2>
            </div>
            
            <div className="p-6">
              <motion.div 
                className={`bg-gradient-to-br ${templates[selectedTemplate].bgColor} rounded-lg p-6 min-h-[300px] border-l-4 ${templates[selectedTemplate].accentColor}`}
                key={selectedTemplate}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <AnimatePresence mode="wait">
                  {isGenerating ? (
                    <motion.div 
                      className="flex items-center justify-center h-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="text-center">
                        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">AI is enhancing your content...</p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      className={`${templates[selectedTemplate].textColor} whitespace-pre-wrap`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      {rightContent || (
                        <span className="text-gray-400 italic">
                          Enhanced content will appear here...
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              
              {rightContent && (
                <motion.div 
                  className="mt-4 flex gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.button
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    📄 Generate PDF
                  </motion.button>
                  
                  <motion.button
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    📋 Copy Text
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* AI Suggestions Panel */}
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-6"
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse"></span>
                AI Suggestions
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 cursor-pointer hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <div className="flex items-start">
                      <span className="text-emerald-500 mr-2">💡</span>
                      <p className="text-gray-700 text-sm">{suggestion}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default LiveResumeEditor;