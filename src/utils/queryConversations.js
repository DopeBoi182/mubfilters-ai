/**
 * Utility script to query conversations from MongoDB
 * 
 * Usage examples:
 * 
 * // Get all conversations for a specific chat
 * import { getConversationsByChatId } from './utils/queryConversations.js';
 * const conversations = await getConversationsByChatId(123456789);
 * 
 * // Get all conversations for a specific user
 * import { getConversationsByUserId } from './utils/queryConversations.js';
 * const conversations = await getConversationsByUserId(123456789);
 * 
 * // Get all unique chat IDs
 * import { getAllChatIds } from './utils/queryConversations.js';
 * const chatIds = await getAllChatIds();
 */

// Re-export functions from conversationLogger for convenience
export {
    getConversationsByChatId,
    getConversationsByUserId,
    getAllChatIds
} from './conversationLogger.js';

// Example usage function
export async function printConversationStats() {
    const { getAllChatIds, getConversationsByChatId } = await import('./conversationLogger.js');
    const { connectDatabase } = await import('../database.js');
    
    await connectDatabase();
    
    const chatIds = await getAllChatIds();
    console.log(`\nTotal unique chats: ${chatIds.length}\n`);
    
    for (const chatId of chatIds.slice(0, 5)) { // Show first 5 chats
        const conversations = await getConversationsByChatId(chatId, 10);
        console.log(`Chat ID: ${chatId}`);
        console.log(`  Conversations: ${conversations.length}`);
        if (conversations.length > 0) {
            console.log(`  User: ${conversations[0].firstName || 'Unknown'} ${conversations[0].lastName || ''} (@${conversations[0].username || 'N/A'})`);
            console.log(`  Last message: ${conversations[0].timestamp}`);
        }
        console.log('');
    }
}


