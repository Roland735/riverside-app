import { connectDB } from "@/configs/dbConfig";
import { studentsModel } from "@/models/Demographic";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

connectDB();

export async function POST(req) {
    try {
        const body = await req.json();
        const { name, lastName, nationalIdNumber, regNumber, email } = body;

        // Find the existing document with the provided regNumber
        let existingStudent = await studentsModel.findOne({ regNumber });

        if (existingStudent) {
            // If document exists, update it
            if (name) existingStudent.name = name;
            if (lastName) existingStudent.lastName = lastName;
            if (nationalIdNumber) existingStudent.nationalIdNumber = nationalIdNumber;
            if (email) existingStudent.emailAddress = email;
            await existingStudent.save();

            return NextResponse.json({
                message: 'Student profile successfully updated'
            });
        } else {
            // If document doesn't exist, create a new one
            const newStudentInfo = new studentsModel({
                name: name,
                lastName: lastName,
                nationalIdNumber: nationalIdNumber,
                emailAddress: email,
                regNumber
            });
            await newStudentInfo.save();

            return NextResponse.json({
                message: 'New student profile successfully created'
            });
        }
    } catch (error) {
        console.error('Error saving profile:', error);
        return NextResponse.json({ error: 'Unable to save profile. Please try again.' }, { status: 500 });
    }
}
