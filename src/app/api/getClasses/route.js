import { connectDB } from "@/configs/dbConfig";
import { SchoolClass } from "@/models/GradeSyllabus";
import { NextResponse } from "next/server";
connectDB();

export const GET = async () => {
    try {
        const classes = await SchoolClass.find({});
        return NextResponse.json({ classes }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "An error occurred while fetching classes" },
            { status: 500 }
        );
    }
};
