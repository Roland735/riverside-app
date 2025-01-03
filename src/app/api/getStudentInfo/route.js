import { connectDB } from "@/configs/dbConfig";
import { SchoolClass } from "@/models/GradeSyllabus"; // Assuming GradeSyllabus file has all the required schemas
import { userModel } from "@/models/userModel";
import { NextResponse } from "next/server";

// Connect to the database
connectDB();
// Function to format the date
function formatDate(date) {
    const options = { day: 'numeric', month: 'long' };
    return new Date(date).toLocaleDateString('en-GB', options);
}

export async function POST(req) {
    try {
        const { registrationNumber } = await req.json();


        const studentUser = await userModel.findOne({ regNumber: registrationNumber });
        const name = studentUser.firstname;
        const lastname = studentUser.lastname;

        // Fetch student data from the database
        const student = await SchoolClass.findOne({ "years.students.name": `${name} ${lastname}` }).populate('years.students.grades.subjects.assignments years.students.grades.subjects.tests years.students.grades.subjects.quizzes');
        // console.log(student);



        if (!student) {
            return NextResponse.json({
                message: 'Student not found',
            });
        }



        // console.log(studentUser);



        const currentYear = student.years.find(year => year.year === 2025)
        // console.log("currentYear", currentYear);

        const studentData = currentYear.students.find(student => student.name === `${name} ${lastname}`);
        // console.log(studentData);




        // Prepare performance data
        const performance = [];
        studentData.grades.forEach(grade => {
            grade.subjects.forEach(subject => {
                performance.push({
                    subject: subject.name,
                    mark: Math.round(subject.testAverage),
                    maxMark: 100 // Assuming maxMark is 100
                });
            });
        });

        // Prepare assignments data
        const assignments = [];
        studentData.grades.forEach(grade => {
            grade.subjects.forEach(subject => {
                let highestScore = 0;
                let lowestScore = 100;
                subject.assignments.forEach(assignment => {
                    if (assignment.assignment_mark > highestScore) {
                        highestScore = assignment.assignment_mark;
                    }
                    if (assignment.assignment_mark < lowestScore) {
                        lowestScore = assignment.assignment_mark;
                    }
                });
                assignments.push({
                    name: subject.name,
                    score: Math.round(subject.assignmentAverage),
                    maxScore: Math.round(highestScore),
                    minimumScore: Math.round(lowestScore)
                });
                highestScore = 0;
                lowestScore = 100;
            });
        });

        // Prepare tests data
        const tests = [];
        studentData.grades.forEach(grade => {
            grade.subjects.forEach(subject => {
                let highestScore = 0;
                let lowestScore = 100;
                subject.tests.forEach(test => {
                    if (test.test_mark > highestScore) {
                        highestScore = test.test_mark;
                    }
                    if (test.test_mark < lowestScore) {
                        lowestScore = test.test_mark;
                    }
                });
                tests.push({
                    name: subject.name,
                    score: Math.round(subject.testAverage),
                    maxScore: Math.round(highestScore),
                    minimumScore: Math.round(lowestScore)
                });
            });
        });


        // Prepare quizzes data
        const quizzes = [];
        studentData.grades.forEach(grade => {
            grade.subjects.forEach(subject => {
                subject.quizzes.forEach(quiz => {
                    quizzes.push({
                        name: quiz.quiz_name,
                        score: Math.round(quiz.quiz_mark),
                        maxScore: 100 // Assuming maxScore is 100
                    });
                });
            });
        });


        // Attendance

        const attendance = [];
        console.log("hi");


        studentData.grades.forEach(grade => {
            console.log("grade", grade)
            grade.attendance.forEach(currentAttendance => {
                console.log("Hi")
                console.log(currentAttendance);

                if (currentAttendance.status === "Present") {
                    attendance.push({
                        date: formatDate(currentAttendance.date),
                        status: currentAttendance.status,
                        position: 4
                    });
                } else if (currentAttendance.status === "Absent") {
                    attendance.push({
                        date: formatDate(currentAttendance.date),
                        status: currentAttendance.status,
                        position: 0
                    });
                } else if (currentAttendance.status === "Late") {
                    attendance.push({
                        date: formatDate(currentAttendance.date),
                        status: currentAttendance.status,
                        position: 3
                    });
                } else if (currentAttendance.status === "Excused") {
                    attendance.push({
                        date: formatDate(currentAttendance.date),
                        status: currentAttendance.status,
                        position: 2
                    });
                } else if (currentAttendance.status === "Sick") {
                    attendance.push({
                        date: formatDate(currentAttendance.date),
                        status: currentAttendance.status,
                        position: 1
                    });
                }
            })
        })


        // Prepare final data
        const studentPerformanceData = {
            studentName: `${studentData.name} `,
            registrationNumber: studentData.reg_number,
            className: studentData.grades[0]?.grade || "N/A", // Assuming className from the first grade entry
            email: studentUser.email,
            profilePicture: studentUser.profilePicture,
            overallGrade: "B+", // Assuming an overall grade for now
            age: 16, // Assuming age for now
            gender: "Male", // Assuming gender for now
            performance,
            assignments,
            tests,
            quizzes,
            attendance: attendance
        };

        return NextResponse.json({
            message: 'Data retrieved successfully',
            data: studentPerformanceData
        });
    } catch (error) {
        console.error('Error retrieving data:', error);
        return NextResponse.json({
            message: 'An error occurred while retrieving the data',
        });
    }
}
