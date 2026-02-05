// Telegram-only version (no WhatsApp) for quick deployment

// Initialize Telegram Bot
import telegramBot from './bot.js';
import telegramHandler from './handlers/command.js';

console.log('==============================================');
console.log('Starting MubAI - Telegram Bot');
console.log('==============================================\n');

// Start Telegram bot
telegramHandler(telegramBot);
console.log('✓ Telegram bot is running...\n');

console.log('==============================================');
console.log('Bot is active and ready!');
console.log('==============================================\n');

// Keep the process alive
process.on('SIGINT', () => {
    console.log('\n\nShutting down bot...');
    process.exit(0);
});

console.log('📱 Send /start to your Telegram bot to begin!');

