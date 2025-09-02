import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userai',
        required: true
    },
    threadId: {
        type: String,
        index: true,
        default: null
    },
    userMessage: {
        type: String,
        required: true,
        trim: true
    },
    aiResponse: {
        type: String,
        required: true,
        trim: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const chatModel = mongoose.model('chat', chatSchema);

export default chatModel;


