import React from 'react'

const About = () => {
  return (
    <div className='max-w-4xl mx-auto py-12 px-6'>
      <h1 className='text-4xl font-bold mb-4'>About this project</h1>
      <p className='text-lg text-slate-700 mb-6'>This Resume Builder is a custom-built, polished tool designed to help professionals create modern, ATS-friendly resumes quickly. It combines manual editing with AI-assisted enhancements.</p>

      <div className='bg-white p-6 rounded-lg shadow-sm border'>
        <h2 className='text-2xl font-semibold mb-2'>Designed & Built by</h2>
        <div className='flex items-center gap-4'>
          <div className='h-14 w-14 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold'>MA</div>
          <div>
            <div className='text-lg font-semibold'>Maaz Ansari</div>
            <div className='text-sm text-slate-500'>Full Stack Developer • UI/UX Enthusiast</div>
            <div className='mt-2 text-sm'><a href="https://maazansari.example.com" className='text-green-600 hover:underline'>maazansari.example.com</a> • <a href="mailto:maaz.ansari@example.com" className='text-green-600 hover:underline'>maaz.ansari@example.com</a></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
