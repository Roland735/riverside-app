// /pages/api/getSubjectData.js
import { connectDB } from "@/configs/dbConfig";
import { SchoolClass } from "@/models/GradeSyllabus";
import { NextResponse } from "next/server";

connectDB();

export async function POST(req) {
    try {
        const { subjectName } = await req.json();

        // Fetch the data for the specific subject
        const schoolClasses = await SchoolClass.find({
            "years.subjects.name": subjectName
        }).select("className years.subjects years.students");

        if (schoolClasses.length === 0) {
            return NextResponse.json({ message: "Subject not found" }, { status: 404 });
        }

        // Extract subject details and construct the required response
        const subjectData = {
            subject: subjectName,
            cambridgeGrade: "A", // This should be dynamically fetched or calculated
            standardDeviation: 5.4, // Example value, you can calculate or fetch actual data
            teachers: [],
            headOfDepartment: "Dr. Williams", // Example value, replace with actual data
            averageMark: 0, // Will calculate this below
        };

        const classesData = [];

        let totalMarks = 0;
        let totalStudents = 0;

        schoolClasses.forEach(schoolClass => {
            schoolClass.years.forEach(year => {
                let classStudentCount = 0;

                year.students.forEach(student => {
                    // console.log(student);

                    student.grades.forEach(studentGrade => {


                        if (studentGrade.grade === schoolClass.className) {
                            studentGrade.subjects.forEach(subject => {
                                if (subject.name === subjectName) {
                                    classStudentCount++;
                                }
                            });

                        }
                    })
                });

                year.subjects.forEach(subject => {
                    if (subject.name === subjectName) {
                        subject.currentTeachers.forEach(teacher => {
                            if (!subjectData.teachers.includes(teacher.name)) {
                                subjectData.teachers.push(teacher.name);
                            }
                        });

                        const classData = {
                            className: schoolClass.className,
                            averageMark: Math.round(subject.testaverageMark), // Assuming this is stored in your schema
                            teachers: subject.currentTeachers.map(teacher => teacher.name),
                            numberOfStudents: classStudentCount,
                            assignment: subject.assignmentAverageMark,
                            test: subject.testaverageMark,
                            quiz: subject.quizAverageMark
                        };
                        console.log(subject);


                        classesData.push(classData);

                        totalMarks += subject.subjectAverage * classStudentCount;
                        totalStudents += classStudentCount;
                    }
                });
            });
        });
        let totalClassAverage = 0;
        let i = 0;

        classesData.forEach(classData => {
            if (classData.averageMark > 0) {
                totalClassAverage += classData.averageMark;
                i++;
            }
        });

        totalClassAverage = totalClassAverage / i;

        // if (totalStudents > 0) {
        //     subjectData.averageMark = totalMarks / totalStudents;
        // }
        subjectData.averageMark = Math.round(totalClassAverage);

        return NextResponse.json({ subjectData, classesData });
    } catch (error) {
        console.error("Error fetching subject data:", error);
        return NextResponse.json({ message: "Error fetching subject data", error: error.message }, { status: 500 });
    }
}
