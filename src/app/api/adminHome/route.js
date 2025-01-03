import { connectDB } from "@/configs/dbConfig";
import { SchoolClass } from "@/models/GradeSyllabus";
import { userModel } from "@/models/userModel";
import { NextResponse } from "next/server";

connectDB();

export async function GET(req) {
    try {
        console.log("Fetching grades information");

        // Fetch the grades information from the database
        const schoolClasses = await SchoolClass.find({ "years.year": 2025 });
        console.log(schoolClasses);

        // Fetch all active users
        const users = await userModel.find({ active: true });
        const totalTeachers = users.filter(user => user.role === 'teacher').length;
        const totalStudents = users.filter(user => user.role === 'student').length;

        let totalTestAverage = 0;
        let totalAssignmentAverage = 0;
        let totalQuizAverage = 0;
        let countTestAverage = 0;
        let countAssignmentAverage = 0;
        let countQuizAverage = 0;

        const grades = schoolClasses.map(schoolClass => {
            const year2025 = schoolClass.years.find(year => year.year === 2025);
            if (!year2025) return null;

            const subjectsData = year2025.subjects.flatMap(subject => {
                const performanceData = subject.topicsTaught.map(topic => ({
                    name: topic.title,
                    score: (topic.assignmentAverage + topic.testAverage) / 2 // Example: Average score from assignment and test
                }));

                if (subject.testaverageMark > 0) {
                    totalTestAverage += subject.testaverageMark;
                    countTestAverage++;
                }
                if (subject.assignmentAverageMark > 0) {
                    totalAssignmentAverage += subject.assignmentAverageMark;
                    countAssignmentAverage++;
                }
                if (subject.quizAverageMark > 0) {
                    totalQuizAverage += subject.quizAverageMark;
                    countQuizAverage++;
                }

                return {
                    name: subject.name,
                    students: year2025.students.length,
                    quizAvg: subject.quizAverageMark || 0,
                    assignmentAvg: subject.assignmentAverageMark || 0,
                    testAvg: subject.testaverageMark || 0,
                    performanceData: performanceData
                };
            });

            const computeAttendanceAverages = (attendanceRecords, period) => {
                const periodNames = period === 'week' ? ["Mon", "Tue", "Wed", "Thu", "Fri"]
                    : period === 'month' ? ["Week 1", "Week 2", "Week 3", "Week 4"]
                        : period === 'semester' ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
                            : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

                const periodAttendance = periodNames.map(name => {
                    const periodRecords = attendanceRecords.filter(record => {
                        const date = new Date(record.date);
                        if (period === 'week') return date.getDay() === periodNames.indexOf(name);
                        if (period === 'month') return Math.ceil(date.getDate() / 7) === periodNames.indexOf(name) + 1;
                        if (period === 'semester') return date.getMonth() === periodNames.indexOf(name);
                        if (period === 'year') return date.getMonth() === periodNames.indexOf(name);
                    });

                    const totalAttendance = periodRecords.reduce((sum, record) => sum + record.present, 0);
                    const averageAttendance = periodRecords.length ? totalAttendance / periodRecords.length : 0;

                    return { name, attendance: averageAttendance };
                });

                return periodAttendance;
            };

            // Compute attendance data
            const attendanceData = {
                week: computeAttendanceAverages(year2025.attendance, 'week'),
                month: computeAttendanceAverages(year2025.attendance, 'month'),
                semester: computeAttendanceAverages(year2025.attendance, 'semester'),
                year: computeAttendanceAverages(year2025.attendance, 'year')
            };

            return { subjectsData, attendanceData };
        }).flat().filter(data => data !== null);

        const adminAverageMark = countTestAverage > 0 ? (totalTestAverage + totalAssignmentAverage + totalQuizAverage) / (countTestAverage + countAssignmentAverage + countQuizAverage) : 0;

        return NextResponse.json({ grades, totalStudents, totalTeachers, adminAverageMark }, { status: 200 });
    } catch (error) {
        console.error("Error fetching grades data:", error);
        return NextResponse.json(
            { message: "Error fetching grades data", error: error.message },
            { status: 500 }
        );
    }
}
