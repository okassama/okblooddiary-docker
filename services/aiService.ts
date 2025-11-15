import { GoogleGenAI } from "@google/genai";
import { Reading } from "../types";
import { getBasicInsights } from "./insightService";

const generatePrompt = (readings: Reading[]): string => {
    const recentReadings = readings.slice(0, 14).map(r => 
        `- ${r.date} ${r.timeOfDay}: ${r.systolic}/${r.diastolic}, Pulse: ${r.pulse}`
      ).join('\n');
    
    return `
    Based on the following recent blood pressure readings, provide a brief, easy-to-understand analysis of potential trends and general wellness recommendations.

    Recent Readings (Systolic/Diastolic):
    ${recentReadings}

    Please provide your analysis in Markdown format. The analysis should:
    1.  Start with a brief, overall summary of the readings (e.g., "Your recent readings appear to be mostly in the 'Elevated' range.").
    2.  Identify any noticeable trends (e.g., "There's a slight upward trend in your morning systolic readings.").
    3.  Offer 2-3 general, non-prescriptive wellness tips related to blood pressure management (e.g., related to diet, exercise, stress).
    4.  IMPORTANT: Conclude with a clear disclaimer that this is not medical advice and the user should consult a healthcare professional for any health concerns.

    Keep the tone encouraging and supportive. Do not diagnose any conditions.
  `;
};

const getGeminiInsights = async (apiKey: string, prompt: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
};

const getOpenAICompatibleInsights = async (apiUrl: string, apiKey: string, model: string, prompt: string): Promise<string> => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };

    if (apiUrl.includes('openrouter')) {
        headers['HTTP-Referer'] = 'https://ok-blood-diary.web.app';
        headers['X-Title'] = 'OK Blood Diary';
    }

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            model: model,
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 350,
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error?.message || `Request to ${apiUrl} failed.`);
    }
    const data = await response.json();
    return data.choices[0].message.content;
};

export type AIProvider = 'none' | 'gemini' | 'deepseek' | 'perplexity' | 'openrouter';

export const getAIInsights = async (readings: Reading[], provider: AIProvider, apiKey: string): Promise<string> => {
    if (provider === 'none' || !apiKey) {
        return Promise.resolve(getBasicInsights(readings));
    }
    
    if (readings.length < 3) {
      return Promise.resolve("Record at least 3 readings to get personalized AI insights.");
    }

    const prompt = generatePrompt(readings);

    try {
        switch (provider) {
            case 'gemini':
                return await getGeminiInsights(apiKey, prompt);
            case 'deepseek':
                return await getOpenAICompatibleInsights('https://api.deepseek.com/chat/completions', apiKey, 'deepseek-chat', prompt);
            case 'perplexity':
                 return await getOpenAICompatibleInsights('https://api.perplexity.ai/chat/completions', apiKey, 'llama-3-sonar-small-32k-online', prompt);
            case 'openrouter':
                 return await getOpenAICompatibleInsights('https://openrouter.ai/api/v1/chat/completions', apiKey, 'mistralai/mistral-7b-instruct-v0.2', prompt);
            default:
                return Promise.resolve(getBasicInsights(readings));
        }
    } catch (error: any) {
        console.error(`Error fetching insights from ${provider}:`, error);
        throw error;
    }
};