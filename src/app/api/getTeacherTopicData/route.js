import { connectDB } from "@/configs/dbConfig";
import { SchoolClass } from "@/models/GradeSyllabus";
import { studentModel } from "@/models/studentModel";
import { userModel } from "@/models/userModel"; // Import user model for profile pictures
import { NextResponse } from "next/server";

// Connect to the database
connectDB();

export async function POST(req) {
    try {
        const { topicName, subjectName, year, className } = await req.json();
        console.log(topicName, subjectName, year, className);

        const classes = await SchoolClass.find({ 'years.year': year, className });

        if (!classes || classes.length === 0) {
            return NextResponse.json({
                message: 'No data found for the specified year and class',
            });
        }

        let topicData = [];

        for (const schoolClass of classes) {
            const yearData = schoolClass.years.find(y => y.year === year);

            if (yearData) {
                for (const subject of yearData.subjects) {
                    if (subject.name === subjectName) {
                        for (const topic of subject.topicsTaught) {
                            if (topic.title === topicName) {
                                let topicInfo = {
                                    className: schoolClass.className,
                                    subjectName: subject.name,
                                    title: topic.title,
                                    scheduleNumber: topic.scheduleNumber,
                                    startDate: topic.startDate,
                                    endDate: topic.endDate,
                                    assignmentAverage: topic.assignmentAverage,
                                    testAverage: topic.testAverage,
                                    data: [
                                        { name: "Test", uv: topic.testAverage, fill: "#8884d8" },
                                        { name: "Assignment", uv: topic.assignmentAverage, fill: "#82ca9d" },
                                        { name: "Overall Average", uv: (topic.assignmentAverage + topic.testAverage) / 2, fill: "#ff7f0e" },
                                    ],
                                    studentMarks: {
                                        assignmentAverage: [],
                                        testAverage: [],
                                        overallAverage: []
                                    },
                                    topAssignmentMark: null,
                                    lowestTestMark: null,
                                    highestTestMark: null,
                                    lowestAssignmentMark: null,
                                    anomalies: {
                                        good: [],
                                        bad: []
                                    }
                                };

                                const students = await studentModel.find({
                                    'grades.grade': className,
                                    'grades.subjects.name': subjectName
                                });

                                let assignmentMarks = [];
                                let testMarks = [];
                                console.log("names", students);


                                students.forEach(student => {
                                    const gradeData = student.grades.find(g => g.grade === className);
                                    const subjectData = gradeData.subjects.find(s => s.name === subjectName);
                                    console.log("student", subjectData.assignments[0]);


                                    const assignmentData = subjectData.assignments
                                        .filter(a => a.assignment_name === topicName)
                                        .map(a => ({ student: `${student.name} ${student.lastname}`, mark: a.assignment_mark, regNumber: student.reg_number }))
                                        .filter(data => data.mark != null);

                                    const testData = subjectData.tests
                                        .filter(t => t.test_name === topicName)
                                        .map(t => ({ student: `${student.name} ${student.lastname}`, mark: t.test_mark, regNumber: student.reg_number }))
                                        .filter(data => data.mark != null);

                                    const assignmentAverage = assignmentData.reduce((sum, data) => sum + data.mark, 0) / assignmentData.length || 0;
                                    const testAverage = testData.reduce((sum, data) => sum + data.mark, 0) / testData.length || 0;
                                    const overallAverage = (assignmentAverage + testAverage) / 2;

                                    if (assignmentData.length > 0) {
                                        console.log(topicInfo.studentMarks.assignmentAverage);

                                        topicInfo.studentMarks.assignmentAverage.push({
                                            student: `${student.name} ${student.lastname}`,
                                            average: assignmentAverage
                                        });
                                    }
                                    if (testData.length > 0) {
                                        topicInfo.studentMarks.testAverage.push({
                                            student: `${student.name} ${student.lastname}`,
                                            average: testAverage
                                        });
                                    }
                                    if (assignmentData.length > 0 || testData.length > 0) {
                                        topicInfo.studentMarks.overallAverage.push({
                                            student: `${student.name} ${student.lastname}`,
                                            average: overallAverage
                                        });
                                    }

                                    assignmentMarks = [...assignmentMarks, ...assignmentData];
                                    testMarks = [...testMarks, ...testData];
                                });
                                console.log("hi");


                                // Determine top and lowest marks
                                if (assignmentMarks.length > 0) {
                                    const topAssignment = assignmentMarks.reduce((prev, curr) => (curr.mark > prev.mark ? curr : prev), assignmentMarks[0]);
                                    topicInfo.topAssignmentMark = topAssignment;

                                    const lowestAssignment = assignmentMarks.reduce((prev, curr) => (curr.mark < prev.mark ? curr : prev), assignmentMarks[0]);
                                    topicInfo.lowestAssignmentMark = lowestAssignment;
                                }

                                if (testMarks.length > 0) {
                                    const highestTest = testMarks.reduce((prev, curr) => (curr.mark > prev.mark ? curr : prev), testMarks[0]);
                                    topicInfo.highestTestMark = highestTest;

                                    const lowestTest = testMarks.reduce((prev, curr) => (curr.mark < prev.mark ? curr : prev), testMarks[0]);
                                    topicInfo.lowestTestMark = lowestTest;
                                }

                                const calculateDeviation = (actual, average) => (actual - average) / average;

                                topicInfo.studentMarks.overallAverage.forEach(studentMark => {
                                    const deviation = calculateDeviation(studentMark.average, (topic.assignmentAverage + topic.testAverage) / 2);
                                    const anomalyType = deviation >= 0 ? 'good' : 'bad';

                                    topicInfo.anomalies[anomalyType].push({
                                        student: studentMark.student,
                                        type: anomalyType,
                                        deviation: deviation
                                    });
                                });

                                console.log(topicInfo);
                                // Fetch URLs for profile pictures
                                if (topicInfo.lowestTestMark != null) {


                                    const lowestTestStudent = await userModel.findOne({ regNumber: topicInfo.lowestTestMark.regNumber });

                                    topicInfo.lowestTestMark.profilePicture = lowestTestStudent ? lowestTestStudent.profilePicture : null;

                                }
                                console.log("hi");




                                if (topicInfo.lowestAssignmentMark != null) {
                                    const lowestAssignmentStudent = await userModel.findOne({ regNumber: topicInfo.lowestAssignmentMark.regNumber });
                                    topicInfo.lowestAssignmentMark.profilePicture = lowestAssignmentStudent ? lowestAssignmentStudent.profilePicture : null;
                                }
                                if (topicInfo.highestTestMark != null) {
                                    const highestTestStudent = await userModel.findOne({ regNumber: topicInfo.highestTestMark.regNumber });
                                    topicInfo.highestTestMark.profilePicture = highestTestStudent ? highestTestStudent.profilePicture : null;
                                }
                                if (topicInfo.topAssignmentMark != null) {
                                    const topAssignmentStudent = await userModel.findOne({ regNumber: topicInfo.topAssignmentMark.regNumber });
                                    topicInfo.topAssignmentMark.profilePicture = topAssignmentStudent ? topAssignmentStudent.profilePicture : null;
                                }

                                topicData.push(topicInfo);


                            }
                        }
                    }
                }
            }
        }

        console.log(topicData);

        return NextResponse.json({
            message: 'Data retrieved successfully',
            topics: topicData
        });
    } catch (error) {
        console.error('Error retrieving data:', error);
        return NextResponse.json({
            message: 'An error occurred while retrieving the data',
        });
    }
}
