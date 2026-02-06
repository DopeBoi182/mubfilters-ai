import express from 'express';
import mongoose from './database.js';

const app = express();
const PORT = process.env.PORT || 8080;

console.log("check")
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
    const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        mongodb: mongoStatus,
        uptime: process.uptime(),
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'MubAI Bot API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            status: '/status',
        },
    });
});

// Status endpoint
app.get('/status', (req, res) => {
    res.json({
        bot: 'running',
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        database: mongoose.connection.db?.databaseName || 'not connected',
        timestamp: new Date().toISOString(),
    });
});

export function startServer() {
    return new Promise((resolve) => {
        app.listen(PORT, () => {
            console.log(`\n==============================================`);
            console.log(`🌐 Web server running on port ${PORT}`);
            console.log(`   Health check: http://localhost:${PORT}/health`);
            console.log(`   Status: http://localhost:${PORT}/status`);
            console.log(`==============================================\n`);
            resolve();
        });
    });
}

export default app;

