import { connectDB } from '@/configs/dbConfig';
import { userModel } from '@/models/userModel';
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        await connectDB();
        const teachers = await userModel.find({ role: 'teacher' });
        return new NextResponse(JSON.stringify(teachers), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
