import { NextResponse } from 'next/server';
import { connectDB } from "@/configs/dbConfig";
import Exam from '@/models/examModel';
import { userModel } from '@/models/userModel'; // Import user model
import { SchoolClass } from "@/models/GradeSyllabus"; // Import SchoolClass schema


connectDB();

export async function POST(req) {
    try {
        console.log("Fetching exam classe...");

        const { regNumber, comment, className } = await req.json();
        console.log("Received data:", { regNumber, comment, className });

        // Fetch all the exam classes from the database
        const examClasses = await Exam.find({ 'className': className });
        console.log("hi");


        // Process each class
        for (const examClass of examClasses) {
            console.log("hi");

            // Process each year
            if (examClass.years.length > 0) {
                console.log("hi");
                for (const year of examClass.years) {
                    console.log("hi");

                    // Process each subject
                    if (year.subjects.length > 0) {
                        console.log("hi");
                        for (const subject of year.subjects) {
                            console.log("hi");


                            console.log("hi");

                            if (subject.exams.length > 0) {
                                console.log("hi");
                                for (const exam of subject.exams) {
                                    console.log("hi");

                                    if (exam.papers.length > 0) {

                                        for (const paper of exam.papers) {

                                            if (year.students.length > 0) {
                                                const studentPromises = year.students.flat().map(async (student) => {
                                                    console.log("student", student);
                                                    if (student.studentId.regNumber === regNumber) {
                                                        try {
                                                            const studentExam = student.exams.find(e => e.period === exam.period);

                                                            if (studentExam) {
                                                                console.log("studen", studentExam.AIComment);
                                                                studentExam.AIComment = comment;

                                                                console.log(studentExam.AIComment);
                                                            }
                                                        } catch (error) {
                                                            console.error("Error processing student:", error);
                                                        }
                                                    }
                                                });

                                                // Wait for all student promises to resolve
                                                await Promise.all(studentPromises);
                                            }
                                        }
                                    }
                                }
                            }

                        }
                    }
                }
            }

            // Save the modified exam class instance
            await examClass.save();
        }

        console.log("Data processed and saved successfully");

        // Return the success response
        return NextResponse.json({ message: 'Comment saved successfully' }, { status: 200 });
    } catch (error) {
        console.error("Error fetching exam data:", error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
