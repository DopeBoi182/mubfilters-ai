import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
    chatId: {
        type: Number,
        required: true,
        index: true, // Index for faster queries
    },
    chatType: {
        type: String,
        enum: ['private', 'group', 'supergroup', 'channel'],
        required: true,
    },
    userId: {
        type: Number,
        required: true,
    },
    username: {
        type: String,
        default: null,
    },
    firstName: {
        type: String,
        default: null,
    },
    lastName: {
        type: String,
        default: null,
    },
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
    messageType: {
        type: String,
        enum: ['text', 'image'],
        default: 'text',
    },
    language: {
        type: String,
        enum: ['en', 'id'],
        default: 'en',
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true, // Index for time-based queries
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt automatically
});

// Compound index for efficient queries by chatId and timestamp
conversationSchema.index({ chatId: 1, timestamp: -1 });

// Index for user-based queries
conversationSchema.index({ userId: 1, timestamp: -1 });

// Use 'chats' as the collection name
const Conversation = mongoose.model('Conversation', conversationSchema, 'chats');

export default Conversation;

