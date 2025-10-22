import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

const InteractiveTemplateSelector = ({ onTemplateChange, currentTemplate }) => {
  const [hoveredTemplate, setHoveredTemplate] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const controls = useAnimation();

  const templates = {
    modern: {
      name: 'Modern',
      preview: {
        header: '#2563EB',
        accent: '#3B82F6',
        text: '#1F2937',
        bg: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)'
      },
      features: ['Clean lines', 'Blue accent', 'Professional'],
      icon: '🔵'
    },
    classic: {
      name: 'Classic',
      preview: {
        header: '#374151',
        accent: '#6B7280',
        text: '#111827',
        bg: 'linear-gradient(135deg, #F9FAFB, #F3F4F6)'
      },
      features: ['Timeless', 'Gray tones', 'Conservative'],
      icon: '⚫'
    },
    creative: {
      name: 'Creative',
      preview: {
        header: '#7C3AED',
        accent: '#A855F7',
        text: '#581C87',
        bg: 'linear-gradient(135deg, #FAF5FF, #F3E8FF)'
      },
      features: ['Vibrant', 'Purple theme', 'Artistic'],
      icon: '🟣'
    },
    minimal: {
      name: 'Minimal',
      preview: {
        header: '#059669',
        accent: '#10B981',
        text: '#065F46',
        bg: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)'
      },
      features: ['Simple', 'Green accent', 'Clean'],
      icon: '🟢'
    },
    executive: {
      name: 'Executive',
      preview: {
        header: '#DC2626',
        accent: '#EF4444',
        text: '#7F1D1D',
        bg: 'linear-gradient(135deg, #FEF2F2, #FEE2E2)'
      },
      features: ['Bold', 'Red theme', 'Leadership'],
      icon: '🔴'
    }
  };

  const handleTemplateSelect = async (templateKey) => {
    if (templateKey === currentTemplate || isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Trigger morphing animation
    await controls.start({
      scale: [1, 0.95, 1.05, 1],
      rotate: [0, -2, 2, 0],
      transition: {
        duration: 0.8,
        times: [0, 0.3, 0.7, 1],
        ease: "easeInOut"
      }
    });
    
    onTemplateChange(templateKey);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const MiniPreview = ({ template, templateKey, isSelected, isHovered }) => (
    <motion.div
      className="relative w-24 h-32 rounded-lg overflow-hidden cursor-pointer"
      style={{ background: template.preview.bg }}
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => handleTemplateSelect(templateKey)}
      onHoverStart={() => setHoveredTemplate(templateKey)}
      onHoverEnd={() => setHoveredTemplate(null)}
    >
      {/* Mini resume preview */}
      <div className="p-2 h-full flex flex-col">
        {/* Header */}
        <div 
          className="h-6 rounded mb-1"
          style={{ backgroundColor: template.preview.header }}
        />
        
        {/* Content lines */}
        <div className="flex-1 space-y-1">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i}
              className="h-1 rounded"
              style={{ 
                backgroundColor: template.preview.text,
                opacity: 0.3,
                width: i === 0 ? '100%' : i === 1 ? '80%' : i === 2 ? '90%' : '70%'
              }}
            />
          ))}
          
          <div 
            className="h-2 rounded mt-2"
            style={{ backgroundColor: template.preview.accent }}
          />
          
          {[...Array(3)].map((_, i) => (
            <div 
              key={i + 4}
              className="h-1 rounded"
              style={{ 
                backgroundColor: template.preview.text,
                opacity: 0.3,
                width: i === 0 ? '90%' : i === 1 ? '75%' : '85%'
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Selection indicator */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            className="absolute inset-0 border-3 border-blue-500 rounded-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          />
        )}
      </AnimatePresence>
      
      {/* Hover overlay */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-xl p-6"
      animate={controls}
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Choose Your Template</h3>
        <p className="text-gray-600">Select a design that matches your style</p>
      </div>
      
      {/* Template Grid */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {Object.entries(templates).map(([key, template]) => (
          <div key={key} className="flex flex-col items-center">
            <MiniPreview 
              template={template}
              templateKey={key}
              isSelected={currentTemplate === key}
              isHovered={hoveredTemplate === key}
            />
            <div className="mt-2 text-center">
              <div className="text-sm font-medium text-gray-800 flex items-center justify-center">
                <span className="mr-1">{template.icon}</span>
                {template.name}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Template Details */}
      <AnimatePresence mode="wait">
        {hoveredTemplate && (
          <motion.div
            key={hoveredTemplate}
            className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200"
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-800 flex items-center">
                  {templates[hoveredTemplate].icon}
                  <span className="ml-2">{templates[hoveredTemplate].name} Template</span>
                </h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {templates[hoveredTemplate].features.map((feature, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-white rounded-full text-xs text-gray-600 border"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              
              {hoveredTemplate !== currentTemplate && (
                <motion.button
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTemplateSelect(hoveredTemplate)}
                  disabled={isTransitioning}
                >
                  {isTransitioning ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Applying...
                    </div>
                  ) : (
                    'Apply Template'
                  )}
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Transition indicator */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 text-center shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-700 font-medium">Morphing to new template...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InteractiveTemplateSelector;