import { NextResponse } from 'next/server';
import { connectDB } from "@/configs/dbConfig";
import Exam from '@/models/examModel';

connectDB();

export async function POST(req) {
    try {
        // Parse the JSON body from the request
        console.log("hi");

        const { name, regNumber, period, year } = await req.json();
        const yearFilter = parseInt(year);

        // Log the received data
        console.log("Received data:", { name, regNumber, period, year });

        // Find the exam class where the teacher is assigned as a marker
        const examClasses = await Exam.find({
            "years.subjects.exams.papers.marker": {
                $elemMatch: {
                    name: name,
                    regNumber: regNumber
                }
            }
        });

        console.log("jd", examClasses);

        // Check if any classes are found
        if (!examClasses || examClasses.length === 0) {
            return NextResponse.json({ message: "No classes found for this teacher" }, { status: 404 });
        }

        // Prepare data to return
        const data = examClasses.map((examClass) => {
            // Log the current exam class being processed
            console.log("Processing exam class:", examClass.className);

            // Define the period and year you're filtering for



            // Extract relevant information from the examClass
            const students = examClass.years
                .filter((year) => year.year === yearFilter)  // Filter year based on yearFilter
                .flatMap((year) => {
                    console.log("Processing year:", year.year, year.students);

                    return year.students.map((student) => {
                        console.log("Processing student:", student[0].studentId.regNumber, student[0].studentId.name);

                        return {
                            regNumber: student[0].studentId.regNumber,
                            name: student[0].studentId.name
                        };
                    });
                });
            console.log(students);

            const papers = examClass.years
                .filter((year) => year.year === yearFilter)  // Filter year based on yearFilter
                .flatMap((year) => {
                    console.log("Processing year for papers:", year.year);

                    return year.subjects.flatMap((subject) => {
                        console.log("Processing subject:", subject.name);

                        return subject.exams
                            .filter((exam) => exam.period === period)  // Only include exams that match the period
                            .flatMap((exam) => {
                                console.log("Processing exam period:", exam.period);

                                return exam.papers.map((paper) => {
                                    console.log("Processing paper:", paper.paperNumber, subject.name);

                                    return {
                                        paperNumber: paper.paperNumber,
                                        paperName: subject.name
                                    };
                                });
                            });
                    });
                });

            console.log("Final data for class:", examClass.className, { students, papers });

            return {
                className: examClass.className,
                students: students,
                papers: papers
            };
        });


        // Log the complete data object
        console.log("Final data output:", data);


        console.log("Returning data:", data);

        // Return the processed data
        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        console.error("Error fetching teacher's data:", error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
