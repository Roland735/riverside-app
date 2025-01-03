import { connectDB } from "@/configs/dbConfig";
import Exam from "@/models/examModel";
import { SchoolClass } from "@/models/GradeSyllabus";
import { NextResponse } from "next/server";

// Ensure the database is connected before handling the request
connectDB();

export async function POST(req) {
    try {
        const { invigilator } = await req.json();

        console.log("Fetching classes for teacher:", invigilator);

        // Find exams where the teacher is an invigilator in the year 2025
        const exams = await Exam.find({
            "years.year": 2025,
            "years.subjects.exams.papers.invigilator.name": invigilator,
        });
        console.log("Exams found:", exams.length);

        if (exams.length === 0) {
            return NextResponse.json({ message: "No exams found for this teacher" }, { status: 404 });
        }

        // Extract and filter papers
        const papersData = exams.flatMap((exam) =>
            exam.years.flatMap((year) =>
                year.subjects.flatMap((subject) =>
                    subject.exams.flatMap((subjectExam) =>
                        subjectExam.papers
                            .filter((paper) =>
                                paper.confirmed &&
                                paper.invigilator.some((inv) => inv.name === invigilator)
                            )
                            .map((paper) => ({
                                subjectName: subject.name,
                                className: exam.className,
                                paperNumber: paper.paperNumber,
                                invigilatorName: invigilator,
                                students: []
                            }))
                    )
                )
            )
        );

        console.log("Papers data:", papersData);

        // Group by paperNumber and className
        // const groupedByPaper = papersData.reduce((acc, paper) => {
        //     const key = `${paper.paperNumber}_${paper.className}`;
        //     if (!acc[key]) {
        //         acc[key] = {
        //             paperNumber: paper.paperNumber,
        //             subjectName: paper.subjectName,
        //             className: paper.className,
        //             invigilatorName: paper.invigilatorName,
        //             students: []
        //         };
        //     }
        //     return acc;
        // }, {});
        // // let groupedByPaper = {};
        // console.log("Grouped by paper:", groupedByPaper);

        // Convert grouped data into an array for response
        const formattedData = Object.values(papersData);
        console.log("Formatted data:", formattedData);

        // Fetch the students who are doing the extracted subjects in the respective classes
        const classes = await SchoolClass.find({
            className: { $in: formattedData.map(item => item.className) },
            "years.year": 2025,
            "years.subjects.name": { $in: formattedData.map(item => item.subjectName) }
        });
        console.log("Classes found:", classes);

        if (classes.length === 0) {
            return NextResponse.json({ message: "No classes found for the given class names and subjects" }, { status: 404 });
        }

        // Collect and group students by class
        const studentsByClass = {};

        classes.forEach(schoolClass => {
            const yearData = schoolClass.years.find(y => y.year === 2025);
            console.log("hi");
            if (yearData) {
                const className = schoolClass.className;
                console.log("hi");

                if (!studentsByClass[className]) {
                    studentsByClass[className] = [];
                }

                yearData.students.forEach(student => {
                    console.log("hi");
                    const matchingGrade = student.grades.find(grade => grade.grade === className);

                    if (matchingGrade) {
                        console.log("hi");

                        matchingGrade.subjects.forEach(subjectDetail => {
                            console.log("yo", student);
                            const studentExists = studentsByClass[className].some(existingStudent =>
                                existingStudent.reg_number === student.reg_number
                            );

                            if (!studentExists && formattedData.some(group => group.subjectName === subjectDetail.name && group.className === className)) {
                                console.log("hi");
                                studentsByClass[className].push({
                                    ...student._doc,
                                    subjectName: subjectDetail.name,
                                    className: className
                                });
                            }
                        });

                    }
                });
            }
        });
        // console.log("Students by class:", studentsByClass);
        console.log(studentsByClass);


        // Merge students data into the grouped data
        formattedData.forEach(group => {
            console.log(`Merging students for ${group.className}`);
            group.students = studentsByClass[group.className] || [];
            console.log(`Students for ${group.className}:`, group.students);
        });

        // console.log("Grouped data with students:", formattedData);

        console.log("Formatted data:", formattedData);

        return NextResponse.json({ subjectsAndClasses: formattedData }, { status: 200 });
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json(
            { message: "Error fetching data", error: error.message },
            { status: 500 }
        );
    }
}
