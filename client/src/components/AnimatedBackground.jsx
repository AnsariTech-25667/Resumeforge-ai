import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden">
      {/* Animated Gradient Background */}
      <motion.div 
        className="absolute inset-0"
        animate={{
          background: [
            "linear-gradient(45deg, #06b6d4 0%, #10b981 25%, #3b82f6 50%, #8b5cf6 75%, #06b6d4 100%)",
            "linear-gradient(45deg, #10b981 0%, #3b82f6 25%, #8b5cf6 50%, #06b6d4 75%, #10b981 100%)",
            "linear-gradient(45deg, #3b82f6 0%, #8b5cf6 25%, #06b6d4 50%, #10b981 75%, #3b82f6 100%)"
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
      
      {/* Floating geometric shapes */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute opacity-10"
          animate={{
            x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
            y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
            rotate: [0, 360],
            scale: [0.5, 1.5, 0.5]
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%'
          }}
        >
          {i % 3 === 0 ? (
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
          ) : i % 3 === 1 ? (
            <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rotate-45" />
          ) : (
            <div className="w-4 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default AnimatedBackground;