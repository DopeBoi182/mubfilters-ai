import { generateResponse } from '../openai.js';

// Store user language preferences
const userLanguages = new Map();

// Helper function to detect language from text
function detectLanguage(text) {
    // Enhanced detection: check for Indonesian words/patterns
    const indonesianPatterns = /\b(apa|bagaimana|berapa|dimana|di mana|kapan|siapa|mengapa|kenapa|saya|kamu|anda|dengan|untuk|dari|yang|ini|itu|ada|tidak|bisa|mau|ingin|terima|kasih|tolong|mohon|produk|filter|harga|informasi|tentang|perusahaan|pabrik)\b/i;
    return indonesianPatterns.test(text) ? 'id' : 'en';
}

export default (client) => {
    // Handle incoming messages
    client.onMessage(async (message) => {
        // Ignore if no message or if it's from status
        if (!message.body || message.isGroupMsg === false && message.from === 'status@broadcast') return;
        
        // Only handle text messages (ignore images, videos, etc.)
        if (message.type !== 'chat') {
            console.log('Non-text message received, ignoring...');
            return;
        }

        const from = message.from;
        const messageText = message.body;
        const sender = message.sender.pushname || message.sender.id;
        
        console.log(`\n[WhatsApp] Message from ${sender}: ${messageText}`);

        // Auto-detect language from message
        const userLang = detectLanguage(messageText);
        userLanguages.set(from, userLang);
        console.log(`Detected language: ${userLang}`);

        try {
            // Generate AI response
            const response = await generateResponse(messageText, userLang);
            
            // Send response back
            await client.sendText(from, response);
            console.log(`[WhatsApp] Response sent to ${sender}`);
        } catch (error) {
            console.error('Error processing WhatsApp message:', error);
            const errorMsg = userLang === 'id' 
                ? 'Maaf, terjadi kesalahan. Silakan coba lagi.'
                : 'Sorry, an error occurred. Please try again.';
            await client.sendText(from, errorMsg);
        }
    });

    console.log('✓ WhatsApp message handler initialized');
};
