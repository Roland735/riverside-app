import { connectDB } from "@/configs/dbConfig";
import { Teacher } from "@/models/Teacher";
import { NextResponse } from "next/server";
import { SchoolClass } from "@/models/GradeSyllabus";

connectDB();

function getGradeColor(averageMark) {
    if (averageMark >= 90) return { grade: 'A+', color: 'blue' };
    if (averageMark >= 80) return { grade: 'A', color: 'dark-green' };
    if (averageMark >= 70) return { grade: 'B', color: 'green' };
    if (averageMark >= 60) return { grade: 'C', color: 'yellow' };
    if (averageMark >= 50) return { grade: 'D', color: 'red' };
    if (averageMark >= 40) return { grade: 'E', color: 'red' };
    if (averageMark >= 36) return { grade: 'F', color: 'red' };
    return { grade: 'U', color: 'red' };
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { teacherName } = body;

        if (!teacherName) {
            return NextResponse.json({ message: "Teacher name is required" }, { status: 400 });
        }

        const teacher = await Teacher.findOne({ name: teacherName });

        if (!teacher) {
            return NextResponse.json({ message: "Teacher not found" }, { status: 404 });
        }

        const activeClasses = teacher.activeClasses.map(async (activeClass) => {
            const classInfo = { className: activeClass.className, subjects: [] };
            const classDetails = await SchoolClass.findOne({ className: activeClass.className });

            if (classDetails) {
                const year2025 = classDetails.years.find(year => year.year === 2025);

                if (year2025) {
                    const subjects = year2025.subjects
                        .filter(subject =>
                            subject.currentTeachers.some(teacher => teacher.name === teacherName)
                        )
                        .map(subject => {
                            const studentsCount = year2025.students.filter(student =>
                                student.grades.some(grade =>
                                    grade.grade === activeClass.className &&
                                    grade.subjects.some(sub => sub.name === subject.name)
                                )
                            ).length;

                            const averageMark = (subject.testaverageMark + subject.assignmentAverageMark) / 2;
                            const { grade, color } = getGradeColor(averageMark);

                            return {
                                name: subject.name,
                                className: activeClass.className,
                                teachers: subject.currentTeachers.map(teacher => ({ name: teacher.name })),
                                topics: subject.topicsTaught.map(topic => ({ title: topic.title, completed: topic.completed })),
                                assignmentAverageMark: subject.assignmentAverageMark,
                                testAverageMark: subject.testaverageMark,
                                studentsCount,
                                averageMark,
                                grade,
                                color
                            };
                        });

                    classInfo.subjects.push(...subjects);
                }
            }
            return classInfo;
        });

        const activeClassesData = await Promise.all(activeClasses);

        // Use a Set to filter out duplicates based on subject name and className
        const subjectsSet = new Set();
        const uniqueSubjects = activeClassesData.reduce((acc, curr) => {
            curr.subjects.forEach(subject => {
                const uniqueKey = `${subject.name}-${subject.className}`;
                if (!subjectsSet.has(uniqueKey)) {
                    subjectsSet.add(uniqueKey);
                    acc.push(subject);
                }
            });
            return acc;
        }, []);

        return NextResponse.json({ subjects: uniqueSubjects }, { status: 200 });
    } catch (error) {
        console.error('Error fetching classes:', error);
        return NextResponse.json({ message: 'Error fetching classes', error: error.message }, { status: 500 });
    }
}
