import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NeuralNetworkVisualization from '../components/NeuralNetworkVisualization';
import { AIProcessingProgress } from '../components/AIProcessingProgress';
import { InteractiveSkillMatching } from '../components/InteractiveSkillMatching';
import { ResumeScoreVisualization } from '../components/ResumeScoreVisualization';
import { ATSCompatibilityChecker } from '../components/ATSCompatibilityChecker';

const AIProcessingDashboard = () => {
  const [processingStage, setProcessingStage] = useState('idle');
  const [isProcessing, setIsProcessing] = useState(false);
  const [stageProgress, setStageProgress] = useState({});
  const [overallProgress, setOverallProgress] = useState(0);
  const [resumeScore, setResumeScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Sample resume content for demonstration
  const sampleResumeContent = `
    Experienced Full Stack Developer with 5+ years of experience building scalable web applications.
    Proficient in React, Node.js, Python, and AWS cloud technologies.
    Led cross-functional teams and delivered high-impact projects.
  `;

  const stages = ['analyzing', 'enhancing', 'optimizing', 'scoring'];

  const startProcessing = () => {
    setIsProcessing(true);
    setProcessingStage('analyzing');
    setStageProgress({});
    setOverallProgress(0);
    setResumeScore(0);
    setShowResults(false);

    // Simulate multi-stage processing
    simulateProcessing();
  };

  const simulateProcessing = async () => {
    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i];
      setProcessingStage(stage);

      // Simulate stage progress
      for (let progress = 0; progress <= 100; progress += Math.random() * 10 + 5) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setStageProgress(prev => ({
          ...prev,
          [stage]: Math.min(100, progress)
        }));
        
        // Update overall progress
        const stageWeight = 100 / stages.length;
        const completedStages = i * stageWeight;
        const currentStageProgress = (progress / 100) * stageWeight;
        setOverallProgress(completedStages + currentStageProgress);
      }

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Final results
    setIsProcessing(false);
    setResumeScore(87);
    setShowResults(true);
  };

  const resetDemo = () => {
    setProcessingStage('idle');
    setIsProcessing(false);
    setStageProgress({});
    setOverallProgress(0);
    setResumeScore(0);
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            AI Processing Visualization
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Experience real-time AI processing with animated neural networks, interactive charts, 
            and comprehensive resume analysis powered by advanced visualization
          </p>

          {/* Control Buttons */}
          <div className="flex justify-center gap-4">
            <motion.button
              onClick={startProcessing}
              disabled={isProcessing}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={!isProcessing ? { scale: 1.05 } : {}}
              whileTap={!isProcessing ? { scale: 0.95 } : {}}
            >
              {isProcessing ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </div>
              ) : (
                '🚀 Start AI Analysis'
              )}
            </motion.button>

            <motion.button
              onClick={resetDemo}
              className="px-8 py-4 bg-gray-500 text-white font-semibold rounded-full shadow-lg hover:bg-gray-600 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🔄 Reset Demo
            </motion.button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Neural Network & Progress Row */}
          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <NeuralNetworkVisualization 
                isProcessing={isProcessing}
                stage={processingStage}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <AIProcessingProgress
                currentStage={processingStage}
                overallProgress={overallProgress}
                stageProgress={stageProgress}
                isProcessing={isProcessing}
              />
            </motion.div>
          </div>

          {/* Skill Matching */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <InteractiveSkillMatching
              isAnalyzing={isProcessing && processingStage === 'analyzing'}
              onSkillClick={(skill) => console.log('Skill clicked:', skill)}
            />
          </motion.div>

          {/* Results Row */}
          <AnimatePresence>
            {showResults && (
              <motion.div
                className="grid lg:grid-cols-2 gap-8"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -100 }}
                transition={{ duration: 0.8 }}
              >
                <ResumeScoreVisualization
                  overallScore={resumeScore}
                  scores={{
                    content: 85,
                    ats: 78,
                    design: 92,
                    keywords: 73,
                    structure: 88
                  }}
                  isCalculating={isProcessing && processingStage === 'scoring'}
                  improvementSuggestions={[
                    'Add more quantified achievements with specific metrics',
                    'Include additional relevant keywords for your target role',
                    'Strengthen the professional summary section',
                    'Add more technical certifications or achievements'
                  ]}
                />

                <ATSCompatibilityChecker
                  resumeContent={sampleResumeContent}
                  isChecking={isProcessing && processingStage === 'optimizing'}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Demo Information */}
          <motion.div
            className="mt-12 p-8 bg-white rounded-2xl shadow-xl border border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              🎨 Visualization Features
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="text-3xl mb-3">🧠</div>
                <h4 className="font-semibold text-gray-800 mb-2">Neural Network</h4>
                <p className="text-sm text-gray-600">
                  Real-time animated neural network visualization showing AI thinking process
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="text-3xl mb-3">📊</div>
                <h4 className="font-semibold text-gray-800 mb-2">Interactive Charts</h4>
                <p className="text-sm text-gray-600">
                  Advanced data visualization using Recharts with animated progress indicators
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="text-3xl mb-3">🎯</div>
                <h4 className="font-semibold text-gray-800 mb-2">Skill Matching</h4>
                <p className="text-sm text-gray-600">
                  Interactive skill matching with animated progress rings and real-time feedback
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="text-3xl mb-3">✨</div>
                <h4 className="font-semibold text-gray-800 mb-2">Particle Effects</h4>
                <p className="text-sm text-gray-600">
                  Stunning particle animations during processing with smooth transitions
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="text-3xl mb-3">🤖</div>
                <h4 className="font-semibold text-gray-800 mb-2">ATS Checker</h4>
                <p className="text-sm text-gray-600">
                  Real-time ATS compatibility analysis with live feedback and scoring
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="text-3xl mb-3">📈</div>
                <h4 className="font-semibold text-gray-800 mb-2">Score Analytics</h4>
                <p className="text-sm text-gray-600">
                  Comprehensive score visualization with trend analysis and breakdown charts
                </p>
              </div>
            </div>
          </motion.div>

          {/* Tech Stack */}
          <motion.div
            className="p-6 bg-gradient-to-r from-gray-900 to-blue-900 rounded-2xl text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <h3 className="text-xl font-bold mb-4 text-center">🛠️ Powered By</h3>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="px-3 py-1 bg-white/20 rounded-full">React 19</span>
              <span className="px-3 py-1 bg-white/20 rounded-full">Framer Motion</span>
              <span className="px-3 py-1 bg-white/20 rounded-full">Recharts</span>
              <span className="px-3 py-1 bg-white/20 rounded-full">Tailwind CSS</span>
              <span className="px-3 py-1 bg-white/20 rounded-full">SVG Animations</span>
              <span className="px-3 py-1 bg-white/20 rounded-full">Canvas API</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AIProcessingDashboard;