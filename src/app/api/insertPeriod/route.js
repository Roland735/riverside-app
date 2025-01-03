import { connectDB } from "@/configs/dbConfig";
import Exam from "@/models/examModel";
import { SchoolClass } from "@/models/GradeSyllabus";
import StudentReport from "@/models/StudentReport";
import { userModel } from "@/models/userModel";
import { NextResponse } from "next/server";

connectDB();
export const POST = async (req) => {
    try {
        const { period, startDate, endDate, schoolDays } = await req.json();
        console.log("Received data:", { period, startDate, endDate, schoolDays });

        // Fetch all classes with the year 2025 in the SchoolClass schema
        const schoolClasses = await SchoolClass.find({ "years.year": 2025 });
        console.log("Found classes for 2025:", schoolClasses.length);

        for (const schoolClass of schoolClasses) {
            const { className, classTeachers, years } = schoolClass;
            const existingExamClasses = await Exam.find({ className: className });
            console.log(`Processing class: ${className}`);

            if (existingExamClasses.length === 0) {
                console.log("No existing exam classes, creating new one...");
                await Exam.create({
                    className,
                    classTeachers,
                    years: [{
                        year: 2025,
                        subjects: years.find(year => year.year === 2025).subjects,
                        students: [],
                        attendance: [],
                        termDays: [{
                            examPeriod: period,
                            termDaysTotal: schoolDays,
                        }],
                        presentPercentage: 0,
                        latePercentage: 0,
                        excusedPercentage: 0,
                        sickPercentage: 0,
                        absentPercentage: 0,
                    }]
                });
            } else {
                const existingExamClass = existingExamClasses[0];
                const existingYear = existingExamClass.years.find(year => year.year === 2025);

                if (!existingYear) {
                    console.log(`Year 2025 not found in ${className}, adding year...`);
                    existingExamClass.years.push({
                        year: 2025,
                        subjects: years.find(year => year.year === 2025).subjects,
                        students: [],
                        attendance: [],
                        presentPercentage: 0,
                        termDays: [{
                            examPeriod: period,
                            termDaysTotal: schoolDays,
                        }],
                        latePercentage: 0,
                        excusedPercentage: 0,
                        sickPercentage: 0,
                        absentPercentage: 0,
                    });
                    await existingExamClass.save();
                } else {
                    console.log(`Year 2025 found in ${className}, updating year...`);
                    existingYear.termDays.push({
                        examPeriod: period,
                        termDaysTotal: schoolDays,
                    });
                    await existingExamClass.save();
                }
            }

            console.log(`Adding exam period to ${className}`);
            await Exam.updateOne(
                { className, "years.year": 2025 },
                {
                    $push: {
                        "years.$.subjects.$[].exams": {
                            period,
                            startDate,
                            endDate
                        }
                    }
                }
            );


        }
        // Fetch all active students from the user model for the class
        const activeStudents = await userModel.find({ role: 'student', active: true });
        console.log(`Found ${activeStudents.length} active students for class `);

        for (const student of activeStudents) {
            let studentReport = await StudentReport.findOne({ studentId: student._id });
            console.log(`Processing student report for ${student._id}`);

            if (!studentReport) {
                console.log("Creating new student report...");
                studentReport = await StudentReport.create({
                    studentId: student._id,
                    years: [{
                        year: 2025,
                        examPeriods: [{
                            examPeriod: period,
                            receiveReport: false,
                        }]
                    }]
                });
            } else {
                const existingYear = studentReport.years.find(y => y.year === 2025);

                if (!existingYear) {
                    console.log("Adding year to existing student report...");
                    studentReport.years.push({
                        year: 2025,
                        examPeriods: [{
                            examPeriod: period,
                            receiveReport: false,
                        }]
                    });
                } else {
                    console.log("Adding exam period to existing year...");
                    existingYear.examPeriods.push({
                        examPeriod: period,
                        receiveReport: false,
                    });
                }

                await studentReport.save();
            }
        }

        return NextResponse.json({ message: "Exam periods and student reports added successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error processing exam periods:", error);
        return NextResponse.json(
            { message: "Error processing exam periods", error: error.message },
            { status: 500 }
        );
    }
};
