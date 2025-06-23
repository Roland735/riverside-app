import mongoose from 'mongoose';
import { connectDB } from '@/configs/dbConfig';

export const GET = async () => {
    // ensure we’re connected with whatever options your app is using
    await connectDB();

    // log the raw env var
    console.log('🔍 DEBUG – MONGODB_URL:', process.env.MONGODB_URL);

    // ask Mongo “am I primary or secondary?”
    const isMaster = await mongoose.connection.db.command({ isMaster: 1 });
    console.log('🔍 DEBUG – isMaster:', isMaster);

    return new Response(
        JSON.stringify({
            mongoUrl: process.env.MONGODB_URL,
            isMaster,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
};
