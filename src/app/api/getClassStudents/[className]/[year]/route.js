import { connectDB } from "@/configs/dbConfig";
import { SchoolClass } from "@/models/GradeSyllabus";
import { NextResponse } from "next/server";

connectDB();

export const GET = async (request, { params }) => {

    console.log("hi");

    const { className, year } = params;
    console.log(className, year);
    const parsedYear = parseInt(year); // Convert year to an integer


    try {
        const schoolClass = await SchoolClass.findOne({ className, 'years.year': parsedYear });
        console.log(schoolClass);

        if (!schoolClass) {
            return NextResponse.json(
                { message: "Class not found" },
                { status: 404 }
            );
        }
        const yearData = schoolClass.years.find(y => y.year === parsedYear);

        const students = yearData ? yearData.students : [];

        console.log(students);
        return NextResponse.json({ students: students.map(student => ({ regNumber: student.reg_number, name: student.name || `${student.firstname} ${student.lastname}` })) }, { status: 200 });


    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "An error occurred while fetching class students" },
            { status: 500 }
        );
    }
};
