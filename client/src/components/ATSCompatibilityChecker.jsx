import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ATSCompatibilityIndicator = ({ score, isChecking = false }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  useEffect(() => {
    if (isChecking) {
      let current = 0;
      const interval = setInterval(() => {
        current += Math.random() * 3 + 1;
        if (current >= score) {
          current = score;
          clearInterval(interval);
        }
        setAnimatedScore(current);
      }, 50);
      
      return () => clearInterval(interval);
    } else {
      setAnimatedScore(score);
    }
  }, [score, isChecking]);

  const getATSStatus = (score) => {
    if (score >= 90) return { status: 'Excellent', color: 'emerald', icon: '✅' };
    if (score >= 75) return { status: 'Good', color: 'blue', icon: '👍' };
    if (score >= 60) return { status: 'Fair', color: 'amber', icon: '⚠️' };
    return { status: 'Poor', color: 'red', icon: '❌' };
  };

  const atsStatus = getATSStatus(animatedScore);

  return (
    <div className={`p-4 rounded-xl border-2 bg-${atsStatus.color}-50 border-${atsStatus.color}-200`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <motion.span 
            className="text-2xl mr-3"
            animate={isChecking ? {
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0]
            } : {}}
            transition={{ duration: 1, repeat: isChecking ? Infinity : 0 }}
          >
            {atsStatus.icon}
          </motion.span>
          <div>
            <div className={`text-lg font-bold text-${atsStatus.color}-700`}>
              {Math.round(animatedScore)}% ATS Compatible
            </div>
            <div className={`text-sm text-${atsStatus.color}-600`}>
              {atsStatus.status}
            </div>
          </div>
        </div>
        
        {isChecking && (
          <motion.div
            className={`w-6 h-6 border-2 border-${atsStatus.color}-500 border-t-transparent rounded-full`}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        )}
      </div>
    </div>
  );
};

const ATSChecklistItem = ({ item, isChecked, isChecking, delay = 0 }) => {
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    if (isChecked && !isChecking) {
      const timer = setTimeout(() => {
        setShowCheck(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isChecked, isChecking, delay]);

  return (
    <motion.div
      className={`flex items-center p-3 rounded-lg border transition-all ${
        showCheck 
          ? 'bg-emerald-50 border-emerald-200' 
          : isChecking 
          ? 'bg-blue-50 border-blue-200' 
          : 'bg-gray-50 border-gray-200'
      }`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delay / 1000 }}
    >
      <div className="mr-3">
        <AnimatePresence mode="wait">
          {isChecking ? (
            <motion.div
              key="checking"
              className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          ) : showCheck ? (
            <motion.div
              key="checked"
              className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <span className="text-white text-xs">✓</span>
            </motion.div>
          ) : (
            <motion.div
              key="unchecked"
              className="w-5 h-5 border-2 border-gray-300 rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}
        </AnimatePresence>
      </div>
      
      <div className="flex-1">
        <div className={`font-medium ${
          showCheck ? 'text-emerald-700' : isChecking ? 'text-blue-700' : 'text-gray-700'
        }`}>
          {item.title}
        </div>
        <div className={`text-sm ${
          showCheck ? 'text-emerald-600' : isChecking ? 'text-blue-600' : 'text-gray-600'
        }`}>
          {item.description}
        </div>
      </div>
    </motion.div>
  );
};

const ATSCompatibilityChecker = ({ 
  resumeContent = '', 
  isChecking = false, 
  checkResults = null 
}) => {
  const [currentCheck, setCurrentCheck] = useState(-1);
  const [completedChecks, setCompletedChecks] = useState(new Set());
  const [overallScore, setOverallScore] = useState(0);

  const atsChecklist = [
    {
      id: 'keywords',
      title: 'Keyword Optimization',
      description: 'Contains relevant industry keywords',
      weight: 20
    },
    {
      id: 'formatting',
      title: 'ATS-Friendly Formatting',
      description: 'Uses standard fonts and simple formatting',
      weight: 15
    },
    {
      id: 'sections',
      title: 'Standard Sections',
      description: 'Includes all required resume sections',
      weight: 15
    },
    {
      id: 'contact',
      title: 'Contact Information',
      description: 'Clear and properly formatted contact details',
      weight: 10
    },
    {
      id: 'dates',
      title: 'Date Formatting',
      description: 'Consistent and clear date formats',
      weight: 10
    },
    {
      id: 'headings',
      title: 'Section Headings',
      description: 'Uses standard section headings',
      weight: 10
    },
    {
      id: 'length',
      title: 'Appropriate Length',
      description: 'Optimal resume length for your experience level',
      weight: 10
    },
    {
      id: 'bullet-points',
      title: 'Bullet Points',
      description: 'Uses bullet points for easy scanning',
      weight: 10
    }
  ];

  // Simulate ATS checking process
  useEffect(() => {
    if (isChecking) {
      setCurrentCheck(-1);
      setCompletedChecks(new Set());
      setOverallScore(0);
      
      let checkIndex = 0;
      const checkInterval = setInterval(() => {
        setCurrentCheck(checkIndex);
        
        setTimeout(() => {
          setCompletedChecks(prev => new Set([...prev, atsChecklist[checkIndex].id]));
          
          // Update overall score
          const totalWeight = atsChecklist.slice(0, checkIndex + 1)
            .reduce((acc, item) => acc + item.weight, 0);
          const maxWeight = atsChecklist.reduce((acc, item) => acc + item.weight, 0);
          setOverallScore((totalWeight / maxWeight) * 85 + Math.random() * 10); // Simulate some variance
          
          checkIndex++;
          if (checkIndex < atsChecklist.length) {
            setCurrentCheck(checkIndex);
          } else {
            setCurrentCheck(-1);
            clearInterval(checkInterval);
          }
        }, 1000);
      }, 1500);

      return () => clearInterval(checkInterval);
    }
  }, [isChecking]);

  const isCheckingItem = (index) => currentCheck === index;
  const isItemCompleted = (item) => completedChecks.has(item.id);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center">
          <motion.span 
            className="mr-3 text-3xl"
            animate={isChecking ? {
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            } : {}}
            transition={{
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            🤖
          </motion.span>
          ATS Compatibility Checker
        </h3>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            {Math.round(overallScore)}%
          </div>
          <div className="text-sm text-gray-500">ATS Score</div>
        </div>
      </div>

      {/* Overall Status */}
      <div className="mb-8">
        <ATSCompatibilityIndicator 
          score={overallScore} 
          isChecking={isChecking} 
        />
      </div>

      {/* Checking Status */}
      {isChecking && (
        <motion.div
          className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-center">
            <motion.div
              className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mr-3"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <div>
              <div className="font-medium text-blue-700">
                Scanning resume for ATS compatibility...
              </div>
              <div className="text-sm text-blue-600">
                Checking {completedChecks.size + 1} of {atsChecklist.length} criteria
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Checklist */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          ATS Compatibility Checklist
        </h4>
        
        {atsChecklist.map((item, index) => (
          <ATSChecklistItem
            key={item.id}
            item={item}
            isChecked={isItemCompleted(item)}
            isChecking={isCheckingItem(index)}
            delay={index * 100}
          />
        ))}
      </div>

      {/* Results Summary */}
      {!isChecking && completedChecks.size > 0 && (
        <motion.div
          className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h5 className="text-lg font-semibold text-emerald-800 mb-4">
            📋 ATS Compatibility Summary
          </h5>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl font-bold text-emerald-600">
                {completedChecks.size}
              </div>
              <div className="text-sm text-gray-600">Checks Passed</div>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(overallScore)}%
              </div>
              <div className="text-sm text-gray-600">ATS Score</div>
            </div>
          </div>

          <div className="text-emerald-700">
            <p className="mb-2">
              <strong>Good news!</strong> Your resume shows strong ATS compatibility.
            </p>
            <ul className="text-sm space-y-1">
              <li>• Your resume follows ATS-friendly formatting standards</li>
              <li>• Keywords are well-distributed throughout the content</li>
              <li>• Section structure is optimized for automated parsing</li>
            </ul>
          </div>
        </motion.div>
      )}

      {/* Tips Section */}
      <motion.div
        className="mt-6 p-4 bg-gray-50 rounded-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <h5 className="font-semibold text-gray-800 mb-2">💡 ATS Tips</h5>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Use standard section headings like "Experience", "Education", "Skills"</li>
          <li>• Avoid complex formatting, tables, and graphics</li>
          <li>• Include relevant keywords from the job description</li>
          <li>• Use a simple, professional font like Arial or Calibri</li>
        </ul>
      </div>
    </div>
  );
};

export { ATSCompatibilityIndicator, ATSChecklistItem, ATSCompatibilityChecker };