// /pages/api/marks/confirm.js
import { connectDB } from "@/configs/dbConfig";
import Exam from "@/models/examModel";

import { NextResponse } from "next/server";

connectDB();

export async function POST(req) {
    const { markId } = await req.json();

    const mark = await Exam.findById(markId);
    if (!mark) {
        return NextResponse.json({ message: "Mark not found" }, { status: 404 });
    }

    mark.confirmed = true;
    await mark.save();

    return NextResponse.json({ message: "Mark confirmed successfully" });
}
