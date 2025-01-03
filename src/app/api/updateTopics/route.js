import { connectDB } from "@/configs/dbConfig";
import { NextResponse } from "next/server";
import { SchoolClass } from "@/models/GradeSyllabus"; // Import the SchoolClass model

connectDB();

export async function POST(req) {
    try {
        const body = await req.json();
        const { className, year, subjectName, title } = body; // Assuming the request body contains className, year, subjectName, and title array

        console.log('Updating title with:', className, year, subjectName, title);
        const startDate = new Date("2024-05-01");

        // Loop through topics to calculate start and end dates
        const topicsWithDates = title.map(topicRec => {
            const { scheduleNumber, duration, title } = topicRec;
            const daysToAdd = (scheduleNumber - 1) * (duration * 7); // Convert duration from weeks to days
            const topicStartDate = new Date(startDate);
            topicStartDate.setDate(topicStartDate.getDate() + daysToAdd); // Add days to start date

            const topicEndDate = new Date(topicStartDate);
            topicEndDate.setDate(topicEndDate.getDate() + (duration * 7) - 1); // Calculate end date

            return { ...topicRec, startDate: topicStartDate, endDate: topicEndDate };
        });

        console.log('Topics with dates:', topicsWithDates);

        // Find the class and update the topics for the specified subject
        const schoolClass = await SchoolClass.findOne({
            className,
            "years.year": year,
            "years.subjects.name": subjectName
        });

        if (!schoolClass) {
            return NextResponse.json({ error: 'Class not found' }, { status: 404 });
        }

        // Find the specific year and subject
        const yearDoc = schoolClass.years.find(y => y.year === year);
        if (!yearDoc) {
            return NextResponse.json({ error: 'Year not found' }, { status: 404 });
        }

        const subjectDoc = yearDoc.subjects.find(s => s.name === subjectName);
        if (!subjectDoc) {
            return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
        }

        // Update the topics
        subjectDoc.topicsTaught = topicsWithDates;

        // Save the document
        await schoolClass.save();

        return NextResponse.json({
            message: 'Topics updated successfully'
        });
    } catch (error) {
        console.error('Error updating topics:', error);
        return NextResponse.json({ error: 'Unable to update topics. Please try again.' }, { status: 500 });
    }
}
