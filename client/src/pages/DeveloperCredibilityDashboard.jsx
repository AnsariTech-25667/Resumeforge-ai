import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import GitHubContributionGraph from '../components/GitHubContributionGraph';
import AnimatedCodeQualityMetrics from '../components/AnimatedCodeQualityMetrics';
import InteractiveSkillMatching from '../components/InteractiveSkillMatching';
import ResumeScoreVisualization from '../components/ResumeScoreVisualization';

const DeveloperCredibilityDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [realtimeStats, setRealtimeStats] = useState({
    repositoriesCount: 0,
    totalCommits: 0,
    languagesUsed: 0,
    starsEarned: 0,
    contributionsThisYear: 0,
    projectsCompleted: 0
  });
  const [techStack, setTechStack] = useState(null);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Animated counter hook
  const useAnimatedCounter = (targetValue, duration = 2.5) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, Math.round);

    useEffect(() => {
      if (targetValue !== undefined) {
        count.set(targetValue);
      }
    }, [targetValue, count, duration]);

    return rounded;
  };

  // Generate mock GitHub statistics
  const generateGitHubStats = () => {
    return {
      repositoriesCount: 47,
      totalCommits: 2847,
      languagesUsed: 12,
      starsEarned: 342,
      contributionsThisYear: 1456,
      projectsCompleted: 23,
      followers: 128,
      following: 89,
      publicRepos: 47,
      privateRepos: 31
    };
  };

  // Generate tech stack data with proficiency levels
  const generateTechStackData = () => {
    return {
      languages: [
        { name: 'TypeScript', level: 95, years: 4, projects: 18, trend: 'up' },
        { name: 'JavaScript', level: 98, years: 6, projects: 35, trend: 'stable' },
        { name: 'Python', level: 88, years: 3, projects: 12, trend: 'up' },
        { name: 'Java', level: 82, years: 5, projects: 8, trend: 'down' },
        { name: 'Go', level: 75, years: 2, projects: 6, trend: 'up' },
        { name: 'Rust', level: 65, years: 1, projects: 3, trend: 'up' }
      ],
      frameworks: [
        { name: 'React', level: 96, years: 5, projects: 28, trend: 'up' },
        { name: 'Node.js', level: 93, years: 4, projects: 22, trend: 'stable' },
        { name: 'Next.js', level: 89, years: 3, projects: 15, trend: 'up' },
        { name: 'Express', level: 91, years: 4, projects: 18, trend: 'stable' },
        { name: 'FastAPI', level: 78, years: 2, projects: 8, trend: 'up' },
        { name: 'Spring Boot', level: 76, years: 3, projects: 5, trend: 'down' }
      ],
      tools: [
        { name: 'Docker', level: 87, years: 3, projects: 16, trend: 'up' },
        { name: 'AWS', level: 84, years: 3, projects: 14, trend: 'up' },
        { name: 'Kubernetes', level: 72, years: 2, projects: 7, trend: 'up' },
        { name: 'MongoDB', level: 89, years: 4, projects: 19, trend: 'stable' },
        { name: 'PostgreSQL', level: 86, years: 4, projects: 21, trend: 'stable' },
        { name: 'Redis', level: 81, years: 3, projects: 13, trend: 'up' }
      ]
    };
  };

  // Generate performance metrics
  const generatePerformanceMetrics = () => {
    return {
      bundle: {
        size: 245, // KB
        gzipped: 78,
        optimization: 87, // percentage
        treeshaking: 94,
        codeSplitting: 91
      },
      lighthouse: {
        performance: 96,
        accessibility: 94,
        bestPractices: 98,
        seo: 92,
        pwa: 89
      },
      testing: {
        unitTests: 247,
        integrationTests: 34,
        e2eTests: 18,
        coverage: 94.7,
        mutationScore: 87.3
      },
      ci: {
        buildTime: 3.2, // minutes
        deployTime: 1.8,
        uptime: 99.9,
        errorRate: 0.03
      }
    };
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setRealtimeStats(generateGitHubStats());
      setTechStack(generateTechStackData());
      setPerformanceMetrics(generatePerformanceMetrics());
      setIsLoading(false);
    }, 2000);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setRealtimeStats(prev => ({
        ...prev,
        totalCommits: prev.totalCommits + Math.floor(Math.random() * 3),
        contributionsThisYear: prev.contributionsThisYear + Math.floor(Math.random() * 2)
      }));
    }, 10000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const reposCounter = useAnimatedCounter(realtimeStats.repositoriesCount);
  const commitsCounter = useAnimatedCounter(realtimeStats.totalCommits);
  const starsCounter = useAnimatedCounter(realtimeStats.starsEarned);
  const contributionsCounter = useAnimatedCounter(realtimeStats.contributionsThisYear);

  const sections = [
    { id: 'overview', name: 'Overview', icon: '📊', description: 'Key metrics & stats' },
    { id: 'github', name: 'GitHub', icon: '🐙', description: 'Contribution graph' },
    { id: 'quality', name: 'Code Quality', icon: '⚙️', description: 'Quality metrics' },
    { id: 'skills', name: 'Tech Stack', icon: '🛠️', description: 'Interactive skills' },
    { id: 'performance', name: 'Performance', icon: '⚡', description: 'Optimization data' }
  ];

  const StatCard = ({ title, value, icon, color, description, trend, suffix = '' }) => (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6 border-l-4 hover:shadow-xl transition-all duration-300"
      style={{ borderLeftColor: color }}
      whileHover={{ scale: 1.02, y: -4 }}
      layout
    >
      <div className="flex items-center justify-between mb-4">
        <motion.span 
          className="text-3xl"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: Math.random() * 2 }}
        >
          {icon}
        </motion.span>
        {trend && (
          <motion.div
            className={`flex items-center text-sm ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {trend === 'up' ? '↗️' : trend === 'down' ? '↘️' : '➡️'}
          </motion.div>
        )}
      </div>
      
      <div className="mb-2">
        <motion.span 
          className="text-3xl font-bold"
          style={{ color }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
        >
          {value}{suffix}
        </motion.span>
      </div>
      
      <h4 className="font-semibold text-gray-800 mb-1">{title}</h4>
      {description && <p className="text-sm text-gray-600">{description}</p>}
    </motion.div>
  );

  const TechStackVisualization = ({ data }) => (
    <div className="space-y-6">
      {Object.entries(data).map(([category, items]) => (
        <motion.div
          key={category}
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h4 className="text-lg font-bold text-gray-800 mb-4 capitalize flex items-center">
            <span className="mr-2">
              {category === 'languages' ? '💻' : category === 'frameworks' ? '🎯' : '🔧'}
            </span>
            {category}
          </h4>
          
          <div className="space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.name}
                className="flex items-center justify-between"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-3 flex-1">
                  <span className="font-medium text-gray-800 w-24">{item.name}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${item.level}%` }}
                      transition={{ duration: 1.5, delay: index * 0.1 }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-600 w-12">{item.level}%</span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{item.years}y</span>
                  <span>{item.projects} projects</span>
                  <motion.span
                    animate={{ 
                      color: item.trend === 'up' ? '#10b981' : item.trend === 'down' ? '#ef4444' : '#6b7280',
                      scale: item.trend === 'up' ? [1, 1.2, 1] : 1
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {item.trend === 'up' ? '📈' : item.trend === 'down' ? '📉' : '➡️'}
                  </motion.span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );

  const PerformanceGrid = ({ metrics }) => (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Bundle Analytics */}
      <motion.div
        className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h5 className="font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">📦</span>
          Bundle Optimization
        </h5>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Bundle Size</span>
            <span className="font-bold text-green-600">{metrics.bundle.size}KB</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Gzipped</span>
            <span className="font-bold text-green-600">{metrics.bundle.gzipped}KB</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Tree Shaking</span>
            <span className="font-bold text-green-600">{metrics.bundle.treeshaking}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Code Splitting</span>
            <span className="font-bold text-green-600">{metrics.bundle.codeSplitting}%</span>
          </div>
        </div>
      </motion.div>

      {/* Lighthouse Scores */}
      <motion.div
        className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h5 className="font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">🏮</span>
          Lighthouse Scores
        </h5>
        <div className="space-y-3">
          {Object.entries(metrics.lighthouse).map(([key, value], index) => (
            <div key={key} className="flex justify-between items-center">
              <span className="text-sm text-gray-600 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <motion.span 
                className="font-bold text-blue-600"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                {value}/100
              </motion.span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Testing Metrics */}
      <motion.div
        className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h5 className="font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">🧪</span>
          Testing Coverage
        </h5>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Unit Tests</span>
            <span className="font-bold text-purple-600">{metrics.testing.unitTests}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Integration</span>
            <span className="font-bold text-purple-600">{metrics.testing.integrationTests}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Coverage</span>
            <span className="font-bold text-purple-600">{metrics.testing.coverage}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Mutation Score</span>
            <span className="font-bold text-purple-600">{metrics.testing.mutationScore}%</span>
          </div>
        </div>
      </motion.div>

      {/* CI/CD Performance */}
      <motion.div
        className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h5 className="font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">🚀</span>
          CI/CD Pipeline
        </h5>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Build Time</span>
            <span className="font-bold text-amber-600">{metrics.ci.buildTime}min</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Deploy Time</span>
            <span className="font-bold text-amber-600">{metrics.ci.deployTime}min</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Uptime</span>
            <span className="font-bold text-amber-600">{metrics.ci.uptime}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Error Rate</span>
            <span className="font-bold text-amber-600">{metrics.ci.errorRate}%</span>
          </div>
        </div>
      </motion.div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <motion.div
              className="inline-flex items-center space-x-4"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <h1 className="text-3xl font-bold text-gray-800">Loading Developer Credentials...</h1>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Developer Credibility
            </motion.h1>
            
            <motion.p
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Real-time technical expertise showcase with GitHub integration, 
              code quality metrics, and performance benchmarks
            </motion.p>

            {/* Live Stats */}
            <motion.div
              className="flex flex-wrap justify-center gap-6 text-sm text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center space-x-2">
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>⚙️</motion.span>
                <span>Live Monitoring Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <motion.div className="w-2 h-2 bg-green-400 rounded-full" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                <span>Real-time GitHub Sync</span>
              </div>
              <div className="flex items-center space-x-2">
                <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>📊</motion.span>
                <span>Performance Tracking</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2 p-2 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50">
            {sections.map((section) => (
              <motion.button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all ${
                  activeSection === section.id
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg">{section.icon}</span>
                <div className="text-left">
                  <div className="font-semibold">{section.name}</div>
                  <div className="text-xs opacity-75">{section.description}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeSection === 'overview' && (
              <div className="space-y-8">
                {/* Real-time Stats Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    title="Repositories"
                    value={reposCounter}
                    icon="📁"
                    color="#3b82f6"
                    description="Public & Private repos"
                    trend="up"
                  />
                  <StatCard
                    title="Total Commits"
                    value={commitsCounter}
                    icon="💻"
                    color="#10b981"
                    description="All-time contributions"
                    trend="up"
                  />
                  <StatCard
                    title="Stars Earned"
                    value={starsCounter}
                    icon="⭐"
                    color="#f59e0b"
                    description="Community recognition"
                    trend="up"
                  />
                  <StatCard
                    title="This Year"
                    value={contributionsCounter}
                    icon="🔥"
                    color="#8b5cf6"
                    description="Contributions in 2025"
                    trend="up"
                  />
                </div>

                {/* Quick Overview Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                  <motion.div className="bg-white rounded-xl shadow-lg p-6" whileHover={{ scale: 1.02 }}>
                    <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                      <span className="mr-2">🛠️</span>
                      Tech Stack Highlights
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">TypeScript</span>
                        <span className="font-semibold text-blue-600">95%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">React</span>
                        <span className="font-semibold text-blue-600">96%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Node.js</span>
                        <span className="font-semibold text-blue-600">93%</span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div className="bg-white rounded-xl shadow-lg p-6" whileHover={{ scale: 1.02 }}>
                    <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                      <span className="mr-2">⚡</span>
                      Performance Score
                    </h4>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">96</div>
                      <div className="text-gray-600">Lighthouse Average</div>
                    </div>
                  </motion.div>

                  <motion.div className="bg-white rounded-xl shadow-lg p-6" whileHover={{ scale: 1.02 }}>
                    <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                      <span className="mr-2">🏆</span>
                      Quality Grade
                    </h4>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600 mb-2">A</div>
                      <div className="text-gray-600">Code Quality Score</div>
                    </div>
                  </motion.div>
                </div>

                {/* Combined Skills & Score Visualization */}
                <div className="grid lg:grid-cols-2 gap-8">
                  <InteractiveSkillMatching />
                  <ResumeScoreVisualization />
                </div>
              </div>
            )}

            {activeSection === 'github' && <GitHubContributionGraph />}

            {activeSection === 'quality' && <AnimatedCodeQualityMetrics />}

            {activeSection === 'skills' && techStack && (
              <TechStackVisualization data={techStack} />
            )}

            {activeSection === 'performance' && performanceMetrics && (
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Performance Benchmarks</h3>
                  <p className="text-gray-600">Real-time optimization metrics and bundle analysis</p>
                </div>
                <PerformanceGrid metrics={performanceMetrics} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Achievement Badge */}
      <motion.div
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full p-4 shadow-2xl"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2 }}
        whileHover={{ scale: 1.1 }}
      >
        <motion.div
          className="text-center"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <div className="text-2xl mb-1">🏆</div>
          <div className="text-xs font-bold">Elite</div>
          <div className="text-xs">Developer</div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DeveloperCredibilityDashboard;