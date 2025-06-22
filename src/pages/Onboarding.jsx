import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

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

  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOutput(null);

    const prompt = `
System Prompt:
You are an expert project planning assistant. Your task is to generate a comprehensive, step-by-step project roadmap based on user-provided details...

User-Provided Details:
- Project Goal: ${formData.projectGoal}
- Initial Ideas/Resources/Blockers: ${formData.initialIdeas || 'Not specified'}
- Project Start Date: ${formData.startDate || 'Not specified'}
- Project End Date: ${formData.endDate || 'Not specified'}
- Time Commitment: ${formData.timeCommitment || 'Not specified'}
- Experience Level: ${formData.experienceLevel}
- Current Skills/Tools: ${formData.currentSkills || 'Not specified'}
- Learning Goals from Project: ${formData.learningGoals || 'Not specified'}
- Preferred Learning Styles: ${formData.learningPreferences || 'Not specified'}
- Desired Project Name: ${formData.projectName || 'N/A'}

JSON Schema to follow strictly:
{ ...your schema goes here... }
`;

    try {
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      let text = response.text.trim();
      const match = text.match(/^```(?:json)?\s*\n?(.*?)\n?\s*```$/s);
      if (match && match[1]) {
        text = match[1].trim();
      }

      const parsed = JSON.parse(text);
      setOutput(parsed);
    } catch (err) {
      console.error(err);
      setError('Failed to generate roadmap. ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
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
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Roadmap'}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {output && (
        <pre className="mt-4 bg-gray-100 p-4 text-sm overflow-auto rounded whitespace-pre-wrap">
          {JSON.stringify(output, null, 2)}
        </pre>
      )}
    </div>
  );
}
