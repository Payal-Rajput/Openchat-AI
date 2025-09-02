import chatModel from '../models/chat.model.js'
import { getAiResponse } from '../services/ai.service.js'




export async function createChatController(req, res){
    try{
        const { userId, message, imageUrl, threadId } = req.body
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
            threadId: threadId || null,
            userMessage: message || (file ? `[image:${file.mimetype}]` : (imageUrl ? `[imageUrl:${imageUrl}]` : '')),
            aiResponse,
            timestamp: new Date()
        })

        return res.status(201).json({
            message: 'Chat created',
            data: {
                id: chatDoc._id,
                userId: chatDoc.userId,
                threadId: chatDoc.threadId,
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


export async function deleteAllChatsController(req, res){
    try{
        const authenticatedUserId = req.user._id
        const result = await chatModel.deleteMany({ userId: authenticatedUserId })
        return res.status(200).json({
            message: 'All chats deleted successfully',
            deletedCount: result.deletedCount || 0
        })
    }catch(error){
        const status = error.status || 500
        return res.status(status).json({ message: 'Failed to delete chats', error: error.message })
    }
}

export async function deleteChatByIdController(req, res){
    try{
        const authenticatedUserId = req.user._id
        const { id } = req.params
        console.log('Delete chat request:', { id, authenticatedUserId });
        const deleted = await chatModel.findOneAndDelete({ _id: id, userId: authenticatedUserId })
        if(!deleted){
            console.log('Chat not found for deletion:', { id, authenticatedUserId });
            return res.status(404).json({ message: 'Chat not found' })
        }
        console.log('Chat deleted successfully:', { id, authenticatedUserId });
        return res.status(200).json({ message: 'Chat deleted', id })
    }catch(error){
        console.log('Error deleting chat:', error);
        const status = error.status || 500
        return res.status(status).json({ message: 'Failed to delete chat', error: error.message })
    }
}

