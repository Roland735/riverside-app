import mongoose from "mongoose";
import { connectDB } from "@/configs/dbConfig";
import { SchoolClass } from "@/models/GradeSyllabus";
import { NextResponse } from "next/server";

connectDB();

export async function POST(req) {
    try {
        const { teacherName } = await req.json();
        const schoolClasses = await SchoolClass.find({
            "years.subjects.currentTeachers.name": teacherName
        }).select("className years.subjects.name years.subjects.topicsTaught.title");

        const subjects = schoolClasses.reduce((acc, schoolClass) => {
            schoolClass.years.forEach(year => {
                year.subjects.forEach(subject => {
                    const existingSubject = acc.find(sub => sub.name === subject.name);
                    if (existingSubject) {
                        existingSubject.topicsTaught.push(...subject.topicsTaught);
                    } else {
                        acc.push({
                            className: schoolClass.className, // Add className
                            name: subject.name,
                            topicsTaught: subject.topicsTaught
                        });
                    }
                });
            });
            return acc;
        }, []);

        return NextResponse.json({ subjects });
    } catch (error) {
        console.error("Error fetching subjects:", error);
        return NextResponse.json({ message: "Error fetching subjects", error: error.message }, { status: 500 });
    }
}
