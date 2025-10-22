import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

const SmartFormAutoComplete = ({ onSuggestionSelect, formData, fieldName, placeholder, value, onChange }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const suggestionRefs = useRef([]);
  const debounceTimer = useRef(null);

  // ML-powered suggestion engine (simulated)
  const mlSuggestions = {
    jobTitle: [
      'Senior Full Stack Developer',
      'Software Engineer',
      'Frontend Developer',
      'Backend Developer',
      'DevOps Engineer',
      'Data Scientist',
      'Product Manager',
      'UI/UX Designer',
      'Machine Learning Engineer',
      'Cloud Architect'
    ],
    company: [
      'Google',
      'Microsoft',
      'Amazon',
      'Apple',
      'Meta',
      'Netflix',
      'Tesla',
      'Spotify',
      'Airbnb',
      'Uber'
    ],
    skills: [
      'React.js',
      'Node.js',
      'TypeScript',
      'Python',
      'AWS',
      'Docker',
      'Kubernetes',
      'MongoDB',
      'PostgreSQL',
      'GraphQL',
      'Machine Learning',
      'Data Analysis',
      'Project Management',
      'Agile Methodologies'
    ],
    education: [
      'Bachelor of Science in Computer Science',
      'Master of Science in Software Engineering',
      'Bachelor of Engineering in Information Technology',
      'Master of Business Administration',
      'Bachelor of Science in Data Science',
      'Master of Science in Artificial Intelligence'
    ],
    achievements: [
      'Increased system performance by 40% through optimization',
      'Led a team of 8 developers to deliver project ahead of schedule',
      'Implemented CI/CD pipeline reducing deployment time by 60%',
      'Developed microservices architecture serving 1M+ users',
      'Reduced technical debt by 35% through code refactoring',
      'Launched feature that increased user engagement by 25%'
    ]
  };

  // Context-aware suggestion generation
  const generateContextualSuggestions = (input, field) => {
    const suggestions = mlSuggestions[field] || [];
    const filtered = suggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(input.toLowerCase())
    );

    // Add personalized suggestions based on existing form data
    const personalizedSuggestions = [];
    
    if (field === 'achievements' && formData.jobTitle) {
      personalizedSuggestions.push(
        `Led ${formData.jobTitle.toLowerCase()} initiatives that delivered measurable results`,
        `Mentored junior developers in ${formData.jobTitle.toLowerCase()} best practices`,
        `Architected scalable solutions as ${formData.jobTitle}`
      );
    }

    if (field === 'skills' && formData.company) {
      personalizedSuggestions.push(
        'Large-scale system design',
        'Performance optimization',
        'Team leadership',
        'Cross-functional collaboration'
      );
    }

    return [...new Set([...personalizedSuggestions, ...filtered])].slice(0, 8);
  };

  // Debounced suggestion fetching
  const fetchSuggestions = (input) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      if (input.length > 2) {
        setIsLoading(true);
        // Simulate API call delay
        setTimeout(() => {
          const newSuggestions = generateContextualSuggestions(input, fieldName);
          setSuggestions(newSuggestions);
          setIsLoading(false);
          setIsOpen(newSuggestions.length > 0);
        }, 300);
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    }, 150);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    fetchSuggestions(newValue);
    setSelectedIndex(-1);
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
      case 'Tab':
        if (selectedIndex >= 0) {
          e.preventDefault();
          handleSuggestionSelect(suggestions[selectedIndex]);
        }
        break;
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion) => {
    onChange(suggestion);
    onSuggestionSelect?.(suggestion, fieldName);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && suggestionRefs.current[selectedIndex]) {
      suggestionRefs.current[selectedIndex].scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [selectedIndex]);

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => value.length > 2 && fetchSuggestions(value)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pr-10"
          aria-label={`${fieldName} input with smart suggestions`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          role="combobox"
        />
        
        {/* Smart indicator */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {isLoading ? (
            <motion.div
              className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          ) : (
            <motion.div
              className={`w-2 h-2 rounded-full ${
                suggestions.length > 0 ? 'bg-green-400' : 'bg-gray-300'
              }`}
              animate={{ scale: suggestions.length > 0 ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </div>
      </div>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            role="listbox"
            aria-label="Smart suggestions"
          >
            {/* Header */}
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center space-x-2">
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="text-sm"
              >
                🧠
              </motion.span>
              <span className="text-xs font-medium text-gray-600">
                AI-Powered Suggestions
              </span>
              <div className="text-xs text-gray-500">
                {suggestions.length} matches
              </div>
            </div>

            {/* Suggestions list */}
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                ref={el => suggestionRefs.current[index] = el}
                className={`px-4 py-3 cursor-pointer transition-colors border-l-2 ${
                  index === selectedIndex
                    ? 'bg-blue-50 border-blue-500 text-blue-800'
                    : 'border-transparent hover:bg-gray-50'
                }`}
                onClick={() => handleSuggestionSelect(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                role="option"
                aria-selected={index === selectedIndex}
              >
                <div className="flex items-center space-x-3">
                  <motion.span
                    className="text-lg"
                    whileHover={{ scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {index === selectedIndex ? '✨' : '💡'}
                  </motion.span>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">
                      {suggestion}
                    </div>
                    {index < 3 && (
                      <div className="text-xs text-blue-600 mt-1 flex items-center">
                        <span className="mr-1">🎯</span>
                        AI Recommended
                      </div>
                    )}
                  </div>
                  {index === selectedIndex && (
                    <motion.div
                      className="text-xs text-gray-500 flex items-center space-x-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <span>↵</span>
                      <span>Enter</span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Footer with shortcuts */}
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <kbd className="px-1 py-0.5 bg-white border border-gray-300 rounded">↑↓</kbd>
                    <span>Navigate</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <kbd className="px-1 py-0.5 bg-white border border-gray-300 rounded">↵</kbd>
                    <span>Select</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <kbd className="px-1 py-0.5 bg-white border border-gray-300 rounded">Esc</kbd>
                    <span>Close</span>
                  </div>
                </div>
                <motion.div
                  className="text-green-600"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ⚡ Smart Complete
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartFormAutoComplete;