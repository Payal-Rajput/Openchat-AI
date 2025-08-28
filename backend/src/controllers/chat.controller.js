import chatModel from '../models/chat.model.js'
import { getAiResponse } from '../services/ai.service.js'




export async function createChatController(req, res){
    try{
        const { userId, message, imageUrl } = req.body
        const file = req.file

        // Use authenticated user's ID from middleware instead of body
        const authenticatedUserId = req.user._id

        if(!message && !file && !imageUrl){
            return res.status(400).json({ message: 'Provide message text, an image file, or imageUrl' })
        }

        const aiResponse = await getAiResponse(message, undefined, file, imageUrl)

        if(!aiResponse){
            return res.status(502).json({ message: 'No response from AI provider' })
        }
        

        const chatDoc = await chatModel.create({
            userId: authenticatedUserId,
            userMessage: message || (file ? `[image:${file.mimetype}]` : (imageUrl ? `[imageUrl:${imageUrl}]` : '')),
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



export async function getChatHistoryController(req, res){
    try{
        // Use authenticated user's ID from middleware
        const authenticatedUserId = req.user._id

        const chatHistory = await chatModel.find({ userId: authenticatedUserId }).sort({ timestamp: 1 })
        return res.status(200).json({
            message: 'Chat history fetched successfully',
            data: chatHistory
        })
        }catch(error){
        const status = error.status || 500
        return res.status(status).json({ message: 'Failed to get chat history', error: error.message })
    }
}


