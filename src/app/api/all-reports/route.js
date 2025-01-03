import { connectDB } from '@/configs/dbConfig';
import Exam from '@/models/examModel';
import { userModel } from '@/models/userModel';
import { NextResponse } from 'next/server';

connectDB();

export async function POST(req) {
    const { period, year } = await req.json();

    console.log("Received POST request with data:", { period, year });

    try {
        // Find all classes for the given year and period
        const examClasses = await Exam.find({
            'years.year': year,
            'years.subjects.exams.period': period,
        }).lean();

        console.log("Exam classes found:", examClasses);

        if (!examClasses.length) {
            console.log("No exam classes found");
            return NextResponse.json({ error: 'Exam period not found' }, { status: 404, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST' } });
        }

        const studentsData = [];

        // Iterate through all classes
        for (const examClass of examClasses) {
            // Iterate through the years and students for each class
            for (const y of examClass.years) {
                if (y.year === year) {
                    for (const s of y.students) {
                        const student = s[0];
                        let examData = null;

                        // Find the exam data for the given period
                        for (const e of student.exams) {
                            if (e.period === period) {
                                examData = e;
                                break;
                            }
                        }

                        if (examData) {
                            // Fetch user image URL if available
                            const userImageUrl = await userModel.findOne({ regNumber: student.studentId.regNumber }).lean();
                            const subjects = [];

                            // Map subject data
                            for (const subject of examData.subjects) {
                                for (const exam of subject.exams) {
                                    if (exam.period === period) {
                                        subjects.push({
                                            name: subject.name,
                                            testMark: 0,
                                            assignmentMark: 0,
                                            behaviorGrade: exam.behaviorGrade,
                                            classAverage: Math.round(exam.classAverage),
                                            finalMark: Math.round(exam.percentage),
                                            subjectTeacherComment: exam.TeacherComments || '',
                                        });
                                    }
                                }
                            }

                            // Add student data to the studentsData array
                            studentsData.push({
                                name: student.studentId.name,
                                className: examClass.className,
                                regNumber: student.studentId.regNumber,
                                imageUrl: userImageUrl?.profilePicture || null,
                                attendancePercentage: Math.round((examData.AttendanceMark / examData.AttendanceTotal) * 100),
                                examPeriod: `${period}, ${year}`,
                                classTeacherComment: examData.classTeachersComments || '',
                                headMasterComment: examData.adminComments || '',
                                subjects,
                                schoolName: 'Riverside School', // You can store the school name in the DB or make it dynamic
                                schoolLogoUrl: '/assets/logo.png', // Add logo URL if available
                            });
                        }
                    }
                }
            }
        }

        console.log("All students' data constructed:", studentsData);

        // Return the formatted response with CORS headers
        return NextResponse.json(studentsData, { status: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST' } });
    } catch (error) {
        console.log("Error occurred:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST' } });
    }
}
