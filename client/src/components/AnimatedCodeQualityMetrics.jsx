import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

const AnimatedCodeQualityMetrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [animationPhase, setAnimationPhase] = useState('loading');

  // Animated counter hook
  const useAnimatedCounter = (targetValue, duration = 2) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, Math.round);

    useEffect(() => {
      if (targetValue !== undefined) {
        const animation = count.set(targetValue, {
          type: 'tween',
          duration,
          ease: 'easeOut'
        });
        return animation;
      }
    }, [targetValue, count, duration]);

    return rounded;
  };

  // Mock code quality metrics data
  const generateMetricsData = () => {
    return {
      codeQuality: {
        maintainabilityIndex: 85,
        technicalDebt: 12, // hours
        codeComplexity: 3.2,
        duplication: 2.1, // percentage
        bugs: 3,
        vulnerabilities: 0,
        hotspots: 1,
        coverage: 94.7,
        score: 'A'
      },
      performance: {
        lighthouseScore: 96,
        firstContentfulPaint: 1.2, // seconds
        largestContentfulPaint: 2.1,
        cumulativeLayoutShift: 0.05,
        timeToInteractive: 2.8,
        totalBlockingTime: 45, // milliseconds
        speedIndex: 1.6
      },
      security: {
        securityScore: 98,
        vulnerabilitiesFixed: 15,
        securityHotspots: 0,
        securityRating: 'A',
        lastScan: new Date().toISOString().split('T')[0]
      },
      testCoverage: {
        linesCovered: 2847,
        linesTotal: 3012,
        branchCoverage: 91.3,
        functionCoverage: 96.8,
        statementCoverage: 94.7,
        testsPassing: 247,
        testsTotal: 251
      },
      codeMetrics: {
        linesOfCode: 12547,
        classes: 89,
        functions: 342,
        files: 127,
        techDebtRatio: 0.8,
        duplicatedLines: 264,
        duplicatedBlocks: 12
      }
    };
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setMetrics(generateMetricsData());
      setIsLoading(false);
      setAnimationPhase('loaded');
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const maintainabilityCounter = useAnimatedCounter(metrics?.codeQuality.maintainabilityIndex);
  const lighthouseCounter = useAnimatedCounter(metrics?.performance.lighthouseScore);
  const coverageCounter = useAnimatedCounter(metrics?.testCoverage.statementCoverage);
  const securityCounter = useAnimatedCounter(metrics?.security.securityScore);

  const MetricCard = ({ title, value, unit, icon, color, description, trend, children }) => (
    <motion.div
      className={`bg-white rounded-xl shadow-lg p-6 border-l-4 cursor-pointer transition-all duration-300 hover:shadow-xl`}
      style={{ borderLeftColor: color }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setSelectedMetric({ title, value, unit, description, trend })}
      layout
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <motion.span 
            className="text-2xl"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: Math.random() * 2 }}
          >
            {icon}
          </motion.span>
          <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
        </div>
        {trend && (
          <motion.div
            className={`flex items-center text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.span
              animate={{ y: trend > 0 ? [-2, 2, -2] : [2, -2, 2] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {trend > 0 ? '↗️' : '↘️'}
            </motion.span>
            <span className="ml-1">{Math.abs(trend)}%</span>
          </motion.div>
        )}
      </div>

      <div className="flex items-end space-x-2">
        <motion.span 
          className="text-3xl font-bold"
          style={{ color }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
        >
          {value}
        </motion.span>
        {unit && <span className="text-gray-500 text-lg mb-1">{unit}</span>}
      </div>

      {description && (
        <p className="text-sm text-gray-600 mt-2">{description}</p>
      )}

      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </motion.div>
  );

  const CircularProgress = ({ percentage, size = 60, strokeWidth = 6, color = '#3b82f6' }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <motion.div 
        className="relative inline-flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
      >
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
            strokeLinecap="round"
          />
        </svg>
        <motion.span 
          className="absolute text-sm font-bold"
          style={{ color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {Math.round(percentage)}%
        </motion.span>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Code Quality Metrics</h3>
          <motion.div
            className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-xl h-32"></div>
            </div>
          ))}
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
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            ⚙️
          </motion.span>
          Code Quality Metrics
        </h3>
        <div className="flex items-center space-x-2">
          <motion.div
            className="w-3 h-3 bg-green-400 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-sm text-gray-500">Live Monitoring</span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Maintainability"
          value={maintainabilityCounter}
          unit="/100"
          icon="🏗️"
          color="#10b981"
          description="Code maintainability index"
          trend={5.2}
        >
          <CircularProgress percentage={metrics.codeQuality.maintainabilityIndex} color="#10b981" />
        </MetricCard>

        <MetricCard
          title="Performance"
          value={lighthouseCounter}
          unit="/100"
          icon="⚡"
          color="#f59e0b"
          description="Lighthouse performance score"
          trend={2.1}
        >
          <CircularProgress percentage={metrics.performance.lighthouseScore} color="#f59e0b" />
        </MetricCard>

        <MetricCard
          title="Test Coverage"
          value={coverageCounter}
          unit="%"
          icon="🧪"
          color="#3b82f6"
          description="Statement coverage"
          trend={1.8}
        >
          <CircularProgress percentage={metrics.testCoverage.statementCoverage} color="#3b82f6" />
        </MetricCard>

        <MetricCard
          title="Security"
          value={securityCounter}
          unit="/100"
          icon="🔒"
          color="#8b5cf6"
          description="Security rating score"
          trend={0}
        >
          <CircularProgress percentage={metrics.security.securityScore} color="#8b5cf6" />
        </MetricCard>
      </div>

      {/* Detailed Metrics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Code Complexity */}
        <motion.div
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h5 className="font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">📊</span>
            Code Complexity
          </h5>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Cyclomatic Complexity</span>
              <motion.span 
                className="font-bold text-blue-600"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                {metrics.codeQuality.codeComplexity}
              </motion.span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Technical Debt</span>
              <motion.span 
                className="font-bold text-blue-600"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                {metrics.codeQuality.technicalDebt}h
              </motion.span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Code Duplication</span>
              <motion.span 
                className="font-bold text-blue-600"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7 }}
              >
                {metrics.codeQuality.duplication}%
              </motion.span>
            </div>
          </div>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h5 className="font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🚀</span>
            Performance Vitals
          </h5>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">FCP</span>
              <motion.span 
                className="font-bold text-amber-600"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8 }}
              >
                {metrics.performance.firstContentfulPaint}s
              </motion.span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">LCP</span>
              <motion.span 
                className="font-bold text-amber-600"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.9 }}
              >
                {metrics.performance.largestContentfulPaint}s
              </motion.span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">CLS</span>
              <motion.span 
                className="font-bold text-amber-600"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.0 }}
              >
                {metrics.performance.cumulativeLayoutShift}
              </motion.span>
            </div>
          </div>
        </motion.div>

        {/* Test Statistics */}
        <motion.div
          className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h5 className="font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">✅</span>
            Test Statistics
          </h5>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tests Passing</span>
              <motion.span 
                className="font-bold text-green-600"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.1 }}
              >
                {metrics.testCoverage.testsPassing}/{metrics.testCoverage.testsTotal}
              </motion.span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Branch Coverage</span>
              <motion.span 
                className="font-bold text-green-600"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2 }}
              >
                {metrics.testCoverage.branchCoverage}%
              </motion.span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Function Coverage</span>
              <motion.span 
                className="font-bold text-green-600"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.3 }}
              >
                {metrics.testCoverage.functionCoverage}%
              </motion.span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quality Score Summary */}
      <motion.div
        className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h5 className="text-lg font-bold text-gray-800 flex items-center">
              <motion.span 
                className="mr-3 text-2xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🏆
              </motion.span>
              Overall Quality Score: {metrics.codeQuality.score}
            </h5>
            <p className="text-sm text-gray-600 mt-1">
              Excellent code quality with strong maintainability and performance metrics
            </p>
          </div>
          <motion.div
            className="text-6xl"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {metrics.codeQuality.score === 'A' ? '🥇' : 
             metrics.codeQuality.score === 'B' ? '🥈' : 
             metrics.codeQuality.score === 'C' ? '🥉' : '📊'}
          </motion.div>
        </div>
      </motion.div>

      {/* Modal for detailed metric view */}
      <AnimatePresence>
        {selectedMetric && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMetric(null)}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-md w-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{selectedMetric.title}</h3>
              <div className="text-4xl font-bold text-blue-600 mb-4">
                {selectedMetric.value}{selectedMetric.unit}
              </div>
              <p className="text-gray-600 mb-6">{selectedMetric.description}</p>
              {selectedMetric.trend !== undefined && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">30-day trend</div>
                  <div className={`text-lg font-semibold ${selectedMetric.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedMetric.trend > 0 ? '+' : ''}{selectedMetric.trend}%
                  </div>
                </div>
              )}
              <button
                onClick={() => setSelectedMetric(null)}
                className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedCodeQualityMetrics;