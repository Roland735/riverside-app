import { connectDB } from "@/configs/dbConfig";
import StudentReport from "@/models/StudentReport";
import { userModel } from "@/models/userModel"; // Note: It seems you're not using this in the code
import { NextResponse } from "next/server";

// Connect to the database
connectDB();

export const POST = async (req) => {
    try {
        console.log("Fetching student reports...");

        const { period, year } = await req.json();
        console.log("Received data:", { period, year });

        // Fetch all student reports for the specified year and exam period
        const studentReports = await StudentReport.find({ "years.year": year })
            .populate({
                path: 'studentId',
                select: 'firstname lastname' // Only fetching relevant details from the student
            });
        console.log("Fetched student reports:", studentReports);

        // Map through the reports and extract relevant data
        const students = studentReports.map(report => {
            const student = report.studentId;
            const yearData = report.years.find(y => y.year === parseInt(year));
            const examPeriod = yearData?.examPeriods.find(ep => ep.examPeriod === period);

            return {
                id: student._id,
                name: `${student.firstname} ${student.lastname}`,
                selected: examPeriod?.receiveReport || false,
                reason: examPeriod?.reason || ''
            };
        });
        console.log("Mapped student data:", students);

        return NextResponse.json(students, { status: 200 });
    } catch (error) {
        console.error("Error fetching student reports:", error);
        return NextResponse.json(
            { message: "Error fetching student reports", error: error.message },
            { status: 500 }
        );
    }
};
