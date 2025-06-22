import { useNavigate } from 'react-router-dom';
import { generateRoadmap } from '../api/generateRoadmap';
import { useState } from 'react';

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
    learningPreferences: '',
    projectName: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto mb-8">
        <h2 className="text-xl font-bold mb-4">Project Roadmap Generator</h2>
        <form onSubmit={handleSubmit} className="space-y-2">
          <input name="projectGoal" placeholder="Project Goal" value={formData.projectGoal} onChange={handleChange} className="w-full border p-2" />
          <input name="initialIdeas" placeholder="Initial Ideas" value={formData.initialIdeas} onChange={handleChange} className="w-full border p-2" />
          <input name="startDate" type="date" value={formData.startDate} onChange={handleChange} className="w-full border p-2" />
          <input name="endDate" type="date" value={formData.endDate} onChange={handleChange} className="w-full border p-2" />
          <input name="timeCommitment" placeholder="Time Commitment" value={formData.timeCommitment} onChange={handleChange} className="w-full border p-2" />
          <input name="experienceLevel" placeholder="Experience Level" value={formData.experienceLevel} onChange={handleChange} className="w-full border p-2" />
          <input name="currentSkills" placeholder="Current Skills" value={formData.currentSkills} onChange={handleChange} className="w-full border p-2" />
          <input name="learningGoals" placeholder="Learning Goals" value={formData.learningGoals} onChange={handleChange} className="w-full border p-2" />
          <input name="learningPreferences" placeholder="Learning Preferences" value={formData.learningPreferences} onChange={handleChange} className="w-full border p-2" />
          <input name="projectName" placeholder="Project Name" value={formData.projectName} onChange={handleChange} className="w-full border p-2" />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Roadmap'}
          </button>
        </form>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
