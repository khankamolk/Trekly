import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Star, Clock, Target, Users, Award, FileText } from 'lucide-react';
import roadmapData from '../data.json';

export default function Roadmap() {
  const [expandedStep, setExpandedStep] = useState(null);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  // Calculate step positions dynamically
  const calculateStepPositions = () => {
    const allSteps = [];
    let stepIndex = 0;
    
    roadmapData.worlds.forEach((world, worldIndex) => {
      world.steppingStones.forEach((step, stepInWorldIndex) => {
        const position = {
          stepId: step.stepId,
          worldIndex,
          stepInWorldIndex,
          globalStepIndex: stepIndex,
          x: 50, // Center horizontally
          y: 150 + (stepIndex * 300), // Vertical spacing
          side: stepIndex % 2 === 0 ? 'left' : 'right' // Alternate sides
        };
        
        // Adjust x position based on side
        position.x = position.side === 'left' ? 30 : 70;
        
        allSteps.push(position);
        stepIndex++;
      });
    });
    
    return allSteps;
  };

  // Generate dynamic SVG path connecting all steps
  const generateDynamicPath = () => {
    const stepPositions = calculateStepPositions();
    if (stepPositions.length < 2) return "";
    
    let pathData = "";
    
    for (let i = 0; i < stepPositions.length; i++) {
      const current = stepPositions[i];
      const currentX = (current.x / 100) * 800; // Convert to SVG coordinates
      const currentY = current.y;
      
      if (i === 0) {
        // Start the path
        pathData += `M ${currentX} ${currentY} `;
      } else {
        const previous = stepPositions[i - 1];
        const prevX = (previous.x / 100) * 800;
        const prevY = previous.y;
        
        // Calculate control points for smooth curves
        const deltaY = currentY - prevY;
        const midY = prevY + deltaY / 2;
        
        // Create S-curves that alternate based on step position
        const cp1X = prevX;
        const cp1Y = prevY + deltaY * 0.3;
        const cp2X = currentX;
        const cp2Y = currentY - deltaY * 0.3;
        
        // Add curve to path
        pathData += `C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${currentX} ${currentY} `;
      }
    }
    
    return pathData;
  };

  // Generate progress path (shows completed portion)
  const generateProgressPath = () => {
    const stepPositions = calculateStepPositions();
    const completedStepCount = completedSteps.size;
    
    if (completedStepCount === 0) return "";
    
    let pathData = "";
    const progressSteps = stepPositions.slice(0, completedStepCount + 1);
    
    for (let i = 0; i < progressSteps.length; i++) {
      const current = progressSteps[i];
      const currentX = (current.x / 100) * 800;
      const currentY = current.y;
      
      if (i === 0) {
        pathData += `M ${currentX} ${currentY} `;
      } else {
        const previous = progressSteps[i - 1];
        const prevX = (previous.x / 100) * 800;
        const prevY = previous.y;
        
        const deltaY = currentY - prevY;
        const cp1X = prevX;
        const cp1Y = prevY + deltaY * 0.3;
        const cp2X = currentX;
        const cp2Y = currentY - deltaY * 0.3;
        
        pathData += `C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${currentX} ${currentY} `;
      }
    }
    
    return pathData;
  };

  const toggleStep = (stepId) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  const toggleCompletion = (stepId) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId);
    } else {
      newCompleted.add(stepId);
    }
    setCompletedSteps(newCompleted);
  };

  const getAllSteps = () => {
    return roadmapData.worlds.flatMap(world => world.steppingStones);
  };

  const allSteps = getAllSteps();
  const completedCount = completedSteps.size;
  const progressPercentage = (completedCount / allSteps.length) * 100;
  const stepPositions = calculateStepPositions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{roadmapData.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {roadmapData.totalDuration}
            </span>
            <span className="capitalize bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
              {roadmapData.difficulty}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">
            {completedCount} of {allSteps.length} steps completed ({Math.round(progressPercentage)}%)
          </p>
        </div>
      </div>

      {/* Roadmap Path */}
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          {/* Dynamic Curved Path SVG */}
          <svg 
            className="absolute top-0 left-0 w-full pointer-events-none z-0" 
            viewBox={`0 0 800 ${stepPositions.length * 300 + 200}`}
            preserveAspectRatio="xMidYMin meet"
            style={{ height: `${stepPositions.length * 300 + 200}px` }}
          >
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="25%" stopColor="#06B6D4" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#EF4444" />
              </linearGradient>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
            
            {/* Main path - full roadmap */}
            <path
              d={generateDynamicPath()}
              stroke="url(#pathGradient)"
              strokeWidth="6"
              fill="none"
              strokeDasharray="15,10"
              opacity="0.4"
            />
            
            {/* Progress path - completed portion */}
            <path
              d={generateProgressPath()}
              stroke="url(#progressGradient)"
              strokeWidth="8"
              fill="none"
              opacity="0.8"
              strokeLinecap="round"
            />
            
            {/* Step position indicators */}
            {stepPositions.map((position, index) => {
              const isCompleted = completedSteps.has(position.stepId);
              const x = (position.x / 100) * 800;
              const y = position.y;
              
              return (
                <g key={position.stepId}>
                  {/* Step connection point */}
                  <circle
                    cx={x}
                    cy={y}
                    r="8"
                    fill={isCompleted ? "#10B981" : "#8B5CF6"}
                    opacity="0.8"
                  />
                  {/* Completion indicator */}
                  {isCompleted && (
                    <circle
                      cx={x}
                      cy={y}
                      r="12"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="3"
                      opacity="0.6"
                      className="animate-pulse"
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Steps */}
          <div className="relative z-10 space-y-8">
            {roadmapData.worlds.map((world, worldIndex) => (
              <div key={world.worldId} className="mb-12">
                {/* World Header */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{world.title}</h2>
                  <p className="text-gray-600">{world.description}</p>
                  <span className="inline-block bg-white px-4 py-2 rounded-full text-sm text-gray-600 shadow-md mt-2">
                    {world.duration}
                  </span>
                </div>

                {/* World Steps */}
                {world.steppingStones.map((step, stepIndex) => {
                  const isCompleted = completedSteps.has(step.stepId);
                  const isExpanded = expandedStep === step.stepId;
                  const stepPosition = stepPositions.find(pos => pos.stepId === step.stepId);
                  const side = stepPosition?.side || 'left';

                  return (
                    <div
                      key={step.stepId}
                      className={`relative flex ${side === 'left' ? 'justify-start' : 'justify-end'} mb-16`}
                    >
                      {/* Step Bubble */}
                      <div
                        className={`relative ${side === 'left' ? 'mr-8' : 'ml-8'} transition-all duration-300 hover:scale-105`}
                      >
                        {/* Step Number Circle */}
                        <div 
                          className={`
                            absolute -top-4 ${side === 'left' ? '-right-4' : '-left-4'} 
                            w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-lg z-20
                            ${isCompleted ? 'bg-green-500' : 'bg-gradient-to-r from-purple-500 to-blue-500'}
                            cursor-pointer hover:shadow-xl transition-all duration-200
                          `}
                          onClick={() => toggleCompletion(step.stepId)}
                        >
                          {isCompleted ? '✓' : step.stepId}
                        </div>

                        {/* Step Card */}
                        <div 
                          className={`
                            bg-white rounded-3xl shadow-xl p-6 max-w-md cursor-pointer transition-all duration-300
                            ${isExpanded ? 'shadow-2xl scale-105' : 'hover:shadow-lg hover:scale-102'}
                            ${isCompleted ? 'bg-green-50 border-2 border-green-200' : ''}
                          `}
                          onClick={() => toggleStep(step.stepId)}
                        >
                          {/* Step Header */}
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-gray-800">{step.title}</h3>
                            {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-3">{step.description}</p>
                          
                          <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {step.estimatedTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              Difficulty: {step.difficulty}/5
                            </span>
                          </div>

                          {/* Expanded Content */}
                          {isExpanded && (
                            <div className="mt-4 space-y-4 border-t pt-4">
                              {/* Activities */}
                              <div>
                                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                  <Target className="w-4 h-4" />
                                  Activities
                                </h4>
                                <ul className="space-y-1">
                                  {step.activities.map((activity, idx) => (
                                    <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                                      <span className="text-purple-500 mt-1">•</span>
                                      {activity}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Deliverable */}
                              <div>
                                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                  <FileText className="w-4 h-4" />
                                  Deliverable
                                </h4>
                                <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                                  {step.deliverable}
                                </p>
                              </div>

                              {/* Resources */}
                              <div>
                                <h4 className="font-semibold text-gray-800 mb-2">📚 Resources</h4>
                                <ul className="space-y-1">
                                  {step.resources.map((resource, idx) => (
                                    <li key={idx} className="text-sm text-blue-600 hover:underline cursor-pointer">
                                      • {resource}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Rewards */}
                              <div>
                                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                  <Award className="w-4 h-4" />
                                  Rewards
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                                    +{step.rewards.xp} XP
                                  </span>
                                  {step.rewards.badge && (
                                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                                      🏆 {step.rewards.badge}
                                    </span>
                                  )}
                                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                    🔓 {step.rewards.skillUnlock}
                                  </span>
                                </div>
                              </div>

                              {/* Social Challenge */}
                              <div>
                                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                  <Users className="w-4 h-4" />
                                  Community Challenge
                                </h4>
                                <p className="text-sm text-gray-600 bg-purple-50 p-3 rounded-lg">
                                  {step.socialChallenge}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Avatar Progress */}
      <div className="fixed bottom-6 right-6 bg-white rounded-2xl shadow-lg p-4 max-w-xs">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            👨‍💻
          </div>
          <div>
            <p className="font-semibold text-gray-800">Level {Math.floor(completedCount / 2) + 1}</p>
            <p className="text-xs text-gray-600">{completedCount * 50} / {roadmapData.avatar.totalXPNeeded} XP</p>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(completedCount * 50 / roadmapData.avatar.totalXPNeeded) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};