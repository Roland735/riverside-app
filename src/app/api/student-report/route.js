import { connectDB } from '@/configs/dbConfig';
import Exam from '@/models/examModel';
import { userModel } from '@/models/userModel';
import { NextResponse } from 'next/server';

connectDB();

export async function POST(req) {
    const { regNumber, period, year } = await req.json();

    console.log("Received POST request with data:", { regNumber, period, year });

    try {
        // Find the exam class by year, className, and exam period
        const examClass = await Exam.findOne({
            'years.year': year, // Match the year
            'years.subjects.exams.period': period, // Match the exam period
        }).lean();

        console.log("Exam class found:", examClass);

        if (!examClass) {
            console.log("Exam class not found");
            return NextResponse.json({ error: 'Student or exam period not found' }, { status: 404, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST' } });
        }

        let student = null;
        let examData = null;

        // Use forEach to loop through the years and students
        examClass.years.forEach((y) => {
            console.log("Checking year:", y.year, year);
            if (y.year === year) {
                y.students.forEach((s) => {
                    console.log("Checking student with regNumber:", s[0].studentId.regNumber);
                    if (s[0].studentId.regNumber === regNumber) {
                        student = s;
                        console.log("Student found:", student);
                        // Find the exam data for the given period
                        s[0].exams.forEach((e) => {
                            console.log("Checking exam period:", e.period);
                            if (e.period === period) {
                                examData = e;
                                console.log("Exam data found for period:", examData);
                            }
                        });
                    }
                });
            }
        });

        if (!student) {
            console.log("Student not found");
            return NextResponse.json({ error: 'Student not found' }, { status: 404, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST' } });
        }

        if (!examData) {
            console.log("Exam data not found for the period");
            return NextResponse.json({ error: 'Exam data not found for the period' }, { status: 404, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST' } });
        }

        // Use forEach to map subject data
        const subjects = [];
        examData.subjects.forEach((subject) => {
            console.log("Processing subject:", subject.name);
            const testPaper = subject.exams[0]?.papers?.find(p => p.paperNumber === 'Test');
            const assignmentPaper = subject.exams[0]?.papers?.find(p => p.paperNumber === 'Assignment');
            console.log("subg", subject.exams);

            subject.exams.forEach((exam) => {
                console.log("Processing exam:", exam);
                if (exam.period === period) {
                    console.log("Exam found for period:", exam.behaviorGrade);
                    console.log("Test paper:", subject);
                    // Add the test and assignment marks to the subject

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
            })

            console.log("Subject processed:", subjects[subjects.length - 1]);
        });
        console.log(student);

        console.log(examData.classTeachersComments);

        const userImageUrl = await userModel.findOne({ regNumber: regNumber }).lean();
        console.log(userImageUrl.profilePicture);

        // Construct the response object
        const responseData = {
            name: student[0].studentId.name,
            regNumber: student[0].studentId.regNumber,
            imageUrl: userImageUrl.profilePicture, // Add image URL if available
            attendancePercentage: Math.round((examData.AttendanceMark / examData.AttendanceTotal) * 100), // Assuming class-level attendance is used
            examPeriod: `${period}, ${year}`, // Format the period and year
            classTeacherComment: examData.classTeachersComments || '',
            headMasterComment: examData.adminComments || '',
            subjects,
            schoolName: 'Riverside School', // You can store the school name in the DB or make it dynamic
            schoolLogoUrl: '/assets/logo.png', // Add logo URL if available
        };

        console.log("Response data constructed:", responseData);

        // Return the formatted response with CORS headers
        return NextResponse.json(responseData, { status: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST' } });
    } catch (error) {
        console.log("Error occurred:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST' } });
    }
}
