import chatModel from '../models/chat.model.js'
import { getAiResponse } from '../services/ai.service.js'

export async function createChatController(req, res){
    try{
        const { userId, message } = req.body

        if(!userId || !message){
            return res.status(400).json({ message: 'userId and message are required' })
        }

        const aiResponse = await getAiResponse(message)

        if(!aiResponse){
            return res.status(502).json({ message: 'No response from AI provider' })
        }
        

        const chatDoc = await chatModel.create({
            userId,
            userMessage: message,
            aiResponse,
            timestamp: new Date()
        })

        return res.status(201).json({
            message: 'Chat created',
            data: {
                id: chatDoc._id,
                userId: chatDoc.userId,
                userMessage: chatDoc.userMessage,
                aiResponse: chatDoc.aiResponse,
                timestamp: chatDoc.timestamp
            }
        })
    }catch(error){
        const status = error.status || 500
        return res.status(status).json({ message: 'Failed to create chat', error: error.message })
    }
}


