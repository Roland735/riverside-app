import { SchoolClass } from "@/models/GradeSyllabus";
import { Teacher } from "@/models/Teacher";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { className, classTeachers, subjects, year, level, term } = await req.json();
        console.log("term and level", term, level);

        const name = `${level} ${className}`;


        // Validate request body
        if (!className || !classTeachers || !year || !Array.isArray(subjects) || !term) {
            return NextResponse.json(
                {
                    message:
                        "Invalid request body. Please provide className, classTeachers, year, and subjects array.",
                },
                { status: 400 }
            );
        }
        console.log(className, classTeachers, year, subjects, term);


        // Create new class document
        const newClass = await SchoolClass.create({
            className: name,
            level,
            term,
            classTeachers: classTeachers.map((teacherName) => ({
                name: teacherName,
            })),
            years: [
                {
                    year,
                    subjects: subjects.map((subject) => ({
                        name: subject.name,
                        currentTeachers: subject.teachers.map((teacherName) => ({
                            name: teacherName,
                        })),
                    })),
                },
            ],
        });
        console.log(newClass);


        // Update Teacher model for subject teachers
        for (const subject of subjects) {
            for (const teacherName of subject.teachers) {
                await Teacher.updateOne(
                    { name: teacherName },
                    {
                        $push: {
                            activeClasses: {
                                className: name,
                                subjects: [subject.name],
                            },
                            classesTaught: {
                                class: newClass._id,
                                yearTaught: year,
                                averageMark: 0,
                            },
                        },
                    }
                );
            }
        }

        return NextResponse.json({
            message: "Class created successfully",
            data: newClass,
        });
    } catch (error) {
        console.error("Error creating class:", error);
        return NextResponse.json(
            { message: "Error creating class" },
            { status: 500 }
        );
    }
}
