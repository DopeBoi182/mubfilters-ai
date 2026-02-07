import { generateResponse, generateImageResponse } from '../openai.js';
import { saveConversation } from '../utils/conversationLogger.js';

// Store user language preferences
const userLanguages = new Map();

// Helper function to send messages
async function sendFormattedMessage(bot, chatId, text) {
    try {
        await bot.sendMessage(chatId, text);
    } catch (error) {
        console.error('Failed to send message:', error);
    }
}

// Helper function to detect language from text
function detectLanguage(text) {
    // Enhanced detection: check for English words/patterns
    // Default to Indonesian, only switch to English if English patterns are detected
    const englishPatterns = /\b(what|how|when|where|who|why|can|could|would|should|will|is|are|was|were|the|a|an|and|or|but|if|then|this|that|these|those|hello|hi|hey|please|thank|thanks|product|price|information|about|company|factory)\b/i;
    return englishPatterns.test(text) ? 'en' : 'id';
}

export default (bot) => {
    // Starting point of the bot itself
    bot.onText(/\/start/, async (msg) => {   
        const welcomeMessage = 
            "Hi I'm MubAI, how can I assist you today?\n\n" +
            "Hai saya MubAI, bagaimana saya bisa membantu Anda hari ini?";
        
        bot.sendMessage(msg.chat.id, welcomeMessage);
    });

    // Handle all other messages -> I can do all the stuff in here, everytime I send a text it will be here
    bot.on('message', async (msg) => {
        if (!msg.text || msg.text.startsWith('/')) return;

        console.log(`consuming text from user: ${msg.text}`);
        
        // Start typing indicator
        const chatId = msg.chat.id;
        let typingInterval;
        
        // Send typing action immediately
        bot.sendChatAction(chatId, 'typing').catch(err => 
            console.error('Failed to send typing action:', err)
        );
        
        // Keep typing indicator active (Telegram typing expires after ~5 seconds)
        typingInterval = setInterval(() => {
            bot.sendChatAction(chatId, 'typing').catch(err => 
                console.error('Failed to send typing action:', err)
            );
        }, 4000); // Send every 4 seconds
        
        // Auto-detect language from current message
        const userLang = detectLanguage(msg.text);
        userLanguages.set(msg.chat.id, userLang);
        console.log(`Detected language: ${userLang}`);
        
        try {
            const response = await generateResponse(msg.text, userLang);
            
            // Stop typing indicator before sending response
            if (typingInterval) {
                clearInterval(typingInterval);
            }
            
            await sendFormattedMessage(bot, msg.chat.id, response);
            
            // Save conversation to MongoDB
            await saveConversation({
                chatId: msg.chat.id,
                chatType: msg.chat.type,
                userId: msg.from.id,
                username: msg.from.username || null,
                firstName: msg.from.first_name || null,
                lastName: msg.from.last_name || null,
                question: msg.text,
                answer: response,
                messageType: 'text',
                language: userLang,
            });
        } catch (error) {
            // Stop typing indicator on error
            if (typingInterval) {
                clearInterval(typingInterval);
            }
            console.error('Error processing message:', error);
        }
    });

    // Handle the image from the user
    bot.on('photo', async (msg) => {
        if(!msg || !msg.photo || msg.photo.length === 0) return;

        console.log("consuming image from user");
        
        // Start typing indicator
        const chatId = msg.chat.id;
        let typingInterval;
        
        // Send typing action immediately
        bot.sendChatAction(chatId, 'typing').catch(err => 
            console.error('Failed to send typing action:', err)
        );
        
        // Keep typing indicator active (Telegram typing expires after ~5 seconds)
        typingInterval = setInterval(() => {
            bot.sendChatAction(chatId, 'typing').catch(err => 
                console.error('Failed to send typing action:', err)
            );
        }, 4000); // Send every 4 seconds
        
        const photo = msg.photo[msg.photo.length - 1];
        const fileId = photo.file_id;

        // Get user's language preference (default to Indonesian)
        let userLang = userLanguages.get(msg.chat.id) || 'id';

        try {
            const filePath = await bot.downloadFile(fileId, './downloads');
            const response = await generateImageResponse(filePath, userLang);
            
            // Stop typing indicator before sending response
            if (typingInterval) {
                clearInterval(typingInterval);
            }
            
            await sendFormattedMessage(bot, msg.chat.id, response);
            
            // Save conversation to MongoDB
            await saveConversation({
                chatId: msg.chat.id,
                chatType: msg.chat.type,
                userId: msg.from.id,
                username: msg.from.username || null,
                firstName: msg.from.first_name || null,
                lastName: msg.from.last_name || null,
                question: '[Image]', // Since there's no text with image
                answer: response,
                messageType: 'image',
                language: userLang,
            });
        } catch (error) {
            // Stop typing indicator on error
            if (typingInterval) {
                clearInterval(typingInterval);
            }
            console.error('Error processing image:', error);
        }
    });
};