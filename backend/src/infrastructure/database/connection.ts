import mongoose from 'mongoose';
import { env } from '../../config/env';

export class Database {
  private static isConnected = false;

  public static async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    try {
      mongoose.connection.on('connected', () => {
        console.log('✅ MongoDB connected successfully');
      });

      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️ MongoDB disconnected');
        this.isConnected = false;
      });

      await mongoose.connect(env.MONGO_URI);
      this.isConnected = true;
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  public static async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    await mongoose.connection.close();
    this.isConnected = false;
    console.log('🔌 MongoDB connection closed gracefully');
  }
}
