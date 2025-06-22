import React, { useState } from 'react';
import { CheckCircle, Calendar, User, Book, Target, Award, Clock, Star, Trophy, Gamepad2, Code, Palette, Bug, X, Play, BarChart3 } from 'lucide-react';
import '../styles/Roadmap.css';

const VerticalGameDevRoadmap = () => {
  const [completedSteps, setCompletedSteps] = useState([]); // Demo: first 3 steps completed
  const [hoveredStep, setHoveredStep] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [expandedStep, setExpandedStep] = useState(null);

  // This would be imported from '../data.json' in a real app
  const roadmapData = {
    "title": "Awesome Project",
    "totalDuration": "15 days",
    "difficulty": "beginner",
    "avatar": {
      "startingLevel": 1,
      "totalXPNeeded": 1000,
      "currentXP": 0
    },
    "worlds": [
      {
        "worldId": 1,
        "title": "Foundation & Engine Basics",
        "description": "Setting up your game development environment and learning the fundamental concepts of a game engine.",
        "duration": "Days 1-4",
        "color": "#A78BFA",
        "steppingStones": [
          {
            "stepId": 1,
            "title": "Choose Your Engine & Setup",
            "description": "Research popular industry-standard game engines (Unity, Unreal Engine). Choose one based on resources and personal preference. Install the engine and set up your first project.",
            "estimatedTime": "6 hours",
            "difficulty": 2,
            "activities": [
              "Watch introductory videos on Unity vs Unreal",
              "Download and install chosen engine",
              "Create a new 2D project",
              "Familiarize yourself with the editor layout via tutorials"
            ],
            "deliverable": "Game engine installed, empty project created, basic editor navigation understood.",
            "resources": [
              "Official Unity/Unreal Engine getting started guides",
              "YouTube channels for beginner game dev tutorials (e.g., Brackeys - Unity, Unreal Engine official channel)"
            ],
            "successCriteria": "Successfully launched the engine and created a new project. Can identify key editor windows (Hierarchy, Project, Inspector, Scene).",
            "rewards": {
              "xp": 100,
              "skillUnlock": "Game Engine Familiarity (Level 1)"
            }
          },
          {
            "stepId": 2,
            "title": "Core Engine Concepts",
            "description": "Learn about the basic building blocks of your chosen engine: GameObjects (or Actors), Components, and Scenes (or Levels).",
            "estimatedTime": "7 hours",
            "difficulty": 2,
            "activities": [
              "Watch tutorials explaining GameObjects/Actors and their properties",
              "Learn about the role of Components/Blueprints",
              "Understand how Scenes/Levels work",
              "Create simple GameObjects/Actors in the scene"
            ],
            "deliverable": "Basic understanding of engine hierarchy and components. Can create and manipulate simple objects in a scene.",
            "rewards": {
              "xp": 80
            }
          },
          {
            "stepId": 3,
            "title": "Scripting Basics",
            "description": "Introduce yourself to the primary scripting language (C# for Unity, Blueprints or C++ for Unreal). Learn how to create scripts/blueprints and attach them to objects.",
            "estimatedTime": "7 hours",
            "difficulty": 3,
            "activities": [
              "Watch beginner tutorials on C# scripting (Unity) or Blueprints (Unreal)",
              "Learn about variables, data types, and basic functions (Start/Awake, Update/Tick)",
              "Write a very simple script (e.g., print a message to console)",
              "Attach the script to a GameObject/Actor"
            ],
            "deliverable": "Created and successfully ran a basic script attached to an object.",
            "rewards": {
              "xp": 100,
              "skillUnlock": "Basic Scripting (Engine-Specific)"
            }
          },
          {
            "stepId": 4,
            "title": "Player Input & Movement",
            "description": "Implement basic player movement based on keyboard input.",
            "estimatedTime": "6 hours",
            "difficulty": 3,
            "activities": [
              "Watch tutorials on handling player input (Input Manager/System)",
              "Learn different methods for object movement (transform, physics)",
              "Write a script to move an object based on input"
            ],
            "deliverable": "A controllable object that moves left/right/up/down based on keyboard input.",
            "rewards": {
              "xp": 90
            }
          }
        ]
      },
      {
        "worldId": 2,
        "title": "World & Interactions",
        "description": "Adding a basic environment to your game and enabling simple interactions.",
        "duration": "Days 5-8",
        "color": "#4ADE80",
        "steppingStones": [
          {
            "stepId": 5,
            "title": "Tilemaps & Environment Setup",
            "description": "Learn how to use Tilemaps (Unity) or Tiled workflow (Unreal) to create 2D levels using sprite assets.",
            "estimatedTime": "6 hours",
            "difficulty": 3,
            "activities": [
              "Watch tutorials on using the Tilemap system (Unity) or importing/using Tiled maps (Unreal)",
              "Import or create a simple tile set (can be placeholder squares)",
              "Design a small test level using the tilemap/tiled approach"
            ],
            "deliverable": "A scene with a basic level structure built using tile-based assets.",
            "rewards": {
              "xp": 90
            }
          },
          {
            "stepId": 6,
            "title": "Collisions & Basic Physics",
            "description": "Add collision detection to your player and environmental tiles to prevent walking through walls.",
            "estimatedTime": "7 hours",
            "difficulty": 3,
            "activities": [
              "Watch tutorials on 2D physics and collision components (Colliders, Rigidbody)",
              "Add necessary components to player and tiles",
              "Configure physics settings if needed"
            ],
            "deliverable": "Player object can no longer move through solid parts of the tiled environment.",
            "rewards": {
              "xp": 90
            }
          },
          {
            "stepId": 7,
            "title": "Simple Object Interaction",
            "description": "Learn how to detect when the player interacts with an object (e.g., clicking on it, walking into a trigger area). Implement a basic action like displaying a message.",
            "estimatedTime": "7 hours",
            "difficulty": 3,
            "activities": [
              "Watch tutorials on raycasting, trigger volumes, or click detection",
              "Create a simple interactive object (e.g., a sign post)",
              "Write a script to detect player interaction and trigger an event (e.g., show text in console)"
            ],
            "deliverable": "An object in the scene that triggers a response when the player interacts with it.",
            "rewards": {
              "xp": 90
            }
          }
        ]
      },
      {
        "worldId": 3,
        "title": "Game Mechanics & UI Concepts",
        "description": "Exploring simplified versions of core Stardew Valley mechanics and implementing basic user interface elements.",
        "duration": "Days 9-12",
        "color": "#34D399",
        "steppingStones": [
          {
            "stepId": 8,
            "title": "Basic Inventory System Concept",
            "description": "Design the data structure for a simple inventory (e.g., an array or list). Learn how to add and potentially display items (even if just text).",
            "estimatedTime": "7 hours",
            "difficulty": 4,
            "activities": [
              "Research inventory system data structures",
              "Watch tutorials on managing data within scripts",
              "Write code to represent a player's inventory",
              "Add placeholder items to the inventory"
            ],
            "deliverable": "A script that holds a collection of 'items' (represented simply, e.g., by name).",
            "rewards": {
              "xp": 110,
              "badge": "Data Architect"
            }
          },
          {
            "stepId": 9,
            "title": "Farming/Resource Gathering Concept",
            "description": "Implement a simplified mechanic related to Stardew Valley's core loop, such as interacting with a resource node to 'collect' an item into the inventory concept.",
            "estimatedTime": "7 hours",
            "difficulty": 4,
            "activities": [
              "Design a simple resource node object (e.g., a rock or tree)",
              "Combine interaction logic from World 2 with inventory logic from Step 1",
              "Write a script to 'gather' an item from the node and add it to the inventory when interacted with"
            ],
            "deliverable": "An interactive object that, upon interaction, adds an item to the player's conceptual inventory.",
            "rewards": {
              "xp": 120
            }
          },
          {
            "stepId": 10,
            "title": "Basic UI Implementation",
            "description": "Use your Figma/Adobe skills to design basic UI elements (like an inventory slot or health bar). Implement these UI elements in the game engine using the engine's UI system.",
            "estimatedTime": "7 hours",
            "difficulty": 3,
            "activities": [
              "Design simple UI mockups in Figma/Adobe (e.g., inventory slot icon/background)",
              "Learn the basics of the engine's UI system (Canvas, UI elements like Images, Text)",
              "Create a simple UI display in the game scene (e.g., display text indicating collected items)",
              "Integrate the basic inventory count display with the UI element"
            ],
            "deliverable": "A simple visual UI element is displayed on screen, potentially showing dynamic game data (like the number of collected items).",
            "rewards": {
              "xp": 110,
              "skillUnlock": "In-Engine UI Implementation"
            }
          }
        ]
      },
      {
        "worldId": 4,
        "title": "Polish, Testing & Next Steps",
        "description": "Refining your prototype, testing what you've built, and planning for future development.",
        "duration": "Days 13-15",
        "color": "#F87171",
        "steppingStones": [
          {
            "stepId": 11,
            "title": "Bug Fixing & Refinement",
            "description": "Playtest your prototype. Identify and fix any bugs in movement, interaction, or UI. Improve the feel or clarity where possible.",
            "estimatedTime": "6 hours",
            "difficulty": 3,
            "activities": [
              "Thoroughly test player movement and object interaction",
              "Look for errors in the engine's console",
              "Refactor simple code segments for clarity",
              "Make minor adjustments based on playtesting"
            ],
            "deliverable": "A more stable and polished basic prototype.",
            "rewards": {
              "xp": 80
            }
          },
          {
            "stepId": 12,
            "title": "Basic Sound & Visual Polish",
            "description": "If time permits, add simple visual effects (e.g., particle system on interaction) or basic sound effects.",
            "estimatedTime": "5 hours",
            "difficulty": 2,
            "activities": [
              "Watch tutorials on adding particle effects or playing sound effects",
              "Find free placeholder sound/particle assets",
              "Implement one or two simple visual/audio cues (e.g., sound on interaction)"
            ],
            "deliverable": "The prototype includes at least one basic visual effect or sound effect.",
            "rewards": {
              "xp": 70
            }
          },
          {
            "stepId": 13,
            "title": "Project Reflection & Next Steps",
            "description": "Review what you learned, document your progress, and plan what features you would add next if continuing the project. Reflect on the challenges and successes.",
            "estimatedTime": "4 hours",
            "difficulty": 1,
            "activities": [
              "Write down key learnings about the engine and game development",
              "Outline features for a potential 'Awesome Project v2'",
              "Identify areas where you need further learning",
              "Organize your project files"
            ],
            "deliverable": "A document outlining learnings, project status, and future plans.",
            "rewards": {
              "xp": 50,
              "badge": "Planner"
            }
          }
        ]
      }
    ]
  };

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