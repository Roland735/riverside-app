import { NextResponse } from 'next/server';
import { connectDB } from "@/configs/dbConfig";
import Exam from '@/models/examModel';

connectDB();

export async function POST(req) {
    try {
        // Parse the request body
        console.log("hi");

        const { className, subjectName, paperNumber, examPeriod } = await req.json();

        console.log("Confirming marks for:", { className, subjectName, paperNumber, examPeriod });

        // Find the specific exam class
        const examClass = await Exam.findOne({ className });

        if (!examClass) {
            return NextResponse.json({ message: 'Class not found' }, { status: 404 });
        }

        let paperFound = false;

        // Loop through the years and find the matching subject and paper
        for (const year of examClass.years) {
            for (const subject of year.subjects) {
                if (subject.name === subjectName) {
                    for (const exam of subject.exams) {
                        if (exam.period === examPeriod) {
                            console.log("hi");
                            console.log("Exam:", exam);
                            exam.marksConfirmed = true;

                            // for (const paper of exam.papers) {
                            //     console.log("hi");

                            //     if (paper.paperNumber === paperNumber) {
                            //         console.log("hi");
                            //         // Confirm the paper
                            //         paper.confirmed = true;
                            //         paperFound = true;
                            //         break;
                            //     }
                            // }
                            // if (paperFound) {
                            // Mark the entire subject's marks as confirmed
                            exam.marksConfirmed = true;

                            // Loop through each student in the class and update the marksConfirmed for the subject
                            for (const student of year.students) {
                                console.log("Student:", student);
                                student.forEach(myStudent => {
                                    for (const studentSubject of myStudent.exams) {
                                        console.log("hi");
                                        if (studentSubject.period === examPeriod) {
                                            console.log("hi");
                                            for (const studentExamSubject of studentSubject.subjects) {
                                                console.log("hi", studentExamSubject.name, subjectName);
                                                if (studentExamSubject.name === subjectName) {
                                                    console.log("hi");
                                                    studentExamSubject.exams.forEach(stExam => {
                                                        console.log(stExam.marksConfirmed);

                                                        stExam.marksConfirmed = true;
                                                    });
                                                }
                                            }
                                        }
                                    }
                                })
                            }
                            // }
                        }
                    }
                }
            }
        }
        console.log("hi");


        // if (!paperFound) {
        //     return NextResponse.json({ message: 'Paper not found' }, { status: 404 });
        // }

        // Save the updated exam class
        await examClass.save();

        console.log("Marks confirmed successfully");
        return NextResponse.json({ message: 'Marks confirmed successfully' }, { status: 200 });
    } catch (error) {
        console.error("Error confirming marks:", error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
