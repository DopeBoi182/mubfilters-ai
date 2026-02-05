import { generateResponse, generateImageResponse } from '../openai.js';

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
    bot.on('message', (msg) => {
        if (!msg.text || msg.text.startsWith('/')) return;

        console.log(`consuming text from user: ${msg.text}`);
        
        // Auto-detect language from current message
        const userLang = detectLanguage(msg.text);
        userLanguages.set(msg.chat.id, userLang);
        console.log(`Detected language: ${userLang}`);
        
        generateResponse(msg.text, userLang).then(response => {   
            sendFormattedMessage(bot, msg.chat.id, response);
        });
    });

    // Handle the image from the user
    bot.on('photo', async (msg) => {
        if(!msg || !msg.photo || msg.photo.length === 0) return;

        console.log("consuming image from user");
        const photo = msg.photo[msg.photo.length - 1];
        const fileId = photo.file_id;

        // Get user's language preference
        let userLang = userLanguages.get(msg.chat.id) || 'en';

        const filePath = await bot.downloadFile(fileId, './downloads');
        generateImageResponse(filePath, userLang).then(response => {
            sendFormattedMessage(bot, msg.chat.id, response);
        }); 
    });
};