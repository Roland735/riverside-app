import { connectDB } from "@/configs/dbConfig";
import Department from "@/models/Departments";
import { NextResponse } from "next/server";

connectDB();

export async function GET(req) {
    try {
        // Fetch all departments and populate the subjects
        const departments = await Department.find();

        return NextResponse.json({ departments }, {
            status: 200, headers: {
                'Cache-Control': 'no-store, must-revalidate',
            },
        });
    } catch (error) {
        console.error('Error fetching departments:', error);
        return NextResponse.json({ message: 'Failed to fetch departments', error: error.message }, { status: 500 });
    }
}
