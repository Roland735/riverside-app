// pages/api/update-student-receiving-status.js

import { NextResponse } from 'next/server';
import StudentReport from '@/models/StudentReport'; // Adjust the import path as necessary
import { connectDB } from '@/configs/dbConfig'; // Import your database connection utility

// API route to update student receiving status
export async function POST(req) {
    console.log("Connecting to the database...");
    await connectDB(); // Connect to your MongoDB database
    console.log("Database connected successfully.");

    try {
        console.log("Parsing request data...");
        const { students, year, period } = await req.json(); // Expecting an array of students
        console.log("Students data received:", students);
        const myYear = parseInt(year)
        const myPeriod = period

        // Loop through each student and update their receiving status
        await Promise.all(
            students.map(async (student) => {
                console.log("Processing student:", student);

                const { id, selected, reason } = student;
                console.log("Student ID:", id);
                console.log("Receive Report Status (selected):", selected);
                console.log("Reason (if any):", reason);

                // Find the student report and update the receiving status
                console.log("Updating student report for student ID:", id);
                const result = await StudentReport.findOne({ 'studentId': id });
                if (result) {
                    console.log("Found student report for student ID:", id);
                    const yearData = result.years.find(year => year.year === myYear);
                    console.log(yearData);

                    if (yearData) {
                        const examPeriod = yearData.examPeriods.find(period => period.examPeriod === myPeriod);
                        console.log("period", examPeriod);

                        if (examPeriod) {

                            examPeriod.receiveReport = selected;
                            if (reason !== "") { examPeriod.reason = reason; }
                            await result.save();
                            console.log("Student report updated successfully for student ID:", examPeriod.receiveReport);
                        }
                    }
                }


                console.log("Update result for student ID:", id, result);
            })
        );

        console.log("All student statuses updated successfully.");
        return NextResponse.json({ message: 'Student receiving status updated successfully.' }, { status: 200 });
    } catch (error) {
        console.error('Error updating student receiving status:', error);
        return NextResponse.json({ message: 'Error updating student receiving status.' }, { status: 500 });
    }
}
