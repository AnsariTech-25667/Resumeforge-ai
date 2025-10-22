import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GoogleFontsSelector = ({ onFontChange, currentFont }) => {
  const [loadedFonts, setLoadedFonts] = useState(new Set());
  const [previewText, setPreviewText] = useState('Maaz Ansari - Full Stack Developer');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Curated Google Fonts for professional resumes
  const fontCategories = {
    serif: [
      { name: 'Playfair Display', fallback: 'serif', weight: '400,700', style: 'elegant' },
      { name: 'Crimson Text', fallback: 'serif', weight: '400,600', style: 'classic' },
      { name: 'Lora', fallback: 'serif', weight: '400,500,700', style: 'readable' },
      { name: 'Merriweather', fallback: 'serif', weight: '300,400,700', style: 'friendly' },
      { name: 'Source Serif Pro', fallback: 'serif', weight: '400,600', style: 'modern' },
    ],
    sans: [
      { name: 'Inter', fallback: 'sans-serif', weight: '300,400,500,600,700', style: 'modern' },
      { name: 'Roboto', fallback: 'sans-serif', weight: '300,400,500,700', style: 'neutral' },
      { name: 'Open Sans', fallback: 'sans-serif', weight: '300,400,600,700', style: 'friendly' },
      { name: 'Poppins', fallback: 'sans-serif', weight: '300,400,500,600,700', style: 'rounded' },
      { name: 'Montserrat', fallback: 'sans-serif', weight: '300,400,500,600,700', style: 'geometric' },
      { name: 'Source Sans Pro', fallback: 'sans-serif', weight: '300,400,600,700', style: 'clean' },
    ],
    display: [
      { name: 'Oswald', fallback: 'sans-serif', weight: '300,400,500,600,700', style: 'bold' },
      { name: 'Raleway', fallback: 'sans-serif', weight: '300,400,500,600,700', style: 'elegant' },
      { name: 'Nunito', fallback: 'sans-serif', weight: '300,400,600,700,800', style: 'rounded' },
      { name: 'Work Sans', fallback: 'sans-serif', weight: '300,400,500,600,700', style: 'versatile' },
    ]
  };

  const getAllFonts = () => {
    const categories = selectedCategory === 'all' 
      ? Object.values(fontCategories).flat()
      : fontCategories[selectedCategory] || [];
    return categories;
  };

  const loadGoogleFont = async (font) => {
    if (loadedFonts.has(font.name)) return;

    try {
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?family=${font.name.replace(/ /g, '+')}:wght@${font.weight}&display=swap`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
      
      // Wait for font to load
      await document.fonts.load(`400 16px "${font.name}"`);
      
      setLoadedFonts(prev => new Set([...prev, font.name]));
    } catch (error) {
      console.log('Font loading error:', error);
    }
  };

  const handleFontSelect = (font) => {
    loadGoogleFont(font);
    onFontChange(font);
  };

  const fonts = getAllFonts();

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <motion.span 
            className="mr-3 text-2xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            📝
          </motion.span>
          Typography Selector
        </h3>

        <div className="text-sm text-gray-500">
          {fonts.length} Professional Fonts
        </div>
      </div>

      {/* Preview Text Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preview Text
        </label>
        <input
          type="text"
          value={previewText}
          onChange={(e) => setPreviewText(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          placeholder="Enter text to preview fonts..."
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'serif', 'sans', 'display'].map((category) => (
          <motion.button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === category
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Font Grid */}
      <div className="grid gap-4">
        <AnimatePresence mode="wait">
          {fonts.map((font, index) => (
            <motion.div
              key={font.name}
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                currentFont?.name === font.name
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
              onClick={() => handleFontSelect(font)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              layout
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <h4 className="font-semibold text-gray-800">{font.name}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    font.style === 'modern' ? 'bg-blue-100 text-blue-700' :
                    font.style === 'classic' ? 'bg-gray-100 text-gray-700' :
                    font.style === 'elegant' ? 'bg-purple-100 text-purple-700' :
                    font.style === 'friendly' ? 'bg-green-100 text-green-700' :
                    font.style === 'bold' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {font.style}
                  </span>
                </div>
                
                {currentFont?.name === font.name && (
                  <motion.span 
                    className="text-blue-500"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    ✓
                  </motion.span>
                )}
              </div>

              {/* Font Preview */}
              <div className="space-y-2">
                <motion.div
                  className="text-2xl text-gray-800"
                  style={{ 
                    fontFamily: loadedFonts.has(font.name) ? `"${font.name}", ${font.fallback}` : font.fallback,
                    fontWeight: 600
                  }}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: loadedFonts.has(font.name) ? 1 : 0.5 }}
                >
                  {previewText}
                </motion.div>
                
                <div
                  className="text-sm text-gray-600"
                  style={{ 
                    fontFamily: loadedFonts.has(font.name) ? `"${font.name}", ${font.fallback}` : font.fallback,
                    fontWeight: 400
                  }}
                >
                  Experience: Senior Full Stack Developer with 5+ years of experience building scalable web applications.
                </div>
              </div>

              {/* Font Weights Preview */}
              <div className="mt-3 flex flex-wrap gap-2">
                {font.weight.split(',').map((weight) => (
                  <span
                    key={weight}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                    style={{ 
                      fontFamily: loadedFonts.has(font.name) ? `"${font.name}", ${font.fallback}` : font.fallback,
                      fontWeight: weight
                    }}
                  >
                    {weight === '300' ? 'Light' :
                     weight === '400' ? 'Regular' :
                     weight === '500' ? 'Medium' :
                     weight === '600' ? 'SemiBold' :
                     weight === '700' ? 'Bold' :
                     weight === '800' ? 'ExtraBold' : weight}
                  </span>
                ))}
              </div>

              {/* Loading Indicator */}
              {!loadedFonts.has(font.name) && (
                <motion.div
                  className="mt-2 flex items-center text-xs text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full mr-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Loading font...
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Font Pairing Suggestions */}
      {currentFont && (
        <motion.div
          className="mt-8 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h5 className="font-semibold text-gray-800 mb-3">
            💡 Font Pairing Suggestions for {currentFont.name}
          </h5>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">Headers</div>
              <div 
                className="text-lg"
                style={{ fontFamily: `"${currentFont.name}", ${currentFont.fallback}`, fontWeight: 600 }}
              >
                Section Headers
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">Body Text</div>
              <div 
                className="text-sm"
                style={{ fontFamily: `"${currentFont.name}", ${currentFont.fallback}`, fontWeight: 400 }}
              >
                Professional experience and detailed descriptions
              </div>
            </div>
          </div>
          
          <div className="mt-3 text-xs text-gray-600">
            This font works well for: {
              currentFont.style === 'modern' ? 'Tech, startups, creative roles' :
              currentFont.style === 'classic' ? 'Law, finance, traditional industries' :
              currentFont.style === 'elegant' ? 'Luxury brands, fashion, hospitality' :
              currentFont.style === 'friendly' ? 'Education, healthcare, social impact' :
              'All professional contexts'
            }
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default GoogleFontsSelector;