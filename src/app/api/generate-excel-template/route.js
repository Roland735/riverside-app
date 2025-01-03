import { connectDB } from "@/configs/dbConfig";
import { SchoolClass } from "@/models/GradeSyllabus";
import { NextResponse } from "next/server";
import generateExcelTemplate from './generateExcelTemplate'; // Import the function

connectDB();

// Define the POST route handler
export const POST = async (request) => {
    try {
        // Extract data from the request body
        const { className, subjectName, templateType, title } = await request.json();
        console.log(className, subjectName, templateType, title);

        // Generate Excel template for the specified class, subject, and template type
        const excelBuffer = await generateExcelTemplate(className, subjectName, templateType);

        // If the buffer is null, it means the class was not found
        if (!excelBuffer) {
            return NextResponse.json(
                { message: "Class not found" },
                { status: 404 }
            );
        }

        // Set the filename
        const filename = `${title}-${templateType}-Template.xlsx`;

        // Send the Excel file as a response
        return new Response(excelBuffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename=${filename}`
            }
        });
    } catch (error) {
        console.error(error);
        // Return a 500 response if an error occurs
        return NextResponse.json(
            { message: "An error occurred while generating Excel template" },
            { status: 500 }
        );
    }
};
