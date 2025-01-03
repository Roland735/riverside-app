import { connectDB } from "@/configs/dbConfig";
import { SchoolClass } from "@/models/GradeSyllabus";
import { NextResponse } from "next/server";

connectDB();

export async function GET(req) {
    try {
        const { grade, year, subjectName } = req.query;
        const assignments = await SchoolClass.findOne({ 'years.year': year, className: grade }, { 'years.subjects.name': subjectName }).populate('years.subjects.assignments');
        const assignmentData = assignments.years[0].subjects[0].assignments.map(assignment => ({
            highestStudent: {
                name: assignment.highestStudent.name,
                score: assignment.highestStudent.score,
                change: assignment.highestStudent.change,
                grade: assignment.highestStudent.grade
            },
            lowestStudent: {
                name: assignment.lowestStudent.name,
                score: assignment.lowestStudent.score,
                change: assignment.lowestStudent.change,
                grade: assignment.lowestStudent.grade
            }
        }));
        console.log(assignmentData);

        return NextResponse.json({ message: 'Assignment data retrieved successfully', assignmentData });
    } catch (error) {
        console.error('Error retrieving assignment data:', error);
        return NextResponse.json({ message: 'An error occurred while retrieving assignment data' });
    }
}
