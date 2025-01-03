import { connectDB } from "@/configs/dbConfig";
import Department from "@/models/Departments";
import { NextResponse } from "next/server";

connectDB();

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const departmentName = searchParams.get('department');

    try {
        // Find the department and get subject count
        const department = await Department.findOne({ name: departmentName });
        if (!department) {
            return NextResponse.json({ message: "Department not found" }, { status: 404 });
        }

        const subjectCount = department.subjects.length;

        return NextResponse.json({ count: subjectCount }, { status: 200 });
    } catch (error) {
        console.error("Error fetching subject count:", error);
        return NextResponse.json({ message: "Failed to fetch subject count", error: error.message }, { status: 500 });
    }
}
