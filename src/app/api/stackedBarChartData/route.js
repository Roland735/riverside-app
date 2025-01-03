// pages/api/studentAverages.js
import { studentModel } from "@/models/studentModel";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        // Extract student ID from the request query
        const studentId = "123456789";



        // Fetch student data based on the provided ID
        const studentData = await studentModel.findOne({ reg_number: studentId });


        if (!studentData) {
            return NextResponse.json({
                message: `Student with ID ${studentId} not found`,
            });
        }

        // Extract exam, assignment, and quiz data for the student
        const examMarks = studentData.subjects.flatMap(subject => subject.exams.map(exam => exam.exam_mark));
        const assignmentMarks = studentData.subjects.flatMap(subject => subject.assignments.map(assignment => assignment.assignment_mark));
        const testMarks = studentData.subjects.flatMap(subject => subject.tests.map(test => test.test_mark));
        const quizMarks = studentData.subjects.flatMap(subject => subject.quizzes.map(quiz => quiz.quiz_mark));
        ;

        // Calculate averages
        const examsAverage = examMarks.length > 0 ? examMarks.reduce((acc, mark) => acc + mark, 0) / examMarks.length : 0;
        const assignmentsAverage = assignmentMarks.length > 0 ? assignmentMarks.reduce((acc, mark) => acc + mark, 0) / assignmentMarks.length : 0;
        const testsAverage = testMarks.length > 0 ? testMarks.reduce((acc, mark) => acc + mark, 0) / testMarks.length : 0;
        const quizzesAverage = quizMarks.length > 0 ? quizMarks.reduce((acc, mark) => acc + mark, 0) / quizMarks.length : 0;


        return NextResponse.json({
            message: `Averages for student ${studentId} successfully calculated`,
            data: {
                examsAverage,
                assignmentsAverage,
                testsAverage,
                quizzesAverage
            }
        });
    } catch (error) {
        console.error("Error fetching student averages:", error);
        return NextResponse.json({
            message: 'Error fetching student averages',
        });
    }
}
