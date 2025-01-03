// /pages/api/exam/confirm.js
import { connectDB } from "@/configs/dbConfig";
import Exam from "@/models/examModel";

import { NextResponse } from "next/server";

connectDB();

export async function POST(req) {
    const { examId } = await req.json();

    const exam = await Exam.findById(examId);
    if (!exam) {
        return NextResponse.json({ message: "Exam not found" }, { status: 404 });
    }

    exam.status = 'Confirmed';
    await exam.save();

    return NextResponse.json({ message: "Exam confirmed successfully" });
}
