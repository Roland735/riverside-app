import { connectDB } from "@/configs/dbConfig";
import { SchoolClass } from "@/models/GradeSyllabus";
import { NextResponse } from "next/server";

connectDB();

export async function POST(req) {
    try {
        const body = await req.json();
        const { regNumber } = body;
        console.log(regNumber);


        if (!regNumber) {
            return NextResponse.json(
                { message: "Registration number is required" },
                { status: 400 }
            );
        }

        // Fetch the student's data using the registration number in the year 2025
        const student = await SchoolClass.findOne(
            {
                "years.year": 2025,
                "years.students.reg_number": regNumber,
            },
            {
                "years.$": 1,
            }
        );

        if (!student) {
            return NextResponse.json({ message: "Student not found" }, { status: 404 });
        }

        const studentData = student.years[0];

        // Extract subjects and their marks from the student data
        const subjects = studentData.subjects.map((subject) => ({
            name: subject.name,
            assignmentAverageMark: subject.assignmentAverageMark || 0,
            testaverageMark: subject.testaverageMark || 0,
            quizAverageMark: subject.quizAverageMark || 0,
            OveralAverageMark: subject.OveralAverageMark || 0,
            exams: subject.exams || [],
            assignments: subject.assignments || [],
            tests: subject.tests || [],
            quizzes: subject.quizzes || [],
        }));

        // Prepare subject data in the required format
        const subjectData = subjects.map((subject) => ({
            subject: subject.name,
            mark: subject.testaverageMark, // You can adjust this based on your schema structure
        }));

        // Radar chart data
        const radarData = subjects.map((subject) => ({
            subject: subject.name,
            A: subject.assignmentAverageMark || 0,
            B: subject.testaverageMark || 0,
            fullMark: subject.testaverageMark, // Example value, adjust as per your requirement
        }));

        // Calculate submission rate (example calculation)
        const totalAssignments = subjects.reduce((acc, subject) => acc + subject.assignments.length, 0);
        const submittedAssignments = subjects.reduce((acc, subject) => acc + subject.assignments.filter(a => a.assignment_mark !== undefined).length, 0);
        // const submissionRate = totalAssignments > 0 ? (submittedAssignments / totalAssignments) * 100 : 0;

        // // Calculate attendance rate (example calculation)
        // const totalClasses = studentData.attendance.total_classes || 0;
        // const attendedClasses = studentData.attendance.attended_classes || 0;
        // const attendanceRate = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;

        // // Calculate detention count
        // const detentionCount = studentData.detentions.length;

        // Calculate averages and changes for assignments, tests, and quizzes
        const assignmentAverage = subjects
            .filter(subject => subject.assignmentAverageMark > 0)
            .reduce((acc, subject) => acc + subject.assignmentAverageMark, 0) /
            subjects.filter(subject => subject.assignmentAverageMark > 0).length;

        const testAverage = subjects
            .filter(subject => subject.testaverageMark > 0)
            .reduce((acc, subject) => acc + subject.testaverageMark, 0) /
            subjects.filter(subject => subject.testaverageMark > 0).length;

        const quizAverage = subjects
            .filter(subject => subject.quizAverageMark > 0)
            .reduce((acc, subject) => acc + subject.quizAverageMark, 0) /
            subjects.filter(subject => subject.quizAverageMark > 0).length;


        // Mocked changes (these would ideally come from previous data or some other source)
        const assignmentChange = -5; // Mocked value, replace with actual calculation
        const testChange = +3; // Mocked value, replace with actual calculation
        const quizChange = +10; // Mocked value, replace with actual calculation

        return NextResponse.json({
            subjectData,
            radarData,
            // submissionRate,
            // attendanceRate,
            // detentionCount,
            averages: {
                assignment: { average: assignmentAverage, change: assignmentChange },
                test: { average: testAverage, change: testChange },
                quiz: { average: quizAverage, change: quizChange }
            }
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching student data:", error);
        return NextResponse.json(
            { message: "Error fetching student data", error: error.message },
            { status: 500 }
        );
    }
}
