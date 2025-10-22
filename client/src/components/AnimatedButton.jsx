import React from 'react';
import { motion } from 'framer-motion';
import { buttonVariants, magneticVariants } from '../utils/animations';

// Enhanced button with micro-interactions
const AnimatedButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  onClick,
  disabled = false,
  ...props 
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white shadow-lg',
    secondary: 'bg-white border-2 border-gray-300 text-gray-700 hover:border-emerald-500 hover:text-emerald-600',
    ghost: 'bg-transparent text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <motion.button
      className={`
        ${variants[variant]} 
        ${sizes[size]} 
        rounded-full font-semibold transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        backdrop-blur-sm relative overflow-hidden
        ${className}
      `}
      variants={buttonVariants}
      initial="idle"
      whileHover={!disabled ? "hover" : "idle"}
      whileTap={!disabled ? "tap" : "idle"}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{
          x: ['-100%', '100%']
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3
        }}
      />
      
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

// Magnetic card component
export const MagneticCard = ({ children, className = '', ...props }) => {
  return (
    <motion.div
      className={`
        bg-white/10 backdrop-blur-md border border-white/20 
        rounded-xl p-6 shadow-lg cursor-pointer
        ${className}
      `}
      variants={magneticVariants}
      whileHover="hover"
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Floating action button with pulse animation
export const FloatingActionButton = ({ children, className = '', ...props }) => {
  return (
    <motion.button
      className={`
        fixed bottom-8 right-8 w-14 h-14 
        bg-gradient-to-r from-emerald-500 to-blue-600 
        text-white rounded-full shadow-lg
        flex items-center justify-center
        ${className}
      `}
      animate={{
        scale: [1, 1.1, 1],
        boxShadow: [
          '0 0 0 0 rgba(16, 185, 129, 0.4)',
          '0 0 0 10px rgba(16, 185, 129, 0)',
          '0 0 0 0 rgba(16, 185, 129, 0)'
        ]
      }}
      transition={{
        duration: 2,
        repeat: Infinity
      }}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default AnimatedButton;