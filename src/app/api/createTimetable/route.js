import { connectDB } from "@/configs/dbConfig";
import Exam from "@/models/examModel";
import examTimeTable from "@/models/examTimeTable";
import { NextResponse } from 'next/server';

// Define regulated school times and dates
const SCHOOL_REGULATED_TIMES = {
    dailyStart: 8 * 60, // Start time in minutes (8:00 AM)
    dailyEnd: 16 * 60,  // End time in minutes (4:00 PM)
};

export async function POST(request) {
    try {
        await connectDB(); // Ensure you are connected to the DB

        const { period } = await request.json(); // Extract the period from the request body

        // Fetch the relevant exam data with startDate
        const classes = await Exam.find({ 'years.subjects.exams.period': period }).populate('years.subjects.exams.papers');

        let timetable = [];
        let currentDayStart = null; // Initialize with null
        let currentTimeInMinutes = SCHOOL_REGULATED_TIMES.dailyStart;

        classes.forEach(classItem => {
            classItem.years.forEach(year => {
                year.subjects.forEach(subject => {
                    subject.exams.forEach((exam, examIndex) => {
                        exam.papers.forEach((paper, paperIndex) => {
                            if (paper.confirmed && paper.duration) {
                                const paperDurationInMinutes = (paper.duration.hours || 0) * 60 + (paper.duration.minutes || 0);
                                const startDate = new Date(exam.startDate); // Use exam startDate

                                // If currentDayStart is not initialized, set it to exam startDate
                                if (!currentDayStart) {
                                    currentDayStart = startDate;
                                }

                                // Adjust the startDate if it is not the current day
                                if (currentDayStart < startDate) {
                                    currentDayStart = startDate;
                                    currentTimeInMinutes = SCHOOL_REGULATED_TIMES.dailyStart;
                                }

                                const endTimeInMinutes = currentTimeInMinutes + paperDurationInMinutes;

                                // Check if the exam fits within the daily regulated time
                                if (endTimeInMinutes > SCHOOL_REGULATED_TIMES.dailyEnd) {
                                    // Move to the next day
                                    currentDayStart.setDate(currentDayStart.getDate() + 1);
                                    currentTimeInMinutes = SCHOOL_REGULATED_TIMES.dailyStart;
                                }

                                const startTime = new Date(currentDayStart);
                                startTime.setHours(0, currentTimeInMinutes); // setMinutes will add minutes to hours, so we need to reset hours first
                                const endTime = new Date(startTime);
                                endTime.setMinutes(startTime.getMinutes() + paperDurationInMinutes);
                                console.log(classItem.className);


                                // Update the timetable
                                timetable.push({
                                    className: classItem.className,
                                    subjectName: subject.name,
                                    examIndex,
                                    paperNumber: paper.paperNumber,
                                    startTime,
                                    endTime,
                                });

                                // Update the current time for the next paper
                                currentTimeInMinutes += paperDurationInMinutes;
                            }
                        });
                    });
                });
            });
        });

        // Save timetable to the database
        const newTimetable = new examTimeTable({
            period,
            year: new Date().getFullYear().toString(), // Adjust as needed
            timetable
        });

        await newTimetable.save();

        return NextResponse.json({ timetable }, { status: 200 });
    } catch (error) {
        console.error("Error creating timetable:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
