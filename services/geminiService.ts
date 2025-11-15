
import { GoogleGenAI } from "@google/genai";
import { Reading } from "../types";

// FIX: Initialize with process.env.API_KEY directly as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getBloodPressureInsights = async (readings: Reading[]): Promise<string> => {
  // FIX: Remove API key check, as its presence is assumed by the guidelines.
  
  if (readings.length < 3) {
    return Promise.resolve("Record at least 3 readings to get personalized insights.");
  }

  const recentReadings = readings.slice(0, 14).map(r => 
    `- ${r.date} ${r.timeOfDay}: ${r.systolic}/${r.diastolic}, Pulse: ${r.pulse}`
  ).join('\n');

  const prompt = `
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

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error fetching insights from Gemini API:", error);
    return "Could not fetch insights at this time. Please try again later.";
  }
};
