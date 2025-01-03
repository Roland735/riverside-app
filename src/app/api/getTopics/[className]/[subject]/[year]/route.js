// pages/api/classData.js
import { NextResponse } from 'next/server';
import { SchoolClass } from '@/models/GradeSyllabus';
import { connectDB } from '@/configs/dbConfig';

connectDB();

export async function GET(request, { params }) {
    try {


        const { className, subject, year } = params;
        console.log(className, subject, year);



        // Validate query parameters
        if (!className || !subject || !year) {
            return NextResponse.json({
                message: 'Invalid query parameters. Please provide className, subject, and year.',
            }, { status: 400 });
        }

        // Find the class by class name
        const schoolClass = await SchoolClass.findOne({ className });

        // Check if the class exists
        if (!schoolClass) {
            return NextResponse.json({
                message: 'Class not found.',
            }, { status: 404 });
        }

        // Find the year within the class
        const yearData = schoolClass.years.find((y) => y.year === parseInt(year));


        // Check if the year exists
        if (!yearData) {
            return NextResponse.json({
                message: `Year ${year} not found in ${className}.`,
            }, { status: 404 });
        }

        // Find the subject within the year
        const subjectData = yearData.subjects.find((s) => s.name === subject);

        // Check if the subject exists
        if (!subjectData) {
            return NextResponse.json({
                message: `Subject ${subject} not found in ${className}, Year ${year}.`,
            }, { status: 404 });
        }

        // Return the topics taught for the subject
        return NextResponse.json({
            message: `Topics data retrieved successfully for ${className}, Year ${year}, Subject ${subject}.`,
            data: subjectData.topicsTaught,
            class: className,
            subject: subject,
        });
    } catch (error) {
        console.error('Error fetching class data:', error);
        return NextResponse.json({
            message: 'Error fetching class data',
        }, { status: 500 });
    }
}
