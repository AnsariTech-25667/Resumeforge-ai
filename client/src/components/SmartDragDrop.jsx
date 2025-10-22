import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';

const DragDropZone = ({ onFileUpload, onTextDrop, children, className = "" }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dropAnimation, setDropAnimation] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setDropAnimation(true);

    const files = e.dataTransfer.files;
    const text = e.dataTransfer.getData('text/plain');

    if (files.length > 0) {
      const file = files[0];
      setDraggedItem({ type: 'file', name: file.name, size: file.size });
      
      if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
        onFileUpload && onFileUpload(file);
      }
    } else if (text) {
      setDraggedItem({ type: 'text', content: text.substring(0, 50) + '...' });
      onTextDrop && onTextDrop(text);
    }

    // Reset animation after delay
    setTimeout(() => {
      setDropAnimation(false);
      setDraggedItem(null);
    }, 2000);
  }, [onFileUpload, onTextDrop]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div
      className={`relative ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}
      
      {/* Drag Overlay */}
      <AnimatePresence>
        {isDragOver && (
          <motion.div
            className="absolute inset-0 bg-blue-500 bg-opacity-20 backdrop-blur-sm border-3 border-dashed border-blue-500 rounded-xl flex items-center justify-center z-50"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="text-center p-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <motion.div
                className="text-6xl mb-4"
                animate={{ 
                  rotate: [0, -10, 10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                📁
              </motion.div>
              <h3 className="text-2xl font-bold text-blue-600 mb-2">Drop Your File Here</h3>
              <p className="text-blue-500">Supports .txt, .doc, .docx files or plain text</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Animation */}
      <AnimatePresence>
        {dropAnimation && draggedItem && (
          <motion.div
            className="absolute inset-0 bg-emerald-500 bg-opacity-20 backdrop-blur-sm rounded-xl flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-sm"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: -50 }}
            >
              <motion.div
                className="text-5xl mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                ✅
              </motion.div>
              
              <h3 className="text-xl font-bold text-emerald-600 mb-2">Upload Successful!</h3>
              
              {draggedItem.type === 'file' ? (
                <div className="text-gray-600">
                  <p className="font-medium">{draggedItem.name}</p>
                  <p className="text-sm">{formatFileSize(draggedItem.size)}</p>
                </div>
              ) : (
                <p className="text-gray-600 text-sm">{draggedItem.content}</p>
              )}
              
              <motion.div
                className="w-full bg-emerald-200 rounded-full h-2 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  className="bg-emerald-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".txt,.doc,.docx,text/plain"
        onChange={(e) => e.target.files[0] && onFileUpload(e.target.files[0])}
      />
    </div>
  );
};

const DraggableResumeSection = ({ title, content, onContentChange, sectionKey, onReorder }) => {
  const [isEditing, setIsEditing] = useState(false);
  const dragControls = useDragControls();
  const [dragConstraints, setDragConstraints] = useState({ top: 0, bottom: 0 });

  const handleDragEnd = (event, info) => {
    if (Math.abs(info.offset.y) > 50) {
      onReorder && onReorder(sectionKey, info.offset.y > 0 ? 'down' : 'up');
    }
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-4"
      drag="y"
      dragControls={dragControls}
      dragConstraints={dragConstraints}
      dragElastic={0.1}
      onDragEnd={handleDragEnd}
      whileDrag={{ 
        scale: 1.02, 
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        zIndex: 1000 
      }}
      layout
    >
      {/* Section Header */}
      <div 
        className="bg-gradient-to-r from-gray-100 to-gray-200 p-4 cursor-grab active:cursor-grabbing flex items-center justify-between"
        onPointerDown={(e) => dragControls.start(e)}
      >
        <div className="flex items-center">
          <motion.div
            className="w-6 h-6 mr-3 flex flex-col justify-center items-center"
            whileHover={{ scale: 1.1 }}
          >
            <div className="w-1 h-1 bg-gray-500 rounded-full mb-1"></div>
            <div className="w-1 h-1 bg-gray-500 rounded-full mb-1"></div>
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
          </motion.div>
          <h3 className="font-bold text-gray-700 text-lg">{title}</h3>
        </div>
        
        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isEditing ? '💾' : '✏️'}
          </motion.button>
          
          <motion.button
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            🗑️
          </motion.button>
        </div>
      </div>

      {/* Section Content */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.textarea
              key="editor"
              className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={content}
              onChange={(e) => onContentChange(sectionKey, e.target.value)}
              placeholder={`Enter ${title.toLowerCase()} details...`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            />
          ) : (
            <motion.div
              key="display"
              className="min-h-[80px] p-3 bg-gray-50 rounded-lg text-gray-700 whitespace-pre-wrap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {content || (
                <span className="text-gray-400 italic">
                  Click edit to add {title.toLowerCase()} information...
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const SmartDragDrop = ({ onFileUpload, onTextDrop, sections, onSectionChange, onSectionReorder }) => {
  const [hoveredSection, setHoveredSection] = useState(null);

  const defaultSections = [
    { key: 'summary', title: 'Professional Summary', content: '' },
    { key: 'experience', title: 'Work Experience', content: '' },
    { key: 'education', title: 'Education', content: '' },
    { key: 'skills', title: 'Skills', content: '' },
    { key: 'projects', title: 'Projects', content: '' }
  ];

  const currentSections = sections || defaultSections;

  return (
    <DragDropZone 
      onFileUpload={onFileUpload}
      onTextDrop={onTextDrop}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Smart Resume Builder
          </h2>
          <p className="text-gray-600">
            Drag sections to reorder, drop files to import, or edit inline
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex gap-4 bg-white rounded-2xl p-4 shadow-lg">
            <motion.button
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              📄 Import Resume
            </motion.button>
            
            <motion.button
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ✨ AI Enhance
            </motion.button>
            
            <motion.button
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-medium flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🎨 Change Style
            </motion.button>
          </div>
        </motion.div>

        {/* Draggable Sections */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {currentSections.map((section, index) => (
            <motion.div
              key={section.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <DraggableResumeSection
                title={section.title}
                content={section.content}
                sectionKey={section.key}
                onContentChange={onSectionChange}
                onReorder={onSectionReorder}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Add Section Button */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 rounded-2xl font-medium border-2 border-dashed border-gray-400 hover:border-blue-400 hover:from-blue-50 hover:to-blue-100 hover:text-blue-600 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ➕ Add New Section
          </motion.button>
        </motion.div>
      </div>
    </DragDropZone>
  );
};

export { DragDropZone, DraggableResumeSection, SmartDragDrop };