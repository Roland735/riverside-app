import { NextResponse } from 'next/server';
import { connectDB } from "@/configs/dbConfig";
import Exam from '@/models/examModel';

connectDB();

export async function POST(req) {
    try {
        const { regNumber, paperNumber, students, className, subject, examPeriod, examYear } = await req.json();
        console.log("Received data for submission:", { regNumber, className, subject, paperNumber, students, examPeriod, examYear });

        const myClass = await Exam.findOne({ className });
        if (!myClass) {
            return NextResponse.json({ message: "Class not found" }, { status: 404 });
        }

        await Promise.all(students.map(async (stu) => {
            console.log(`Processing student: ${stu.regNumber}`);

            myClass.years.forEach(year => {
                if (year.year === examYear) {
                    console.log(`Year 2025 found for student: ${stu.regNumber}`);

                    year.students.forEach(stud => {
                        console.log(stud);

                        if (stud[0].studentId.regNumber === stu.regNumber) {
                            console.log(`Matching student found: ${stu.regNumber}`);

                            stud[0].exams.forEach(ex => {
                                if (ex.period === examPeriod) {
                                    console.log(`Exam period found for student: ${stu.regNumber} in Mid-First term`);

                                    ex.subjects.forEach(sub => {
                                        if (sub.name === subject) {
                                            console.log(`Subject ${subject} found for student: ${stu.regNumber}`);

                                            sub.exams.forEach(exa => {
                                                if (exa.period === examPeriod) {
                                                    console.log(`Exam period within subject found: Mid-First term for student: ${stu.regNumber}`);

                                                    let confirmed = true;
                                                    let total = 0;

                                                    exa.papers.forEach(paper => {
                                                        if (paper.paperNumber === paperNumber) {
                                                            console.log(`Paper number ${paperNumber} found for student: ${stu.regNumber}`);
                                                            console.log(typeof stu.mark === 'number');
                                                            console.log(typeof stu.total === 'number');
                                                            console.log(stu.total > 0);
                                                            console.log(stu.total);



                                                            if (typeof stu.mark === 'number' && typeof stu.total === 'number' && stu.total > 0) {
                                                                console.log(`Valid marks found for student: ${stu.regNumber}, marks: ${stu.mark}, total: ${stu.total}`);

                                                                paper.mark = stu.mark;
                                                                paper.total = stu.total;
                                                                paper.percentage = (stu.mark / stu.total) * 100;
                                                                paper.confirmed = true;
                                                            } else {
                                                                console.log(`Invalid marks or total for student ${stu.regNumber}: marks = ${stu.mark}, total = ${stu.total}`);
                                                            }
                                                        }

                                                        if (!paper.confirmed) {
                                                            confirmed = false;
                                                            console.log(`Paper not confirmed for student: ${stu.regNumber}, paper: ${paper.paperNumber}`);
                                                        }

                                                        total = total + paper.percentage;
                                                        console.log(`Current total percentage for student: ${stu.regNumber} = ${total}`);
                                                    });

                                                    exa.percentage = confirmed ? total / exa.papers.length : 0;
                                                    console.log(`Final percentage for exam ${exa.period} for student ${stu.regNumber}: ${exa.percentage}`);
                                                    myClass.years.forEach((y) => {
                                                        console.log("year found", year);
                                                        if (year.year === examYear) {
                                                            console.log("year found");

                                                            y.subjects.forEach((s) => {
                                                                console.log("year found");
                                                                if (s.name === subject) {
                                                                    console.log("year found");
                                                                    s.exams.forEach((exam) => {
                                                                        console.log("year found");
                                                                        if (exam.period === examPeriod) {
                                                                            console.log("year found");
                                                                            let allMarked = true;
                                                                            exam.papers.forEach((paper) => {
                                                                                console.log("year found");
                                                                                if (paper.paperNumber === paperNumber) {
                                                                                    console.log("paper found", paper);

                                                                                    paper.marksUploaded = true;
                                                                                }
                                                                                if (paper.marksUploaded === false) {
                                                                                    allMarked = false;
                                                                                }
                                                                            })
                                                                            exam.marksUploaded = allMarked;

                                                                        }
                                                                    })
                                                                }
                                                            })
                                                        }
                                                    })

                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }));

        await myClass.save();
        return NextResponse.json({ message: "Paper marks updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating paper marks:", error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
