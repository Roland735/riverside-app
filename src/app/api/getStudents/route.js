import { connectDB } from "@/configs/dbConfig";
import { userModel } from "@/models/userModel";
import { NextResponse } from "next/server";

connectDB();

export const GET = async () => {
    try {
        // Fetch students with reg_number, firstname, and lastname fields
        const students = await userModel.find(
            { role: 'student' },
            { regNumber: 1, firstname: 1, lastname: 1 } // Project only regNumber, firstname, and lastname
        );

        return NextResponse.json({ students }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "An error occurred while fetching students" },
            { status: 500 }
        );
    }
};
