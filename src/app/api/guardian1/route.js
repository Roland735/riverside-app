import { NextResponse } from "next/server";
import { studentsModel } from "@/models/Demographic";
import { connectDB } from "@/configs/dbConfig";

connectDB();

export async function POST(req) {
    try {
        const body = await req.json();

        const { name, email, contact1, contact2, emergencyContact, regNumber } = body;


        // Ensure regNumber is provided
        if (!regNumber) {
            return NextResponse.json({ error: 'RegNumber is required.' }, { status: 400 });
        }

        // Find the existing document with the provided regNumber
        let existingStudent = await studentsModel.findOne({ regNumber });

        if (!existingStudent) {
            return NextResponse.json({ message: 'Student not found', error: true }, 404);
        }


        console.log(existingStudent)

        // Create a new object for guardian1 with updated values
        const updatedGuardian1 = { ...existingStudent.guardian1 }; // No need to access _doc here
        if (name) updatedGuardian1.name = name;
        if (email) updatedGuardian1.email = email;
        if (contact1) updatedGuardian1.contact1 = contact1;
        if (contact2) updatedGuardian1.contact2 = contact2;
        if (emergencyContact) updatedGuardian1.emergencyContact = emergencyContact;

        // Update the guardian1 field with the new object
        existingStudent.guardian1 = updatedGuardian1;

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
