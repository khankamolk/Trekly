import { GoogleGenAI } from '@google/genai';

export async function generateRoadmap(formData) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error('GEMINI API key is missing.');
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
        System Prompt:
        You are an expert project planning assistant. Your task is to generate a comprehensive, step-by-step project roadmap based on user-provided details. The output MUST be a valid JSON object adhering to the schema provided below. Do not include any explanatory text, comments, or markdown formatting like \`\`\`json around the JSON object itself.

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
        - Desired Project Name: ${formData.projectName} (If empty, please generate a creative and relevant project name based on the project goal)

        JSON Schema to follow strictly:
        {
            "title": "string // Project title. Use Desired Project Name if provided, otherwise generate one.",
            "totalDuration": "string // Estimated total duration (e.g., 'X weeks', 'Y months')",
            "difficulty": "string // Reflects user's experience level (e.g., 'beginner', 'intermediate', 'advanced')",
            "avatar": {
                "startingLevel": 1,
                "totalXPNeeded": 1000,
                "currentXP": 0
            },
            "worlds": [
                {
                    "worldId": "number // Sequential ID, starting from 1",
                    "title": "string // Title for this phase/module",
                    "description": "string // Brief description of this world/phase",
                    "duration": "string // Estimated duration for this world/phase (e.g., 'Days 1-10', 'Week 1-2')",
                    "color": "string // A hex color code (e.g., '#8B5CF6'). Generate a suitable color.",
                    "steppingStones": [
                        {
                        "stepId": "number // Sequential ID within the world, starting from 1",
                        "title": "string // Title for this task/step",
                        "description": "string // Detailed description of what needs to be done",
                        "estimatedTime": "string // Estimated time to complete (e.g., '3 hours', '2 days')",
                        "difficulty": "number // Task difficulty rating from 1 (easy) to 5 (very hard)",
                        "activities": ["string"],
                        "deliverable": "string // Tangible output for this step",
                        "resources": ["string"],
                        "successCriteria": "string // How to know this step is completed",
                        "rewards": {
                            "xp": "number",
                            "badge": "string (optional)",
                            "skillUnlock": "string (optional)"
                        }
                    ]
                }
            ]
        }

        Generate ONLY the JSON object.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17',
        contents: prompt,
        config: { responseMimeType: "application/json" },
    });

    let jsonStr = response.text.trim();
    const match = jsonStr.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
    if (match) {
      jsonStr = match[1].trim();
    }

    try {
        const parsed = JSON.parse(jsonStr);
        return parsed;
    } catch (err) {
        throw new Error('Invalid JSON returned: ' + jsonStr);
    }
}

