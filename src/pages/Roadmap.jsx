import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, User, Book, Target, Award, Clock, Star, Trophy, Gamepad2, Code, Palette, Bug, X, Play, BarChart3, MessageCircle, Send, Image, Sparkles } from 'lucide-react';
import Anthropic from '@anthropic-ai/sdk';
import mentorCharacter from '../assets/chatpal.png'; // adjust path as needed

import '../styles/Roadmap.css';

// Create Claude client (put this outside the component)
const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_CLAUDE_API_KEY,
  dangerouslyAllowBrowser: true // Required for browser usage
});



const VerticalGameDevRoadmap = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const roadmapData = useMemo(() => state?.roadmap, [state]);
  
  useEffect(() => {
    if (!roadmapData) {
      navigate('/');
    }
    
  }, [roadmapData, navigate]);


  // State variables
  const [completedSteps, setCompletedSteps] = useState([]);
  const [hoveredStep, setHoveredStep] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [expandedStep, setExpandedStep] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [completedActivities, setCompletedActivities] = useState({});

  // Early return if no roadmap data
  if (!roadmapData) {
    return <div>Loading...</div>;
  }

  const iconMap = {
    1: Target,      // Setup
    2: Code,        // Engine Concepts
    3: Code,        // Scripting
    4: Gamepad2,    // Input & Movement
    5: Palette,     // Tilemaps
    6: Target,      // Physics
    7: User,        // Interactions
    8: Book,        // Inventory
    9: Target,      // Farming
    10: Palette,    // UI
    11: Bug,        // Bug Fixing
    12: Star,       // Polish
    13: Award       // Reflection
  };

  const allSteps = roadmapData.worlds.flatMap(world => 
    world.steppingStones.map(stone => ({
      ...stone,
      worldTitle: world.title,
      worldColor: world.color,
      worldDuration: world.duration
    }))
  );

  const totalSteps = allSteps.length;
  const currentXP = completedSteps.reduce((total, stepId) => {
    const step = allSteps.find(s => s.stepId === stepId);
    return total + (step?.rewards?.xp || 0);
  }, 0);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 1: return 'difficulty-beginner';
      case 2: return 'difficulty-beginner';
      case 3: return 'difficulty-intermediate';
      case 4: return 'difficulty-advanced';
      case 5: return 'difficulty-advanced';
      default: return 'difficulty-unknown';
    }
  };

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case 1: case 2: return 'Beginner';
      case 3: return 'Intermediate';
      case 4: case 5: return 'Advanced';
      default: return 'Unknown';
    }
  };

  const isStepAccessible = (stepId) => {
    if (stepId === 1) return true;
    return completedSteps.includes(stepId - 1);
  };

  const isStepCompleted = (stepId) => {
    return completedSteps.includes(stepId);
  };

  const getCurrentStep = () => {
    for (let i = 1; i <= totalSteps; i++) {
      if (!completedSteps.includes(i)) return i;
    }
    return totalSteps;
  };

  const handleStepHover = (step, event) => {
    setHoveredStep(step);
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleStepClick = (step) => {
    const currentStep = getCurrentStep();
    if (step.stepId === currentStep || completedSteps.includes(step.stepId)) {
      setExpandedStep(step);
    }
  };

  const completeStep = (stepId) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
    setExpandedStep(null);
  };
  const toggleActivity = (stepId, activityIndex) => {
  const activityKey = `${stepId}-${activityIndex}`;
  setCompletedActivities(prev => {
    const updated = {
      ...prev,
      [activityKey]: !prev[activityKey]
    };
    // Save to localStorage immediately
    localStorage.setItem('roadmap-completed-activities', JSON.stringify(updated));
    return updated;
  });
};

// Function to check if activity is completed
const isActivityCompleted = (stepId, activityIndex) => {
  const activityKey = `${stepId}-${activityIndex}`;
  return completedActivities[activityKey] || false;
};

  // Helper function to convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  // Build system prompt function
  function buildSystemPrompt(context) {
    const { currentStep, allSteps, completedSteps, totalSteps, currentXP, roadmapTitle, roadmapData } = context;
    
    // Find current step data
    const currentStepData = allSteps.find(step => step.stepId === currentStep);
    const aiName = roadmapData?.aiMentor?.name || 'Learning Mentor';
    const aiPersonality = roadmapData?.aiMentor?.personality || 'encouraging and supportive';
    
    return `You are ${aiName}, an experienced and ${aiPersonality} mentor helping someone learn through a structured roadmap called "${roadmapTitle}".

CURRENT CONTEXT:
- Student is on Step ${currentStep}${currentStepData ? `: "${currentStepData.title}"` : ''}
${currentStepData ? `- World: ${currentStepData.worldTitle}
- Difficulty: ${currentStepData.difficulty}/5
- Estimated Time: ${currentStepData.estimatedTime}` : ''}
- Progress: ${completedSteps.length}/${totalSteps} steps completed (${currentXP} XP earned)

YOUR ROLE:
- Be encouraging and supportive
- Provide specific, actionable advice
- Help troubleshoot issues
- Explain concepts clearly for beginners
- Suggest resources when helpful
- Celebrate progress and achievements

TONE:
- Friendly and approachable
- Use appropriate terminology for the subject matter
- Include relevant emojis occasionally
- Be concise but thorough

Remember: Your goal is to help them succeed in their learning journey while building confidence for the path ahead.`;
  }

  // UPDATED: Direct Claude API call function
  const sendMessageToClaude = async (message, imageFile = null) => {
    setIsTyping(true);
    
    try {
      const context = {
        currentStep: getCurrentStep(),
        allSteps,
        completedSteps,
        totalSteps,
        currentXP,
        roadmapTitle: roadmapData.title,
        roadmapData
      };

      console.log('Sending message directly to Claude...');
      console.log('Context:', context);

      // Build system prompt
      const systemPrompt = buildSystemPrompt(context);
      
      // Prepare message content
      const messageContent = [
        {
          type: 'text',
          text: message
        }
      ];

      // Add image if provided
      if (imageFile) {
        try {
          const base64Image = await fileToBase64(imageFile);
          messageContent.push({
            type: 'image',
            source: {
              type: 'base64',
              media_type: imageFile.type,
              data: base64Image
            }
          });
          console.log('Image added to message');
        } catch (imageError) {
          console.error('Error processing image:', imageError);
          // Continue without image
        }
      }

      console.log('Calling Claude API directly...');

      // Call Claude API directly
      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: messageContent
          }
        ]
      });

      console.log('Claude response received:', response);
      
      setChatMessages(prev => [
        ...prev,
        { type: 'user', content: message, image: imageFile },
        { type: 'bot', content: response.content[0].text }
      ]);

    } catch (error) {
      console.error('Chat error details:', error);
      setChatMessages(prev => [
        ...prev,
        { type: 'user', content: message, image: imageFile },
        { type: 'bot', content: `Error: ${error.message}` }
      ]);
    } finally {
      setIsTyping(false);
      setChatInput('');
    }
  };

  const initializeChat = () => {
    if (chatMessages.length === 0) {
      const currentStepData = allSteps.find(s => s.stepId === getCurrentStep());
      const aiName = roadmapData?.aiMentor?.name || 'Learning Mentor';
      const welcomeMessage = `Hi! I'm ${aiName}
      
      Welcome to ${roadmapData.title}! 

      Your current progress:
      - ✅ You've completed ${completedSteps.length}/${totalSteps} steps
      - 🏆 You've earned ${currentXP} XP so far
      - 🎯 Next step: ${currentStepData ? `${currentStepData.title} (Step ${currentStepData.stepId})` : 'All steps completed! 🎉'}

      How can I help you today? I can:
      - Explain concepts in detail
      - Help troubleshoot issues
      - Review your progress
      - Analyze screenshots of your work
      - Guide you through any step
      - Answer questions about your learning journey

      What would you like assistance with?`;

      setChatMessages([{ type: 'bot', content: welcomeMessage }]);
    }
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with input:', chatInput);
    if (chatInput.trim()) {
      sendMessageToClaude(chatInput.trim());
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && chatInput.trim()) {
      sendMessageToClaude(chatInput.trim(), file);
    } else if (file) {
      sendMessageToClaude("I've uploaded an image. Can you help me analyze this?", file);
    }
  };

  // ... rest of your render methods (renderWorldHeader, renderStep, renderRoadmapContent) stay the same ...

  const renderWorldHeader = (world) => {
    return (
      <div key={`world-${world.worldId}`} className="world-header">
        <div className="world-header-content">
          <div className="world-duration">{world.duration}</div>
          <h3 className="world-title">{world.title}</h3>
          <p className="world-description">{world.description}</p>
        </div>
      </div>
    );
  };

  const renderStep = (step, index) => {
    const isCompleted = isStepCompleted(step.stepId);
    const isAccessible = isStepAccessible(step.stepId);
    const isCurrent = step.stepId === getCurrentStep();
    const isFinalStep = step.stepId === totalSteps;
    const Icon = iconMap[step.stepId];
    
    return (
      <div key={step.stepId} className="step-container">
        {/* Connection line */}
        {index > 0 && (
          <div className="connection-line"></div>
        )}
        
        {/* Step circle */}
        <div
          className={`step-circle ${
            isFinalStep ? 'step-final' : ''
          } ${
            isCompleted 
              ? 'step-completed' 
              : isCurrent && isAccessible
              ? 'step-current'
              : isAccessible
              ? 'step-accessible'
              : 'step-locked'
          }`}
          onMouseEnter={(e) => handleStepHover(step, e)}
          onMouseLeave={() => setHoveredStep(null)}
          onClick={() => handleStepClick(step)}
        >
          {isCompleted ? (
            <CheckCircle className="step-icon" />
          ) : (
            <Icon className="step-icon" />
          )}
          
          {/* Step number badge */}
          <div className={`step-badge ${isCompleted ? 'step-badge-completed' : 'step-badge-default'}`}>
            {step.stepId}
          </div>
        </div>
      </div>
    );
  };

  const renderRoadmapContent = () => {
    const elements = [];
    let stepIndex = 0;

    roadmapData.worlds.forEach((world, worldIndex) => {
      // Add world header
      elements.push(renderWorldHeader(world));
      
      // Add connection line before world header (except for first world)
      if (worldIndex > 0) {
        elements.splice(-1, 0, (
          <div key={`connection-before-world-${world.worldId}`} className="connection-line"></div>
        ));
      }

      // Add steps for this world
      world.steppingStones.forEach((stone) => {
        const step = {
          ...stone,
          worldTitle: world.title,
          worldColor: world.color,
          worldDuration: world.duration
        };
        elements.push(renderStep(step, stepIndex));
        stepIndex++;
      });
    });

    return elements;
  };

  return (
    <div className="roadmap-container">
      <div className="roadmap-wrapper">
        {/* Header */}
        <div className="header">
          <h1>{roadmapData.title}</h1>
          <p className="header-subtitle">
            <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {roadmapData.totalDuration}
            </span>
            <span className="difficulty-badge">
                {roadmapData.difficulty}
            </span>
          </p>
          
          {/* Progress bar */}
          <div className="progress-card">
            <div className="progress-info">
              <span>Progress: {completedSteps.length}/{totalSteps} completed</span>
              <span>{currentXP} / {roadmapData.avatar.totalXPNeeded} XP</span>
            </div>
            <div className="progress-bar-container">
              <div 
                className="progress-bar"
                style={{ width: `${(completedSteps.length / totalSteps) * 100}%` }}
              ></div>
            </div>
            <div className="progress-current">
              <span>Current Step: {getCurrentStep()}</span>
            </div>
          </div>
        </div>

        {/* Vertical Roadmap */}
        <div className="roadmap-content">
          {renderRoadmapContent()}
        </div>

        {/* Hover Card */}
        {hoveredStep && (
          <div 
            className="hover-card"
            style={{
              left: mousePosition.x + 30,
              top: mousePosition.y - 100,
              transform: mousePosition.x > window.innerWidth - 350 ? 'translateX(-320px)' : 'none'
            }}
          >
            <h4>{hoveredStep.title}</h4>
            <p>{hoveredStep.description}</p>
            <div className="hover-card-info">
              <div className="hover-card-row">
                <Clock className="hover-card-icon" />
                <span className="hover-card-text">Duration: {hoveredStep.estimatedTime}</span>
              </div>
              <div className="hover-card-row">
                <BarChart3 className="hover-card-icon" />
                <span className={`${getDifficultyColor(hoveredStep.difficulty)}`}>
                  {getDifficultyLabel(hoveredStep.difficulty)}
                </span>
              </div>
              {hoveredStep.rewards?.xp && (
                <div className="hover-card-row">
                  <Trophy className="xp-icon" />
                  <span className="xp-text">{hoveredStep.rewards.xp} XP</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Expanded Step Overlay - keeping your existing modal code */}
        {expandedStep && (
          <div className="overlay">
            <div className="modal">
              {/* Header */}
              <div className="modal-header">
                <div>
                  <h2 className="modal-title">{expandedStep.title}</h2>
                  <p className="modal-subtitle">{expandedStep.worldTitle}</p>
                </div>
                <button
                  onClick={() => setExpandedStep(null)}
                  className="modal-close"
                >
                  <X style={{ width: '1.5rem', height: '1.5rem' }} />
                </button>
              </div>

              {/* Modal content - keeping your existing content */}
              <div className="modal-content">
                <div className="modal-grid">
                  <div className="modal-card">
                    <div className="modal-card-header">
                      <Clock className="modal-card-icon" />
                      <span className="modal-card-title">Duration</span>
                    </div>
                    <span className="modal-card-content">{expandedStep.estimatedTime}</span>
                  </div>
                  <div className="modal-card">
                    <div className="modal-card-header">
                      <BarChart3 className="modal-card-icon" />
                      <span className="modal-card-title">Difficulty</span>
                    </div>
                    <span className={`${getDifficultyColor(expandedStep.difficulty)}`}>
                      {getDifficultyLabel(expandedStep.difficulty)}
                    </span>
                  </div>
                  <div className="modal-card">
                    <div className="modal-card-header">
                      <Trophy className="modal-card-icon" />
                      <span className="modal-card-title">Reward</span>
                    </div>
                    <span className="modal-card-content">{expandedStep.rewards?.xp || 0} XP</span>
                  </div>
                </div>

                <div className="modal-section">
                  <h3>Description</h3>
                  <p>{expandedStep.description}</p>
                </div>

                <div className="modal-section">
  <h3>Activities</h3>
  <div className="activities-list">
    {expandedStep.activities?.map((activity, index) => {
      const isCompleted = isActivityCompleted(expandedStep.stepId, index);
      return (
        <div 
          key={index} 
          className={`activity-item ${isCompleted ? 'activity-completed' : ''}`}
          onClick={() => toggleActivity(expandedStep.stepId, index)}
        >
          <div className={`activity-checkbox ${isCompleted ? 'checked' : ''}`}>
            {isCompleted ? '✓' : index + 1}
          </div>
          <span className="activity-text">{activity}</span>
        </div>
      );
    })}
  </div>
</div>

                
                
                {expandedStep.resources && expandedStep.resources.length > 0 && (
                  <div className="modal-section">
                    <h3>Learning Resources</h3>
                    <div className="resources-grid">
                      {expandedStep.resources.map((resource, index) => {
                        
                        return (
                          <div key={index} className="resource-tip-card">
                            <div className="resource-tip-header">
      
                              <h4>Tip {index + 1}</h4>
                            </div>
                            <div className="resource-tip-content">
                              <p>{resource}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
{expandedStep.deliverable && (
                  <div className="modal-section">
                    <h3>Deliverable</h3>
                    <div className="deliverable-box">
                      <p className="deliverable-text">{expandedStep.deliverable}</p>
                    </div>
                  </div>
                )}
                

                {expandedStep.rewards && (
                  <div className="modal-section">
                    <h3>Rewards</h3>
                    <div className="rewards-box">
                      <div className="rewards-list">
                        <div className="reward-item">
                          <Trophy className="reward-icon" />
                          <span className="reward-text">{expandedStep.rewards.xp} XP</span>
                        </div>
                        {expandedStep.rewards.skillUnlock && (
                          <div className="reward-unlock">
                            🔓 Skill Unlock: {expandedStep.rewards.skillUnlock}
                          </div>
                        )}
                        {expandedStep.rewards.badge && (
                          <div className="reward-unlock">
                            🏆 Badge: {expandedStep.rewards.badge} 
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="modal-actions">
                  <div className="modal-actions-buttons">
                    {!isStepCompleted(expandedStep.stepId) && (
                      <button
                        onClick={() => completeStep(expandedStep.stepId)}
                        className="btn-complete"
                      >
                        Mark as Complete
                      </button>
                    )}
                    <button
                      onClick={() => setExpandedStep(null)}
                      className="btn-close"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Chat Widget */}
        <div className="floating-chat-widget">
          {!chatOpen ? (
            <button
              onClick={() => {
                console.log('Chat widget clicked');
                setChatOpen(true);
                initializeChat();
              }}
              className="chat-fab"
              title={`Open ${roadmapData?.aiMentor?.name || 'Learning Mentor'}`}
            >
              <img src={mentorCharacter} alt="Chat Mentor" className="fab-icon" />
            </button>
          ) : (
            <div className="chat-widget-expanded">
              <div className="chat-header">
                <div className="chat-header-info">
                  <img src={mentorCharacter} alt="Chat Mentor" className="chat-header-icon" />
                  <div>
                    <h3>{roadmapData?.aiMentor?.name || 'Learning Mentor'}</h3>
                    <p>Your AI Learning Companion</p>
                  </div>
                </div>
                <button 
                  onClick={() => setChatOpen(false)}
                  className="chat-close"
                >
                  <X className="chat-close-icon" />
                </button>
              </div>

              <div className="chat-messages">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`chat-message ${msg.type}`}>
                    {msg.type === 'bot' && (
                      
                        <img src={mentorCharacter} alt="Chat Mentor" className="avatar-icon" />

                      
                    )}
                    <div className="message-content">
                      {msg.image && (
                        <img 
                          src={URL.createObjectURL(msg.image)} 
                          alt="Uploaded" 
                          className="message-image"
                        />
                      )}
                      <div className="message-text">
                        {msg.content.split('\n').map((line, i) => {
                          if (line.startsWith('**') && line.endsWith('**')) {
                            return <strong key={i}>{line.slice(2, -2)}</strong>;
                          }
                          if (line.startsWith('- ')) {
                            return <div key={i} className="message-bullet">{line}</div>;
                          }
                          return <div key={i}>{line}</div>;
                        })}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="chat-message bot">
                   
                      <img src={mentorCharacter} alt="Chat Mentor" className="avatar-icon" />

                    
                    <div className="message-content">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleChatSubmit} className="chat-input-form">
                <div className="chat-input-container">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask for help, share progress, or upload a screenshot..."
                    className="chat-input"
                  />
                  <label className="image-upload-button">
                    <Image className="upload-icon" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <button 
                    type="submit" 
                    disabled={!chatInput.trim() || isTyping}
                    className="chat-send-button"
                  >
                    <Send className="send-icon" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerticalGameDevRoadmap;