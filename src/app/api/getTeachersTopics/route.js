import { connectDB } from "@/configs/dbConfig";
import { assignmentModel, testModel, quizModel } from "@/models/documentData"; // Ensure these models are correctly imported
import { SchoolClass } from "@/models/GradeSyllabus";
import { NextResponse } from "next/server";

connectDB();

export async function POST(req) {
    try {
        const { teacherName } = await req.json();

        // Find the school classes for the year 2025 that include the specified teacher
        const classes = await SchoolClass.find({ 'years.year': 2025, 'years.subjects.currentTeachers.name': teacherName });

        if (!classes || classes.length === 0) {
            return NextResponse.json({
                message: 'No data found for the specified teacher in 2025',
            });
        }

        // Collect and format the necessary data
        let subjectsData = [];

        for (const schoolClass of classes) {
            const year = schoolClass.years.find(year => year.year === 2025);

            if (year) {
                for (const subject of year.subjects) {
                    if (subject.currentTeachers.some(teacher => teacher.name === teacherName)) {
                        let subjectInfo = {
                            className: schoolClass.className, // Add className here
                            subjectName: subject.name,
                            topics: subject.topicsTaught.map(topic => ({
                                title: topic.title,
                                assignmentAverage: topic.assignmentAverage,
                                testAverage: topic.testAverage,
                                anomalies: [] // Collect anomalies for each topic
                            }))
                        };

                        // Find anomalies for each topic
                        for (const topic of subjectInfo.topics) {
                            // Fetch anomalies related to assignments
                            const assignments = await assignmentModel.find({ subject: subject.name, assigned_by: teacherName });
                            assignments.forEach(assignment => {
                                assignment.anomalies.forEach(anomaly => {
                                    topic.anomalies.push(anomaly);
                                });
                            });

                            // Fetch anomalies related to tests
                            const tests = await testModel.find({ subject: subject.name, assigned_by: teacherName });
                            tests.forEach(test => {
                                test.anomalies.forEach(anomaly => {
                                    topic.anomalies.push(anomaly);
                                });
                            });

                            // Fetch anomalies related to quizzes
                            const quizzes = await quizModel.find({ subject: subject.name, assigned_by: teacherName });
                            quizzes.forEach(quiz => {
                                quiz.anomalies.forEach(anomaly => {
                                    topic.anomalies.push(anomaly);
                                });
                            });
                        }

                        subjectsData.push(subjectInfo);
                    }
                }
            }
        }

        return NextResponse.json({
            message: 'Data retrieved successfully',
            subjects: subjectsData
        });
    } catch (error) {
        console.error('Error retrieving data:', error);
        return NextResponse.json({
            message: 'An error occurred while retrieving the data',
        });
    }
}
