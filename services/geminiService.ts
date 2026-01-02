
import { GoogleGenAI, Type } from "@google/genai";
import { MoodType, PromptResult } from "../types";

export const generateMusicContent = async (mood: MoodType): Promise<PromptResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const systemInstruction = `
    You are an expert AI music prompt engineer and professional songwriter.
    Your task is to generate:
    1. A highly detailed, professional English music prompt for tools like Suno/Udio. Include genre, tempo, instruments, and atmosphere.
    2. Meaningful song lyrics (Verse and Chorus) that match the mood and the music prompt.
    
    Output must be in JSON format.
  `;

  const promptText = `Generate a music prompt and matching lyrics for the mood: ${mood}. The prompt and lyrics must be in English.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: promptText,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prompt: {
              type: Type.STRING,
              description: 'The technical music prompt for the AI generator.',
            },
            lyrics: {
              type: Type.STRING,
              description: 'The song lyrics with stanzas (Verse, Chorus, etc.).',
            },
          },
          required: ["prompt", "lyrics"],
        },
      },
    });

    const result = JSON.parse(response.text || '{}');
    return {
      prompt: result.prompt || "Prompt could not be generated.",
      lyrics: result.lyrics || "Lyrics could not be generated."
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("İçerik oluşturulurken bir hata oluştu.");
  }
};
