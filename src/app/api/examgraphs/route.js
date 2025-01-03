import { connectDB } from "@/configs/dbConfig";
// import { examModel } from "@/models/examModel";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Exam from "@/models/examModel";

connectDB();

export async function GET(req) {
    try {
        // const body = await req.json();
        // const { subject } = body;
        const subject = "Math"; // Assuming the subject is passed in the request body;

        // Find the existing document with the provided regNumber
        const subjectAverages = await Exam.aggregate([
            {
                $group: {
                    _id: "$subject",
                    average: { $avg: "$average_mark" },
                    highestMark: { $avg: "$highest_mark" },
                    LowestMark: { $avg: "$lowest_mark" },
                },
            },
        ]);
        console.log(subjectAverages);
        if (subjectAverages.length > 0) {

            return NextResponse.json({
                message: 'Student profile successfully updated',
                subjectAverages
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
