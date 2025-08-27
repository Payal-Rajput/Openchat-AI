import { GoogleGenAI } from "@google/genai";
import fetch from "node-fetch";
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

export async function getAiResponse(message, systemInstruction, file, imageUrl){
    if(!message && !file && !imageUrl){
        throw new Error('Provide either message text or an image file');
    }
    try{
        const client = getClient();
        const effectiveInstruction = systemInstruction ?? config.GEMINI_SYSTEM_INSTRUCTION;
        let contents;
        if(file){
            const base64Image = Buffer.from(file.buffer).toString('base64');
            contents = [
                effectiveInstruction ? { role: 'user', parts: [{ text: effectiveInstruction }] } : null,
                {
                    role: 'user',
                    parts: [
                        { inlineData: { mimeType: file.mimetype, data: base64Image } },
                        message ? { text: message } : null
                    ].filter(Boolean)
                }
            ].filter(Boolean)
        }else if(imageUrl){
            // Prefer Gemini file URI ingestion if allowed
            const mimeGuess = inferMimeTypeFromUrl(imageUrl) || 'image/jpeg';
            contents = [
                effectiveInstruction ? { role: 'user', parts: [{ text: effectiveInstruction }] } : null,
                {
                    role: 'user',
                    parts: [
                        { fileData: { fileUri: imageUrl, mimeType: mimeGuess } },
                        message ? { text: message } : null
                    ].filter(Boolean)
                }
            ].filter(Boolean)
            
            // Some environments may not support remote fetch by the model. Fallback: fetch and inline
            try{
                const fetched = await fetch(imageUrl);
                if(fetched.ok){
                    const arrayBuffer = await fetched.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);
                    const contentType = fetched.headers.get('content-type') || mimeGuess;
                    const base64Image = buffer.toString('base64');
                    contents = [
                        effectiveInstruction ? { role: 'user', parts: [{ text: effectiveInstruction }] } : null,
                        {
                            role: 'user',
                            parts: [
                                { inlineData: { mimeType: contentType, data: base64Image } },
                                message ? { text: message } : null
                            ].filter(Boolean)
                        }
                    ].filter(Boolean)
                }
            }catch{ /* ignore; rely on fileData path */ }
        }else{
            const prompt = effectiveInstruction ? `${effectiveInstruction}\n\n${message}` : message;
            contents = prompt;
        }
        const response = await client.models.generateContent({
            model: "gemini-2.5-flash",
            contents,
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

function inferMimeTypeFromUrl(url){
    try{
        const lower = url.split('?')[0].toLowerCase();
        if(lower.endsWith('.png')) return 'image/png';
        if(lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
        if(lower.endsWith('.gif')) return 'image/gif';
        if(lower.endsWith('.webp')) return 'image/webp';
        return undefined;
    }catch{
        return undefined;
    }
}


