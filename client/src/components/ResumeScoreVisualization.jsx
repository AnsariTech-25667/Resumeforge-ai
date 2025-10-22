import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RadialBarChart, 
  RadialBar, 
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

const AnimatedScoreRing = ({ score, maxScore = 100, label, color = '#3B82F6' }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [score]);

  const percentage = (animatedScore / maxScore) * 100;
  const data = [{ value: percentage, fill: color }];

  return (
    <div className="relative">
      <ResponsiveContainer width={150} height={150}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="60%"
          outerRadius="90%"
          barSize={12}
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <RadialBar
            dataKey="value"
            cornerRadius={10}
            fill={color}
            animationDuration={2000}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          className="text-3xl font-bold"
          style={{ color }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          {Math.round(animatedScore)}
        </motion.div>
        <div className="text-sm text-gray-500">{label}</div>
      </div>
    </div>
  );
};

const ScoreBreakdown = ({ scores }) => {
  const data = [
    { name: 'Content Quality', score: scores.content || 0, color: '#3B82F6' },
    { name: 'ATS Compatibility', score: scores.ats || 0, color: '#10B981' },
    { name: 'Format & Design', score: scores.design || 0, color: '#F59E0B' },
    { name: 'Keywords', score: scores.keywords || 0, color: '#EF4444' },
    { name: 'Structure', score: scores.structure || 0, color: '#8B5CF6' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {data.map((item, index) => (
        <motion.div
          key={item.name}
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <AnimatedScoreRing
            score={item.score}
            label={item.name}
            color={item.color}
          />
        </motion.div>
      ))}
    </div>
  );
};

const ScoreTrendChart = ({ trendData }) => {
  const data = trendData || [
    { version: 'Original', score: 65 },
    { version: 'AI Enhanced', score: 78 },
    { version: 'Optimized', score: 85 },
    { version: 'Final', score: 92 }
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">Score Improvement Trend</h4>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="version" 
            stroke="#6B7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6B7280"
            fontSize={12}
            domain={[0, 100]}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#3B82F6"
            fillOpacity={1}
            fill="url(#scoreGradient)"
            strokeWidth={3}
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const CategoryScoreChart = ({ categoryScores }) => {
  const data = categoryScores || [
    { category: 'Technical Skills', score: 88, target: 90 },
    { category: 'Experience', score: 85, target: 85 },
    { category: 'Education', score: 92, target: 85 },
    { category: 'Projects', score: 79, target: 80 },
    { category: 'Achievements', score: 94, target: 90 }
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">Category Performance</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="category" 
            stroke="#6B7280"
            fontSize={11}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="#6B7280"
            fontSize={12}
            domain={[0, 100]}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Bar 
            dataKey="score" 
            fill="#3B82F6" 
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
          />
          <Bar 
            dataKey="target" 
            fill="#E5E7EB" 
            radius={[4, 4, 0, 0]}
            opacity={0.3}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const ResumeScoreVisualization = ({ 
  overallScore = 0, 
  scores = {}, 
  isCalculating = false,
  improvementSuggestions = []
}) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (isCalculating) {
      // Simulate score calculation
      let current = 0;
      const interval = setInterval(() => {
        current += Math.random() * 5 + 2;
        if (current >= overallScore) {
          current = overallScore;
          clearInterval(interval);
        }
        setDisplayScore(current);
      }, 100);
      
      return () => clearInterval(interval);
    } else {
      setDisplayScore(overallScore);
    }
  }, [overallScore, isCalculating]);

  const getScoreColor = (score) => {
    if (score >= 90) return '#10B981';
    if (score >= 75) return '#3B82F6';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const getScoreGrade = (score) => {
    if (score >= 90) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 80) return 'A-';
    if (score >= 75) return 'B+';
    if (score >= 70) return 'B';
    if (score >= 65) return 'B-';
    if (score >= 60) return 'C+';
    return 'C';
  };

  const defaultScores = {
    content: 85,
    ats: 78,
    design: 92,
    keywords: 73,
    structure: 88
  };

  const currentScores = { ...defaultScores, ...scores };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center">
          <motion.span 
            className="mr-3 text-3xl"
            animate={isCalculating ? {
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            } : {}}
            transition={{
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            📊
          </motion.span>
          Resume Score Analysis
        </h3>

        <motion.button
          onClick={() => setShowDetails(!showDetails)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </motion.button>
      </div>

      {/* Main Score Display */}
      <div className="text-center mb-8">
        <div className="relative inline-block">
          <ResponsiveContainer width={250} height={250}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="70%"
              outerRadius="90%"
              barSize={20}
              data={[{ value: (displayScore / 100) * 100, fill: getScoreColor(displayScore) }]}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar
                dataKey="value"
                cornerRadius={10}
                fill={getScoreColor(displayScore)}
                animationDuration={2000}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              className="text-5xl font-bold mb-2"
              style={{ color: getScoreColor(displayScore) }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              {Math.round(displayScore)}
            </motion.div>
            <div className="text-xl text-gray-600 mb-1">
              Grade: {getScoreGrade(displayScore)}
            </div>
            <div className="text-sm text-gray-500">Overall Score</div>
          </div>
        </div>

        {/* Score Status */}
        <motion.div
          className={`inline-block px-6 py-2 rounded-full text-white font-medium mt-4 ${
            displayScore >= 90 ? 'bg-emerald-500' :
            displayScore >= 75 ? 'bg-blue-500' :
            displayScore >= 60 ? 'bg-amber-500' : 'bg-red-500'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          {displayScore >= 90 ? 'Excellent Resume!' :
           displayScore >= 75 ? 'Strong Resume' :
           displayScore >= 60 ? 'Good Resume' : 'Needs Improvement'}
        </motion.div>
      </div>

      {/* Score Breakdown */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-800 mb-6 text-center">Score Breakdown</h4>
        <ScoreBreakdown scores={currentScores} />
      </div>

      {/* Processing Indicator */}
      {isCalculating && (
        <motion.div
          className="text-center mb-6"
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
            Calculating resume score...
          </motion.div>
        </motion.div>
      )}

      {/* Detailed Analysis */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6"
          >
            <div className="grid lg:grid-cols-2 gap-6">
              <ScoreTrendChart />
              <CategoryScoreChart categoryScores={[
                { category: 'Content', score: currentScores.content, target: 90 },
                { category: 'ATS', score: currentScores.ats, target: 85 },
                { category: 'Design', score: currentScores.design, target: 85 },
                { category: 'Keywords', score: currentScores.keywords, target: 80 },
                { category: 'Structure', score: currentScores.structure, target: 90 }
              ]} />
            </div>

            {/* Improvement Suggestions */}
            {improvementSuggestions.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <h5 className="text-lg font-semibold text-blue-800 mb-4">
                  🚀 Improvement Suggestions
                </h5>
                <ul className="space-y-2">
                  {improvementSuggestions.map((suggestion, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start text-blue-700"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <span className="text-blue-500 mr-2">•</span>
                      {suggestion}
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { AnimatedScoreRing, ScoreBreakdown, ScoreTrendChart, CategoryScoreChart, ResumeScoreVisualization };