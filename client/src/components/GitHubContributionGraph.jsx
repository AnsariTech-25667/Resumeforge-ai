import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GitHubContributionGraph = ({ username = 'AnsariTech-25667' }) => {
  const [contributionData, setContributionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [hoveredDay, setHoveredDay] = useState(null);

  // Mock GitHub contribution data (in real app, fetch from GitHub API)
  const generateContributionData = () => {
    const weeks = [];
    const today = new Date();
    const startDate = new Date(today.getTime() - (52 * 7 * 24 * 60 * 60 * 1000)); // 52 weeks ago
    
    for (let week = 0; week < 52; week++) {
      const weekData = [];
      for (let day = 0; day < 7; day++) {
        const date = new Date(startDate.getTime() + ((week * 7 + day) * 24 * 60 * 60 * 1000));
        const contributions = Math.floor(Math.random() * 12); // 0-11 contributions
        const level = contributions === 0 ? 0 : contributions <= 2 ? 1 : contributions <= 5 ? 2 : contributions <= 8 ? 3 : 4;
        
        weekData.push({
          date: date.toISOString().split('T')[0],
          contributions,
          level,
          formattedDate: date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })
        });
      }
      weeks.push(weekData);
    }
    
    return {
      weeks,
      totalContributions: weeks.flat().reduce((sum, day) => sum + day.contributions, 0),
      longestStreak: calculateLongestStreak(weeks.flat()),
      currentStreak: calculateCurrentStreak(weeks.flat())
    };
  };

  const calculateLongestStreak = (days) => {
    let maxStreak = 0;
    let currentStreak = 0;
    
    days.forEach(day => {
      if (day.contributions > 0) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });
    
    return maxStreak;
  };

  const calculateCurrentStreak = (days) => {
    let streak = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].contributions > 0) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setContributionData(generateContributionData());
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [username]);

  const getContributionColor = (level) => {
    const colors = {
      0: '#ebedf0',
      1: '#9be9a8',
      2: '#40c463',
      3: '#30a14e',
      4: '#216e39'
    };
    return colors[level] || colors[0];
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">GitHub Contributions</h3>
          <motion.div
            className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-53 gap-1">
            {[...Array(371)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-gray-200 rounded-sm" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <motion.span 
            className="mr-3 text-2xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            📊
          </motion.span>
          GitHub Contributions
        </h3>
        <div className="text-sm text-gray-500">
          @{username}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <motion.div 
          className="text-center p-3 bg-green-50 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div 
            className="text-2xl font-bold text-green-600"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            {contributionData?.totalContributions}
          </motion.div>
          <div className="text-sm text-gray-600">Total Contributions</div>
        </motion.div>
        
        <motion.div 
          className="text-center p-3 bg-blue-50 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div 
            className="text-2xl font-bold text-blue-600"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: "spring" }}
          >
            {contributionData?.longestStreak}
          </motion.div>
          <div className="text-sm text-gray-600">Longest Streak</div>
        </motion.div>
        
        <motion.div 
          className="text-center p-3 bg-purple-50 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div 
            className="text-2xl font-bold text-purple-600"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7, type: "spring" }}
          >
            {contributionData?.currentStreak}
          </motion.div>
          <div className="text-sm text-gray-600">Current Streak</div>
        </motion.div>
      </div>

      {/* Month Labels */}
      <div className="mb-2">
        <div className="grid grid-cols-12 gap-1 text-xs text-gray-500 ml-8">
          {months.map((month, index) => (
            <div key={month} className="text-center">
              {index % 2 === 0 ? month : ''}
            </div>
          ))}
        </div>
      </div>

      {/* Contribution Graph */}
      <div className="relative">
        {/* Day Labels */}
        <div className="absolute left-0 top-0 flex flex-col text-xs text-gray-500 space-y-2 pr-2">
          <div className="h-3"></div>
          <div>Mon</div>
          <div className="h-3"></div>
          <div>Wed</div>
          <div className="h-3"></div>
          <div>Fri</div>
          <div className="h-3"></div>
        </div>

        {/* Contribution Grid */}
        <div className="ml-8 overflow-x-auto">
          <div className="grid grid-flow-col gap-1" style={{ gridTemplateRows: 'repeat(7, 1fr)' }}>
            {contributionData?.weeks.map((week, weekIndex) => 
              week.map((day, dayIndex) => (
                <motion.div
                  key={`${weekIndex}-${dayIndex}`}
                  className="w-3 h-3 rounded-sm cursor-pointer transition-all duration-200"
                  style={{ backgroundColor: getContributionColor(day.level) }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (weekIndex * 7 + dayIndex) * 0.002 }}
                  whileHover={{ 
                    scale: 1.5, 
                    zIndex: 10,
                    boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
                  }}
                  onHoverStart={() => setHoveredDay(day)}
                  onHoverEnd={() => setHoveredDay(null)}
                  onClick={() => setSelectedWeek(weekIndex)}
                />
              ))
            )}
          </div>
        </div>

        {/* Hover Tooltip */}
        <AnimatePresence>
          {hoveredDay && (
            <motion.div
              className="absolute z-20 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm shadow-lg pointer-events-none"
              style={{
                left: '50%',
                top: '-60px',
                transform: 'translateX(-50%)'
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <div className="font-semibold">
                {hoveredDay.contributions} contribution{hoveredDay.contributions !== 1 ? 's' : ''}
              </div>
              <div className="text-xs text-gray-300">
                {hoveredDay.formattedDate}
              </div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                <div className="border-4 border-transparent border-t-gray-900"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-xs text-gray-500">Less</div>
        <div className="flex space-x-1">
          {[0, 1, 2, 3, 4].map(level => (
            <div
              key={level}
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: getContributionColor(level) }}
            />
          ))}
        </div>
        <div className="text-xs text-gray-500">More</div>
      </div>

      {/* Activity Summary */}
      <motion.div
        className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-green-50 rounded-xl border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-800">🔥 On Fire!</div>
            <div className="text-xs text-gray-600">
              {contributionData?.currentStreak > 0 
                ? `${contributionData.currentStreak} day contribution streak` 
                : 'Ready to start a new streak'}
            </div>
          </div>
          <motion.div
            className="text-2xl"
            animate={{ 
              scale: contributionData?.currentStreak > 7 ? [1, 1.2, 1] : 1,
              rotate: contributionData?.currentStreak > 14 ? [0, 10, -10, 0] : 0
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {contributionData?.currentStreak > 14 ? '🚀' : 
             contributionData?.currentStreak > 7 ? '⚡' : 
             contributionData?.currentStreak > 0 ? '💪' : '🎯'}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default GitHubContributionGraph;