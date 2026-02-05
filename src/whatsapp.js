import 'dotenv/config';
import venom from 'venom-bot';
import { setQRCode, setConnectionStatus } from './webserver.js';

let client = null;

async function connectToWhatsApp() {
    try {
        console.log('🔄 Starting WhatsApp connection...');
        setConnectionStatus('connecting');
        
        client = await venom.create(
            'mubai-session', // Session name
            (base64Qrimg, asciiQR, attempts, urlCode) => {
                // QR Code generated
                console.log(`📱 QR Code generated (attempt ${attempts})! Check http://localhost:3000`);
                
                // Send QR to web interface (urlCode is the string we need)
                if (urlCode) {
                    setQRCode(urlCode);
                    setConnectionStatus('connecting');
                    console.log('✓ QR Code sent to web interface');
                }
            },
            (statusSession, session) => {
                // Status updates
                console.log('📊 Status update:', statusSession);
                
                if (statusSession === 'isLogged') {
                    console.log('\n✅ WhatsApp connected successfully!');
                    setConnectionStatus('connected');
                    setQRCode(null);
                } else if (statusSession === 'notLogged') {
                    console.log('⏳ Waiting for QR scan...');
                    setConnectionStatus('connecting');
                } else if (statusSession === 'qrReadError' || statusSession === 'qrReadFail') {
                    console.log('⚠️ QR Code read failed, generating new one...');
                    setConnectionStatus('connecting');
                } else {
                    console.log(`📱 WhatsApp status: ${statusSession}`);
                }
            },
            {
                folderNameToken: 'tokens',
                headless: 'new', // Use new headless mode
                useChrome: true,
                debug: false,
                logQR: false,
                browserArgs: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--disable-gpu',
                    '--single-process'
                ],
                autoClose: 120000, // 2 minutes
                disableSpins: true,
                disableWelcome: true,
                updatesLog: false,
                createPathFileToken: true,
            },
            (browser, page) => {
                console.log('🌐 Browser session started');
                return Promise.resolve();
            }
        );

        console.log('✅ WhatsApp client initialized successfully');
        return client;

    } catch (error) {
        console.error('❌ Error connecting to WhatsApp:', error.message);
        setConnectionStatus('disconnected');
        setQRCode(null);
        
        // Retry after 5 seconds
        console.log('🔄 Will retry in 5 seconds...');
        setTimeout(() => {
            console.log('Retrying WhatsApp connection...');
            connectToWhatsApp().catch(err => {
                console.error('Retry failed:', err.message);
            });
        }, 5000);
        
        throw error;
    }
}

function getWhatsAppClient() {
    return client;
}

export {
    connectToWhatsApp,
    getWhatsAppClient
};
