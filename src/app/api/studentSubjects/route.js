import { connectDB } from "@/configs/dbConfig";
import { SchoolClass } from "@/models/GradeSyllabus";
import { NextResponse } from "next/server";

connectDB();

export async function POST(req) {
    try {
        const body = await req.json();
        const { regNumber } = body;

        if (!regNumber) {
            return NextResponse.json(
                { message: "Registration number is required" },
                { status: 400 }
            );
        }

        // Fetch the student's data for the year 2025
        const student = await SchoolClass.findOne(
            {
                "years.year": 2025,
                "years.students.reg_number": regNumber,
            },
            {
                "years.$": 1,
                className: 1, // Ensure className is included in the query
            }
        );

        if (!student) {
            return NextResponse.json({ message: "Student not found" }, { status: 404 });
        }

        const studentData = student.years[0];

        // Extract relevant student information
        const subjects = studentData.subjects.map((subject) => ({
            name: subject.name,
            className: student.className, // Corrected to fetch from the main document
            teachers: subject.currentTeachers.map(teacher => teacher.name),
            topics: subject.topicsTaught.map(topic => ({
                name: topic.title,
                completed: topic.completed,
            })),
            testAverageMark: subject.testaverageMark,
            assignmentAverageMark: subject.assignmentAverageMark,
            studentsCount: studentData.students.length,
            anomalies: [], // Assuming anomalies are not part of the current schema
        }));

        return NextResponse.json({
            studentName: studentData.students[0].name,
            subjects
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching student data:", error);
        return NextResponse.json(
            { message: "Error fetching student data", error: error.message },
            { status: 500 }
        );
    }
}
