import { Zap } from 'lucide-react';
import React from 'react'
import Title from './Title';

const Features = () => {
  return (
    <div id='features' className='flex flex-col items-center my-10 scroll-mt-12'>

    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-400/10 rounded-full px-6 py-1.5">
        <Zap width={14}/>
        <span>Simple Process</span>
    </div>
    <Title title='Build your resume' description='Our streamlined process helps you create a professional resume in minutes with intelligent AI-powered tools and features.'/>

            <div className="flex flex-col md:flex-row items-center xl:-mt-10 gap-6">
                <img className="max-w-2xl w-full xl:-ml-32 rounded-xl shadow-lg" src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/group-image-1.png" alt="Product features illustration" />
                <div className="px-4 md:px-0">
                    <div className="flex flex-col gap-4" >
                        {[{
                            title: 'Real-Time Analytics',
                            desc: 'Get instant insights into your resume performance with live tips and score.',
                            color: 'violet'
                        },{
                            title: 'Privacy-first',
                            desc: 'Your data stays local unless you choose to save it to your account.',
                            color: 'green'
                        },{
                            title: 'Customizable Templates',
                            desc: 'Pick a template and tweak typography, spacing and colors for each section.',
                            color: 'orange'
                        }].map((f) => (
                            <div key={f.title} className="group relative">
                                <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center opacity-80">
                                    <div className="arrow-tab bg-white rounded-full shadow-md p-2 transform transition-all duration-300 group-hover:scale-110">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`stroke-${f.color}-600`}>
                                            <path d="M5 12h14" />
                                            <path d="M12 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>

                                <div className={`p-6 bg-white border border-transparent rounded-xl shadow-sm transform transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-105 hover:shadow-lg`}>
                                    <div className="flex items-start gap-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${f.color}-50 text-${f.color}-600`}> 
                                            {/* icon placeholder */}
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`stroke-${f.color}-600`}>
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-base font-semibold text-slate-800">{f.title}</h3>
                                            <p className="text-sm text-slate-600 max-w-md">{f.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            
                * {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>
        </div>
  )
}

export default Features
