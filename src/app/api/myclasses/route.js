import { connectDB } from "@/configs/dbConfig";
import { SchoolClass } from "@/models/GradeSyllabus";
import { NextResponse } from "next/server";

connectDB();

export async function POST(req) {
    try {
        const body = await req.json();
        const { teacherName, year } = body;

        if (!teacherName || !year) {
            return NextResponse.json({ message: "Teacher name and year are required" }, { status: 400 });
        }

        // Find all classes where the teacher is listed as a teacher
        const classes = await SchoolClass.find({ "classTeachers.name": teacherName });

        if (!classes || classes.length === 0) {
            return NextResponse.json({ message: "Classes not found for the given teacher" }, { status: 404 });
        }

        const responseData = [];

        // Iterate over each class found
        for (let classDetails of classes) {
            const classYear = classDetails.years.find(y => y.year === year);

            if (!classYear) {
                // If the year is not found for a class, continue to the next class
                continue;
            }

            const subjectsData = classYear.subjects.map(subject => {
                console.log("highest Test MarK", subject.highestTestMark);

                const highestTestMark = subject.highestTestMark && subject.highestTestMark.length > 0
                    ? Math.max(...subject.highestTestMark.map(student => {
                        console.log("student", student);

                        const grade = student.grades?.find(g => g.subjects?.some(s => s.name === subject.name));
                        return grade ? grade.subjectAverage || 0 : 0;
                    }))
                    : 0;

                const lowestTestMark = subject.lowestTestMark && subject.lowestTestMark.length > 0
                    ? Math.min(...subject.lowestTestMark.map(student => {
                        const grade = student.grades?.find(g => g.subjects?.some(s => s.name === subject.name));
                        return grade ? grade.subjectAverage || 0 : 0;
                    }))
                    : 0;

                const mostImprovedTestMark = subject.mostImprovedTestStudent && subject.mostImprovedTestStudent.length > 0
                    ? subject.mostImprovedTestStudent[0].grades?.find(g => g.subjects?.some(s => s.name === subject.name))?.subjectAverage || 0
                    : 0;

                return {
                    name: subject.name,
                    marks: {
                        lastYear: subject.lastYear || 0,  // Adjust this as needed based on where this data comes from
                        current: subject.testaverageMark || 0,
                        highest: highestTestMark,
                        lowest: lowestTestMark,
                        mostImproved: mostImprovedTestMark,
                        change: (subject.testaverageMark || 0) - (subject.lastYear || 0)  // Change based on last year's mark
                    }
                };
            });

            const students = classYear.students.map(student => {
                console.log("student", student);

                const studentAverage = student.grades.reduce((acc, grade) => {


                    const subjectTotal = grade.subjects.reduce((subAcc, sub) => subAcc + (sub.subjectAverage || 0), 0);
                    console.log("subjects", grade.subjects);

                    return acc + (subjectTotal / (grade.subjects.length || 1));  // Avoid division by zero
                }, 0) / (student.grades.length || 1);  // Avoid division by zero

                return {
                    name: student.name,
                    average: studentAverage
                };
            });

            responseData.push({
                classDetails: {
                    className: classDetails.className,
                    classCode: classDetails.classCode
                },
                classAverages: {
                    assignmentAverage: classYear.subjects.reduce((acc, subject) => acc + (subject.assignmentAverageMark || 0), 0) / (classYear.subjects.length || 1),  // Avoid division by zero
                    testAverage: classYear.subjects.reduce((acc, subject) => acc + (subject.testaverageMark || 0), 0) / (classYear.subjects.length || 1),  // Avoid division by zero
                    quizAverage: classYear.subjects.reduce((acc, subject) => acc + (subject.quizAverageMark || 0), 0) / (classYear.subjects.length || 1)  // Avoid division by zero
                },
                subjects: subjectsData,
                students: students
            });
        }

        if (responseData.length === 0) {
            return NextResponse.json({ message: "No classes found for the given teacher and year" }, { status: 404 });
        }
        console.log(responseData);


        return NextResponse.json(responseData, { status: 200 });
    } catch (error) {
        console.error('Error fetching class data:', error);
        return NextResponse.json({ message: 'Error fetching class data', error: error.message }, { status: 500 });
    }
}
