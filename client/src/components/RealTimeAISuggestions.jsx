import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TypewriterSuggestion = ({ suggestion, onAccept, onDismiss, delay = 0 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    let timeoutId;
    let currentIndex = 0;
    
    const typeText = () => {
      if (currentIndex < suggestion.length) {
        setDisplayedText(suggestion.slice(0, currentIndex + 1));
        currentIndex++;
        timeoutId = setTimeout(typeText, 30 + Math.random() * 20);
      } else {
        setIsComplete(true);
      }
    };
    
    const startTimeout = setTimeout(typeText, delay);
    
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(startTimeout);
    };
  }, [suggestion, delay]);
  
  return (
    <motion.div
      className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-3"
      initial={{ opacity: 0, x: -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{ delay: delay / 1000 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <motion.span 
              className="text-blue-500 mr-2"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              🤖
            </motion.span>
            <span className="text-sm font-medium text-blue-700">AI Suggestion</span>
          </div>
          
          <p className="text-gray-800 leading-relaxed">
            {displayedText}
            {!isComplete && (
              <motion.span
                className="inline-block w-0.5 h-4 bg-blue-500 ml-1"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
          </p>
        </div>
        
        <AnimatePresence>
          {isComplete && (
            <motion.div 
              className="flex gap-2 ml-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.button
                onClick={() => onAccept(suggestion)}
                className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ✓
              </motion.button>
              
              <motion.button
                onClick={onDismiss}
                className="p-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const SmartAutocomplete = ({ input, onSuggestion, context = 'general' }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  // Mock AI-powered suggestions based on context
  const generateSuggestions = (text, contextType) => {
    const contextSuggestions = {
      experience: [
        'Led a cross-functional team of 8 developers to deliver a enterprise-scale application, resulting in 40% improved user engagement',
        'Architected and implemented microservices infrastructure using Docker and Kubernetes, reducing deployment time by 60%',
        'Spearheaded the migration from monolithic to serverless architecture, achieving 50% cost reduction and improved scalability',
        'Collaborated with product managers and designers to define technical requirements and deliver user-centric solutions'
      ],
      skills: [
        'React, Node.js, TypeScript, Python, AWS, Docker, Kubernetes, MongoDB, PostgreSQL, Redis',
        'Frontend: React, Vue.js, Angular, TypeScript, HTML5, CSS3, Sass, Tailwind CSS',
        'Backend: Node.js, Python, Java, .NET, Express.js, Django, Flask, Spring Boot',
        'Cloud: AWS, Azure, GCP, Docker, Kubernetes, Terraform, CI/CD pipelines'
      ],
      summary: [
        'Experienced Full Stack Developer with 5+ years building scalable web applications and leading technical teams',
        'Results-driven Software Engineer specializing in modern JavaScript frameworks and cloud architecture',
        'Senior Developer with expertise in React, Node.js, and AWS, passionate about creating efficient, user-focused solutions',
        'Innovative Technical Lead with a track record of delivering high-impact projects and mentoring junior developers'
      ],
      education: [
        'Bachelor of Science in Computer Science, [University Name], [Year] - GPA: 3.8/4.0',
        'Master of Technology in Software Engineering, [University Name], [Year]',
        'Bachelor of Engineering in Information Technology, [University Name], [Year] - Relevant Coursework: Data Structures, Algorithms, Database Systems',
        'Associate Degree in Computer Programming, [College Name], [Year] - Dean\'s List, Honors Program'
      ]
    };
    
    const baseSuggestions = contextSuggestions[contextType] || contextSuggestions.general || [];
    
    return baseSuggestions.filter(suggestion => 
      suggestion.toLowerCase().includes(text.toLowerCase()) || text.length < 3
    ).slice(0, 3);
  };
  
  useEffect(() => {
    if (input.length > 2) {
      const newSuggestions = generateSuggestions(input, context);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
      setSelectedIndex(-1);
    } else {
      setShowSuggestions(false);
    }
  }, [input, context]);
  
  const handleSuggestionClick = (suggestion) => {
    onSuggestion(suggestion);
    setShowSuggestions(false);
  };
  
  const handleKeyDown = (e) => {
    if (!showSuggestions) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev <= 0 ? suggestions.length - 1 : prev - 1);
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };
  
  return (
    <div className="relative">
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-50 mt-2 max-h-64 overflow-y-auto"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-2">
              <div className="flex items-center text-xs text-gray-500 mb-2 px-2">
                <span className="mr-2">🤖</span>
                AI Suggestions for {context}
              </div>
              
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedIndex === index 
                      ? 'bg-blue-500 text-white' 
                      : 'hover:bg-gray-100 text-gray-800'
                  }`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <p className="text-sm leading-relaxed">{suggestion}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const RealTimeAISuggestions = ({ content, onContentUpdate, sectionType = 'general' }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalyzedContent, setLastAnalyzedContent] = useState('');
  const [showTypewriter, setShowTypewriter] = useState(false);
  const analysisTimeout = useRef(null);
  
  // Mock AI analysis - in real app, this would call your AI service
  const analyzeContent = async (text) => {
    if (text === lastAnalyzedContent || text.length < 20) return;
    
    setIsAnalyzing(true);
    setLastAnalyzedContent(text);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const improvementSuggestions = [
      'Consider adding specific metrics and numbers to quantify your achievements',
      'Use stronger action verbs like "spearheaded", "orchestrated", or "architected" instead of basic verbs',
      'Include the business impact or results of your work to demonstrate value',
      'Mention the technologies, frameworks, or tools you used in this role',
      'Add team size or project scope to provide context for your leadership experience'
    ];
    
    // Filter suggestions based on content analysis
    const relevantSuggestions = improvementSuggestions
      .filter(() => Math.random() > 0.3) // Randomly select some suggestions
      .slice(0, 3);
    
    setSuggestions(relevantSuggestions);
    setIsAnalyzing(false);
    setShowTypewriter(true);
  };
  
  useEffect(() => {
    if (analysisTimeout.current) {
      clearTimeout(analysisTimeout.current);
    }
    
    analysisTimeout.current = setTimeout(() => {
      analyzeContent(content);
    }, 2000); // Analyze after user stops typing for 2 seconds
    
    return () => {
      if (analysisTimeout.current) {
        clearTimeout(analysisTimeout.current);
      }
    };
  }, [content]);
  
  const handleAcceptSuggestion = (suggestion) => {
    // Integrate suggestion into content
    const enhancedContent = content + '\n\n' + suggestion;
    onContentUpdate(enhancedContent);
    
    // Remove the accepted suggestion
    setSuggestions(prev => prev.filter(s => s !== suggestion));
  };
  
  const handleDismissSuggestion = (suggestionToDismiss) => {
    setSuggestions(prev => prev.filter(s => s !== suggestionToDismiss));
  };
  
  const dismissAllSuggestions = () => {
    setSuggestions([]);
    setShowTypewriter(false);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-bold text-lg flex items-center">
            <motion.span 
              className="mr-3"
              animate={{ rotate: isAnalyzing ? 360 : 0 }}
              transition={{ duration: 1, repeat: isAnalyzing ? Infinity : 0, ease: "linear" }}
            >
              🧠
            </motion.span>
            AI Writing Assistant
          </h3>
          
          {suggestions.length > 0 && (
            <motion.button
              onClick={dismissAllSuggestions}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Dismiss All
            </motion.button>
          )}
        </div>
      </div>
      
      {/* Analysis Status */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            className="bg-blue-50 border-b border-blue-200 p-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center">
              <motion.div
                className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3"
              />
              <span className="text-blue-700 font-medium">Analyzing your content...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Suggestions */}
      <div className="p-4">
        <AnimatePresence>
          {suggestions.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <span className="mr-2">💡</span>
                  Smart Suggestions ({suggestions.length})
                </h4>
                <p className="text-sm text-gray-600">
                  AI has analyzed your content and found ways to improve it
                </p>
              </div>
              
              {showTypewriter && suggestions.map((suggestion, index) => (
                <TypewriterSuggestion
                  key={`${suggestion}-${index}`}
                  suggestion={suggestion}
                  onAccept={handleAcceptSuggestion}
                  onDismiss={() => handleDismissSuggestion(suggestion)}
                  delay={index * 500}
                />
              ))}
            </motion.div>
          ) : !isAnalyzing && content.length > 0 ? (
            <motion.div
              className="text-center py-8 text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-4xl mb-2">👍</div>
              <p className="font-medium">Looking good!</p>
              <p className="text-sm">Keep writing for more AI suggestions</p>
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-8 text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-4xl mb-2">✍️</div>
              <p className="font-medium">Start writing to get AI suggestions</p>
              <p className="text-sm">I'll help improve your content as you type</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export { TypewriterSuggestion, SmartAutocomplete, RealTimeAISuggestions };