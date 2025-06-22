import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, User, Book, Target, Award, Clock, Star, Trophy, Gamepad2, Code, Palette, Bug, X, Play, BarChart3 } from 'lucide-react';
import '../styles/Roadmap.css';

const VerticalGameDevRoadmap = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const roadmapData = useMemo(() => state?.roadmap, [state]);
  console.log(JSON.stringify(roadmapData, null, 2));
  
  useEffect(() => {
    if (!roadmapData) {
      navigate('/');
    }
  }, [roadmapData, navigate]);

  const [completedSteps, setCompletedSteps] = useState([]); // Demo: first 3 steps completed
  const [hoveredStep, setHoveredStep] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [expandedStep, setExpandedStep] = useState(null);

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
    13: Trophy      // Reflection
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

  const getWorldForStep = (stepId) => {
    return roadmapData.worlds.find(world => 
      world.steppingStones.some(stone => stone.stepId === stepId)
    );
  };

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

        {/* Expanded Step Overlay */}
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

              {/* Content */}
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
                    {expandedStep.activities?.map((activity, index) => (
                      <div key={index} className="activity-item">
                        <div className="activity-number">
                          {index + 1}
                        </div>
                        <span className="activity-text">{activity}</span>
                      </div>
                    ))}
                  </div>
                </div>

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
        )}
      </div>
    </div>
  );
};

export default VerticalGameDevRoadmap;