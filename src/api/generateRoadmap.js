import { GoogleGenAI } from '@google/genai';

class APIKeyError extends Error {
    constructor(message) {
        super(message);
        this.name = 'APIKeyError';
    }
}

class JSONParseError extends Error {
    constructor(message, rawResponse) {
        super(message);
        this.name = 'JSONParseError';
        this.rawResponse = rawResponse;
    }
}

class ValidationError extends Error {
    constructor(message, missingFields) {
        super(message);
        this.name = 'ValidationError';
        this.missingFields = missingFields;
    }
}


// Validate the generated roadmap structure
function validateRoadmapStructure(roadmap) {
    const requiredProps = ['title', 'totalDuration', 'difficulty', 'avatar', 'worlds'];
    const missingFields = [];
    
    for (const prop of requiredProps) {
        if (!roadmap[prop]) {
            missingFields.push(prop);
        }
    }
    
    if (missingFields.length > 0) {
        throw new ValidationError(
            `Roadmap is missing required fields: ${missingFields.join(', ')}`,
            missingFields
        );
    }
    
    if (!Array.isArray(roadmap.worlds) || roadmap.worlds.length === 0) {
        throw new ValidationError('Worlds must be a non-empty array', ['worlds']);
    }
    
    // Validate each world has required properties
    roadmap.worlds.forEach((world, index) => {
        const worldRequiredProps = ['worldId', 'title', 'description', 'steppingStones'];
        const worldMissingFields = [];
        
        worldRequiredProps.forEach(prop => {
            if (!world[prop]) {
                worldMissingFields.push(`world[${index}].${prop}`);
            }
        });
        
        if (worldMissingFields.length > 0) {
            throw new ValidationError(
                `World ${index + 1} is missing required fields: ${worldMissingFields.join(', ')}`,
                worldMissingFields
            );
        }
        
        if (!Array.isArray(world.steppingStones) || world.steppingStones.length === 0) {
            throw new ValidationError(
                `World ${index + 1} must have at least one stepping stone`,
                [`world[${index}].steppingStones`]
            );
        }
    });
}

// Clean and parse JSON response
function cleanAndParseJSON(jsonStr) {
    // Remove markdown code blocks if present
    let cleaned = jsonStr.trim();
    const codeBlockMatch = cleaned.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
    if (codeBlockMatch) {
        cleaned = codeBlockMatch[1].trim();
    }
    
    // Remove any leading/trailing non-JSON content
    const startIndex = cleaned.indexOf('{');
    const endIndex = cleaned.lastIndexOf('}');
    
    if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
        throw new JSONParseError('No valid JSON object found in response', cleaned);
    }
    
    cleaned = cleaned.substring(startIndex, endIndex + 1);
    
    try {
        const parsed = JSON.parse(cleaned);
        validateRoadmapStructure(parsed);
        return parsed;
    } catch (error) {
        if (error instanceof SyntaxError) {
            throw new JSONParseError(`Invalid JSON syntax: ${error.message}`, cleaned);
        }
        throw error;
    }
}

// Enhanced generateRoadmap function with retry logic
export async function generateRoadmap(formData, onProgress = null) {
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 1000; 
    
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
        throw new APIKeyError('GEMINI API key is missing. Please check your environment configuration.');
    }
    
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
        System Prompt:
        You are an expert project planning assistant. Your task is to generate a comprehensive, step-by-step project roadmap based on user-provided details. The output MUST be a valid JSON object adhering to the schema provided below. Do not include any explanatory text, comments, or markdown formatting like \`\`\`json around the JSON object itself.

        CRITICAL: Your response must be ONLY a valid JSON object that can be parsed by JSON.parse(). 

        JSON FORMATTING REQUIREMENTS:
        - Start your response with { and end with }
        - Use double quotes (") for all strings, never single quotes (')
        - Ensure all brackets [ ] and braces { } are properly matched
        - Include commas after every property except the last one in each object/array
        - Do not include trailing commas
        - Do not include any text before or after the JSON object
        - Do not use markdown formatting like \`\`\`json
        - Escape any quotes within strings using \"

        User-Provided Details:
        - Project Goal: ${formData.projectGoal}
        - Initial Ideas/Resources/Blockers: ${formData.initialIdeas || 'Not specified'}
        - Project Start Date: ${formData.startDate || 'Not specified'} 
        - Project End Date: ${formData.endDate || 'Not specified'}
        - Time Commitment: ${formData.timeCommitment || 'Not specified'}
        - Experience Level: ${formData.experienceLevel}
        - Current Skills/Tools: ${formData.currentSkills || 'Not specified'}
        - Learning Goals from Project: ${formData.learningGoals || 'Not specified'}
        - Desired Project Name: ${formData.projectName} 
        - Autogenerate name: ${formData.projectName === 'true' ? 'true' : 'false'} (If value is true, please generate a creative and relevant project name based on the project goal, else use the given desired project name)

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
                    "worldId": "number // Start from 1 and increment for each world (1, 2, 3, 4, etc.)",
                    "title": "string // Title for this phase/module",
                    "description": "string // Brief description of this world/phase",
                    "duration": "string // Estimated duration for this world/phase (e.g., 'Days 1-10', 'Week 1-2')",
                    "color": "string // A hex color code (e.g., '#8B5CF6'). Generate a suitable color.",
                    "steppingStones": [
                        {
                        "stepId": "number // IMPORTANT: Sequential ID across ALL worlds and steps, never restarting. First step in entire project = 1, second step = 2, third step = 3, etc. Continue incrementing across all worlds.",
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

        EXAMPLE stepId numbering:
        World 1: steps have stepId 1, 2, 3
        World 2: steps have stepId 4, 5, 6, 7
        World 3: steps have stepId 8, 9, 10
        (Continue this pattern - never restart numbering)

        Generate ONLY the JSON object following this exact structure.
    `;
    
    let lastError = null;
    
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            // Update progress
            if (onProgress) {
                onProgress({
                    status: 'generating',
                    attempt,
                    maxAttempts: MAX_RETRIES,
                    message: attempt === 1 
                        ? 'Generating your personalized roadmap...' 
                        : `Retry attempt ${attempt}/${MAX_RETRIES}...`
                });
            }
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-preview-04-17',
                contents: prompt,
                config: { responseMimeType: "application/json" },
            });
            
            if (!response || !response.text) {
                throw new Error('Empty response from API');
            }
            
            const roadmap = cleanAndParseJSON(response.text.trim());
            
            // Success! Update progress and return
            if (onProgress) {
                onProgress({
                    status: 'success',
                    message: 'Roadmap generated successfully!'
                });
            }
            
            return roadmap;
            
        } catch (error) {
            lastError = error;
            console.error(`Attempt ${attempt} failed:`, error);
            
            // Don't retry validation errors or API key errors
            if (error instanceof ValidationError || error instanceof APIKeyError) {
                throw error;
            }
            
            // If this isn't the last attempt, wait before retrying
            if (attempt < MAX_RETRIES) {
                const delay = RETRY_DELAY * Math.pow(2, attempt - 1); // Exponential backoff
                
                if (onProgress) {
                    onProgress({
                        status: 'retrying',
                        attempt,
                        maxAttempts: MAX_RETRIES,
                        message: `Attempt ${attempt} failed. Retrying in ${delay/1000} seconds...`,
                        error: error.message
                    });
                }
                
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    
    const errorMessage = getError(lastError);
    throw new Error(errorMessage);
}

// Generate user-friendly error messages
function getError(error) {
    if (error instanceof APIKeyError) {
        return 'API configuration error. Please check your setup and try again.';
    }

    if (error instanceof JSONParseError) {
        return 'We encountered an issue generating your roadmap. Please try submitting your form again with slightly different details.';
    }
    
    if (error.message.includes('quota') || error.message.includes('rate limit')) {
        return 'Service is temporarily busy. Please wait a moment and try again.';
    }
    
    if (error.message.includes('network') || error.message.includes('fetch')) {
        return 'Network connection issue. Please check your internet connection and try again.';
    }
    
    // Generic fallback
    return 'We encountered an unexpected issue generating your roadmap. Please try again, and if the problem persists, try adjusting your project details slightly.';
}