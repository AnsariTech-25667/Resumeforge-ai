import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NeuralNetworkVisualization = ({ isProcessing, stage = 'analyzing' }) => {
  const canvasRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [activeNodes, setActiveNodes] = useState(new Set());

  // Initialize neural network structure
  useEffect(() => {
    const layers = [
      { count: 4, y: 50, label: 'Input Layer' },
      { count: 6, y: 150, label: 'Hidden Layer 1' },
      { count: 8, y: 250, label: 'Hidden Layer 2' },
      { count: 6, y: 350, label: 'Hidden Layer 3' },
      { count: 3, y: 450, label: 'Output Layer' }
    ];

    const newNodes = [];
    const newConnections = [];
    let nodeId = 0;

    // Create nodes
    layers.forEach((layer, layerIndex) => {
      for (let i = 0; i < layer.count; i++) {
        const x = 100 + (300 / (layer.count + 1)) * (i + 1);
        newNodes.push({
          id: nodeId++,
          x,
          y: layer.y,
          layer: layerIndex,
          active: false
        });
      }
    });

    // Create connections between layers
    layers.forEach((layer, layerIndex) => {
      if (layerIndex < layers.length - 1) {
        const currentLayerNodes = newNodes.filter(n => n.layer === layerIndex);
        const nextLayerNodes = newNodes.filter(n => n.layer === layerIndex + 1);
        
        currentLayerNodes.forEach(currentNode => {
          nextLayerNodes.forEach(nextNode => {
            newConnections.push({
              from: currentNode.id,
              to: nextNode.id,
              active: false,
              weight: Math.random()
            });
          });
        });
      }
    });

    setNodes(newNodes);
    setConnections(newConnections);
  }, []);

  // Animate neural network activity
  useEffect(() => {
    if (!isProcessing) {
      setActiveNodes(new Set());
      return;
    }

    const animateNetwork = () => {
      // Simulate forward propagation
      const layers = [
        nodes.filter(n => n.layer === 0),
        nodes.filter(n => n.layer === 1),
        nodes.filter(n => n.layer === 2),
        nodes.filter(n => n.layer === 3),
        nodes.filter(n => n.layer === 4)
      ];

      let delay = 0;
      layers.forEach((layerNodes, layerIndex) => {
        setTimeout(() => {
          const newActiveNodes = new Set();
          layerNodes.forEach(node => {
            if (Math.random() > 0.3) { // 70% chance to activate
              newActiveNodes.add(node.id);
            }
          });
          setActiveNodes(prev => new Set([...prev, ...newActiveNodes]));
        }, delay);
        delay += 300;
      });

      // Clear and restart
      setTimeout(() => {
        setActiveNodes(new Set());
        if (isProcessing) {
          setTimeout(animateNetwork, 500);
        }
      }, delay + 1000);
    };

    animateNetwork();
  }, [isProcessing, nodes]);

  const stageLabels = {
    analyzing: 'Analyzing Content...',
    enhancing: 'AI Enhancement...',
    optimizing: 'ATS Optimization...',
    scoring: 'Calculating Score...',
    complete: 'Processing Complete!'
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-2xl p-6 text-white overflow-hidden relative">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            animate={{
              x: [0, 400, 0],
              y: [0, 300, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%'
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center">
            <motion.span 
              className="mr-3 text-2xl"
              animate={{ rotate: isProcessing ? 360 : 0 }}
              transition={{ duration: 2, repeat: isProcessing ? Infinity : 0, ease: "linear" }}
            >
              🧠
            </motion.span>
            AI Neural Network
          </h3>
          
          <div className="text-sm text-blue-300">
            {stageLabels[stage]}
          </div>
        </div>

        {/* Neural Network Visualization */}
        <div className="relative bg-black/30 rounded-xl p-4 h-96 overflow-hidden">
          <svg width="100%" height="100%" className="absolute inset-0">
            {/* Render connections */}
            {connections.map((connection, index) => {
              const fromNode = nodes.find(n => n.id === connection.from);
              const toNode = nodes.find(n => n.id === connection.to);
              
              if (!fromNode || !toNode) return null;
              
              const isActive = activeNodes.has(connection.from) && activeNodes.has(connection.to);
              
              return (
                <motion.line
                  key={index}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={isActive ? '#60A5FA' : '#374151'}
                  strokeWidth={isActive ? 2 : 1}
                  opacity={isActive ? 0.8 : 0.3}
                  initial={{ pathLength: 0 }}
                  animate={{ 
                    pathLength: 1,
                    stroke: isActive ? '#60A5FA' : '#374151'
                  }}
                  transition={{ duration: 0.5 }}
                />
              );
            })}
            
            {/* Render nodes */}
            {nodes.map((node) => {
              const isActive = activeNodes.has(node.id);
              return (
                <motion.g key={node.id}>
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r={isActive ? 8 : 6}
                    fill={isActive ? '#60A5FA' : '#6B7280'}
                    animate={{
                      r: isActive ? [6, 10, 8] : 6,
                      fill: isActive ? '#60A5FA' : '#6B7280'
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  {isActive && (
                    <motion.circle
                      cx={node.x}
                      cy={node.y}
                      r={12}
                      fill="none"
                      stroke="#60A5FA"
                      strokeWidth={2}
                      initial={{ opacity: 0, r: 8 }}
                      animate={{ opacity: [0, 0.8, 0], r: [8, 16, 20] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                  )}
                </motion.g>
              );
            })}
          </svg>

          {/* Layer Labels */}
          <div className="absolute left-4 top-4 space-y-12 text-xs text-gray-400">
            <div>Input</div>
            <div>Hidden 1</div>
            <div>Hidden 2</div>
            <div>Hidden 3</div>
            <div>Output</div>
          </div>
        </div>

        {/* Processing Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              <motion.span
                animate={{ opacity: isProcessing ? [0.5, 1, 0.5] : 1 }}
                transition={{ duration: 1, repeat: isProcessing ? Infinity : 0 }}
              >
                {nodes.filter(n => activeNodes.has(n.id)).length}
              </motion.span>
            </div>
            <div className="text-sm text-gray-400">Active Nodes</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">
              <motion.span
                animate={{ opacity: isProcessing ? [0.5, 1, 0.5] : 1 }}
                transition={{ duration: 1.2, repeat: isProcessing ? Infinity : 0 }}
              >
                {Math.round((activeNodes.size / nodes.length) * 100)}%
              </motion.span>
            </div>
            <div className="text-sm text-gray-400">Processing</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              <motion.span
                animate={{ opacity: isProcessing ? [0.5, 1, 0.5] : 1 }}
                transition={{ duration: 0.8, repeat: isProcessing ? Infinity : 0 }}
              >
                {connections.length}
              </motion.span>
            </div>
            <div className="text-sm text-gray-400">Connections</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeuralNetworkVisualization;