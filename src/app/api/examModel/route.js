import { connectDB } from "@/configs/dbConfig";
import Exam from "@/models/examModel";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

connectDB();

export async function GET(req) {
    try {
        // const body = await req.json();
        // const { subject } = body;
        const subject = "Science"; // Assuming the subject is passed in the request body;

        // Find the existing document with the provided regNumber
        const exams = await Exam.find();
        console.log(exams);

        if (exams) {

            return NextResponse.json({
                message: 'Student profile successfully updated',
                exams
            });
        } else {


            return NextResponse.json({
                message: 'No exams found for the given subject',
            });
        }
    } catch (error) {
        console.error('Error fetching exams:', error);
        return NextResponse.json({ error: 'Unable to get Exams. Please try again.' }, { status: 500 });
    }
}
