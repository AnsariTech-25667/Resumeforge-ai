import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ParticleEffect = ({ isActive, color = '#60A5FA', count = 20 }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (isActive) {
      const newParticles = Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        delay: Math.random() * 2
      }));
      setParticles(newParticles);
    }
  }, [isActive, count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <AnimatePresence>
        {isActive && particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full opacity-70"
            style={{
              backgroundColor: color,
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50]
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              duration: 2,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

const AnimatedProgressBar = ({ 
  progress, 
  label, 
  color = 'blue', 
  showParticles = false,
  isProcessing = false 
}) => {
  const colorVariants = {
    blue: {
      bg: 'bg-blue-200',
      fill: 'bg-gradient-to-r from-blue-500 to-blue-600',
      particle: '#60A5FA',
      text: 'text-blue-600'
    },
    green: {
      bg: 'bg-emerald-200',
      fill: 'bg-gradient-to-r from-emerald-500 to-emerald-600', 
      particle: '#10B981',
      text: 'text-emerald-600'
    },
    purple: {
      bg: 'bg-purple-200',
      fill: 'bg-gradient-to-r from-purple-500 to-purple-600',
      particle: '#8B5CF6',
      text: 'text-purple-600'
    },
    orange: {
      bg: 'bg-orange-200',
      fill: 'bg-gradient-to-r from-orange-500 to-orange-600',
      particle: '#F97316',
      text: 'text-orange-600'
    }
  };

  const colors = colorVariants[color];

  return (
    <div className="relative mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className={`text-sm font-bold ${colors.text}`}>
          {Math.round(progress)}%
        </span>
      </div>
      
      <div className={`relative w-full h-3 ${colors.bg} rounded-full overflow-hidden`}>
        {showParticles && <ParticleEffect isActive={isProcessing} color={colors.particle} count={15} />}
        
        <motion.div
          className={`h-full ${colors.fill} rounded-full relative overflow-hidden`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 2,
              repeat: isProcessing ? Infinity : 0,
              ease: "linear"
            }}
          />
          
          {/* Progress pulse */}
          {isProcessing && (
            <motion.div
              className="absolute right-0 top-0 w-2 h-full bg-white opacity-60"
              animate={{
                opacity: [0.6, 1, 0.6]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

const AIProcessingProgress = ({ 
  currentStage = 'analyzing', 
  overallProgress = 0,
  stageProgress = {},
  isProcessing = true 
}) => {
  const [displayProgress, setDisplayProgress] = useState({});

  const stages = [
    { 
      id: 'analyzing', 
      label: 'Analyzing Content', 
      color: 'blue',
      icon: '🔍',
      description: 'Scanning resume structure and content'
    },
    { 
      id: 'enhancing', 
      label: 'AI Enhancement', 
      color: 'purple',
      icon: '🚀',
      description: 'Improving language and impact'
    },
    { 
      id: 'optimizing', 
      label: 'ATS Optimization', 
      color: 'green',
      icon: '⚡',
      description: 'Optimizing for applicant tracking systems'
    },
    { 
      id: 'scoring', 
      label: 'Quality Scoring', 
      color: 'orange',
      icon: '📊',
      description: 'Calculating resume effectiveness score'
    }
  ];

  // Simulate progress updates
  useEffect(() => {
    if (!isProcessing) return;

    const interval = setInterval(() => {
      setDisplayProgress(prev => {
        const newProgress = { ...prev };
        
        stages.forEach(stage => {
          const targetProgress = stageProgress[stage.id] || 0;
          const currentProgress = newProgress[stage.id] || 0;
          
          if (currentProgress < targetProgress) {
            newProgress[stage.id] = Math.min(targetProgress, currentProgress + Math.random() * 5 + 2);
          }
        });
        
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isProcessing, stageProgress]);

  const getCurrentStageIndex = () => {
    return stages.findIndex(stage => stage.id === currentStage);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center">
          <motion.span 
            className="mr-3 text-3xl"
            animate={{ 
              rotate: isProcessing ? [0, 360] : 0,
              scale: isProcessing ? [1, 1.1, 1] : 1
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            🤖
          </motion.span>
          AI Processing Status
        </h3>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            {Math.round(overallProgress)}%
          </div>
          <div className="text-sm text-gray-500">Complete</div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="mb-8">
        <AnimatedProgressBar
          progress={overallProgress}
          label="Overall Progress"
          color="blue"
          showParticles={true}
          isProcessing={isProcessing}
        />
      </div>

      {/* Stage Progress */}
      <div className="space-y-6">
        {stages.map((stage, index) => {
          const isCurrentStage = stage.id === currentStage;
          const isCompleted = index < getCurrentStageIndex();
          const stageProgressValue = displayProgress[stage.id] || 0;
          
          return (
            <motion.div
              key={stage.id}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                isCurrentStage 
                  ? 'border-blue-300 bg-blue-50' 
                  : isCompleted
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Stage Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <motion.span 
                    className="text-2xl mr-3"
                    animate={isCurrentStage ? {
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0]
                    } : {}}
                    transition={{ 
                      duration: 2,
                      repeat: isCurrentStage ? Infinity : 0,
                      ease: "easeInOut"
                    }}
                  >
                    {stage.icon}
                  </motion.span>
                  <div>
                    <h4 className="font-semibold text-gray-800">{stage.label}</h4>
                    <p className="text-sm text-gray-600">{stage.description}</p>
                  </div>
                </div>
                
                {/* Stage Status */}
                <div className="flex items-center">
                  {isCompleted ? (
                    <motion.div
                      className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <span className="text-white text-sm">✓</span>
                    </motion.div>
                  ) : isCurrentStage ? (
                    <motion.div
                      className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 rounded-full" />
                  )}
                </div>
              </div>

              {/* Stage Progress Bar */}
              <AnimatedProgressBar
                progress={stageProgressValue}
                label=""
                color={stage.color}
                showParticles={isCurrentStage}
                isProcessing={isCurrentStage && isProcessing}
              />

              {/* Processing Animation */}
              {isCurrentStage && isProcessing && (
                <motion.div
                  className="absolute -top-1 -left-1 -right-1 -bottom-1 border-2 border-blue-400 rounded-xl"
                  animate={{
                    boxShadow: [
                      '0 0 0 0 rgba(59, 130, 246, 0.4)',
                      '0 0 0 10px rgba(59, 130, 246, 0)',
                      '0 0 0 0 rgba(59, 130, 246, 0)'
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Processing Indicator */}
      {isProcessing && (
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full"
            animate={{
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <motion.div
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            Processing with AI...
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export { ParticleEffect, AnimatedProgressBar, AIProcessingProgress };