import { NextResponse } from "next/server";
import { studentsModel } from "@/models/Demographic";
import { connectDB } from "@/configs/dbConfig";


connectDB();
export async function PUT(req) {
    try {
        const body = await req.json();
        const { contact1, contact2, address, regNumber } = body;

        // Ensure regNumber is provided
        if (!regNumber) {
            return NextResponse.json({ error: 'RegNumber is required.' }, { status: 400 });
        }

        // Find the existing document with the provided regNumber
        let existingStudent = await studentsModel.findOne({ regNumber });

        if (!existingStudent) {
            return NextResponse.json({ message: 'Student not found', error: true }, 404);
        }

        // Update the existing document if the value is provided
        if (contact1) existingStudent.contact1 = contact1;
        if (contact2) existingStudent.contact2 = contact2;
        if (address) existingStudent.address = address;

        // Save the updated document
        const updatedStudent = await existingStudent.save();

        return NextResponse.json({
            message: 'Student contact successfully updated',
            updatedStudent
        });
    } catch (error) {
        console.error('Error updating contact:', error);
        return NextResponse.json({ error: 'Unable to update contact. Please try again.' }, { status: 500 });
    }
}
