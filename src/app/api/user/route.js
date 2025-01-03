// src/app/api/user/route.js
import { connectDB } from "@/configs/dbConfig";
import { userModel } from "@/models/userModel";
import { NextResponse } from "next/server";

connectDB();

export async function POST(req) {
    try {
        console.log("hi");

        const { userId, name, lastname } = await req.json(); // Adjust as needed to get the user ID
        console.log(userId, name, lastname);

        // const user = await userModel.find({
        //     "firstname": name,
        //     "lastname": lastname,
        // });
        const users = await userModel.find({
        });
        console.log(users);

        const user = users.find(u => u.regNumber === userId.regNumber);

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("Error fetching user data:", error);
        return NextResponse.json({ message: "Error fetching user data", error: error.message }, { status: 500 });
    }
}
