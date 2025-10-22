import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ColorSwatch = ({ color, isSelected, onClick, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <motion.button
      onClick={() => onClick(color)}
      className={`${sizeClasses[size]} rounded-full border-4 transition-all ${
        isSelected ? 'border-blue-500 shadow-lg' : 'border-white shadow-md hover:border-gray-300'
      }`}
      style={{ backgroundColor: color }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {isSelected && (
        <motion.div
          className="w-full h-full rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <span className="text-white text-xs">✓</span>
        </motion.div>
      )}
    </motion.button>
  );
};

const AIColorSchemeGenerator = ({ onColorSchemeChange, currentScheme }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSchemes, setGeneratedSchemes] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState(currentScheme || 0);

  // AI-generated color schemes based on psychology and design principles
  const colorSchemes = [
    {
      name: 'Professional Blue',
      description: 'Trust, reliability, and corporate professionalism',
      colors: {
        primary: '#2563EB',
        secondary: '#3B82F6',
        accent: '#60A5FA',
        text: '#1F2937',
        background: '#F8FAFC',
        gradient: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)'
      },
      mood: 'professional',
      industries: ['Technology', 'Finance', 'Healthcare']
    },
    {
      name: 'Creative Purple',
      description: 'Innovation, creativity, and artistic expression',
      colors: {
        primary: '#7C3AED',
        secondary: '#8B5CF6',
        accent: '#A78BFA',
        text: '#581C87',
        background: '#FEFBFF',
        gradient: 'linear-gradient(135deg, #FAF5FF, #F3E8FF)'
      },
      mood: 'creative',
      industries: ['Design', 'Marketing', 'Entertainment']
    },
    {
      name: 'Executive Black',
      description: 'Authority, sophistication, and leadership',
      colors: {
        primary: '#111827',
        secondary: '#374151',
        accent: '#6B7280',
        text: '#F9FAFB',
        background: '#1F2937',
        gradient: 'linear-gradient(135deg, #111827, #374151)'
      },
      mood: 'executive',
      industries: ['Law', 'Consulting', 'Investment']
    },
    {
      name: 'Growth Green',
      description: 'Growth, sustainability, and fresh perspectives',
      colors: {
        primary: '#059669',
        secondary: '#10B981',
        accent: '#34D399',
        text: '#065F46',
        background: '#F0FDF4',
        gradient: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)'
      },
      mood: 'growth',
      industries: ['Environment', 'Startups', 'Education']
    },
    {
      name: 'Energy Orange',
      description: 'Enthusiasm, energy, and dynamic leadership',
      colors: {
        primary: '#EA580C',
        secondary: '#F97316',
        accent: '#FB923C',
        text: '#9A3412',
        background: '#FFFBEB',
        gradient: 'linear-gradient(135deg, #FEF3C7, #FDE68A)'
      },
      mood: 'energetic',
      industries: ['Sports', 'Sales', 'Hospitality']
    },
    {
      name: 'Elegant Rose',
      description: 'Sophistication, warmth, and personal touch',
      colors: {
        primary: '#BE185D',
        secondary: '#EC4899',
        accent: '#F472B6',
        text: '#831843',
        background: '#FDF2F8',
        gradient: 'linear-gradient(135deg, #FCE7F3, #FBCFE8)'
      },
      mood: 'elegant',
      industries: ['Fashion', 'Beauty', 'Events']
    }
  ];

  const generateAISchemes = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation with random color combinations
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const aiSchemes = [
      {
        name: 'AI Sunset',
        description: 'Warm, inspiring colors for creative professionals',
        colors: {
          primary: '#F59E0B',
          secondary: '#EF4444',
          accent: '#F97316',
          text: '#92400E',
          background: '#FFFBEB',
          gradient: 'linear-gradient(135deg, #FEF3C7, #FEE2E2)'
        },
        mood: 'warm',
        industries: ['Creative', 'Marketing', 'Consulting'],
        aiGenerated: true
      },
      {
        name: 'AI Ocean',
        description: 'Cool, calming tones for analytical roles',
        colors: {
          primary: '#0891B2',
          secondary: '#06B6D4',
          accent: '#67E8F9',
          text: '#164E63',
          background: '#F0F9FF',
          gradient: 'linear-gradient(135deg, #E0F7FA, #B2EBF2)'
        },
        mood: 'calm',
        industries: ['Data Science', 'Research', 'Academia'],
        aiGenerated: true
      },
      {
        name: 'AI Midnight',
        description: 'Bold, modern palette for tech leaders',
        colors: {
          primary: '#4C1D95',
          secondary: '#7C3AED',
          accent: '#C084FC',
          text: '#F3F4F6',
          background: '#1E1B4B',
          gradient: 'linear-gradient(135deg, #312E81, #4C1D95)'
        },
        mood: 'bold',
        industries: ['Technology', 'Gaming', 'Innovation'],
        aiGenerated: true
      }
    ];
    
    setGeneratedSchemes(aiSchemes);
    setIsGenerating(false);
  };

  const allSchemes = [...colorSchemes, ...generatedSchemes];

  const handleSchemeSelect = (index) => {
    setSelectedScheme(index);
    onColorSchemeChange(allSchemes[index]);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <motion.span 
            className="mr-3 text-2xl"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            🎨
          </motion.span>
          AI Color Palette Generator
        </h3>
        
        <motion.button
          onClick={generateAISchemes}
          disabled={isGenerating}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-700 transition-all disabled:opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isGenerating ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Generating...
            </div>
          ) : (
            '✨ Generate AI Colors'
          )}
        </motion.button>
      </div>

      {/* Color Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {allSchemes.map((scheme, index) => (
          <motion.div
            key={scheme.name}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selectedScheme === index 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleSchemeSelect(index)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Scheme Header */}
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-800 flex items-center">
                {scheme.aiGenerated && (
                  <motion.span 
                    className="mr-2 text-purple-500"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🤖
                  </motion.span>
                )}
                {scheme.name}
              </h4>
              {selectedScheme === index && (
                <motion.span 
                  className="text-blue-500"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  ✓
                </motion.span>
              )}
            </div>

            {/* Color Swatches */}
            <div className="flex space-x-2 mb-3">
              <ColorSwatch 
                color={scheme.colors.primary} 
                isSelected={false}
                onClick={() => {}}
                size="sm"
              />
              <ColorSwatch 
                color={scheme.colors.secondary} 
                isSelected={false}
                onClick={() => {}}
                size="sm"
              />
              <ColorSwatch 
                color={scheme.colors.accent} 
                isSelected={false}
                onClick={() => {}}
                size="sm"
              />
              <div 
                className="w-8 h-8 rounded-full border-2 border-gray-300"
                style={{ background: scheme.colors.gradient }}
              />
            </div>

            {/* Description */}
            <p className="text-xs text-gray-600 mb-2">
              {scheme.description}
            </p>

            {/* Industries */}
            <div className="flex flex-wrap gap-1">
              {scheme.industries.map((industry, i) => (
                <span 
                  key={i}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  {industry}
                </span>
              ))}
            </div>

            {/* Mood Indicator */}
            <div className="mt-2">
              <span className={`px-2 py-1 text-xs rounded-full ${
                scheme.mood === 'professional' ? 'bg-blue-100 text-blue-700' :
                scheme.mood === 'creative' ? 'bg-purple-100 text-purple-700' :
                scheme.mood === 'executive' ? 'bg-gray-100 text-gray-700' :
                scheme.mood === 'growth' ? 'bg-green-100 text-green-700' :
                scheme.mood === 'energetic' ? 'bg-orange-100 text-orange-700' :
                scheme.mood === 'elegant' ? 'bg-pink-100 text-pink-700' :
                'bg-indigo-100 text-indigo-700'
              }`}>
                {scheme.mood}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Generation Status */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 mb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center">
              <motion.div
                className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full mr-3"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <div>
                <div className="font-medium text-purple-700">
                  AI is analyzing color psychology and design trends...
                </div>
                <div className="text-sm text-purple-600">
                  Creating personalized color schemes for your industry
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Scheme Details */}
      {selectedScheme !== null && allSchemes[selectedScheme] && (
        <motion.div
          className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h5 className="font-semibold text-gray-800 mb-3">
            Selected: {allSchemes[selectedScheme].name}
          </h5>
          
          <div className="grid grid-cols-5 gap-3 mb-3">
            {Object.entries(allSchemes[selectedScheme].colors).map(([key, color]) => (
              <div key={key} className="text-center">
                <div 
                  className="w-12 h-12 rounded-lg border border-gray-300 mb-1 mx-auto"
                  style={{ backgroundColor: key === 'gradient' ? 'transparent' : color, background: key === 'gradient' ? color : undefined }}
                />
                <div className="text-xs text-gray-600 capitalize">{key}</div>
              </div>
            ))}
          </div>
          
          <p className="text-sm text-gray-600">
            Perfect for: {allSchemes[selectedScheme].industries.join(', ')}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export { ColorSwatch, AIColorSchemeGenerator };