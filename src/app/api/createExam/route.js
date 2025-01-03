import { connectDB } from "@/configs/dbConfig";
import Exam from "@/models/examModel";
import { NextResponse } from "next/server";

connectDB();

export async function POST(request) {
    try {
        console.log("Received request to create multiple exams");

        const { exams, teacherName } = await request.json();
        console.log(exams, teacherName);

        for (const { subject, period, papers, className } of exams) {
            // Find the class and subject
            let schoolClass = await Exam.findOne({
                className,
                "years.subjects.name": subject
            });

            if (!schoolClass) {
                schoolClass = await Exam.create({
                    className,
                    years: [{
                        year: 2025,
                        subjects: [{
                            name: subject,
                            currentTeachers: [{
                                name: teacherName
                            }],
                            exams: []
                        }]
                    }]
                });
            }

            // Add the exam to the subject
            let examAddedOrUpdated = false;
            schoolClass.years.forEach(yearObj => {
                if (yearObj.year === 2025) {
                    yearObj.subjects.forEach(subj => {
                        if (subj.name === subject) {
                            // Check if an exam with the same period exists
                            const existingExam = subj.exams.find(exam => exam.period === period);

                            if (existingExam) {
                                // Update existing exam with new papers
                                existingExam.papers = papers.map(paper => ({
                                    paperNumber: paper.paperNumber,
                                    duration: {
                                        hours: paper.hours,
                                        minutes: paper.minutes
                                    }
                                }));
                            } else {
                                // Add a new exam
                                const newExam = {
                                    period,
                                    startDate: new Date(), // Handle startDate properly if needed
                                    papers: papers.map(paper => ({
                                        paperNumber: paper.paperNumber,
                                        duration: {
                                            hours: paper.hours,
                                            minutes: paper.minutes
                                        }
                                    }))
                                };
                                subj.exams.push(newExam);
                            }
                            examAddedOrUpdated = true;
                        }
                    });
                }
            });

            if (!examAddedOrUpdated) {
                return NextResponse.json({ message: `Exam for ${subject} could not be added or updated` }, { status: 500 });
            }

            await schoolClass.save();
        }

        return NextResponse.json({ message: "Exams created or updated successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
