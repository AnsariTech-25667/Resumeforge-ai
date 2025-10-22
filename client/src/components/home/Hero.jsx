import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

// TypewriterText Component
const TypewriterText = ({ text }) => {
    const [displayText, setDisplayText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, 50);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, text]);

    return <span>{displayText}<span className="animate-pulse">|</span></span>;
};

// FloatingResumeCard Component
const FloatingResumeCard = ({ delay = 0, children, className = "" }) => {
    return (
        <motion.div
            className={`absolute bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-lg ${className}`}
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                rotateY: [0, 5, -5, 0],
            }}
            transition={{ 
                duration: 0.8, 
                delay,
                rotateY: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            whileHover={{ 
                scale: 1.05, 
                rotateY: 10,
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
            }}
        >
            {children}
        </motion.div>
    );
};

// Hero component — landing header and primary CTAs
// Keep this file focused on presentation and light interactions; heavy logic
// belongs in the app shell or dedicated hooks for testability.
const Hero = () => {

    // current user (if logged in) — used to toggle CTAs
    const {user} = useSelector(state => state.auth)

    // mobile menu state
    const [menuOpen, setMenuOpen] = React.useState(false);

    const logos = [
        'https://saasly.prebuiltui.com/assets/companies-logo/instagram.svg',
        'https://saasly.prebuiltui.com/assets/companies-logo/framer.svg',
        'https://saasly.prebuiltui.com/assets/companies-logo/microsoft.svg',
        'https://saasly.prebuiltui.com/assets/companies-logo/huawei.svg',
        'https://saasly.prebuiltui.com/assets/companies-logo/walmart.svg',
    ]

  return (
    <>
    <div className="min-h-screen pb-20">
        {/* Navbar */}
        <nav className="z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-40 text-sm">
            <a href="https://prebuiltui.com">
                                <div className="flex items-center gap-3">
                                    <img src="/logo.svg" alt="Maaz Ansari logo" className="h-11 w-auto"/>
                                    <div className="text-sm">
                                        <div className="font-semibold">Maaz Ansari</div>
                                        <div className="text-xs text-slate-500">Resume Builder</div>
                                    </div>
                                </div>
            </a>

            <div className="hidden md:flex items-center gap-8 transition duration-500 text-slate-800">
                <a href="#" className="hover:text-green-600 transition">Home</a>
                <a href="#features" className="hover:text-green-600 transition">Features</a>
                <a href="#testimonials" className="hover:text-green-600 transition">Testimonials</a>
                <a href="#cta" className="hover:text-green-600 transition">Contact</a>
            </div>

            <div className="flex gap-2">
                <Link to='/app?state=register' className="hidden md:block px-6 py-2 bg-green-500 hover:bg-green-700 active:scale-95 transition-all rounded-full text-white" hidden={user}>
                    Get started
                </Link>
                <Link to='/app?state=login' className="hidden md:block px-6 py-2 border active:scale-95 hover:bg-slate-50 transition-all rounded-full text-slate-700 hover:text-slate-900" hidden={user}>
                    Login
                </Link>
                <Link to='/app' className='hidden md:block px-8 py-2 bg-green-500 hover:bg-green-700 active:scale-95 transition-all rounded-full text-white' hidden={!user}>
                    Dashboard
                </Link>
            </div>

            <button onClick={() => setMenuOpen(true)} className="md:hidden active:scale-90 transition" >
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" className="lucide lucide-menu" >
                    <path d="M4 5h16M4 12h16M4 19h16" />
                </svg>
            </button>
        </nav>

        {/* Mobile Menu */}
        <div className={`fixed inset-0 z-[100] bg-black/40 text-black backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`} >
            <a href="#" className="text-white">Home</a>
            <a href="#features" className="text-white">Features</a>
            <a href="#testimonials" className="text-white">Testimonials</a>
            <a href="#contact" className="text-white">Contact</a>
            <button onClick={() => setMenuOpen(false)} className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-green-600 hover:bg-green-700 transition text-white rounded-md flex" >
                X
            </button>
        </div>

        {/* Hero Section */}
        <div className="relative flex flex-col items-center justify-center text-sm px-4 md:px-16 lg:px-24 xl:px-40 text-black overflow-hidden">
            {/* Animated Gradient Background */}
            <motion.div 
                className="absolute inset-0 -z-20"
                animate={{
                    background: [
                        "linear-gradient(45deg, #06b6d4 0%, #10b981 25%, #3b82f6 50%, #8b5cf6 75%, #06b6d4 100%)",
                        "linear-gradient(45deg, #10b981 0%, #3b82f6 25%, #8b5cf6 50%, #06b6d4 75%, #10b981 100%)",
                        "linear-gradient(45deg, #3b82f6 0%, #8b5cf6 25%, #06b6d4 50%, #10b981 75%, #3b82f6 100%)"
                    ]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-0 -z-10 bg-white/90 backdrop-blur-sm"></div>
            
            {/* Floating Particles */}
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full opacity-20"
                    animate={{
                        x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                        y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
                    }}
                    transition={{
                        duration: Math.random() * 10 + 10,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    style={{
                        left: Math.random() * 100 + '%',
                        top: Math.random() * 100 + '%'
                    }}
                />
            ))}
            
            <div className="absolute top-28 xl:top-10 -z-10 left-1/4 size-72 sm:size-96 xl:size-120 2xl:size-132 bg-green-300 blur-[100px] opacity-30"></div>

            {/* Avatars + Stars */}
            <div className="flex items-center mt-24">
                <div className="flex -space-x-3 pr-3">
                    <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200" alt="user3" className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-[1]" />
                    <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200" alt="user1" className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-2" />
                    <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200" alt="user2" className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-[3]" />
                    <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200" alt="user3" className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-[4]" />
                    <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="user5" className="size-8 rounded-full border-2 border-white hover:-translate-y-0.5 transition z-[5]" />
                </div>

                <div>
                    <div className="flex ">
                        {Array(5).fill(0).map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star text-transparent fill-green-600" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>
                        ))}
                    </div>
                    <p className="text-sm text-gray-700">
                        Used by 10,000+ users
                    </p>
                </div>
            </div>

            {/* Headline + CTA */}
            {/* Use short headline and gradient emphasis to attract attention —
                keep the sentence concise for recruiter eyes (they scan quickly). */}
            <motion.h1 
                className="text-5xl md:text-6xl font-semibold max-w-5xl text-center mt-4 md:leading-[70px]"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                Land your dream job with <motion.span 
                    className="bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent text-nowrap"
                    animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    AI-powered 
                </motion.span> resumes.
            </motion.h1>

            {/* Short elevator pitch to reinforce the CTA. */}
            <motion.p 
                className="max-w-md text-center text-base my-7"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
            >
                <TypewriterText text="Create, edit and download professional resumes with AI-powered assistance." />
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
                className="flex items-center gap-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
            >
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Link to='/ai-dashboard' className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-full px-9 h-12 m-1 ring-offset-2 ring-1 ring-cyan-400 flex items-center transition-all shadow-lg hover:shadow-xl">
                        🧠 AI Visualization
                        <motion.svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="24" height="24" viewBox="0 0 24 24" 
                            fill="none" stroke="currentColor" strokeWidth="2" 
                            strokeLinecap="round" strokeLinejoin="round" 
                            className="lucide lucide-arrow-right ml-1 size-4" 
                            aria-hidden="true"
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            <path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path>
                        </motion.svg>
                    </Link>
                </motion.div>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Link to='/live-editor' className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-full px-9 h-12 m-1 ring-offset-2 ring-1 ring-purple-400 flex items-center transition-all shadow-lg hover:shadow-xl">
                        ⚡ Live Editor
                        <motion.svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="24" height="24" viewBox="0 0 24 24" 
                            fill="none" stroke="currentColor" strokeWidth="2" 
                            strokeLinecap="round" strokeLinejoin="round" 
                            className="lucide lucide-arrow-right ml-1 size-4" 
                            aria-hidden="true"
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            <path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path>
                        </motion.svg>
                    </Link>
                </motion.div>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Link to='/app' className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full px-9 h-12 m-1 ring-offset-2 ring-1 ring-green-400 flex items-center transition-all shadow-lg hover:shadow-xl">
                        Get started
                        <motion.svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="24" height="24" viewBox="0 0 24 24" 
                            fill="none" stroke="currentColor" strokeWidth="2" 
                            strokeLinecap="round" strokeLinejoin="round" 
                            className="lucide lucide-arrow-right ml-1 size-4" 
                            aria-hidden="true"
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            <path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path>
                        </motion.svg>
                    </Link>
                </motion.div>
                <motion.button 
                    className="flex items-center gap-2 border border-slate-400 hover:bg-green-50 transition rounded-full px-7 h-12 text-slate-700 backdrop-blur-md bg-white/10 hover:bg-white/20"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-video size-5" aria-hidden="true"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"></path><rect x="2" y="6" width="14" height="12" rx="2"></rect></svg>
                    <span>Try demo</span>
                </motion.button>
            </motion.div>

            <p className="py-6 text-slate-600 mt-14">Trusted by professionals worldwide</p>

            <div className="flex items-center gap-4 mt-6">
              <div className='text-sm text-slate-500'>Designed & built by <span className='font-semibold text-emerald-600'>Maaz Ansari</span></div>
              <div className='h-0.5 w-8 bg-emerald-200 rounded' />
              <div className='text-xs text-slate-400'>Beautifully crafted UI • Clean resume templates</div>
            </div>

            <motion.div 
                className="flex flex-wrap justify-center gap-6 max-w-3xl w-full mx-auto py-4" 
                id="logo-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
            >
                {logos.map((logo, index) => (
                    <motion.img 
                        key={index} 
                        src={logo} 
                        alt={`partner-${index}`} 
                        className="h-6 w-auto max-w-xs grayscale hover:grayscale-0 transition-all duration-300" 
                        whileHover={{ scale: 1.1 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                    />
                ))}
            </motion.div>

            {/* Floating Resume Cards */}
            <FloatingResumeCard delay={1.5} className="top-32 left-8 w-48 hidden lg:block">
                <div className="text-xs text-gray-600 mb-2">Before AI Enhancement</div>
                <div className="text-sm font-medium mb-1">• Managed team projects</div>
                <div className="text-sm font-medium mb-1">• Worked with databases</div>
                <div className="text-sm font-medium">• Developed applications</div>
            </FloatingResumeCard>

            <FloatingResumeCard delay={2} className="top-40 right-8 w-48 hidden lg:block">
                <div className="text-xs text-emerald-600 mb-2">✨ AI Enhanced</div>
                <div className="text-sm font-medium mb-1">• Led cross-functional team of 8 developers, delivering 15+ projects 40% faster</div>
                <div className="text-sm font-medium mb-1">• Architected PostgreSQL database system, reducing query time by 60%</div>
                <div className="text-sm font-medium">• Built scalable React applications serving 10K+ daily users</div>
            </FloatingResumeCard>

            {/* Interactive Code Snippet */}
            <motion.div
                className="absolute bottom-20 left-16 w-64 bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs hidden xl:block"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 2.5 }}
            >
                <div className="text-gray-500 mb-2">// AI Resume Enhancement</div>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, delay: 3 }}
                    className="overflow-hidden"
                >
                    <div>const enhance = (resume) => {'{'}</div>
                    <div>  return ai.optimize(resume)</div>
                    <div>    .addMetrics()</div>
                    <div>    .improveImpact()</div>
                    <div>    .atsOptimize();</div>
                    <div>{'}'}</div>
                </motion.div>
            </motion.div>
        </div>
    </div>
    <style>
        {`
            @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

            * {
                font-family: 'Poppins', sans-serif;
            }
        `}
    </style>
    </>
  )
}

export default Hero
