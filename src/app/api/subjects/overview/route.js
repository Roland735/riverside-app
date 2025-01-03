// app/api/subjects/overview/route.js
import { connectDB } from '@/configs/dbConfig';
import { SchoolClass } from '@/models/GradeSyllabus';  // Import your class schema
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await connectDB();

        // Aggregate data from SchoolClass schema
        const classes = await SchoolClass.find({}).populate({
            path: 'years.subjects.currentTeachers',
            select: 'name'
        });

        // Process data to the desired format
        const subjectsMap = new Map();

        classes.forEach(classItem => {
            classItem.years.forEach(year => {
                year.subjects.forEach(subject => {
                    if (!subjectsMap.has(subject.name)) {
                        subjectsMap.set(subject.name, {
                            name: subject.name,
                            teachers: subject.currentTeachers.map(teacher => teacher.name),
                            totalMarks: 0,
                            count: 0
                        });
                    }

                    const subjectData = subjectsMap.get(subject.name);

                    // Only include testaverageMark values greater than 0
                    if (subject.testaverageMark > 0) {
                        subjectData.totalMarks += subject.testaverageMark;
                        subjectData.count += 1;
                    }
                });
            });
        });

        const subjects = Array.from(subjectsMap.values()).map(subject => ({
            ...subject,
            averageMark: subject.count > 0 ? (subject.totalMarks / subject.count).toFixed(2) : 0
        }));

        return new NextResponse(JSON.stringify(subjects), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
