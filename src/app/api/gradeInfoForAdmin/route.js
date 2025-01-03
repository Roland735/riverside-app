// pages/api/grades.js
import { studentModel } from "@/models/studentModel";
import { NextResponse } from "next/server";
import { connectDB } from "@/configs/dbConfig";

connectDB();

export async function GET(req, res) {
    try {
        const grades = {};

        // Fetch all students
        const students = await studentModel.find();

        // Iterate through each student
        students.forEach((student) => {
            const { grade, subjects } = student;

            // Check if the grade exists in the grades object
            if (!grades[grade]) {
                grades[grade] = {};
            }

            // Iterate through each subject of the student
            subjects.forEach((subject) => {
                const { name, exams, assignments, tests, quizzes } = subject;

                // Check if the subject exists in the grade's object
                if (!grades[grade][name]) {
                    grades[grade][name] = {
                        exams: [],
                        assignments: [],
                        tests: [],
                        quizzes: [],
                    };
                }

                // Calculate average marks for exams
                const examsTotal = exams.reduce((total, exam) => total + exam.exam_mark, 0);
                const examsAverage = examsTotal / exams.length || 0;

                // Calculate average marks for assignments
                const assignmentsTotal = assignments.reduce((total, assignment) => total + assignment.assignment_mark, 0);
                const assignmentsAverage = assignmentsTotal / assignments.length || 0;

                // Calculate average marks for tests
                const testsTotal = tests.reduce((total, test) => total + test.test_mark, 0);
                const testsAverage = testsTotal / tests.length || 0;

                // Calculate average marks for quizzes
                const quizzesTotal = quizzes.reduce((total, quiz) => total + quiz.quiz_mark, 0);
                const quizzesAverage = quizzesTotal / quizzes.length || 0;

                // Store average marks for each subject
                grades[grade][name].exams.push(examsAverage);
                grades[grade][name].assignments.push(assignmentsAverage);
                grades[grade][name].tests.push(testsAverage);
                grades[grade][name].quizzes.push(quizzesAverage);
            });
        });

        // Calculate overall average for each subject within each grade
        Object.keys(grades).forEach((grade) => {
            Object.keys(grades[grade]).forEach((subject) => {
                const subjectData = grades[grade][subject];
                const examsAverage = calculateAverage(subjectData.exams);
                const assignmentsAverage = calculateAverage(subjectData.assignments);
                const testsAverage = calculateAverage(subjectData.tests);
                const quizzesAverage = calculateAverage(subjectData.quizzes);

                grades[grade][subject] = {
                    exams: examsAverage,
                    assignments: assignmentsAverage,
                    tests: testsAverage,
                    quizzes: quizzesAverage,
                };
            });
        });

        console.log("Grades data:", grades);

        return NextResponse.json(grades);
    } catch (error) {
        console.error("Error fetching grades:", error);
        return NextResponse.json({ error: "Error fetching grades" }, { status: 500 });
    }
}

// Function to calculate average
function calculateAverage(array) {
    return array.reduce((total, value) => total + value, 0) / array.length || 0;
}