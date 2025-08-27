import { GoogleGenAI } from "@google/genai";
import config from "../config/config.js";

let aiClient = null;

function getClient(){
    if(!config.GEMINI_API_KEY){
        throw new Error("GEMINI_API_KEY is not configured");
    }
    if(!aiClient){
        aiClient = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY });
    }
    return aiClient;
}

export async function getAiResponse(message, systemInstruction){
    if(!message || typeof message !== 'string' || !message.trim()){
        throw new Error('Invalid message input');
    }
    try{
        const client = getClient();
        const effectiveInstruction = systemInstruction ?? config.GEMINI_SYSTEM_INSTRUCTION;
        const prompt = effectiveInstruction ? `${effectiveInstruction}\n\n${message}` : message;
        const response = await client.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        const text = typeof response?.text === 'function' ? response.text() : response?.text;
        if(!text || (typeof text === 'string' && !text.trim())){
            throw new Error('Empty response from Gemini');
        }
        return typeof text === 'string' ? text : String(text);
    }catch(err){
        // Re-throw with a friendly message so controller can format response
        throw new Error(`Gemini error: ${err.message}`);
    }
}


