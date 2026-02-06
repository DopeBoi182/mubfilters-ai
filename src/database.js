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
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
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
    isConnected = false;
});

mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB disconnected event');
    isConnected = false;
});

mongoose.connection.on('connecting', () => {
    console.log('🔄 MongoDB connecting...');
});

export default mongoose;

