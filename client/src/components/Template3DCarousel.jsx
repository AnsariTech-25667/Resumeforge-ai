import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

const Template3DCard = ({ template, index, isActive, onSelect, style = {} }) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-300, 300], [15, -15]);
  const rotateY = useTransform(mouseX, [-300, 300], [-15, 15]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative cursor-pointer ${isActive ? 'z-20' : 'z-10'}`}
      style={{
        ...style,
        perspective: '1000px',
      }}
      initial={{ opacity: 0, scale: 0.8, z: -100 }}
      animate={{ 
        opacity: 1, 
        scale: isActive ? 1.1 : 1, 
        z: isActive ? 50 : 0,
        x: isActive ? 0 : (index - 2) * 20,
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        duration: 0.6 
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(template)}
      whileHover={{ scale: isActive ? 1.15 : 1.05 }}
    >
      <motion.div
        className="w-80 h-96 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          transformStyle: 'preserve-3d',
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        {/* Template Preview */}
        <div 
          className="h-full p-6 relative overflow-hidden"
          style={{ 
            background: template.gradient,
            color: template.textColor 
          }}
        >
          {/* Header Section */}
          <div className="mb-6">
            <div 
              className="w-full h-12 rounded-lg mb-3"
              style={{ backgroundColor: template.primaryColor }}
            />
            <div className="space-y-2">
              <div 
                className="h-3 rounded"
                style={{ 
                  backgroundColor: template.textColor, 
                  opacity: 0.7,
                  width: '80%' 
                }}
              />
              <div 
                className="h-2 rounded"
                style={{ 
                  backgroundColor: template.textColor, 
                  opacity: 0.5,
                  width: '60%' 
                }}
              />
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div 
                  className="h-3 rounded"
                  style={{ 
                    backgroundColor: template.accentColor,
                    width: '50%' 
                  }}
                />
                <div className="space-y-1">
                  {[...Array(2)].map((_, j) => (
                    <div 
                      key={j}
                      className="h-2 rounded"
                      style={{ 
                        backgroundColor: template.textColor, 
                        opacity: 0.4,
                        width: j === 0 ? '90%' : '75%' 
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Template Name Badge */}
          <motion.div
            className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            {template.name}
          </motion.div>

          {/* Active Indicator */}
          {isActive && (
            <motion.div
              className="absolute inset-0 border-4 border-blue-400 rounded-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 400 }}
            />
          )}

          {/* Hover Glow Effect */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* 3D Shadow */}
      <motion.div
        className="absolute inset-0 bg-black/20 rounded-2xl blur-xl"
        style={{
          z: -1,
          scale: 0.9,
          y: 20,
        }}
        animate={{
          opacity: isHovered ? 0.3 : 0.1,
          y: isHovered ? 30 : 20,
        }}
      />
    </motion.div>
  );
};

const Template3DCarousel = ({ templates, activeTemplate, onTemplateSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    if (!autoRotate) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % templates.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [autoRotate, templates.length]);

  const getVisibleTemplates = () => {
    const visible = [];
    for (let i = -2; i <= 2; i++) {
      const index = (currentIndex + i + templates.length) % templates.length;
      visible.push({
        template: templates[index],
        index: i + 2,
        isActive: i === 0,
      });
    }
    return visible;
  };

  const handlePrevious = () => {
    setAutoRotate(false);
    setCurrentIndex(prev => (prev - 1 + templates.length) % templates.length);
  };

  const handleNext = () => {
    setAutoRotate(false);
    setCurrentIndex(prev => (prev + 1) % templates.length);
  };

  const visibleTemplates = getVisibleTemplates();

  return (
    <div className="relative w-full h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 opacity-10 rounded-2xl" />
      
      {/* Carousel Container */}
      <div className="relative flex items-center justify-center space-x-8" style={{ perspective: '1200px' }}>
        {visibleTemplates.map(({ template, index, isActive }, i) => (
          <Template3DCard
            key={template.id}
            template={template}
            index={index}
            isActive={isActive}
            onSelect={onTemplateSelect}
            style={{
              transform: `translateX(${(index - 2) * 100}px) translateZ(${isActive ? 50 : -Math.abs(index - 2) * 50}px)`,
              opacity: Math.max(0.3, 1 - Math.abs(index - 2) * 0.3),
            }}
          />
        ))}
      </div>

      {/* Navigation Controls */}
      <motion.button
        onClick={handlePrevious}
        className="absolute left-4 p-4 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>

      <motion.button
        onClick={handleNext}
        className="absolute right-4 p-4 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </motion.button>

      {/* Indicators */}
      <div className="absolute bottom-4 flex space-x-2">
        {templates.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setAutoRotate(false);
            }}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex ? 'bg-white' : 'bg-white/40'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
          />
        ))}
      </div>

      {/* Auto-rotate Toggle */}
      <motion.button
        onClick={() => setAutoRotate(!autoRotate)}
        className="absolute top-4 right-4 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white text-xs hover:bg-white/20 transition-all"
        whileHover={{ scale: 1.05 }}
      >
        {autoRotate ? '⏸️ Pause' : '▶️ Auto'}
      </motion.button>
    </div>
  );
};

export { Template3DCard, Template3DCarousel };