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
    // Enhanced detection: check for Indonesian words/patterns
    const indonesianPatterns = /\b(apa|bagaimana|berapa|dimana|di mana|kapan|siapa|mengapa|kenapa|saya|kamu|anda|dengan|untuk|dari|yang|ini|itu|ada|tidak|bisa|mau|ingin|terima|kasih|tolong|mohon|produk|filter|harga|informasi|tentang|perusahaan|pabrik)\b/i;
    return indonesianPatterns.test(text) ? 'id' : 'en';
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
        
        // Auto-detect language from current message
        const userLang = detectLanguage(msg.text);
        userLanguages.set(msg.chat.id, userLang);
        console.log(`Detected language: ${userLang}`);
        
        try {
            const response = await generateResponse(msg.text, userLang);
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
            console.error('Error processing message:', error);
        }
    });

    // Handle the image from the user
    bot.on('photo', async (msg) => {
        if(!msg || !msg.photo || msg.photo.length === 0) return;

        console.log("consuming image from user");
        const photo = msg.photo[msg.photo.length - 1];
        const fileId = photo.file_id;

        // Get user's language preference
        let userLang = userLanguages.get(msg.chat.id) || 'en';

        try {
            const filePath = await bot.downloadFile(fileId, './downloads');
            const response = await generateImageResponse(filePath, userLang);
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
            console.error('Error processing image:', error);
        }
    });
};