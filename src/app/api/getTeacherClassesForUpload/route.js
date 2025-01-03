import { connectDB } from "@/configs/dbConfig";
import { SchoolClass } from "@/models/GradeSyllabus";
import Exam from "@/models/examModel";
import { NextResponse } from "next/server";

connectDB();

export async function POST(req) {
    try {
        const { teacherName } = await req.json();
        console.log(teacherName);


        if (!teacherName) {
            return NextResponse.json({ message: "Teacher name is required" }, { status: 400 });
        }

        // Find all classes where the teacher is teaching in 2025
        const classes = await SchoolClass.find({
            "years.year": 2025,
            "years.subjects.currentTeachers.name": teacherName
        });

        console.log(classes);

        if (classes.length === 0) {
            return NextResponse.json({ message: "No classes found for the teacher in 2025" }, { status: 404 });
        }

        console.log("hi");

        // Extract relevant class and subject details with exams
        const classDetails = await Promise.all(classes.map(async (schoolClass) => {

            const year2025 = schoolClass.years.find((year) => year.year === 2025);


            console.log("hi");

            const subjects = await Promise.all(year2025.subjects.map(async (subject) => {

                console.log("hi");


                if (subject.currentTeachers.some((teacher) => teacher.name === teacherName)) {

                    console.log(subject.name);



                    // Find exams for this subject in the Exam schema

                    const exams = await Exam.findOne({
                        className: schoolClass.className,
                        "years.year": 2025,
                        "years.subjects.name": subject.name,
                        "years.subjects.exams.papers": { $exists: true, $size: { $gt: 1 } }
                    });

                    console.log("hi");



                    console.log(exams);

                    console.log("hi");


                    return {
                        name: subject.name,
                        exams: exams ? exams.years[0].subjects.find(s => s.name === subject.name).exams : []
                    };
                }
            }));
            console.log(schoolClass._id);


            return {
                _id: schoolClass._id,
                className: schoolClass.className,
                subjects: subjects.filter(s => s) // Filter out undefined subjects
            };
        }));


        return NextResponse.json({ classes: classDetails });
    } catch (error) {
        console.error("Error fetching classes and exams:", error);
        return NextResponse.json({ message: "Error fetching classes and exams" }, { status: 500 });
    }
}
