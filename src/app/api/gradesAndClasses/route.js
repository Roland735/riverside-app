import { connectDB } from "@/configs/dbConfig";
import { SchoolClass } from "@/models/GradeSyllabus";
import { NextResponse } from "next/server";

// Ensure the database is connected before handling the request
connectDB();

export async function GET(req) {
    try {
        console.log("Fetching grades information");

        // Fetch the grades information from the database
        const schoolClasses = await SchoolClass.find({});

        // Initialize a result object to structure the data as needed
        const result = {};

        // Process the fetched data
        schoolClasses.forEach(schoolClass => {
            schoolClass.years.forEach(year => {
                const gradeNumber = parseInt(schoolClass.className.match(/\d+/)[0], 10); // Extract grade number from className

                if (!result[gradeNumber]) {
                    result[gradeNumber] = {
                        grades: [],
                        classes: []
                    };
                }

                const studentsCount = year.students.length;
                let subCount = 0;
                let total = 0;




                year.subjects.forEach(subject => {
                    if (subject.assignmentAverageMark > 0) {
                        subCount += 1;
                        total += subject.assignmentAverageMark;
                    }
                    if (subject.quizAverageMark > 0) {
                        subCount += 1;
                        total += subject.quizAverageMark;
                    }
                    if (subject.testaverageMark > 0) {
                        subCount += 1;
                        total += subject.testaverageMark;
                    }
                });

                let avg = subCount > 0 ? total / subCount : 0;



                const gradeItem = {
                    gradeName: `Form ${gradeNumber}`, // Construct gradeName based on extracted gradeNumber
                    className: schoolClass.className,
                    grade: schoolClass.grade, // Assuming grade information needs to be added
                    numStudents: studentsCount,
                    avgMark: avg // Assuming there is an averageMark field
                };

                result[gradeNumber].grades.push(gradeItem);

                const classesData = year.subjects.map(subject => {
                    // Only include subjects where marks are above 0
                    const assignmentMark = subject.assignmentAverageMark > 0 ? subject.assignmentAverageMark : 0;
                    const testMark = subject.testaverageMark > 0 ? subject.testaverageMark : 0;
                    console.log(subject.currentTeachers);


                    if (assignmentMark <= 0 && testMark > 0) {

                        return {
                            class: subject.name,
                            className: schoolClass.className,
                            mark: testMark,
                            cambridgeGrade: subject.cambridgeGrade || 'N/A', // Assuming cambridgeGrade field
                            markChange: subject.markChange || '0',
                            attendance: subject.attendance || '0%',
                            teachers: subject.currentTeachers || []
                        };
                    } else if (assignmentMark > 0 && testMark <= 0) {
                        return {
                            class: subject.name,
                            className: schoolClass.className,
                            mark: assignmentMark,
                            cambridgeGrade: subject.cambridgeGrade || 'N/A', // Assuming cambridgeGrade field
                            markChange: subject.markChange || '0',
                            attendance: subject.attendance || 'N/A',
                            teachers: subject.currentTeachers || []
                        };
                    } else if (assignmentMark > 0 && testMark > 0) {

                        return {
                            class: subject.name,
                            className: schoolClass.className,
                            mark: (assignmentMark + testMark) / 2,
                            cambridgeGrade: subject.cambridgeGrade || 'N/A', // Assuming cambridgeGrade field
                            markChange: subject.markChange || '0',
                            attendance: subject.attendance || 'N/A',
                            teachers: subject.currentTeachers || []
                        };
                    } else {
                        return {
                            class: subject.name,
                            className: schoolClass.className,
                            mark: 0,
                            cambridgeGrade: subject.cambridgeGrade || 'N/A', // Assuming cambridgeGrade field
                            markChange: subject.markChange || '0',
                            attendance: subject.attendance || 'N/A',
                            teachers: subject.currentTeachers || []
                        };
                    }

                    return null;
                }).filter(subject => subject !== null); // Filter out null entries

                result[gradeNumber].classes.push({
                    gradeName: `Form ${gradeNumber}`, // Ensure consistency in gradeName
                    classes: classesData
                });
            });
        });

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Error fetching grades data:", error);
        return NextResponse.json(
            { message: "Error fetching grades data", error: error.message },
            { status: 500 }
        );
    }
}
