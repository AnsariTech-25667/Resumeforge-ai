import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

const LayoutVariantMorpher = ({ onLayoutChange, currentLayout }) => {
  const [hoveredLayout, setHoveredLayout] = useState(null);
  const [previewMode, setPreviewMode] = useState('static'); // static, morphing, interactive
  const morpherRef = useRef(null);

  // Layout configurations for professional resumes
  const layoutVariants = [
    {
      id: 'classic',
      name: 'Classic Professional',
      description: 'Traditional single-column layout with clear hierarchy',
      style: 'timeless',
      structure: {
        columns: 1,
        sections: ['header', 'summary', 'experience', 'education', 'skills'],
        headerStyle: 'centered',
        spacing: 'generous',
        alignment: 'left'
      },
      visualization: {
        color: '#1f2937',
        accent: '#3b82f6',
        pattern: 'solid'
      },
      suitableFor: ['Traditional industries', 'Senior positions', 'Conservative fields']
    },
    {
      id: 'modern-two-column',
      name: 'Modern Two-Column',
      description: 'Split layout with sidebar for skills and main content',
      style: 'contemporary',
      structure: {
        columns: 2,
        sections: ['header', 'sidebar', 'main-content'],
        headerStyle: 'full-width',
        spacing: 'compact',
        alignment: 'mixed'
      },
      visualization: {
        color: '#059669',
        accent: '#10b981',
        pattern: 'split'
      },
      suitableFor: ['Tech roles', 'Creative positions', 'Startups']
    },
    {
      id: 'executive',
      name: 'Executive Summary',
      description: 'Leadership-focused with prominent achievements section',
      style: 'authoritative',
      structure: {
        columns: 1,
        sections: ['header', 'executive-summary', 'achievements', 'experience', 'education'],
        headerStyle: 'minimal',
        spacing: 'tight',
        alignment: 'justified'
      },
      visualization: {
        color: '#7c2d12',
        accent: '#ea580c',
        pattern: 'hierarchical'
      },
      suitableFor: ['C-level positions', 'Management roles', 'Consulting']
    },
    {
      id: 'creative-grid',
      name: 'Creative Grid',
      description: 'Dynamic grid layout with visual elements and infographics',
      style: 'innovative',
      structure: {
        columns: 'flexible',
        sections: ['hero', 'skills-visual', 'projects', 'experience-timeline'],
        headerStyle: 'hero',
        spacing: 'dynamic',
        alignment: 'center'
      },
      visualization: {
        color: '#7c3aed',
        accent: '#a855f7',
        pattern: 'grid'
      },
      suitableFor: ['Design roles', 'Marketing', 'Creative industries']
    },
    {
      id: 'technical',
      name: 'Technical Focus',
      description: 'Code-friendly layout with project showcases and tech stack',
      style: 'systematic',
      structure: {
        columns: 2,
        sections: ['header', 'tech-stack', 'projects', 'experience', 'education'],
        headerStyle: 'compact',
        spacing: 'code-like',
        alignment: 'left'
      },
      visualization: {
        color: '#1e40af',
        accent: '#3b82f6',
        pattern: 'code'
      },
      suitableFor: ['Software engineering', 'DevOps', 'Data science']
    },
    {
      id: 'minimal',
      name: 'Minimal Clean',
      description: 'Ultra-clean design with maximum white space and typography focus',
      style: 'minimal',
      structure: {
        columns: 1,
        sections: ['name', 'contact', 'experience', 'education'],
        headerStyle: 'subtle',
        spacing: 'maximum',
        alignment: 'left'
      },
      visualization: {
        color: '#374151',
        accent: '#6b7280',
        pattern: 'minimal'
      },
      suitableFor: ['Design roles', 'Architecture', 'Premium brands']
    }
  ];

  const LayoutVisualization = ({ layout, isActive, isHovered, scale = 1 }) => {
    const patterns = {
      solid: (
        <div className="space-y-2">
          <div className={`h-3 bg-gray-300 rounded`} style={{ backgroundColor: layout.visualization.accent }} />
          <div className="h-2 bg-gray-200 rounded w-4/5" />
          <div className="h-2 bg-gray-200 rounded w-3/5" />
          <div className="h-2 bg-gray-200 rounded w-4/5" />
          <div className="h-2 bg-gray-200 rounded w-2/5" />
        </div>
      ),
      split: (
        <div className="flex space-x-2">
          <div className="w-1/3 space-y-1">
            <div className="h-2 bg-gray-300 rounded" />
            <div className="h-1 bg-gray-200 rounded" />
            <div className="h-1 bg-gray-200 rounded" />
            <div className="h-1 bg-gray-200 rounded" />
          </div>
          <div className="w-2/3 space-y-1">
            <div className={`h-2 rounded`} style={{ backgroundColor: layout.visualization.accent }} />
            <div className="h-1 bg-gray-200 rounded" />
            <div className="h-1 bg-gray-200 rounded w-4/5" />
            <div className="h-1 bg-gray-200 rounded w-3/5" />
          </div>
        </div>
      ),
      hierarchical: (
        <div className="space-y-1">
          <div className={`h-4 rounded`} style={{ backgroundColor: layout.visualization.accent }} />
          <div className="h-1 bg-gray-200 rounded w-3/4" />
          <div className="ml-2 space-y-1">
            <div className="h-1 bg-gray-300 rounded w-2/3" />
            <div className="h-1 bg-gray-200 rounded w-1/2" />
          </div>
          <div className="h-1 bg-gray-200 rounded w-4/5" />
        </div>
      ),
      grid: (
        <div className="grid grid-cols-2 gap-1">
          <div className={`h-3 rounded`} style={{ backgroundColor: layout.visualization.accent }} />
          <div className="h-3 bg-gray-200 rounded" />
          <div className="h-2 bg-gray-300 rounded" />
          <div className="h-2 bg-gray-200 rounded" />
          <div className="col-span-2 h-1 bg-gray-200 rounded" />
        </div>
      ),
      code: (
        <div className="space-y-1 font-mono">
          <div className="flex space-x-1">
            <div className="w-1 h-2 bg-green-400 rounded" />
            <div className="h-2 bg-gray-200 rounded flex-1" />
          </div>
          <div className="ml-2 space-y-1">
            <div className="h-1 bg-blue-300 rounded w-3/4" />
            <div className="h-1 bg-gray-300 rounded w-1/2" />
            <div className="h-1 bg-purple-300 rounded w-2/3" />
          </div>
        </div>
      ),
      minimal: (
        <div className="space-y-3">
          <div className="h-1 bg-gray-400 rounded w-1/3" />
          <div className="space-y-2">
            <div className="h-1 bg-gray-200 rounded w-full" />
            <div className="h-1 bg-gray-200 rounded w-4/5" />
          </div>
        </div>
      )
    };

    return (
      <motion.div
        className="w-full h-24 p-3 bg-white rounded-lg border-2 transition-all duration-300"
        style={{
          borderColor: isActive ? layout.visualization.accent : isHovered ? layout.visualization.color : '#e5e7eb',
          transform: `scale(${scale})`,
          boxShadow: isActive || isHovered ? '0 8px 25px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.1)'
        }}
        animate={{
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {patterns[layout.visualization.pattern]}
      </motion.div>
    );
  };

  const MorphingPreview = ({ fromLayout, toLayout }) => {
    const progress = useMotionValue(0);
    const opacity1 = useTransform(progress, [0, 0.5, 1], [1, 0, 0]);
    const opacity2 = useTransform(progress, [0, 0.5, 1], [0, 0, 1]);
    const scale = useTransform(progress, [0, 0.5, 1], [1, 0.8, 1]);

    React.useEffect(() => {
      const interval = setInterval(() => {
        progress.set(progress.get() === 1 ? 0 : 1);
      }, 3000);
      return () => clearInterval(interval);
    }, [progress]);

    return (
      <div className="relative w-48 h-32">
        <motion.div
          className="absolute inset-0"
          style={{ opacity: opacity1, scale }}
        >
          <LayoutVisualization layout={fromLayout} />
        </motion.div>
        <motion.div
          className="absolute inset-0"
          style={{ opacity: opacity2, scale }}
        >
          <LayoutVisualization layout={toLayout} />
        </motion.div>
      </div>
    );
  };

  const handleLayoutSelect = (layout) => {
    onLayoutChange(layout);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <motion.span 
            className="mr-3 text-2xl"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            🎨
          </motion.span>
          Layout Variants
        </h3>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{layoutVariants.length} Layouts</span>
          <motion.div
            className="w-3 h-3 bg-green-400 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </div>

      {/* Preview Mode Toggle */}
      <div className="mb-6">
        <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
          {['static', 'morphing', 'interactive'].map((mode) => (
            <motion.button
              key={mode}
              onClick={() => setPreviewMode(mode)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                previewMode === mode
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Morphing Demo */}
      {previewMode === 'morphing' && (
        <motion.div
          className="mb-8 p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            ✨ Layout Morphing Demo
          </h4>
          <div className="flex justify-center">
            <MorphingPreview 
              fromLayout={layoutVariants[0]}
              toLayout={layoutVariants[1]}
            />
          </div>
          <p className="text-center text-sm text-gray-600 mt-4">
            Watch layouts smoothly transform between different structures
          </p>
        </motion.div>
      )}

      {/* Layout Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {layoutVariants.map((layout, index) => (
          <motion.div
            key={layout.id}
            className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
              currentLayout?.id === layout.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
            }`}
            onClick={() => handleLayoutSelect(layout)}
            onHoverStart={() => setHoveredLayout(layout.id)}
            onHoverEnd={() => setHoveredLayout(null)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            layout
          >
            {/* Layout Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold text-gray-800">{layout.name}</h4>
                {currentLayout?.id === layout.id && (
                  <motion.span 
                    className="text-blue-500"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    ✓
                  </motion.span>
                )}
              </div>
              
              <span className={`px-2 py-1 text-xs rounded-full ${
                layout.style === 'timeless' ? 'bg-gray-100 text-gray-700' :
                layout.style === 'contemporary' ? 'bg-green-100 text-green-700' :
                layout.style === 'authoritative' ? 'bg-orange-100 text-orange-700' :
                layout.style === 'innovative' ? 'bg-purple-100 text-purple-700' :
                layout.style === 'systematic' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {layout.style}
              </span>
            </div>

            {/* Layout Visualization */}
            <div className="mb-4">
              <LayoutVisualization 
                layout={layout}
                isActive={currentLayout?.id === layout.id}
                isHovered={hoveredLayout === layout.id}
              />
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-3">{layout.description}</p>

            {/* Structure Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Columns:</span>
                <span className="font-medium">{layout.structure.columns}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Header:</span>
                <span className="font-medium">{layout.structure.headerStyle}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Spacing:</span>
                <span className="font-medium">{layout.structure.spacing}</span>
              </div>
            </div>

            {/* Suitable For */}
            <div className="border-t border-gray-200 pt-3">
              <div className="text-xs text-gray-500 mb-2">Best for:</div>
              <div className="flex flex-wrap gap-1">
                {layout.suitableFor.map((category, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            {/* Interactive Preview */}
            {previewMode === 'interactive' && hoveredLayout === layout.id && (
              <motion.div
                className="mt-4 p-3 bg-white rounded-lg border border-gray-200"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="text-xs font-medium text-gray-700 mb-2">
                  Section Preview:
                </div>
                <div className="space-y-1">
                  {layout.structure.sections.map((section, idx) => (
                    <motion.div
                      key={section}
                      className="text-xs text-gray-600 p-1 bg-gray-50 rounded flex items-center"
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-2" />
                      {section.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Layout Comparison */}
      {currentLayout && (
        <motion.div
          className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h5 className="font-semibold text-gray-800 mb-4 flex items-center">
            📊 Current Layout: {currentLayout.name}
          </h5>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Structure</div>
              <div className="text-sm text-gray-600">
                {currentLayout.structure.columns === 1 ? 'Single column' : 
                 currentLayout.structure.columns === 2 ? 'Two columns' : 
                 'Flexible grid'} layout with {currentLayout.structure.headerStyle} header
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Styling</div>
              <div className="text-sm text-gray-600">
                {currentLayout.structure.spacing.charAt(0).toUpperCase() + currentLayout.structure.spacing.slice(1)} spacing
                with {currentLayout.structure.alignment} alignment
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Optimization</div>
              <div className="text-sm text-gray-600">
                Optimized for {currentLayout.suitableFor[0].toLowerCase()} and similar roles
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex items-center text-xs text-gray-600">
            💡 This layout emphasizes {
              currentLayout.style === 'timeless' ? 'traditional professionalism and reliability' :
              currentLayout.style === 'contemporary' ? 'modern skills and innovation' :
              currentLayout.style === 'authoritative' ? 'leadership experience and achievements' :
              currentLayout.style === 'innovative' ? 'creativity and visual impact' :
              currentLayout.style === 'systematic' ? 'technical expertise and project details' :
              'clean design and essential information'
            }
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LayoutVariantMorpher;