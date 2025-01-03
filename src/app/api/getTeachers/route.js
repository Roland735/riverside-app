// pages/api/teachers.js
import { Teacher } from '@/models/Teacher'; // Adjust the import statement based on your project structure
import { NextResponse } from 'next/server';
import { Subject } from '@/models/subjects';
export const GET = async () => {
    try {
        console.log("Hi");


        const teachers = await Teacher.find({}, 'name'); // Fetch only the name of each teacher
        const subjects = await Subject.find({}, 'name code'); // Fetch only the subjects of each teacher




        return NextResponse.json({ teachers, subjects }, { status: 200 });
    } catch (error) {
        console.error('Error fetching teachers:', error);
        return NextResponse.json({ message: 'Failed to fetch teachers' }, { status: 500 });
    }
};
