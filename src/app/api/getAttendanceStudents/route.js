import { connectDB } from "@/configs/dbConfig";
import { SchoolClass } from "@/models/GradeSyllabus";
import { NextResponse } from "next/server";

// Ensure the database is connected before handling the request
connectDB();

export async function POST(req) {
    try {
        const { classTeacher, year } = await req.json();
        console.log("Fetching students for class teacher:", classTeacher, "in year:", year);

        // Fetch the class based on the teacher and year
        const schoolClass = await SchoolClass.findOne({
            "classTeachers.name": classTeacher,
            "years.year": year
        });

        if (!schoolClass) {
            return NextResponse.json({ message: "Class not found" }, { status: 404 });
        }

        // Extract the students from the specified year
        const students = schoolClass.years.find(y => y.year === year).students;

        return NextResponse.json(students, { status: 200 });
    } catch (error) {
        console.error("Error fetching students data:", error);
        return NextResponse.json(
            { message: "Error fetching students data", error: error.message },
            { status: 500 }
        );
    }
}
