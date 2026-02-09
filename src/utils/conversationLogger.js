import Conversation from '../models/Conversation.js';
import mongoose from 'mongoose';
import { connectDatabase } from '../database.js';

/**
 * Save a conversation to MongoDB
 * @param {Object} conversationData - The conversation data to save
 * @param {Number} conversationData.chatId - Telegram chat ID
 * @param {String} conversationData.chatType - Type of chat (private, group, etc.)
 * @param {Number} conversationData.userId - Telegram user ID
 * @param {String|null} conversationData.username - Username (optional)
 * @param {String|null} conversationData.firstName - First name (optional)
 * @param {String|null} conversationData.lastName - Last name (optional)
 * @param {String} conversationData.question - User's question
 * @param {String} conversationData.answer - Bot's response
 * @param {String} conversationData.messageType - Type of message (text or image)
 * @param {String} conversationData.language - Detected language (en or id)
 */
export async function saveConversation(conversationData) {
    // Check MongoDB connection state
    let connectionState = mongoose.connection.readyState;
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    
    // If disconnected, attempt to reconnect once
    if (connectionState === 0) {
        console.log('⚠️ MongoDB disconnected, attempting to reconnect...');
        try {
            await connectDatabase();
            connectionState = mongoose.connection.readyState;
        } catch (reconnectError) {
            console.log(`⚠️ MongoDB reconnection failed (state: ${connectionState}), skipping conversation save`);
            console.log(`   Connection state: ${connectionState === 0 ? 'disconnected' : connectionState === 2 ? 'connecting' : 'disconnecting'}`);
            return;
        }
    }
    
    if (connectionState !== 1) {
        console.log(`⚠️ MongoDB not connected (state: ${connectionState}), skipping conversation save`);
        console.log(`   Connection state: ${connectionState === 0 ? 'disconnected' : connectionState === 2 ? 'connecting' : 'disconnecting'}`);
        return;
    }

    try {
        console.log(`📝 Attempting to save conversation for chatId: ${conversationData.chatId}`);
        const conversation = new Conversation(conversationData);
        const saved = await conversation.save();
        console.log(`✓ Conversation saved successfully! ID: ${saved._id}, chatId: ${conversationData.chatId}`);
    } catch (error) {
        console.error('❌ Error saving conversation:', error);
        console.error('   Error details:', error.message);
        
        // If it's a connection error, mark as disconnected
        if (error.name === 'MongoServerSelectionError' || 
            error.name === 'MongoNetworkError' ||
            error.message.includes('connection') && error.message.includes('closed')) {
            console.error('   Connection error detected - connection may have been lost');
            // The connection event handlers will attempt reconnection
        }
        
        if (error.errors) {
            console.error('   Validation errors:', error.errors);
        }
        // Don't throw - we don't want to break the bot if logging fails
    }
}

/**
 * Get conversations for a specific chat
 * @param {Number} chatId - Telegram chat ID
 * @param {Number} limit - Maximum number of conversations to return (default: 50)
 * @returns {Promise<Array>} Array of conversations
 */
export async function getConversationsByChatId(chatId, limit = 50) {
    if (mongoose.connection.readyState !== 1) {
        console.log('⚠️ MongoDB not connected');
        return [];
    }

    try {
        const conversations = await Conversation.find({ chatId })
            .sort({ timestamp: -1 })
            .limit(limit)
            .lean();
        return conversations;
    } catch (error) {
        console.error('❌ Error fetching conversations:', error);
        return [];
    }
}

/**
 * Get conversations for a specific user across all chats
 * @param {Number} userId - Telegram user ID
 * @param {Number} limit - Maximum number of conversations to return (default: 50)
 * @returns {Promise<Array>} Array of conversations
 */
export async function getConversationsByUserId(userId, limit = 50) {
    if (mongoose.connection.readyState !== 1) {
        console.log('⚠️ MongoDB not connected');
        return [];
    }

    try {
        const conversations = await Conversation.find({ userId })
            .sort({ timestamp: -1 })
            .limit(limit)
            .lean();
        return conversations;
    } catch (error) {
        console.error('❌ Error fetching conversations:', error);
        return [];
    }
}

/**
 * Get all unique chat IDs (useful for analytics)
 * @returns {Promise<Array>} Array of unique chat IDs
 */
export async function getAllChatIds() {
    if (mongoose.connection.readyState !== 1) {
        console.log('⚠️ MongoDB not connected');
        return [];
    }

    try {
        const chatIds = await Conversation.distinct('chatId');
        return chatIds;
    } catch (error) {
        console.error('❌ Error fetching chat IDs:', error);
        return [];
    }
}


