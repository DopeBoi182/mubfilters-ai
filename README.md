# MubAI Bot - Multi-Platform Intelligent Assistant for MUB Filters

MubAI is a multi-platform bot (Telegram & WhatsApp) powered by OpenAI that serves as an intelligent assistant for **PT Mulia Usaha Bersama (MUB Filters)**, a leading cigarette filter manufacturer in Indonesia.

## About MUB Filters

PT Mulia Usaha Bersama is a premium cigarette filter manufacturer based in Malang, East Java, Indonesia. Founded in 2013, MUB produces over 100,000,000 filter rods monthly with state-of-the-art equipment and stringent quality control.

**Website:** [https://mubfilters.com/](https://mubfilters.com/)

## Features

- 🤖 AI-powered responses about MUB Filters products and services
- 📱 **Multi-platform support** - Works on both Telegram and WhatsApp
- 🌐 **Automatic bilingual support** - English & Bahasa Indonesia (auto-detects language)
- 💬 Text-based conversations
- 🖼️ Image analysis capabilities (Telegram only)
- 📚 Comprehensive knowledge base about:
  - Company information and history
  - Product specifications (Mono Acetate, Menthol, Capsule, Super Slim filters)
  - Production capabilities and equipment
  - Quality control processes
  - Contact information and factory visit arrangements

## Prerequisites

Before running this bot, you need:

1. **Node.js** (v14 or higher)
2. **Telegram Bot Token** - Get from [@BotFather](https://t.me/botfather) on Telegram
3. **OpenAI API Key** - Get from [OpenAI Platform](https://platform.openai.com/api-keys)
4. **WhatsApp Account** - For WhatsApp bot authentication (you'll scan a QR code)

## Installation

1. **Clone the repository** (or navigate to the project directory):
```bash
cd GigRadar
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:

Create a `.env` file in the project root with the following content:

```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here

# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here
```

### How to Get API Keys:

#### Telegram Bot Token:
1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Start a chat and send `/newbot`
3. Follow the instructions to create your bot
4. Copy the token provided and paste it in your `.env` file

#### OpenAI API Key:
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Navigate to API Keys section
4. Create a new secret key
5. Copy the key and paste it in your `.env` file

## Running the Bot

### Option 1: Using npm start (Recommended)
```bash
npm start
```

### Option 2: Using node directly
```bash
node src/index.js
```

Once running, you'll see:
1. **Telegram bot** starts polling for messages
2. **WhatsApp QR Code** appears in the terminal

### Setting up WhatsApp:
1. When you start the bot, a **QR code** will appear in your terminal
2. Open **WhatsApp** on your phone
3. Go to **Settings** > **Linked Devices** > **Link a Device**
4. Scan the QR code displayed in your terminal
5. Once connected, you'll see "✓ WhatsApp connected successfully!"

**Note:** The WhatsApp session will be saved in the `auth_info_baileys` folder, so you only need to scan the QR code once. The bot will automatically reconnect on subsequent runs.

## Usage

### Telegram

#### Starting the Bot
1. Find your bot on Telegram
2. Send `/start` command
3. You'll receive a bilingual welcome message:
   - English: "Hi I'm MubAI, how can I assist you today?"
   - Indonesian: "Hai saya MubAI, bagaimana saya bisa membantu Anda hari ini?"

### WhatsApp

#### Starting Conversations
1. Save the phone number you linked as a contact
2. Send a message to start chatting
3. The bot will automatically respond in the language you use

### Language Support
The bot **automatically detects** the language you're using and responds accordingly:
- Type in **English** → Bot responds in English
- Type in **Bahasa Indonesia** → Bot responds in Bahasa Indonesia
- You can switch languages anytime - just type in your preferred language!

### Asking Questions

**In English:**
- "What products do you offer?"
- "What is your monthly production capacity?"
- "How can I visit your factory?"
- "Do you export to other countries?"
- "Tell me about your quality control process"

**In Bahasa Indonesia:**
- "Produk apa yang Anda tawarkan?"
- "Berapa kapasitas produksi bulanan Anda?"
- "Bagaimana cara mengunjungi pabrik Anda?"
- "Apakah Anda mengekspor ke negara lain?"
- "Ceritakan tentang proses kontrol kualitas Anda"

### Sending Images (Telegram Only)
Send any image related to cigarette filters or production equipment on Telegram, and MubAI will analyze and provide relevant information in your preferred language.

**Note:** Image analysis is currently only supported on Telegram. WhatsApp only supports text messages.

## Bot Capabilities

MubAI can help with:
- **Product Information**: Details about Mono Acetate, Menthol, Capsule, and Super Slim filters
- **Company Details**: Location, contact information, history, and facilities
- **Production Capabilities**: Equipment, capacity, and processes
- **Quality Assurance**: QC processes, testing, and ISO 9001 certification progress
- **Customer Service**: Delivery options, custom orders, pricing inquiries
- **Factory Visits**: Information about scheduling visits to the Malang facility

## Project Structure

```
GigRadar/
├── src/
│   ├── index.js              # Main entry point (starts both bots)
│   ├── bot.js                # Telegram bot configuration
│   ├── whatsapp.js           # WhatsApp bot configuration
│   ├── openai.js             # OpenAI integration with MUB knowledge base
│   └── handlers/
│       ├── command.js        # Telegram message handlers
│       └── whatsapp.js       # WhatsApp message handlers
├── auth_info_baileys/        # WhatsApp session data (auto-generated)
├── downloads/                # Temporary folder for downloaded images
├── package.json              # Project dependencies
├── .env                      # Environment variables (create this)
├── .gitignore                # Git ignore file
└── README.md                 # This file
```

## Technologies Used

- **Node.js** - Runtime environment
- **node-telegram-bot-api** - Telegram Bot API wrapper
- **venom-bot** - WhatsApp Web API library (stable & reliable)
- **Express** - Web server for QR code interface
- **qrcode** - QR code generation for web display
- **OpenAI API (GPT-4o-mini)** - AI-powered responses
- **dotenv** - Environment variable management
- **Docker** - Containerization for easy deployment

## Contact MUB Filters

- **Address**: Jl. Raya Karangpandan No.13, Karangpandan, Kec. Pakisaji, Kabupaten Malang, Jawa Timur 65162, Indonesia
- **Phone**: +62341-3906005
- **Email**: info@mubfilters.com
- **Website**: [https://mubfilters.com/](https://mubfilters.com/)

## Troubleshooting

### Bot not responding?
- Check if the bot process is running
- Verify your `.env` file has correct API keys
- Check your internet connection
- Review console logs for error messages

### OpenAI API errors?
- Verify your OpenAI API key is valid and has available credits
- Check your OpenAI account status at [platform.openai.com](https://platform.openai.com)

### Telegram bot errors?
- Verify your bot token is correct
- Make sure the bot is not already running in another terminal
- Check that polling is enabled in the bot configuration

### WhatsApp bot errors?
- **QR Code not appearing?** Make sure you have a stable internet connection
- **QR Code expired?** Restart the bot to generate a new QR code
- **Connection lost?** The bot will automatically try to reconnect
- **Logged out?** Delete the `auth_info_baileys` folder and scan the QR code again
- **Multiple devices?** WhatsApp allows multiple linked devices, but make sure you're scanning with the correct account

## Docker Deployment

### Quick Start with Docker

```bash
# Build and run
docker build -t mubai-bot .
docker run -p 3000:3000 --env-file .env mubai-bot

# Or use Docker Compose
docker-compose up -d
```

### Deploy to Google Cloud Platform

```bash
# Test locally first
.\scripts\test-docker.ps1  # Windows
./scripts/test-docker.sh   # Linux/Mac

# Deploy to Cloud Run
.\scripts\deploy-gcp.ps1 -DeployType CloudRun  # Windows
./scripts/deploy-gcp.sh cloud-run              # Linux/Mac

# Deploy to Compute Engine
.\scripts\deploy-gcp.ps1 -DeployType ComputeEngine  # Windows
./scripts/deploy-gcp.sh compute-engine              # Linux/Mac
```

📖 **Full deployment guide**: See [GCP_DEPLOYMENT.md](GCP_DEPLOYMENT.md)
📖 **Docker quick start**: See [DOCKER_QUICKSTART.md](DOCKER_QUICKSTART.md)

## License

ISC

## Support

For technical support or questions about the bot, contact the development team.
For business inquiries about MUB Filters, contact info@mubfilters.com or call +62341-3906005.
