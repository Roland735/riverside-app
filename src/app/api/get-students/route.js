import { NextResponse } from 'next/server';
import { connectDB } from "@/configs/dbConfig";
import { studentsModel } from '@/models/Demographic';

export async function GET() {
    await connectDB();

    try {
        const students = await studentsModel.find(); // Fetch all students
        return NextResponse.json(students, { status: 200 }); // Send a JSON response with status 200
    } catch (error) {
        return NextResponse.json({ message: 'Failed to fetch students' }, { status: 500 });
    }
}
