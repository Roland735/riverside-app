import { NextResponse } from 'next/server';
import { connectDB } from '@/configs/dbConfig';
import { studentsModel } from '@/models/Demographic';

export async function POST(req) {
    // Connect to the database
    await connectDB();

    try {
        console.log("hi");

        const { regNumber } = await req.json();  // Extract regNumber from the request body

        if (!regNumber) {
            return NextResponse.json(
                { message: 'Registration number is required' },
                { status: 400 }
            );
        }

        // Fetch the student based on regNumber
        const student = await studentsModel.findOne({ regNumber });
        console.log(student);


        if (!student) {
            return NextResponse.json(
                { message: 'Student not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Student data fetched successfully', student },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching student data:', error);
        return NextResponse.json(
            { message: 'Server error. Please try again later.' },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}
