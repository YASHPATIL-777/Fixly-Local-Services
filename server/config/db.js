import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri && process.env.NODE_ENV === 'production') {
      throw new Error('FATAL: MONGODB_URI environment variable is missing. Database connection cannot be established in production.');
    }

    const conn = await mongoose.connect(mongoUri || 'mongodb://127.0.0.1:27017/fixnear');
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB Error] Connection failure: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
