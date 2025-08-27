import dotenv from 'dotenv';

dotenv.config();

const  config={
    Mongodb_URL:process.env.Mongodb_URL,

    // PUBLIC_KEY:process.env.PUBLIC_KEY,

    // PRIVATE_KEY:process.env.PRIVATE_KEY,

    // URL_ENDPOINT:process.env.URL_ENDPOINT,

    JWT_SECRET:process.env.JWT_SECRET,

    
    // GEMINI_API_KEY:process.env.GEMINI_API_KEY,
    


}

export default config;