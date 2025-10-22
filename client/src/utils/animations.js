// Page transitions with spring animations
export const pageVariants = {
  initial: {
    opacity: 0,
    x: "-100vw",
    scale: 0.8
  },
  in: {
    opacity: 1,
    x: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    x: "100vw",
    scale: 1.2
  }
};

export const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

// Staggered animations for cards
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
};

export const cardVariants = {
  hidden: { 
    y: 20, 
    opacity: 0,
    scale: 0.9
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 200
    }
  }
};

// Magnetic hover effects
export const magneticVariants = {
  hover: {
    scale: 1.05,
    rotate: [0, -1, 1, 0],
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 10
    }
  }
};

// Loading animations
export const loadingVariants = {
  start: {
    scale: [1, 1.2, 1],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Button micro-interactions
export const buttonVariants = {
  idle: { scale: 1 },
  hover: { 
    scale: 1.05,
    boxShadow: "0px 10px 30px rgba(0,0,0,0.2)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 17
    }
  },
  tap: { 
    scale: 0.95,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 17
    }
  }
};

// Smooth state transitions
export const smoothTransition = {
  type: "spring",
  stiffness: 700,
  damping: 30
};