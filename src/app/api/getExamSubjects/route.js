import { connectDB } from "@/configs/dbConfig";
import { SchoolClass } from "@/models/GradeSyllabus";
import { NextResponse } from "next/server";

connectDB();

export async function POST(request) {
    try {
        const name = await request.json();
        console.log(name);

        // const { className, year } = await request.json();

        if (!className || isNaN(year)) {
            return NextResponse.json({ message: "Invalid className or year" }, { status: 400 });
        }

        const schoolClass = await SchoolClass.findOne({ className, "years.year": year }, { "years.$": 1 });

        if (!schoolClass) {
            return NextResponse.json({ message: "Class or year not found" }, { status: 404 });
        }

        const subjects = schoolClass.years[0].subjects;

        return NextResponse.json({ subjects }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
