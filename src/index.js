// Initialize Telegram Bot
import telegramBot from './bot.js';
import telegramHandler from './handlers/command.js';
import { connectDatabase } from './database.js';
import { startServer } from './server.js';

telegramHandler(telegramBot);

async function startBot() {
    console.log('==============================================');
    console.log('Starting MubAI - Telegram Bot');
    console.log('==============================================\n');
    
    // Connect to MongoDB
    try {
        await connectDatabase();
    } catch (error) {
        console.error('⚠️ Failed to connect to MongoDB. Bot will continue without logging conversations.');
        console.error('Error:', error.message);
    }
    
    // Start Web Server on PORT 8080
    try {
        await startServer();
    } catch (error) {
        console.error('⚠️ Failed to start web server:', error.message);
    }
    
    // Start Telegram bot
    console.log('✓ Telegram bot is running...\n');
    
    console.log('==============================================');
    console.log('Bot is now active!');
    console.log('==============================================\n');
}

// Start bot
startBot().catch(err => {
    console.error('Error starting bot:', err);
    process.exit(1);
});
