import React from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import AnimatedButton from '../AnimatedButton'

const CallToAction = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div 
      id='cta' 
      className='border-y border-dashed border-slate-200 w-full max-w-5xl mx-auto px-10 sm:px-16 mt-28'
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div 
        className="flex flex-col md:flex-row text-center md:text-left items-center justify-between gap-8 px-3 md:px-10 border-x border-dashed border-slate-200 py-16 sm:py-20 -mt-10 -mb-10 w-full backdrop-blur-sm bg-white/50"
        animate={isInView ? {
          boxShadow: [
            '0 0 0 0 rgba(16, 185, 129, 0.1)',
            '0 0 30px 10px rgba(16, 185, 129, 0.1)',
            '0 0 0 0 rgba(16, 185, 129, 0.1)'
          ]
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.p 
          className="text-xl font-medium max-w-md text-slate-800"
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Ready to land your dream job with an AI-powered resume that stands out?
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <AnimatedButton 
            variant="primary" 
            size="lg"
            className="flex items-center gap-2"
          >
            <span>Get Started Free</span>
            <motion.svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="size-4.5"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </motion.svg>
          </AnimatedButton>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default CallToAction
