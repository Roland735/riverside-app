

import { NextResponse } from 'next/server';
import { Teacher } from '@/models/Teacher';
import { SchoolClass } from '@/models/GradeSyllabus';
import { connectDB } from '@/configs/dbConfig';

connectDB();

export async function GET(request, { params }) {
    try {
        const teacherName = params.teacherName;
        console.log(teacherName);

        // Validate query parameters
        if (!teacherName) {
            return NextResponse.json({
                message: 'Invalid query parameters. Please provide teacherName.',
            }, { status: 400 });
        }

        // Find teacher by name
        const teacher = await Teacher.findOne({ name: teacherName });

        // Check if teacher exists
        if (!teacher) {
            return NextResponse.json({
                message: 'Teacher not found.',
            }, { status: 404 });
        }

        // Get active classes from teacher's activeClasses array
        const activeClasses = teacher.activeClasses;

        // Iterate over activeClasses and calculate progress for each class
        const classesWithProgress = await Promise.all(
            activeClasses.map(async (activeClass) => {
                // Find the class from SchoolClass model
                const schoolClass = await SchoolClass.findOne({
                    className: activeClass.className,
                });

                // Check if class exists
                if (!schoolClass) {
                    return {
                        className: activeClass.className,
                        syllabusUpdated: false,
                        progress: null,
                        subjects: activeClass.subjects,
                    };
                }

                // Check if topics exist for the subjects the teacher is teaching in the class
                const subjectsWithTopics = schoolClass.years.reduce((acc, year) => {
                    year.subjects.forEach((subject) => {
                        if (
                            activeClass.subjects.includes(subject.name) &&
                            subject.topicsTaught.length > 0
                        ) {
                            acc.push({ subjectName: subject.name, topics: subject.topicsTaught });
                        }
                    });
                    return acc;
                }, []);

                // Calculate progress if topics exist, else mark syllabus not updated
                if (subjectsWithTopics.length > 0) {
                    const totalTopics = subjectsWithTopics.reduce((acc, subject) => acc + subject.topics.length, 0);
                    const completedTopics = subjectsWithTopics.reduce((acc, subject) => {
                        return acc + subject.topics.filter((topic) => topic.completed).length;
                    }, 0);
                    const progress = (completedTopics / totalTopics) * 100;

                    return {
                        className: activeClass.className,
                        syllabusUpdated: true,
                        progress: progress,
                        subjects: subjectsWithTopics.map((subject) => subject.subjectName),
                        topics: subjectsWithTopics.map((subject) => subject.topics),
                    };
                } else {
                    return {
                        className: activeClass.className,
                        syllabusUpdated: false,
                        progress: null,
                        subjects: activeClass.subjects,
                    };
                }
            })
        );

        return NextResponse.json({
            message: 'Teacher dashboard data retrieved successfully',
            data: classesWithProgress,
        });
    } catch (error) {
        console.error('Error fetching teacher dashboard data:', error);
        return NextResponse.json({
            message: 'Error fetching teacher dashboard data',
        }, { status: 500 });
    }
}
