# WhatsApp Bot Setup Guide

This guide will help you set up and use the WhatsApp bot functionality.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Bot
```bash
npm start
```

### 3. Scan QR Code
When you run the bot, you'll see a QR code in your terminal that looks like this:

```
==============================================
WHATSAPP QR CODE - Scan with your phone:
==============================================

[QR CODE WILL APPEAR HERE]

==============================================
Open WhatsApp > Linked Devices > Link a Device
==============================================
```

### 4. Link Your Device

**On Your Phone:**
1. Open **WhatsApp**
2. Tap on **⋮** (three dots) or **Settings**
3. Select **Linked Devices**
4. Tap **Link a Device**
5. Scan the QR code from your terminal

### 5. Start Chatting!

Once connected, you'll see:
```
✓ WhatsApp connected successfully!
```

Now you can:
- Send messages directly to the bot
- Get AI-powered responses about MUB Filters
- Chat in English or Bahasa Indonesia (auto-detected)

## Features

### ✅ What Works:
- ✅ Text message support
- ✅ Automatic language detection (EN/ID)
- ✅ Personal and group chat support
- ✅ Session persistence (no need to scan QR every time)
- ✅ Auto-reconnection if connection drops

### ❌ Current Limitations:
- ❌ Image analysis not supported (text only)
- ❌ Voice messages not supported
- ❌ Document sharing not supported

## Session Management

The bot saves your WhatsApp session in the `auth_info_baileys/` folder. This means:
- You only need to scan the QR code **once**
- The bot will remember your session on restart
- No need to re-authenticate unless you log out

### To Reset WhatsApp Session:
If you want to link a different WhatsApp account or if you're having connection issues:

1. Stop the bot (Ctrl+C)
2. Delete the session folder:
   ```bash
   rm -rf auth_info_baileys
   # On Windows:
   rmdir /s auth_info_baileys
   ```
3. Restart the bot and scan a new QR code

## How It Works

### Message Flow:
1. You send a message on WhatsApp
2. Bot receives the message
3. Bot detects your language (English or Indonesian)
4. Bot generates an AI response using OpenAI
5. Bot sends the response back to you

### Language Detection:
The bot automatically detects which language you're using:
- **English messages** → English responses
- **Bahasa Indonesia** → Indonesian responses

### Example Conversations:

**English:**
```
You: What products do you offer?
Bot: MUB Filters offers several types of cigarette filters...
```

**Bahasa Indonesia:**
```
You: Produk apa yang Anda tawarkan?
Bot: MUB Filters menawarkan beberapa jenis filter rokok...
```

## Troubleshooting

### QR Code Not Showing?
- Make sure you have an active internet connection
- Try restarting the bot
- Check that port is not blocked by firewall

### QR Code Expired?
- QR codes expire after a short time
- Simply restart the bot to get a new QR code
- Make sure to scan it quickly

### Connection Lost?
- The bot will automatically try to reconnect
- Check your internet connection
- If it keeps failing, delete `auth_info_baileys` folder and re-scan

### Bot Not Responding?
- Check if the bot process is still running
- Look at the console for error messages
- Verify your OpenAI API key is valid
- Make sure you have OpenAI credits available

### Already Running Error?
- Only one instance of the bot can run at a time
- Check Task Manager (Windows) or Activity Monitor (Mac) for other instances
- Stop any running instances before starting a new one

## Security Notes

⚠️ **Important:**
- Never commit the `auth_info_baileys/` folder to Git (already in `.gitignore`)
- This folder contains your WhatsApp session credentials
- Keep your session data private and secure
- Don't share your session files with anyone

## Multi-Platform Support

The bot runs on **both Telegram and WhatsApp** simultaneously:
- Same AI brain for both platforms
- Same MUB Filters knowledge base
- Consistent responses across platforms
- Independent session management

## Need Help?

If you encounter any issues:
1. Check the console logs for error messages
2. Review this guide for common solutions
3. Make sure all dependencies are installed
4. Verify your API keys are correct

For business inquiries about MUB Filters:
- Email: info@mubfilters.com
- Phone: +62341-3906005
- Website: https://mubfilters.com/

