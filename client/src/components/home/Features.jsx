import { Zap } from 'lucide-react';
import React from 'react'
import Title from './Title';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { containerVariants, cardVariants, magneticVariants } from '../../utils/animations';

// Features
// This component highlights product capabilities and acts as a content-rich
// section on the landing page. It intentionally keeps interactions simple
// (hover states, grouped cards) and uses semantic headings so recruiters can
// quickly scan the offerings.
const Features = () => {
    // track hover state to toggle subtle visual emphasis on the grouped cards
    const [isHover, setIsHover] = React.useState(false);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });
    
  return (
    <motion.div 
        id='features' 
        className='flex flex-col items-center my-10 scroll-mt-12'
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
    >

    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-400/10 rounded-full px-6 py-1.5">
        <Zap width={14}/>
        <span>Simple Process</span>
    </div>
    <Title title='Build your resume' description='Our streamlined process helps you create a professional resume in minutes with intelligent AI-powered tools and features.'/>

            <div className="flex flex-col md:flex-row items-center xl:-mt-10">
                <img className="max-w-2xl w-full xl:-ml-32" src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/group-image-1.png" alt="Product features illustration" />
                {/* card group: hover toggles a subtle emphasis. Keep interactive
                    affordances keyboard-friendly (consider also adding focus handlers
                    if these become actionable). */}
                <motion.div 
                    className="px-4 md:px-0" 
                    onMouseEnter={() => setIsHover(true)} 
                    onMouseLeave={() => setIsHover(false)}
                    variants={containerVariants}
                >
                    <motion.div 
                        className={"flex items-center justify-center gap-6 max-w-md group cursor-pointer"}
                        variants={cardVariants}
                        whileHover="hover"
                    >
                        <motion.div 
                            className={`p-6 group-hover:bg-violet-100 border border-transparent group-hover:border-violet-300 flex gap-4 rounded-xl transition-colors backdrop-blur-sm ${!isHover ? 'border-violet-300 bg-violet-100' : ''}`}
                            variants={magneticVariants}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6 stroke-violet-600"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" /><circle cx="16.5" cy="7.5" r=".5" fill="currentColor" /></svg>
                            <div className="space-y-2">
                                {/* Title and description: short, scannable copy for recruiters */}
                                <h3 className="text-base font-semibold text-slate-700">Real-Time Analytics</h3>
                                <p className="text-sm text-slate-600 max-w-xs">Get instant insights into your finances with live dashboards.</p>
                            </div>
                        </motion.div>
                    </motion.div>
                    
                    <motion.div 
                        className="flex items-center justify-center gap-6 max-w-md group cursor-pointer"
                        variants={cardVariants}
                        whileHover="hover"
                    >
                        <motion.div 
                            className="p-6 group-hover:bg-green-100 border border-transparent group-hover:border-green-300 flex gap-4 rounded-xl transition-colors backdrop-blur-sm"
                            variants={magneticVariants}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6 stroke-green-600"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" /></svg>
                            <div className="space-y-2">
                                {/* Security blurb — short and focused on trust signals */}
                                <h3 className="text-base font-semibold text-slate-700">AI-Powered Enhancement</h3>
                                <p className="text-sm text-slate-600 max-w-xs">Transform bland bullet points into compelling achievements with quantified impact.</p>
                            </div>
                        </motion.div>
                    </motion.div>
                    
                    <motion.div 
                        className="flex items-center justify-center gap-6 max-w-md group cursor-pointer"
                        variants={cardVariants}
                        whileHover="hover"
                    >
                        <motion.div 
                            className="p-6 group-hover:bg-orange-100 border border-transparent group-hover:border-orange-300 flex gap-4 rounded-xl transition-colors backdrop-blur-sm"
                            variants={magneticVariants}
                        >
                            <svg className="size-6 stroke-orange-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15V3" /><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5" /></svg>
                            <div className="space-y-2">
                                {/* Export & reporting — mention formats supported and print rules
                                    should a recruiter need to validate print fidelity. */}
                                <h3 className="text-base font-semibold text-slate-700">ATS-Optimized Templates</h3>
                                <p className="text-sm text-slate-600 max-w-xs">Professional templates designed for both ATS parsing and human readability.</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            
                * {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>
        </motion.div>
  )
}

export default Features
