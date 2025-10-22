import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Template3DCarousel from '../components/Template3DCarousel';
import AIColorSchemeGenerator from '../components/AIColorSchemeGenerator';
import GoogleFontsSelector from '../components/GoogleFontsSelector';
import LayoutVariantMorpher from '../components/LayoutVariantMorpher';

const Template3DShowcase = () => {
  const [activeTab, setActiveTab] = useState('templates');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedColorScheme, setSelectedColorScheme] = useState(null);
  const [selectedFont, setSelectedFont] = useState(null);
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [previewMode, setPreviewMode] = useState('live'); // live, fullscreen, comparison
  const [isCustomizing, setIsCustomizing] = useState(false);

  // Showcase statistics for motivation
  const [stats, setStats] = useState({
    templatesViewed: 0,
    customizationsMade: 0,
    timeSpent: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        timeSpent: prev.timeSpent + 1
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'templates', name: 'Templates', icon: '🎨', description: '3D Template Carousel' },
    { id: 'colors', name: 'Colors', icon: '🌈', description: 'AI Color Schemes' },
    { id: 'typography', name: 'Typography', icon: '📝', description: 'Google Fonts' },
    { id: 'layouts', name: 'Layouts', icon: '📐', description: 'Layout Variants' },
    { id: 'preview', name: 'Preview', icon: '👁️', description: 'Live Preview' }
  ];

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setStats(prev => ({ ...prev, templatesViewed: prev.templatesViewed + 1 }));
  };

  const handleColorSchemeSelect = (colorScheme) => {
    setSelectedColorScheme(colorScheme);
    setStats(prev => ({ ...prev, customizationsMade: prev.customizationsMade + 1 }));
  };

  const handleFontSelect = (font) => {
    setSelectedFont(font);
    setStats(prev => ({ ...prev, customizationsMade: prev.customizationsMade + 1 }));
  };

  const handleLayoutSelect = (layout) => {
    setSelectedLayout(layout);
    setStats(prev => ({ ...prev, customizationsMade: prev.customizationsMade + 1 }));
  };

  const generateCustomPreview = () => {
    return {
      template: selectedTemplate?.name || 'Modern Professional',
      colorScheme: selectedColorScheme?.name || 'Corporate Blue',
      font: selectedFont?.name || 'Inter',
      layout: selectedLayout?.name || 'Classic Professional',
      primaryColor: selectedColorScheme?.primary || '#3b82f6',
      accentColor: selectedColorScheme?.accent || '#1d4ed8',
      fontFamily: selectedFont?.name || 'Inter'
    };
  };

  const LivePreviewCard = ({ preview }) => (
    <motion.div
      className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200 max-w-2xl mx-auto"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{
        fontFamily: preview.fontFamily ? `"${preview.fontFamily}", sans-serif` : 'Inter, sans-serif'
      }}
    >
      {/* Header */}
      <div className="border-b pb-6 mb-6" style={{ borderColor: preview.primaryColor + '20' }}>
        <h1 
          className="text-3xl font-bold mb-2"
          style={{ color: preview.primaryColor }}
        >
          Maaz Ansari
        </h1>
        <h2 
          className="text-xl text-gray-600 mb-4"
          style={{ color: preview.accentColor }}
        >
          Full Stack Developer
        </h2>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <span>📧 maaz.ansari@email.com</span>
          <span>📱 +1 (555) 123-4567</span>
          <span>🌐 linkedin.com/in/maazansari</span>
        </div>
      </div>

      {/* Professional Summary */}
      <div className="mb-6">
        <h3 
          className="text-lg font-semibold mb-3 flex items-center"
          style={{ color: preview.primaryColor }}
        >
          <motion.span 
            className="mr-2"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            💼
          </motion.span>
          Professional Summary
        </h3>
        <p className="text-gray-700 leading-relaxed">
          Experienced Full Stack Developer with 5+ years of expertise in building scalable web applications. 
          Proven track record of delivering high-quality solutions using modern technologies like React, Node.js, and cloud platforms.
        </p>
      </div>

      {/* Experience Preview */}
      <div className="mb-6">
        <h3 
          className="text-lg font-semibold mb-3 flex items-center"
          style={{ color: preview.primaryColor }}
        >
          <motion.span 
            className="mr-2"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🚀
          </motion.span>
          Experience
        </h3>
        <div className="space-y-4">
          <div className="border-l-4 pl-4" style={{ borderColor: preview.accentColor }}>
            <h4 className="font-semibold text-gray-800">Senior Full Stack Developer</h4>
            <p className="text-sm" style={{ color: preview.accentColor }}>Tech Innovations Inc. • 2021 - Present</p>
            <p className="text-sm text-gray-600 mt-2">
              Led development of microservices architecture serving 100K+ users, implemented CI/CD pipelines reducing deployment time by 80%.
            </p>
          </div>
        </div>
      </div>

      {/* Skills Preview */}
      <div>
        <h3 
          className="text-lg font-semibold mb-3 flex items-center"
          style={{ color: preview.primaryColor }}
        >
          <motion.span 
            className="mr-2"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            ⚡
          </motion.span>
          Key Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {['React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'MongoDB'].map((skill, index) => (
            <motion.span
              key={skill}
              className="px-3 py-1 text-sm rounded-full text-white"
              style={{ backgroundColor: preview.accentColor }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Template Attribution */}
      <div className="mt-8 pt-4 border-t border-gray-200 text-center">
        <div className="text-xs text-gray-500 flex justify-center items-center space-x-4">
          <span>Template: {preview.template}</span>
          <span>•</span>
          <span>Colors: {preview.colorScheme}</span>
          <span>•</span>
          <span>Font: {preview.font}</span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              3D Template Showcase
            </motion.h1>
            
            <motion.p
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Experience the future of resume design with interactive 3D templates, 
              AI-powered customization, and real-time live preview
            </motion.p>

            {/* Stats */}
            <motion.div
              className="flex justify-center space-x-8 text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center space-x-2">
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  👁️
                </motion.span>
                <span>{stats.templatesViewed} templates viewed</span>
              </div>
              <div className="flex items-center space-x-2">
                <motion.span
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  ⚙️
                </motion.span>
                <span>{stats.customizationsMade} customizations made</span>
              </div>
              <div className="flex items-center space-x-2">
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ⏱️
                </motion.span>
                <span>{Math.floor(stats.timeSpent / 60)}:{(stats.timeSpent % 60).toString().padStart(2, '0')} exploring</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2 p-2 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg">{tab.icon}</span>
                <div className="text-left">
                  <div className="font-semibold">{tab.name}</div>
                  <div className="text-xs opacity-75">{tab.description}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'templates' && (
              <div className="space-y-8">
                <Template3DCarousel onTemplateSelect={handleTemplateSelect} />
                
                {selectedTemplate && (
                  <motion.div
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Selected: {selectedTemplate.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{selectedTemplate.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.features?.map((feature, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {activeTab === 'colors' && (
              <AIColorSchemeGenerator
                onColorSchemeSelect={handleColorSchemeSelect}
                currentColorScheme={selectedColorScheme}
              />
            )}

            {activeTab === 'typography' && (
              <GoogleFontsSelector
                onFontChange={handleFontSelect}
                currentFont={selectedFont}
              />
            )}

            {activeTab === 'layouts' && (
              <LayoutVariantMorpher
                onLayoutChange={handleLayoutSelect}
                currentLayout={selectedLayout}
              />
            )}

            {activeTab === 'preview' && (
              <div className="space-y-8">
                {/* Preview Controls */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Live Preview</h3>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Preview Mode:</span>
                        <select
                          value={previewMode}
                          onChange={(e) => setPreviewMode(e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="live">Live</option>
                          <option value="fullscreen">Fullscreen</option>
                          <option value="comparison">Comparison</option>
                        </select>
                      </div>
                      
                      <motion.button
                        onClick={() => setIsCustomizing(!isCustomizing)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isCustomizing ? 'Hide Options' : 'Customize'}
                      </motion.button>
                    </div>
                  </div>

                  {/* Customization Summary */}
                  <div className="grid md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500">Template</div>
                      <div className="font-semibold text-gray-800">
                        {selectedTemplate?.name || 'Default'}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500">Colors</div>
                      <div className="font-semibold text-gray-800">
                        {selectedColorScheme?.name || 'Default'}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500">Font</div>
                      <div className="font-semibold text-gray-800">
                        {selectedFont?.name || 'Inter'}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500">Layout</div>
                      <div className="font-semibold text-gray-800">
                        {selectedLayout?.name || 'Classic'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Preview */}
                <div className="relative">
                  <LivePreviewCard preview={generateCustomPreview()} />
                  
                  {/* Floating Action Buttons */}
                  <div className="absolute top-4 right-4 flex flex-col space-y-2">
                    <motion.button
                      className="p-3 bg-white rounded-full shadow-lg text-gray-600 hover:text-blue-600 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Download PDF"
                    >
                      📄
                    </motion.button>
                    <motion.button
                      className="p-3 bg-white rounded-full shadow-lg text-gray-600 hover:text-green-600 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Share"
                    >
                      🔗
                    </motion.button>
                    <motion.button
                      className="p-3 bg-white rounded-full shadow-lg text-gray-600 hover:text-purple-600 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Favorite"
                    >
                      ⭐
                    </motion.button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Progress Indicator */}
      <motion.div
        className="fixed bottom-6 right-6 bg-white rounded-full shadow-xl p-4 border border-gray-200"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center space-x-3">
          <motion.div
            className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <div className="text-sm">
            <div className="font-semibold text-gray-800">Showcase Active</div>
            <div className="text-gray-500">
              {Object.values({ selectedTemplate, selectedColorScheme, selectedFont, selectedLayout }).filter(Boolean).length}/4 customized
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Template3DShowcase;