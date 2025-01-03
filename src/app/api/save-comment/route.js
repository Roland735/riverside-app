import { NextResponse } from 'next/server';
import { connectDB } from "@/configs/dbConfig";
import Exam from '@/models/examModel';
import { userModel } from '@/models/userModel'; // Import user model
import { SchoolClass } from "@/models/GradeSyllabus"; // Import SchoolClass schema

connectDB();

export async function POST(req) {
    try {
        console.log("Fetching exam classes...");

        const { subjectName, regNumber, comment, className } = await req.json();
        console.log("Received data:", { subjectName, regNumber, comment, className });

        // Fetch all the exam classes from the database
        const examClasses = await Exam.find({ 'className': className });

        // Process each class
        for (const examClass of examClasses) {

            // Process each year
            if (examClass.years.length > 0) {
                for (const year of examClass.years) {

                    // Process each subject
                    if (year.subjects.length > 0) {
                        for (const subject of year.subjects) {

                            if (subject.name === subjectName) {

                                if (subject.exams.length > 0) {
                                    for (const exam of subject.exams) {

                                        if (exam.papers.length > 0) {

                                            for (const paper of exam.papers) {

                                                if (year.students.length > 0) {
                                                    const studentPromises = year.students.flat().map(async (student) => {
                                                        console.log("student", student);
                                                        if (student.studentId.regNumber === regNumber) {
                                                            try {
                                                                const studentExam = student.exams.find(e => e.period === exam.period);

                                                                if (studentExam) {
                                                                    const subjectExam = studentExam.subjects.find(s => s.name === subject.name);

                                                                    if (subjectExam) {
                                                                        const mySubjectExam = subjectExam.exams.find(e => e.period === exam.period);

                                                                        if (mySubjectExam) {
                                                                            console.log("Saving comment:", comment);
                                                                            // Set the comment
                                                                            mySubjectExam.TeacherComments = comment;
                                                                        }
                                                                    }
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
