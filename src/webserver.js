import express from 'express';
import QRCode from 'qrcode';

const app = express();
let currentQR = null;
let connectionStatus = 'disconnected';

// Store the QR code
export function setQRCode(qr) {
    currentQR = qr;
}

// Set connection status
export function setConnectionStatus(status) {
    connectionStatus = status;
}

// Serve static HTML
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MubAI - WhatsApp QR Code</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            padding: 40px;
            max-width: 500px;
            width: 100%;
            text-align: center;
        }
        h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 28px;
        }
        .subtitle {
            color: #666;
            margin-bottom: 30px;
            font-size: 14px;
        }
        .status {
            padding: 10px 20px;
            border-radius: 25px;
            margin-bottom: 30px;
            font-weight: 600;
            font-size: 14px;
            display: inline-block;
        }
        .status.connected {
            background: #10b981;
            color: white;
        }
        .status.connecting {
            background: #f59e0b;
            color: white;
        }
        .status.disconnected {
            background: #ef4444;
            color: white;
        }
        .qr-container {
            background: #f9fafb;
            padding: 30px;
            border-radius: 15px;
            margin-bottom: 20px;
        }
        #qr-code {
            max-width: 100%;
            height: auto;
        }
        .instructions {
            background: #f0f9ff;
            padding: 20px;
            border-radius: 10px;
            border-left: 4px solid #3b82f6;
            text-align: left;
        }
        .instructions h3 {
            color: #1e40af;
            margin-bottom: 10px;
            font-size: 16px;
        }
        .instructions ol {
            margin-left: 20px;
            color: #374151;
            line-height: 1.8;
        }
        .loading {
            color: #666;
            font-size: 18px;
        }
        .refresh-btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 20px;
            transition: background 0.3s;
        }
        .refresh-btn:hover {
            background: #5568d3;
        }
        .success-message {
            background: #dcfce7;
            color: #166534;
            padding: 20px;
            border-radius: 10px;
            font-size: 18px;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🤖 MubAI WhatsApp Bot</h1>
        <p class="subtitle">Intelligent Assistant for MUB Filters</p>
        
        <div class="status" id="status">⏳ Connecting...</div>
        
        <div id="content"></div>
        
        <button class="refresh-btn" onclick="location.reload()">🔄 Refresh</button>
    </div>

    <script>
        async function updateQR() {
            try {
                const response = await fetch('/qr-status');
                const data = await response.json();
                
                const statusEl = document.getElementById('status');
                const contentEl = document.getElementById('content');
                
                // Update status
                statusEl.className = 'status ' + data.status;
                if (data.status === 'connected') {
                    statusEl.textContent = '✓ Connected';
                    contentEl.innerHTML = '<div class="success-message">✓ WhatsApp connected successfully!<br>You can close this window.</div>';
                } else if (data.status === 'connecting') {
                    statusEl.textContent = '⏳ Connecting...';
                    if (data.hasQR) {
                        contentEl.innerHTML = \`
                            <div class="qr-container">
                                <img id="qr-code" src="/qr-image" alt="QR Code">
                            </div>
                            <div class="instructions">
                                <h3>📱 How to Connect:</h3>
                                <ol>
                                    <li>Open <strong>WhatsApp</strong> on your phone</li>
                                    <li>Go to <strong>Settings</strong> → <strong>Linked Devices</strong></li>
                                    <li>Tap <strong>"Link a Device"</strong></li>
                                    <li>Scan the QR code above</li>
                                </ol>
                            </div>
                        \`;
                    } else {
                        contentEl.innerHTML = '<div class="loading">⏳ Generating QR code...</div>';
                    }
                } else {
                    statusEl.textContent = '⏳ Initializing...';
                    contentEl.innerHTML = \`
                        <div class="loading">
                            ⏳ Initializing WhatsApp connection...<br><br>
                            <small style="color: #666;">This may take 30-60 seconds on first start.</small><br>
                            <small style="color: #666;">If stuck, try refreshing the page.</small>
                        </div>
                    \`;
                }
            } catch (error) {
                console.error('Error fetching QR:', error);
            }
        }
        
        // Update every 2 seconds
        updateQR();
        setInterval(updateQR, 2000);
    </script>
</body>
</html>
    `);
});

// API endpoint for QR status
app.get('/qr-status', (req, res) => {
    res.json({
        status: connectionStatus,
        hasQR: currentQR !== null
    });
});

// API endpoint for QR image
app.get('/qr-image', async (req, res) => {
    if (currentQR) {
        try {
            const qrImage = await QRCode.toDataURL(currentQR);
            const base64Data = qrImage.replace(/^data:image\/png;base64,/, '');
            const img = Buffer.from(base64Data, 'base64');
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': img.length
            });
            res.end(img);
        } catch (err) {
            res.status(500).send('Error generating QR code');
        }
    } else {
        res.status(404).send('QR code not available');
    }
});

export function startWebServer(port = 8080) {
    return new Promise((resolve) => {
        const server = app.listen(port, () => {
            console.log('\n==============================================');
            console.log(`📱 WhatsApp QR Code available at:`);
            console.log(`   http://localhost:${port}`);
            console.log('==============================================\n');
            resolve(server);
        });
    });
}

