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
function calculateAverage(items) {
    console.log(items);
    let totalScore = 0;

    items.forEach(item => {
        totalScore += item.score;

    });
    let average = totalScore / items.length;

    return Math.round(average);
}

function arrayReturn(arr, type, topicName) {
    let myArr = [];
    if (type === "assignments") {
        arr.forEach(item => {
            if (item.score) {
                if (item.name === topicName) {

                    myArr.push({
                        name: item.name,
                        score: item.score,
                        maxScore: item.maxScore,
                    });
                }
            }
        })

    } else if (type === "tests") {
        arr.forEach(item => {
            if (item.score) {
                if (item.name === topicName) {
                    myArr.push({
                        name: item.name,
                        score: item.score,
                        maxScore: item.maxScore,
                    });
                }
            }
        });
    } else if (type === "quizzes") {
        arr.forEach(item => {
            if (item.score) {
                if (item.name === topicName) {
                    myArr.push({
                        name: item.name,
                        score: item.score,
                        maxScore: item.maxScore,
                    });
                }
            }
        });
    }

    return myArr;
}

export async function POST(req) {
    try {
        // Extract the student's name and subject from the request body
        // const { name, lastname, subjectName } = await req.json();
        console.log("hi");


        const { regNumber, subjectName } = await req.json();


        const studentUser = await userModel.findOne({ regNumber: regNumber });
        const name = studentUser.firstname;
        const lastname = studentUser.lastname;

        console.log("studentUser", name, lastname);


        // Fetch student data from the database
        const student = await SchoolClass.findOne({ "years.students.name": `${name} ${lastname}`, "years.year": 2025 })
            .populate('years.students.grades.subjects.assignments years.students.grades.subjects.tests years.students.grades.subjects.quizzes');

        // Fetch student data from the database
        const studentClass = await SchoolClass.findOne({ "years.students.name": `${name} ${lastname}`, "years.year": 2025 });

        const year = studentClass.years.find(year => year.year === 2025);

        const subject = year.subjects.find(subject => subject.name === subjectName);

        let topics = [];

        if (subject.topicsTaught) {
            console.log("subject.topicsTaught", subject.topicsTaught);

            subject.topicsTaught.map(topic => (
                topics.push({
                    name: topic.title,
                    date: formatDate(topic.endDate),
                    classAssignmentAverage: topic.assignmentAverage,
                    classTestAverage: topic.testAverage,
                    scheduleNumber: topic.scheduleNumber,
                })))
        }








        console.log(student);
        if (!student) {
            return NextResponse.json({
                message: 'Student not found',
            });
        }

        console.log("hi");

        const studentDemographicInfo = await userModel.findOne({ firstname: name, lastname: lastname });

        const currentYear = student.years.find(year => year.year === 2025);
        const studentData = currentYear.students.find(student => student.name === `${name} ${lastname}`);
        console.log("studentdata", studentData.grades);


        // Find the specific subject data
        const subjectData = studentData.grades.flatMap(grade => grade.subjects).find(subject => subject.name === subjectName);

        if (!subjectData) {
            return NextResponse.json({
                message: 'Subject not found',
            });
        }
        let i = 0;
        let j = 0;
        let totalScore = 0;
        let testAvg = 0;


        // console.log(subjectData);

        // Prepare performance history data
        // const performanceHistory = subjectData.performanceHistory.map(entry => ({
        //     date: formatDate(entry.date),
        //     mark: entry.mark
        // }));


        // Prepare assignments data
        const assignments = subjectData.assignments.map(assignment => {
            if (assignment.assignment_name) {
                return {
                    name: assignment.assignment_name,
                    score: assignment.assignment_mark,
                    maxScore: assignment.maxScore || 100 // Assuming maxScore is 100 if not provided
                };
            }
        });
        console.log("assignments", assignments);


        // Prepare tests data
        const tests = subjectData.tests.map(test => ({
            name: test.test_name,
            score: test.test_mark,
            maxScore: test.maxScore || 100 // Assuming maxScore is 100 if not provided
        }));

        // Prepare quizzes data
        const quizzes = subjectData.quizzes.map(quiz => ({
            name: quiz.quiz_name,
            score: quiz.quiz_mark,
            maxScore: quiz.maxScore || 100 // Assuming maxScore is 100 if not provided
        }));
        // console.log("subjectData", subjectData);
        let myPerformance = []





        topics.forEach(topic => {

            totalScore = 0

            subjectData.tests.map(test => {


                // if (test.test_name === topic.name && test.test_mark > 0) {
                //     console.log(test);

                //     totalScore += test.test_mark;
                //     i++;
                //     testAvg = totalScore / i;
                // }
                // console.log("i", i, "j", j, "length");

                j++;
                if (j === subjectData.tests.length) {
                    console.log(topic);

                    myPerformance.push({
                        name: topic.name,
                        date: formatDate(topic.date),
                        mark: Math.round(topic.classTestAverage),
                    })
                    j = 0

                    console.log(myPerformance);

                }

            })
        });
        console.log(myPerformance);
        const pieChartData = [
            { name: 'Tests', value: calculateAverage(tests) },
            { name: 'Assignments', value: calculateAverage(assignments) },

        ];


        console.log("pieChartData", pieChartData);


        const performance = topics.map(topic => ({
            topicName: topic.name,
            title: topic.name,
            scheduleNumber: topic.scheduleNumber,
            performance: myPerformance
            ,

            assignments: arrayReturn(assignments, "assignments", topic.name),
            tests: arrayReturn(tests, "tests", topic.name),
            quizzes: arrayReturn(quizzes, "quizzes", topic.name),
        }));
        console.log(performance);


        const subjectInfo = {
            name: subjectData.name,

        }
        // Prepare final data
        const studentSubjectPerformanceData = {
            studentName: `${studentData.name}`,
            registrationNumber: studentData.reg_number,
            className: studentData.grades[0]?.grade || "N/A", // Assuming className from the first grade entry
            profilePicture: studentDemographicInfo.profilePicture,
            overallGrade: "B+", // Assuming an overall grade for now
            // age: studentDemographicInfo.age, // Assuming age from demographic info
            // gender: studentDemographicInfo.gender, // Assuming gender from demographic info
            email: studentDemographicInfo.email,
            // phone: studentDemographicInfo.phone,
            // address: studentDemographicInfo.address,
            performance: myPerformance,
            subject: {
                name: subjectData.name,
                topics: performance

            },
            assignments: assignments,
            tests: tests,
            pieChartData: pieChartData,
        };
        console.log(studentSubjectPerformanceData);


        return NextResponse.json({
            message: 'Data retrieved successfully',
            data: studentSubjectPerformanceData
        });
    } catch (error) {
        console.error('Error retrieving data:', error);
        return NextResponse.json({
            message: 'An error occurred while retrieving the data',
        });
    }
}
