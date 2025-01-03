import { connectDB } from "@/configs/dbConfig";
import { userModel } from "@/models/userModel";
import { NextResponse } from "next/server";

connectDB();

export async function GET() {
    try {
        const users = await userModel.find({}, "firstname lastname regNumber role profilePicture").lean();
        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ message: "Error fetching users", error: error.message }, { status: 500 });
    }
}
