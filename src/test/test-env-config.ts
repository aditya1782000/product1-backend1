import mongoose from 'mongoose';
import app from '../app';

const { DATABASE_URL } = process.env;

async function connectToDb() {
    await mongoose.connect(DATABASE_URL ?? '');
    mongoose.connection.on('error', (error: Error) => console.error(error));
}

connectToDb();

export default app;