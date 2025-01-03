import { connectDB } from "@/configs/dbConfig";
import { SchoolClass } from "@/models/GradeSyllabus";
import { NextResponse } from "next/server";

// Ensure the database is connected before handling the request
connectDB();

export async function POST(req) {
    try {
        console.log("hi");

        const { classTeacher, year, reg_number, newStatus, date } = await req.json();
        // Validate and parse date
        const parsedDate = new Date(date);
        if (isNaN(parsedDate)) {
            return NextResponse.json({ message: "Invalid date format" }, { status: 400 });
        }

        // Find the class and the specified year
        const schoolClass = await SchoolClass.findOne({
            "classTeachers.name": classTeacher,
            "years.year": year
        });

        if (!schoolClass) {
            return NextResponse.json({ message: "Class not found" }, { status: 404 });
        }

        // Find the year data within the class
        const yearData = schoolClass.years.find(y => y.year === year);
        console.log("yearData", yearData);



        if (!yearData) {
            return NextResponse.json({ message: "Year not found" }, { status: 404 });
        }


        // Find the student within the year's students
        const student = yearData.students.find(s => s.reg_number === reg_number);

        if (!student) {
            return NextResponse.json({ message: "Student not found" }, { status: 404 });
        }

        const className = schoolClass.className
        console.log(className);
        console.log("hi");
        const grades = student.grades.find(grade => grade.grade === className)
        console.log("hi");
        // Find the attendance record for the specific date or create a new one if it doesn't exist
        let attendanceRecord = student.attendance.find(att => att.date.toISOString().slice(0, 10) === parsedDate.toISOString().slice(0, 10));
        console.log(grades);

        if (grades) {
            let gradesAttendanceRecord = grades.attendance.find(att => att.date.toISOString().slice(0, 10) === parsedDate.toISOString().slice(0, 10));
        }
        console.log("hi");
        let myGrades = [];

        if (grades) {
            myGrades.push(grades)
        }

        console.log("graddes", myGrades);
        if (attendanceRecord) {
            attendanceRecord.status = newStatus;
        } else {
            student.attendance.push({ date: parsedDate, status: newStatus });
        }
        if (grades) {
            if (gradesAttendanceRecord) {
                gradesAttendanceRecord.status = newStatus;
            } else {
                grades.attendance.push({ date: parsedDate, status: newStatus });
            }
        }







        // Update the overall attendance record for the year for the specific date
        let yearAttendanceRecord = yearData.attendance.find(att => att.date.toISOString().slice(0, 10) === parsedDate.toISOString().slice(0, 10));

        if (yearAttendanceRecord) {
            yearAttendanceRecord.present = yearData.students.filter(student => student.attendance.some(att => att.date.toISOString().slice(0, 10) === parsedDate.toISOString().slice(0, 10) && att.status === 'Present')).length;
            yearAttendanceRecord.late = yearData.students.filter(student => student.attendance.some(att => att.date.toISOString().slice(0, 10) === parsedDate.toISOString().slice(0, 10) && att.status === 'Late')).length;
            yearAttendanceRecord.excused = yearData.students.filter(student => student.attendance.some(att => att.date.toISOString().slice(0, 10) === parsedDate.toISOString().slice(0, 10) && att.status === 'Excused')).length;
            yearAttendanceRecord.sick = yearData.students.filter(student => student.attendance.some(att => att.date.toISOString().slice(0, 10) === parsedDate.toISOString().slice(0, 10) && att.status === 'Sick')).length;
            yearAttendanceRecord.absent = yearData.students.filter(student => student.attendance.some(att => att.date.toISOString().slice(0, 10) === parsedDate.toISOString().slice(0, 10) && att.status === 'Absent')).length;
        } else {
            yearData.attendance.push({
                date: parsedDate,
                present: yearData.students.filter(student => student.attendance.some(att => att.date.toISOString().slice(0, 10) === parsedDate.toISOString().slice(0, 10) && att.status === 'Present')).length,
                late: yearData.students.filter(student => student.attendance.some(att => att.date.toISOString().slice(0, 10) === parsedDate.toISOString().slice(0, 10) && att.status === 'Late')).length,
                excused: yearData.students.filter(student => student.attendance.some(att => att.date.toISOString().slice(0, 10) === parsedDate.toISOString().slice(0, 10) && att.status === 'Excused')).length,
                sick: yearData.students.filter(student => student.attendance.some(att => att.date.toISOString().slice(0, 10) === parsedDate.toISOString().slice(0, 10) && att.status === 'Sick')).length,
                absent: yearData.students.filter(student => student.attendance.some(att => att.date.toISOString().slice(0, 10) === parsedDate.toISOString().slice(0, 10) && att.status === 'Absent')).length
            });
        }







        // Update student's attendance percentages
        const totalAttendance = student.attendance.length;
        const presentCount = student.attendance.filter(att => att.status === 'Present').length;
        const lateCount = student.attendance.filter(att => att.status === 'Late').length;
        const excusedCount = student.attendance.filter(att => att.status === 'Excused').length;
        const sickCount = student.attendance.filter(att => att.status === 'Sick').length;
        const absentCount = student.attendance.filter(att => att.status === 'Absent').length;

        // Find the grade of the student
        const grade = student.grades.find(g => g.grade === schoolClass.className);
        if (grade) {
            grade.presentPercentage = (presentCount / totalAttendance) * 100;
            grade.latePercentage = (lateCount / totalAttendance) * 100;
            grade.excusedPercentage = (excusedCount / totalAttendance) * 100;
            grade.sickPercentage = (sickCount / totalAttendance) * 100;
            grade.absentPercentage = (absentCount / totalAttendance) * 100;
        }

        // Recalculate attendance statistics for the entire year
        let totalPresent = 0, totalLate = 0, totalExcused = 0, totalSick = 0, totalAbsent = 0;
        let totalDays = 0;

        yearData.students.forEach(student => {
            totalDays += student.attendance.length;
            totalPresent += student.attendance.filter(att => att.status === 'Present').length;
            totalLate += student.attendance.filter(att => att.status === 'Late').length;
            totalExcused += student.attendance.filter(att => att.status === 'Excused').length;
            totalSick += student.attendance.filter(att => att.status === 'Sick').length;
            totalAbsent += student.attendance.filter(att => att.status === 'Absent').length;
        });

        yearData.presentPercentage = (totalPresent / totalDays) * 100;
        yearData.latePercentage = (totalLate / totalDays) * 100;
        yearData.excusedPercentage = (totalExcused / totalDays) * 100;
        yearData.sickPercentage = (totalSick / totalDays) * 100;
        yearData.absentPercentage = (totalAbsent / totalDays) * 100;

        // Save the updated class
        await schoolClass.save();

        return NextResponse.json({ message: "Attendance updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating attendance:", error);
        return NextResponse.json(
            { message: "Error updating attendance", error: error.message },
            { status: 500 }
        );
    }
}
