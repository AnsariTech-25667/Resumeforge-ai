import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SkillMatchingRing = ({ skill, matchPercentage, delay = 0, isActive = false }) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(matchPercentage);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [matchPercentage, delay]);

  const circumference = 2 * Math.PI * 35; // radius = 35
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;

  const getColorByPercentage = (percentage) => {
    if (percentage >= 90) return { stroke: '#10B981', text: 'text-emerald-600', bg: 'bg-emerald-100' };
    if (percentage >= 75) return { stroke: '#3B82F6', text: 'text-blue-600', bg: 'bg-blue-100' };
    if (percentage >= 60) return { stroke: '#F59E0B', text: 'text-amber-600', bg: 'bg-amber-100' };
    return { stroke: '#EF4444', text: 'text-red-600', bg: 'bg-red-100' };
  };

  const colors = getColorByPercentage(animatedPercentage);

  return (
    <motion.div
      className={`relative p-4 rounded-xl border-2 transition-all ${
        isActive ? 'border-blue-300 bg-blue-50 shadow-lg' : 'border-gray-200 bg-white'
      }`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30, 
        delay: delay / 1000 
      }}
      whileHover={{ scale: 1.05 }}
    >
      {/* Skill Ring */}
      <div className="relative w-24 h-24 mx-auto mb-3">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
          {/* Background circle */}
          <circle
            cx="40"
            cy="40"
            r="35"
            stroke="#E5E7EB"
            strokeWidth="6"
            fill="none"
          />
          
          {/* Progress circle */}
          <motion.circle
            cx="40"
            cy="40"
            r="35"
            stroke={colors.stroke}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: delay / 1000 }}
          />
          
          {/* Glow effect */}
          {isActive && (
            <motion.circle
              cx="40"
              cy="40"
              r="35"
              stroke={colors.stroke}
              strokeWidth="2"
              fill="none"
              opacity="0.3"
              animate={{
                r: [35, 40, 35],
                opacity: [0.3, 0.1, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </svg>
        
        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className={`text-lg font-bold ${colors.text}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: (delay + 500) / 1000, type: "spring" }}
          >
            {Math.round(animatedPercentage)}%
          </motion.span>
        </div>
      </div>

      {/* Skill name */}
      <div className="text-center">
        <h4 className="font-semibold text-gray-800 text-sm mb-1">{skill}</h4>
        <motion.div
          className={`text-xs px-2 py-1 rounded-full ${colors.bg} ${colors.text}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: (delay + 1000) / 1000 }}
        >
          {animatedPercentage >= 90 ? 'Expert Match' :
           animatedPercentage >= 75 ? 'Strong Match' :
           animatedPercentage >= 60 ? 'Good Match' : 'Needs Improvement'}
        </motion.div>
      </div>

      {/* Active indicator */}
      {isActive && (
        <motion.div
          className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.div>
  );
};

const InteractiveSkillMatching = ({ 
  skills = [], 
  jobRequirements = [], 
  isAnalyzing = false,
  onSkillClick 
}) => {
  const [activeSkill, setActiveSkill] = useState(null);
  const [matchingResults, setMatchingResults] = useState({});
  const [analysisStage, setAnalysisStage] = useState('idle');

  // Sample skills data
  const defaultSkills = [
    { name: 'React', match: 95, category: 'Frontend' },
    { name: 'Node.js', match: 88, category: 'Backend' },
    { name: 'Python', match: 82, category: 'Programming' },
    { name: 'AWS', match: 76, category: 'Cloud' },
    { name: 'MongoDB', match: 91, category: 'Database' },
    { name: 'TypeScript', match: 89, category: 'Programming' },
    { name: 'Docker', match: 73, category: 'DevOps' },
    { name: 'GraphQL', match: 67, category: 'API' },
    { name: 'Redis', match: 85, category: 'Database' },
    { name: 'Kubernetes', match: 71, category: 'DevOps' }
  ];

  const skillsData = skills.length > 0 ? skills : defaultSkills;

  // Simulate skill analysis
  useEffect(() => {
    if (isAnalyzing) {
      setAnalysisStage('scanning');
      
      setTimeout(() => {
        setAnalysisStage('matching');
      }, 1000);
      
      setTimeout(() => {
        setAnalysisStage('scoring');
      }, 2000);
      
      setTimeout(() => {
        setAnalysisStage('complete');
      }, 3000);
    } else {
      setAnalysisStage('idle');
    }
  }, [isAnalyzing]);

  const overallMatch = skillsData.reduce((acc, skill) => acc + skill.match, 0) / skillsData.length;

  const getSkillsByCategory = () => {
    const categories = {};
    skillsData.forEach(skill => {
      if (!categories[skill.category]) {
        categories[skill.category] = [];
      }
      categories[skill.category].push(skill);
    });
    return categories;
  };

  const categorizedSkills = getSkillsByCategory();

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center">
          <motion.span 
            className="mr-3 text-3xl"
            animate={isAnalyzing ? {
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            } : {}}
            transition={{
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            🎯
          </motion.span>
          Skill Matching Analysis
        </h3>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            {Math.round(overallMatch)}%
          </div>
          <div className="text-sm text-gray-500">Overall Match</div>
        </div>
      </div>

      {/* Analysis Status */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center">
              <motion.div
                className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mr-3"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span className="font-medium text-blue-700">
                {analysisStage === 'scanning' && 'Scanning your skills...'}
                {analysisStage === 'matching' && 'Matching against job requirements...'}
                {analysisStage === 'scoring' && 'Calculating match scores...'}
                {analysisStage === 'complete' && 'Analysis complete!'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skills Grid by Category */}
      <div className="space-y-8">
        {Object.entries(categorizedSkills).map(([category, categorySkills], categoryIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
          >
            <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
              {category} Skills
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categorySkills.map((skill, index) => (
                <SkillMatchingRing
                  key={skill.name}
                  skill={skill.name}
                  matchPercentage={skill.match}
                  delay={index * 200 + categoryIndex * 100}
                  isActive={activeSkill === skill.name}
                  onClick={() => {
                    setActiveSkill(skill.name);
                    onSkillClick && onSkillClick(skill);
                  }}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Active Skill Details */}
      <AnimatePresence>
        {activeSkill && (
          <motion.div
            className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-xl font-bold text-blue-800 mb-2">
                  {activeSkill} Analysis
                </h5>
                <p className="text-blue-600">
                  This skill shows strong alignment with current market demands.
                  Consider highlighting specific projects and achievements.
                </p>
              </div>
              
              <button
                onClick={() => setActiveSkill(null)}
                className="text-gray-400 hover:text-gray-600 text-xl p-2"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
            <span className="text-gray-600">90-100% Expert Match</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-gray-600">75-89% Strong Match</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
            <span className="text-gray-600">60-74% Good Match</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Below 60% Needs Improvement</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export { SkillMatchingRing, InteractiveSkillMatching };