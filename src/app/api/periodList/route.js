// /pages/api/exam-period/create.js
import ExamPeriods from "@/app/components/admin/ExamPeriods";
import { connectDB } from "@/configs/dbConfig";

import { NextResponse } from "next/server";

connectDB();


export async function POST(req) {
    console.log("he");

    const examPeriods = await ExamPeriods.find({});
    console.log("hell");

    console.log('examPeriods:', examPeriods);

    return NextResponse.json({ message: "Exam period created successfully", examPeriods });
}
