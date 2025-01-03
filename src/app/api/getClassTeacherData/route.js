import { NextResponse } from 'next/server';
import { connectDB } from "@/configs/dbConfig";
import Exam from '@/models/examModel';
import { userModel } from '@/models/userModel';
import { SchoolClass } from "@/models/GradeSyllabus";
import { Subject } from '@/models/subjects';
import Attendance from '@/app/components/teacher/Attendance/AttendanceHome';

connectDB();


export async function POST(req) {
    try {
        console.log("Fetching exam classes...");

        const { myYear, myPeriod } = await req.json();
        const backYear = parseInt(myYear);
        console.log("myYear:", myYear);


        // Fetch all the exam classes from the database
        const examClasses = await Exam.find({});

        console.log("Exam classes fetched");

        // Initialize the response data
        const classes = [];

        for (const examClass of examClasses) {
            console.log("Processing class:", examClass.className);
            const classData = {
                className: examClass.className,
                students: [],
                attendanceTotal: 0,

            };

            // Process each year
            if (examClass.years.length > 0) {
                for (const year of examClass.years) {
                    console.log("Processing year:", year.year);

                    // Process each subject
                    if (year.subjects.length > 0) {
                        if (year.year === backYear) {
                            console.log("Processing 2025 year...");
                            classData.attendanceTotal += year.termDays.find(termDay => termDay.examPeriod === myPeriod).termDaysTotal;
                            console.log("Attendance total:", classData.attendanceTotal);



                            for (const subject of year.subjects) {
                                console.log("Processing subject:", subject.name);

                                // Process each student
                                if (year.students.length > 0) {
                                    console.log("Processing students...");

                                    // Map students to promises
                                    const studentPromises = year.students.flat().map(async (student) => {
                                        try {
                                            // Process each subject exam
                                            for (const subjectExam of subject.exams) {
                                                console.log("Processing student:", student.studentId.regNumber);

                                                const studentExam = student.exams.find(e => e.period === myPeriod);
                                                if (studentExam) {
                                                    const subjectExamData = studentExam.subjects.find(s => s.name === subject.name);
                                                    console.log("Student exam data found :", subjectExamData);
                                                    if (subjectExamData && subjectExamData.exams[0].period === myPeriod) {
                                                        console.log("Student exam data found for subject:");

                                                        // Check if the student is already in the classData
                                                        let studentData = classData.students.find(s => s.regNumber === student.studentId.regNumber);

                                                        if (!studentData) {
                                                            // If student doesn't exist, create a new entry


                                                            // Example usage:


                                                            studentData = {
                                                                name: student.studentId.name,
                                                                regNumber: student.studentId.regNumber,
                                                                image: (await userModel.findOne({ regNumber: student.studentId.regNumber }).exec())?.profilePicture || '',
                                                                subjects: [],
                                                                assignmentMark: 0,
                                                                AttendanceMark: 0,
                                                                testMark: 0,
                                                                finalMark: 0,
                                                                comment: studentExam.classTeachersComments || ''
                                                            };
                                                            classData.students.push(studentData);
                                                        }

                                                        console.log("papers jfj", subjectExamData.exams[0].papers[0].paperNumber, subjectExam);


                                                        // Add subject marks
                                                        const subjectMarks = subjectExamData.exams.map(exam => ({
                                                            name: subject.name,
                                                            mark: exam.papers.find(paper => paper.paperNumber === subjectExam.papers[0].paperNumber)?.percentage || 0
                                                        }));

                                                        // Merge subject marks with existing subjects for the student
                                                        studentData.subjects = [...studentData.subjects, ...subjectMarks];

                                                        // Fetch the test and assignment marks
                                                        const schoolClass = await SchoolClass.findOne({ className: examClass.className, 'years.year': backYear }).exec();
                                                        if (schoolClass) {
                                                            const year2025 = schoolClass.years.find(y => y.year === backYear);
                                                            if (year2025) {
                                                                const subjectFromClass = year2025.students.find(s => s.reg_number === studentData.regNumber)?.grades.find(g => g.grade === examClass.className)?.subjects.find(s => s.name === subject.name);
                                                                if (subjectFromClass) {
                                                                    studentData.testMark = subjectFromClass.testAverage || 0;
                                                                    studentData.assignmentMark = subjectFromClass.assignmentAverage || 0;
                                                                }
                                                            }
                                                        }

                                                        // Calculate final mark
                                                        studentData.finalMark = (
                                                            studentData.subjects
                                                                .filter(sub => sub.mark > 0) // Filter out subjects with marks less than or equal to 0
                                                                .reduce((sum, sub) => sum + sub.mark, 0) // Sum the valid marks
                                                        ) / studentData.subjects.filter(sub => sub.mark > 0).length; // Calculate average based on the count of valid subjects

                                                        // If there are no valid marks, you can set finalMark to "N/A" or another placeholder
                                                        if (studentData.subjects.filter(sub => sub.mark > 0).length === 0) {
                                                            studentData.finalMark = 0; // or use 0 or any placeholder you'd like
                                                        }

                                                    }
                                                }
                                            }
                                        } catch (error) {
                                            console.error("Error processing student:", error);
                                        }
                                    });

                                    // Wait for all student promises to resolve
                                    await Promise.all(studentPromises);
                                }
                            }
                        }
                    }
                }
            }

            if (classData.students.length > 0) {
                classes.push(classData);
                console.log("After pushing, Class data:", classData.students);
            }
        }
        console.log("Classes after processing:", classes);

        console.log("Data processed successfully");

        // Return the success response
        return NextResponse.json(classes, { status: 200 });
    } catch (error) {
        console.error("Error fetching exam data:", error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
