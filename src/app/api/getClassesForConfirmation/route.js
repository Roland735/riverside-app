import { connectDB } from "@/configs/dbConfig";
import Exam from "@/models/examModel";
import { Teacher } from "@/models/Teacher"; // Import the Teacher model
import { NextResponse } from "next/server";
import { userModel } from "@/models/userModel";

function getCurrentPeriod() {
    const now = new Date();
    const month = now.getMonth() + 1; // getMonth() is zero-based
    const date = now.getDate();

    if (month < 4) {
        return date < 15 ? "Mid-First term" : "End-First term";
    } else if (month < 8) {
        return date < 15 ? "Mid-Second term" : "End-Second term";
    } else {
        return date < 15 ? "Mid-Third term" : "End-Third term";
    }
}

export async function POST(req) {
    try {


        await connectDB();

        const body = await req.json();
        const { period, year } = body;

        console.log(period, year);

        const latestPeriod = period;


        // Fetch classes
        const myClasses = await Exam.find({ "years.subjects.exams.period": latestPeriod, "years.year": year, })
            .select("className years.subjects.name years.subjects.exams")
            .lean();


        console.log(myClasses);

        const classes = myClasses.map(classItem => ({
            ...classItem,
            years: classItem.years.map(year => ({
                ...year,
                subjects: year.subjects.map(subject => ({
                    ...subject,
                    exams: subject.exams.filter(exam => exam.period === period)
                }))
            }))
        }));

        console.log(classes);


        const myMarkers = await userModel.find({ active: true, role: "teacher" })
            .select("firstname lastname regNumber")
            .lean();


        let markers = [];
        myMarkers.forEach((marker) => {
            markers.push({
                name: `${marker.firstname} ${marker.lastname}`,
                regNumber: marker.regNumber,
            })
        })

        // Fetch invigilators (active teachers)
        const invigilators = markers;


        return NextResponse.json({ classes, invigilators, markers });
    } catch (error) {
        return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
    }
}
