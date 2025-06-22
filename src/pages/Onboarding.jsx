import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateRoadmap } from '../api/generateRoadmap';
import { X, ChevronRight, ChevronLeft, Target, Calendar, User, BookOpen, Sparkles, Clock, Award, Brain } from 'lucide-react';

export default function Onboarding() {
  const [formData, setFormData] = useState({
    projectGoal: '',
    initialIdeas: '',
    startDate: '',
    endDate: '',
    timeCommitment: '',
    experienceLevel: '',
    currentSkills: '',
    learningGoals: '',
    projectName: '',
    autoGenerateName: '',
  });

  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const totalSteps = 4;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData({ 
        ...formData, 
        [name]: checked,
        ...(name === 'autoGenerateName' && checked && { projectName: '' })
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const roadmap = await generateRoadmap(formData);
      navigate('/roadmap', { state: { roadmap } });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const stepConfig = [
    {
      title: "Define Your Vision",
      subtitle: "Tell us about your project goals and initial thoughts",
      icon: Target,
      color: "from-violet-500 to-purple-600"
    },
    {
      title: "Timeline & Commitment",
      subtitle: "Set your timeline and availability for this project",
      icon: Calendar,
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "Your Experience",
      subtitle: "Help us understand your current skill level",
      icon: User,
      color: "from-emerald-500 to-teal-600"
    },
    {
      title: "Learning Preferences",
      subtitle: "Customize your learning journey and project details",
      icon: BookOpen,
      color: "from-orange-500 to-red-600"
    }
  ];

  const steps = [
    // Step 1: Project Vision
    <div className="space-y-6" key="step1">
      <div className="space-y-4">
        <div className="relative">
          <Target className="absolute left-3 top-3 h-5 w-5 text-violet-500" />
          <input 
            name="projectGoal" 
            placeholder="What's your main goal? (e.g., launch a zine, build a game, start a podcast)"
            value={formData.projectGoal} 
            onChange={handleChange} 
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm" 
          />
        </div>
        <div className="relative">
          <Brain className="absolute left-3 top-3 h-5 w-5 text-violet-500" />
          <textarea 
            name="initialIdeas" 
            placeholder="Got an idea already brewing? Any blockers? Tell us more..." 
            value={formData.initialIdeas} 
            onChange={handleChange} 
            rows={4}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none" 
          />
        </div>
      </div>
    </div>,

    // Step 2: Timeline
    <div className="space-y-6" key="step2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Start Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-5 w-5 text-blue-500" />
            <input 
              name="startDate" 
              type="date" 
              value={formData.startDate} 
              onChange={handleChange} 
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm" 
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Target End Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-5 w-5 text-blue-500" />
            <input 
              name="endDate" 
              type="date" 
              value={formData.endDate} 
              onChange={handleChange} 
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm" 
            />
          </div>
        </div>
      </div>
      <div className="relative">
        <Clock className="absolute left-3 top-3 h-5 w-5 text-blue-500" />
        <select 
          name="timeCommitment" 
          value={formData.timeCommitment} 
          onChange={handleChange} 
          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm appearance-none cursor-pointer"
        >
          <option value="">How much time can you commit per week?</option>
          <option value="1-3 hours">1-3 hours per week</option>
          <option value="4-8 hours">4-8 hours per week</option>
          <option value="9-15 hours">9-15 hours per week</option>
          <option value="16+ hours">16+ hours per week</option>
        </select>
      </div>
    </div>,

    // Step 3: Experience
    <div className="space-y-6" key="step3">
      <div className="space-y-4">
        <div className="relative">
          <Award className="absolute left-3 top-3 h-5 w-5 text-emerald-500" />
          <select 
            name="experienceLevel" 
            value={formData.experienceLevel} 
            onChange={handleChange} 
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm appearance-none cursor-pointer"
          >
            <option value="">What's your experience level?</option>
            <option value="Beginner">Beginner - Just starting out</option>
            <option value="Intermediate">Intermediate - Some experience</option>
            <option value="Advanced">Advanced - Experienced practitioner</option>
            <option value="Expert">Expert - Deep expertise</option>
          </select>
        </div>
        <div className="relative">
          <User className="absolute left-3 top-3 h-5 w-5 text-emerald-500" />
          <textarea 
            name="currentSkills" 
            placeholder="What are you good at? Could be sketching, editing videos, organizing people, baking sourdough..." 
            value={formData.currentSkills} 
            onChange={handleChange} 
            rows={4}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none" 
          />
        </div>
      </div>
    </div>,

    // Step 4: Learning & Project Details
    <div className="space-y-6" key="step4">
      <div className="space-y-4">
          <div className="relative">
            <BookOpen className="absolute left-3 top-3 h-5 w-5 text-orange-500" />
            <textarea 
              name="learningGoals" 
              placeholder="What specific skills do you want to learn or improve? (e.g., web developement...)" 
              value={formData.learningGoals} 
              onChange={handleChange} 
              rows={3}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none" 
            />
          </div>
          <div className="relative">
            <Sparkles className="absolute left-3 top-3 h-5 w-5 text-orange-500" />
            <input 
              name="projectName"
              placeholder={formData.autoGenerateName ? "We'll generate a name for you!" : "Give your project a name"}
              value={formData.autoGenerateName ? "" : formData.projectName}
              onChange={handleChange}
              disabled={formData.autoGenerateName}
              className={`w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm ${
                formData.autoGenerateName 
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed opacity-75' 
                  : 'bg-white/80 hover:bg-white'
              }`}
            />
          </div>
          {/* Auto-generate toggle */}
          <div className="relative">
            <div className="flex items-center space-x-3 mt-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoGenerateName"
                  name="autoGenerateName"
                  checked={formData.autoGenerateName || false}
                  onChange={handleChange}
                  className="w-4 h-4 text-orange-500 bg-white border-gray-300 rounded focus:ring-orange-500 focus:ring-2 transition-colors"
                />
                <label 
                  htmlFor="autoGenerateName" 
                  className="ml-2 text-sm text-gray-700 cursor-pointer select-none hover:text-gray-900 transition-colors"
                >
                  Let us generate a name for your project
                </label>
              </div>
              {formData.autoGenerateName && (
                <div className="flex items-center text-xs text-orange-600">
                  <Sparkles className="w-3 h-3 mr-1" />
                  <span>AI-powered naming</span>
                </div>
              )}
            </div>
          </div>
      </div>
    </div>
  ];

  const currentStepConfig = stepConfig[step];
  const IconComponent = currentStepConfig.icon;

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-6">
            <Sparkles className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Trekly</h1>
          <p className="text-xl text-gray-600">Let's create a personalized learning journey for your project</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 px-4">
          {stepConfig.map((config, index) => {
            const Icon = config.icon;
            const isActive = index === step;
            const isCompleted = index < step;
            
            return (
              <div key={index} className="flex items-center">
                <div className={`
                  relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300
                  ${isActive ? `bg-gradient-to-r ${config.color} text-white shadow-lg scale-110` : 
                    isCompleted ? 'bg-green-500 text-white' : 
                    'bg-gray-200 text-gray-400'}
                `}>
                  <Icon className="w-6 h-6" />
                  {isActive && (
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${config.color} opacity-30 animate-ping`}></div>
                  )}
                </div>
                {index < stepConfig.length - 1 && (
                  <div className={`
                    w-16 h-1 mx-2 transition-all duration-300
                    ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                  `}></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Main Form Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          {/* Step Header */}
          <div className={`bg-gradient-to-r ${currentStepConfig.color} p-8 text-white`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <IconComponent className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm opacity-80">Step {step + 1} of {totalSteps}</div>
                <div className="text-2xl font-bold">{currentStepConfig.title}</div>
              </div>
            </div>
            <p className="text-lg opacity-90">{currentStepConfig.subtitle}</p>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <div className="min-h-[300px]">
              {steps[step]}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-100">
              <div>
                {step > 0 && (
                  <button 
                    type="button" 
                    onClick={handleBack} 
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 font-medium"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                )}
              </div>

              <div className="flex items-center gap-4">
                {/* Progress indicator */}
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                  <span>{Math.round(((step + 1) / totalSteps) * 100)}% complete</span>
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${currentStepConfig.color} transition-all duration-500 ease-out`}
                      style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {step < steps.length - 1 ? (
                  <button 
                    type="button" 
                    onClick={handleNext} 
                    className={`inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r ${currentStepConfig.color} hover:shadow-lg text-white rounded-xl transition-all duration-200 font-medium transform hover:scale-105`}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    onClick={handleSubmit}
                    className={`
                      inline-flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105
                      ${isLoading ? 
                        'bg-gray-400 cursor-not-allowed' : 
                        `bg-gradient-to-r ${currentStepConfig.color} hover:shadow-lg text-white`
                      }
                    `}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate Roadmap
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}