# 🚀 Quick Start - MubAI WhatsApp Bot

## One-Command Setup

```bash
# Install dependencies (first time only)
npm install

# Start the bot
npm start
```

## WhatsApp Setup (30 seconds)

1. **Run the bot** → QR code appears in terminal
2. **Open WhatsApp** on your phone
3. **Tap Settings** → Linked Devices → Link a Device
4. **Scan QR code** → Done! ✅

## Test It

Send a message to your WhatsApp number:
```
Hello, what products do you offer?
```

Or in Indonesian:
```
Halo, produk apa yang Anda tawarkan?
```

## That's It! 🎉

The bot will:
- ✅ Detect your language automatically
- ✅ Answer questions about MUB Filters
- ✅ Work on both WhatsApp and Telegram
- ✅ Remember your session (no need to scan QR again)

## Common Commands

```bash
# Start bot
npm start

# Stop bot (while running)
Ctrl + C

# Reinstall dependencies
npm install

# Reset WhatsApp session
# (On Windows)
rmdir /s auth_info_baileys

# (On Mac/Linux)
rm -rf auth_info_baileys
```

## Troubleshooting

**QR Code not showing?**
→ Check internet connection

**Bot not responding?**
→ Check OpenAI API key in code (line 7 of src/openai.js)

**Need to change WhatsApp account?**
→ Delete `auth_info_baileys` folder and restart

## What Works ✅

- ✅ Text messages on WhatsApp
- ✅ Text messages on Telegram
- ✅ Image analysis on Telegram
- ✅ Auto language detection (EN/ID)
- ✅ Group chats
- ✅ Personal chats

## Need More Help?

📖 Read: `WHATSAPP_SETUP.md` for detailed guide
📖 Read: `README.md` for full documentation
📖 Read: `IMPLEMENTATION_SUMMARY.md` for technical details

