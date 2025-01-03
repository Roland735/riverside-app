// pages/api/addTopic.js
import { SchoolClass } from '@/models/GradeSyllabus'; // Updated import statement
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { className, year, subjectName, topic } = await req.json();
        console.log('Received request body:', { className, year, subjectName, topic });

        // Validate request body
        if (!className || !year || !subjectName || !topic) {
            return NextResponse.json({
                message: 'Invalid request body. Please provide className, year, subjectName, and topic.',
            }, { status: 400 });
        }

        // Find the class document by className and year
        const schoolClass = await SchoolClass.findOne({ className, 'years.year': year });
        if (!schoolClass) {
            return NextResponse.json({
                message: `Class with className ${className} and year ${year} not found.`,
            }, { status: 404 });
        }

        // Find the subject by name
        const subjectIndex = schoolClass.years[0].subjects.findIndex(subject => subject.name === subjectName);
        if (subjectIndex === -1) {
            return NextResponse.json({
                message: `Subject ${subjectName} not found in class ${className} for year ${year}.`,
            }, { status: 404 });
        }

        // Insert the topic into the subject's topicsTaught array
        schoolClass.years[0].subjects[subjectIndex].topicsTaught.push(topic);

        // Save the updated class document
        await schoolClass.save();

        return NextResponse.json({
            message: 'Topic added successfully',
            data: schoolClass,
        });
    } catch (error) {
        console.error('Error adding topic:', error);
        return NextResponse.json({
            message: 'Error adding topic',
        }, { status: 500 });
    }
}
