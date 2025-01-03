// /pages/api/getResources.js
import { connectDB } from "@/configs/dbConfig";
import { SchoolClass } from "@/models/GradeSyllabus";
import { NextResponse } from "next/server";

connectDB();

export async function POST(req) {
    try {
        const { teacherName } = await req.json();

        const schoolClasses = await SchoolClass.find({
            "years.subjects.currentTeachers.name": teacherName
        }).select("className years.subjects.name years.subjects.resources years.subjects.topicsTaught");

        const resources = schoolClasses.reduce((acc, schoolClass) => {
            schoolClass.years.forEach(year => {
                year.subjects.forEach(subject => {
                    const subjectKey = `${subject.name} - ${schoolClass.className}`;
                    if (!acc[subjectKey]) {
                        acc[subjectKey] = { subjectResources: [], topics: {} };
                    }
                    if (Array.isArray(subject.resources)) {
                        acc[subjectKey].subjectResources.push(...subject.resources);
                    }
                    subject.topicsTaught.forEach(topic => {
                        if (!acc[subjectKey].topics[topic.title]) {
                            acc[subjectKey].topics[topic.title] = [];
                        }
                        if (Array.isArray(topic.resources)) {
                            acc[subjectKey].topics[topic.title].push(...topic.resources);
                        }
                    });
                });
            });
            return acc;
        }, {});

        return NextResponse.json({ resources });
    } catch (error) {
        console.error("Error fetching resources:", error);
        return NextResponse.json({ message: "Error fetching resources", error: error.message }, { status: 500 });
    }
}
