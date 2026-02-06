import 'dotenv/config';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://dopeboi:umLDa5vgvRqkGTFv@dope.bwrhzob.mongodb.net/mubfilters-ai';

let isConnected = false;

export async function connectDatabase() {
    if (isConnected) {
        console.log('✓ MongoDB already connected');
        return;
    }

    try {
        await mongoose.connect(MONGODB_URI);
        isConnected = true;
        console.log('✓ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
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
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
    isConnected = false;
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
    isConnected = false;
});

export default mongoose;

