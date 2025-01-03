import { connectDB } from "@/configs/dbConfig";
import { assignmentModel } from "@/models/assignment";
import { NextResponse } from "next/server";
import { userModel } from "@/models/userModel";


connectDB();
export async function POST(req) {

    try {
        // Use middleware to check authentication
        // await withAuth(req, res);


        const body = await req.json();
        // 
        const { courseId, title, grade, description, due_date, instructions, points, created_by } = body;
        console.log(body);
        // console.log(createdBy);

        const newAssignment = new assignmentModel({
            course_id: courseId,
            grade,
            title,
            description,
            due_date: due_date,
            instructions,
            created_by: created_by
        });
        await newAssignment.save();
        return NextResponse.json({
            message: 'Assignment created successfully'
        });
    } catch (error) {
        console.error('Error creating assignment:', error);
        return NextResponse.json({ error: 'Unable to create assignment. Please try again.' }, { status: 500 });
    }

}
