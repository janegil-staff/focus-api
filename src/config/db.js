import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not defined');
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  mongoose.connection.on('error', (err) => console.error('❌ MongoDB error:', err));
  mongoose.connection.on('disconnected', () => console.warn('⚠️  MongoDB disconnected'));
};

export default connectDB;
