import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LivePreviewGenerator = ({ content, template, isGenerating }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [previewScale, setPreviewScale] = useState(0.6);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const canvasRef = useRef(null);

  const templates = {
    modern: {
      primaryColor: '#2563EB',
      accentColor: '#3B82F6',
      textColor: '#1F2937',
      backgroundColor: '#FFFFFF',
      headerBg: 'linear-gradient(135deg, #2563EB, #3B82F6)'
    },
    classic: {
      primaryColor: '#374151',
      accentColor: '#6B7280',
      textColor: '#111827',
      backgroundColor: '#FFFFFF',
      headerBg: 'linear-gradient(135deg, #374151, #6B7280)'
    },
    creative: {
      primaryColor: '#7C3AED',
      accentColor: '#A855F7',
      textColor: '#581C87',
      backgroundColor: '#FFFFFF',
      headerBg: 'linear-gradient(135deg, #7C3AED, #A855F7)'
    },
    minimal: {
      primaryColor: '#059669',
      accentColor: '#10B981',
      textColor: '#065F46',
      backgroundColor: '#FFFFFF',
      headerBg: 'linear-gradient(135deg, #059669, #10B981)'
    },
    executive: {
      primaryColor: '#DC2626',
      accentColor: '#EF4444',
      textColor: '#7F1D1D',
      backgroundColor: '#FFFFFF',
      headerBg: 'linear-gradient(135deg, #DC2626, #EF4444)'
    }
  };

  const currentTemplate = templates[template] || templates.modern;

  // Simulate PDF generation
  const generatePDF = async () => {
    setIsDownloading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Create a mock PDF URL (in real app, this would be from your backend)
    const mockPdfUrl = URL.createObjectURL(new Blob(['Mock PDF content'], { type: 'application/pdf' }));
    setPdfUrl(mockPdfUrl);
    
    setIsDownloading(false);
  };

  const downloadPDF = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'enhanced-resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const ResumePreview = ({ isFullscreen = false }) => (
    <motion.div
      className={`bg-white shadow-xl ${isFullscreen ? 'w-full h-full' : 'w-full'} overflow-hidden`}
      style={{
        aspectRatio: isFullscreen ? 'auto' : '8.5/11',
        transform: isFullscreen ? 'none' : `scale(${previewScale})`,
        transformOrigin: 'top center'
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div 
        className="p-8 text-white"
        style={{ background: currentTemplate.headerBg }}
      >
        <motion.h1 
          className="text-4xl font-bold mb-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          Maaz Ansari
        </motion.h1>
        <motion.p 
          className="text-xl opacity-90"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          Senior Full Stack Developer
        </motion.p>
        <motion.div 
          className="flex flex-wrap gap-4 mt-4 text-sm opacity-80"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <span>📧 maazansari25667@gmail.com</span>
          <span>📱 +91 95116 70380</span>
          <span>📍 Pune, India</span>
        </motion.div>
      </div>

      {/* Content */}
      <div style={{ color: currentTemplate.textColor }} className="p-8">
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Loading skeleton */}
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className={`h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse`} 
                       style={{ width: `${Math.random() * 40 + 60}%` }} />
                  <div className={`h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse`} 
                       style={{ width: `${Math.random() * 30 + 70}%` }} />
                  <div className={`h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse`} 
                       style={{ width: `${Math.random() * 50 + 50}%` }} />
                </div>
              ))}
            </motion.div>
          ) : content ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Professional Summary */}
              <section>
                <h2 className="text-2xl font-bold mb-3 pb-2 border-b-2" 
                    style={{ borderColor: currentTemplate.accentColor }}>
                  Professional Summary
                </h2>
                <div className="whitespace-pre-wrap leading-relaxed">
                  {content.split('\n').slice(0, 3).join('\n')}
                </div>
              </section>

              {/* Experience */}
              <section>
                <h2 className="text-2xl font-bold mb-3 pb-2 border-b-2" 
                    style={{ borderColor: currentTemplate.accentColor }}>
                  Experience
                </h2>
                <div className="space-y-4">
                  {content.split('\n').slice(3, 8).map((line, index) => (
                    <motion.div 
                      key={index}
                      className="bg-gray-50 p-4 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-start">
                        <div className="w-2 h-2 rounded-full mt-2 mr-3" 
                             style={{ backgroundColor: currentTemplate.accentColor }} />
                        <p className="flex-1">{line}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Skills */}
              <section>
                <h2 className="text-2xl font-bold mb-3 pb-2 border-b-2" 
                    style={{ borderColor: currentTemplate.accentColor }}>
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Node.js', 'Python', 'AWS', 'MongoDB', 'TypeScript'].map((skill, index) => (
                    <motion.span
                      key={skill}
                      className="px-3 py-1 rounded-full text-sm font-medium text-white"
                      style={{ backgroundColor: currentTemplate.accentColor }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </section>
            </motion.div>
          ) : (
            <motion.div 
              className="text-center text-gray-400 italic py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-6xl mb-4">📄</div>
              <p>Your enhanced resume will appear here...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-bold text-xl flex items-center">
            <span className="w-3 h-3 bg-white rounded-full mr-3"></span>
            Live Preview
          </h2>
          
          <div className="flex items-center gap-2">
            {/* Scale controls */}
            <div className="flex items-center bg-white bg-opacity-20 rounded-lg p-1">
              <button
                onClick={() => setPreviewScale(Math.max(0.4, previewScale - 0.1))}
                className="p-1 text-white hover:bg-white hover:bg-opacity-20 rounded"
              >
                🔍-
              </button>
              <span className="px-2 text-white text-sm">
                {Math.round(previewScale * 100)}%
              </span>
              <button
                onClick={() => setPreviewScale(Math.min(1, previewScale + 0.1))}
                className="p-1 text-white hover:bg-white hover:bg-opacity-20 rounded"
              >
                🔍+
              </button>
            </div>
            
            <motion.button
              onClick={() => setShowFullscreen(true)}
              className="p-2 bg-white bg-opacity-20 rounded-lg text-white hover:bg-opacity-30 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🔍
            </motion.button>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="p-6 bg-gray-50 max-h-96 overflow-auto">
        <div className="flex justify-center">
          <ResumePreview />
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 bg-gray-50 border-t">
        <div className="flex gap-3 justify-center">
          <motion.button
            onClick={generatePDF}
            disabled={!content || isDownloading || isGenerating}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={!isDownloading && !isGenerating ? { scale: 1.05 } : {}}
            whileTap={!isDownloading && !isGenerating ? { scale: 0.95 } : {}}
          >
            {isDownloading ? (
              <div className="flex items-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Generating PDF...
              </div>
            ) : (
              '📄 Generate PDF'
            )}
          </motion.button>

          {pdfUrl && (
            <motion.button
              onClick={downloadPDF}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              📥 Download PDF
            </motion.button>
          )}
          
          <motion.button
            onClick={() => navigator.clipboard.writeText(content)}
            disabled={!content}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={content ? { scale: 1.05 } : {}}
            whileTap={content ? { scale: 0.95 } : {}}
          >
            📋 Copy Text
          </motion.button>
        </div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {showFullscreen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFullscreen(false)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-4xl max-h-full overflow-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 bg-gray-100 border-b flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Full Preview</h3>
                <button
                  onClick={() => setShowFullscreen(false)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="p-6">
                <ResumePreview isFullscreen={true} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LivePreviewGenerator;