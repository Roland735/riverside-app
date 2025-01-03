import { NextResponse } from "next/server";
import { studentsModel } from "@/models/Demographic";

export async function PUT(req) {
    try {
        const body = await req.json();
        console.log(body);
        const { doctorName,
            email,
            contact1,
            contact2,
            address,
            allergies,
            dietRestrictions,
            doctorAdress,
            regNumber } = body;

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
        if (doctorName) existingStudent.doctorName = doctorName;
        if (email) existingStudent.doctorEmail = email;
        if (contact1) existingStudent.doctorContact1 = contact1;
        if (contact2) existingStudent.doctorContact2 = contact2;
        if (allergies) existingStudent.allergies = allergies;
        if (doctorAdress) existingStudent.doctorPlaceOfWork = doctorAdress;
        if (dietRestrictions) existingStudent.dietRestrictions = dietRestrictions;

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
