import { connectDB } from '@/configs/dbConfig';
import { Subject } from '@/models/subjects';
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        await connectDB();
        const subjects = await Subject.find();
        return new NextResponse(JSON.stringify(subjects), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
