import { connectDB } from "@/configs/dbConfig";
import { Subject } from "@/models/subjects";
import Department from "@/models/Departments";
import { NextResponse } from "next/server";

connectDB();

export async function POST(req) {
    try {
        const { name, description, department, status, createdBy } = await req.json();

        // Check if the subject already exists
        const existingSubject = await Subject.findOne({ name });
        if (existingSubject) {
            return NextResponse.json({ message: "Subject already exists" }, { status: 400 });
        }

        // Fetch the department
        const departmentData = await Department.findOne({ name: department }).populate('subjects');
        if (!departmentData) {
            return NextResponse.json({ message: "Department not found" }, { status: 404 });
        }

        // Generate the subject code
        const subjectCount = departmentData.subjects.length + 1;
        const code = `${department.charAt(0).toUpperCase()}${String(subjectCount).padStart(4, '0')}`;

        // Create a new subject
        const subject = new Subject({
            name,
            code,
            description,
            department,
            status,
            createdBy,
        });

        await subject.save();

        // Add subject to department
        departmentData.subjects.push(subject._id);
        await departmentData.save();

        return NextResponse.json({ message: "Subject created successfully", subject }, { status: 201 });
    } catch (error) {
        console.error('Error creating subject:', error);
        return NextResponse.json({ message: 'Failed to create subject', error: error.message }, { status: 500 });
    }
}
