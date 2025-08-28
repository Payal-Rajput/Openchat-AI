import dotenv from 'dotenv';

dotenv.config();

const  config={
    Mongodb_URL:process.env.Mongodb_URL,

    // PUBLIC_KEY:process.env.PUBLIC_KEY,

    // PRIVATE_KEY:process.env.PRIVATE_KEY,

    // URL_ENDPOINT:process.env.URL_ENDPOINT,

    JWT_SECRET:process.env.JWT_SECRET,


    // OPENAI_API_KEY:process.env.OPENAI_API_KEY,

    // OPENAI_MODEL:process.env.OPENAI_MODEL,

    GEMINI_API_KEY:process.env.GEMINI_API_KEY,
    
    GEMINI_SYSTEM_INSTRUCTION:process.env.GEMINI_SYSTEM_INSTRUCTION,

    EMAIL_USER:process.env.EMAIL_USER,
    
    EMAIL_PASS:process.env.EMAIL_PASS,
    



}

export default config;