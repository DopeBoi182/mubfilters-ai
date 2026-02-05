import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';

const bot = new TelegramBot("8232858349:AAEEk8hKW5ci1AaNeuTF16UFJYCpFfBdL7A", { polling: true });
export default bot;