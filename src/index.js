// Initialize Telegram Bot
import telegramBot from './bot.js';
import telegramHandler from './handlers/command.js';
telegramHandler(telegramBot);

// Initialize WhatsApp Bot
import { connectToWhatsApp } from './whatsapp.js';
import whatsappHandler from './handlers/whatsapp.js';

// Initialize Web Server for QR Code
import { startWebServer } from './webserver.js';

async function startBots() {
    console.log('==============================================');
    console.log('Starting MubAI - Multi-Platform Bot');
    console.log('==============================================\n');
    
    // Start Telegram bot
    console.log('✓ Telegram bot is running...\n');
    
    // Start Web Server for WhatsApp QR Code
    await startWebServer(3000);
    
    // Start WhatsApp bot with timeout
    console.log('Initializing WhatsApp bot...');
    try {
        const whatsappClient = await Promise.race([
            connectToWhatsApp(),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('WhatsApp connection timeout')), 60000)
            )
        ]);
        whatsappHandler(whatsappClient);
    } catch (error) {
        console.error('⚠️ WhatsApp initialization error:', error.message);
        console.log('⚠️ WhatsApp bot will retry in background. Telegram bot continues...');
        // Don't crash the whole app, just log and continue with Telegram
    }
    
    console.log('\n==============================================');
    console.log('All bots are now active!');
    console.log('==============================================\n');
}

// Start all bots
startBots().catch(err => {
    console.error('Error starting bots:', err);
    process.exit(1);
});
