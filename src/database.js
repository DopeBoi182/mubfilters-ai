import 'dotenv/config';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://dopeboi:umLDa5vgvRqkGTFv@dope.bwrhzob.mongodb.net/mubfilters-ai';

let isConnected = false;

export async function connectDatabase() {
    if (isConnected && mongoose.connection.readyState === 1) {
        console.log('✓ MongoDB already connected');
        return;
    }

    try {
        const uriToLog = MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'); // Hide password in logs
        console.log(`🔄 Connecting to MongoDB: ${uriToLog}`);
        
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 30000, // Increased timeout for GCP network conditions
            socketTimeoutMS: 45000, // Socket timeout
            connectTimeoutMS: 30000, // Connection timeout
            maxPoolSize: 10, // Maintain up to 10 socket connections
            minPoolSize: 2, // Maintain at least 2 socket connections
            maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
            retryWrites: true, // Retry write operations
            retryReads: true, // Retry read operations
            // Enable automatic reconnection
            heartbeatFrequencyMS: 10000, // Send a ping every 10 seconds to keep connection alive
        });
        
        // Wait for connection to be ready
        if (mongoose.connection.readyState === 1) {
            isConnected = true;
            console.log('✓ MongoDB connected successfully');
            console.log(`   Database: ${mongoose.connection.db.databaseName}`);
            console.log(`   Connection state: ${mongoose.connection.readyState} (1 = connected)`);
        } else {
            throw new Error('Connection established but state is not ready');
        }
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        console.error('   Error message:', error.message);
        console.error('   Connection string format check: Make sure MONGODB_URI includes the database name');
        console.error('   GCP Tip: Ensure your GCP server IP is whitelisted in MongoDB Atlas Network Access');
        isConnected = false;
        throw error;
    }
}

export async function disconnectDatabase() {
    if (!isConnected) return;
    
    try {
        await mongoose.disconnect();
        isConnected = false;
        console.log('✓ MongoDB disconnected');
    } catch (error) {
        console.error('❌ MongoDB disconnection error:', error);
    }
}

// Handle connection events
mongoose.connection.on('connected', () => {
    console.log('✓ MongoDB connection event: connected');
    isConnected = true;
});

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error event:', err);
    console.error('   Error details:', err.message);
    isConnected = false;
});

mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB disconnected event');
    isConnected = false;
    
    // Attempt to reconnect after a delay (only if not already reconnecting)
    if (mongoose.connection.readyState === 0) {
        console.log('🔄 Attempting to reconnect to MongoDB in 5 seconds...');
        setTimeout(async () => {
            try {
                if (mongoose.connection.readyState === 0) {
                    await connectDatabase();
                }
            } catch (error) {
                console.error('❌ Reconnection attempt failed:', error.message);
            }
        }, 5000);
    }
});

mongoose.connection.on('connecting', () => {
    console.log('🔄 MongoDB connecting...');
});

mongoose.connection.on('reconnected', () => {
    console.log('✓ MongoDB reconnected successfully');
    isConnected = true;
});

export default mongoose;

