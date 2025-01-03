import { NextResponse } from 'next/server';
import { connectDB } from "@/configs/dbConfig";
import Exam from '@/models/examModel';

connectDB();

export async function POST(req) {
    try {
        console.log("Fetching exam classes...");

        // Fetch all the exam classes from the database
        const examClasses = await Exam.find({});
        console.log("Exam classes fetched");

        // Initialize the response data
        const responseData = [];

        // Process each class
        for (const examClass of examClasses) {
            let adding = false;
            console.log("Processing class:", examClass.className);
            const classData = {
                className: examClass.className,
                subjects: []
            };

            // Process each year
            if (examClass.years.length > 0) {
                for (const year of examClass.years) {
                    console.log("Processing year:", year.year);

                    // Process each subject
                    if (year.subjects.length > 0) {
                        for (const subject of year.subjects) {
                            console.log("Processing subject:", subject.name);
                            const subjectData = {
                                subjectName: subject.name,
                                papers: []
                            };

                            // Process each exam
                            if (subject.exams.length > 0) {
                                for (const exam of subject.exams) {
                                    console.log("Processing exam:", exam);

                                    // Initialize exam data
                                    let examData = {
                                        papers: [],

                                    };


                                    // Process each paper
                                    if (exam.papers.length > 0) {
                                        for (const paper of exam.papers) {
                                            console.log("Processing paper:", paper);
                                            let paperData = {
                                                paperNumber: paper.paperNumber,
                                                paperDuration: paper.duration,
                                                totalMarks: paper.total || 0,
                                                students: [],
                                                confirmed: exam.marksConfirmed
                                            };


                                            if (year.students.length > 0) {
                                                console.log("Students:", year.students);

                                                // Process each student's mark
                                                year.students.forEach(studentss => {
                                                    studentss.forEach(student => {
                                                        const studentExam = student.exams.find(e => e.period === exam.period);
                                                        if (studentExam) {
                                                            const subjectExam = studentExam.subjects.find(s => s.name === subject.name);
                                                            if (subjectExam) {
                                                                const mySubjectExam = subjectExam.exams.find(e => e.period === exam.period);
                                                                if (mySubjectExam) {
                                                                    const examPaper = mySubjectExam.papers.find(p => p.paperNumber === paper.paperNumber);
                                                                    if (examPaper && examPaper.confirmed) {
                                                                        console.log("paper", examPaper);

                                                                        paperData.totalMarks = examPaper.total;
                                                                        examData.totalMarks = examPaper.total;

                                                                        paperData.students.push({
                                                                            regNumber: student.studentId.regNumber,
                                                                            name: student.studentId.name,
                                                                            mark: examPaper.percentage || 0
                                                                        });
                                                                        console.log(paperData);

                                                                    }
                                                                    console.log("paperData", paperData);

                                                                }
                                                            }
                                                        }
                                                    });
                                                });
                                            }

                                            // Add paperData to examData.papers
                                            if (paperData.students.length > 0) {
                                                adding = true;
                                                examData.papers.push(paperData);
                                            }
                                            console.log(examData);

                                        }
                                    }

                                    // Add examData to subjectData.papers
                                    if (examData.papers.length > 0) {
                                        subjectData.papers = examData.papers;
                                    }
                                    console.log(subjectData);

                                }
                            }

                            // Add subjectData to classData.subjects
                            if (subjectData.papers.length > 0) {
                                classData.subjects.push(subjectData);
                            }
                        }
                    }
                }
            }

            if (classData.subjects.length > 0) {
                responseData.push(classData);
                console.log("After pushing, Class data:", classData);
            }
        }

        console.log("Data processed successfully");

        // Return the success response
        return NextResponse.json(responseData, { status: 200 });
    } catch (error) {
        console.error("Error fetching exam data:", error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
