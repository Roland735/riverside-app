import { connectDB } from "@/configs/dbConfig";
import { SchoolClass } from "@/models/GradeSyllabus";
import { userModel } from "@/models/userModel";
import { NextResponse } from "next/server";

connectDB();

export const POST = async (request) => {
    try {
        // Extract data from the request body
        const { className, year, studentIds } = await request.json();
        const parsedYear = parseInt(year); // Convert year to an integer
        console.log(className, parsedYear, studentIds);



        // Find the class based on className
        const schoolClass = await SchoolClass.findOne({ className });

        if (!schoolClass) {
            return NextResponse.json(
                { message: "Class not found" },
                { status: 404 }
            );
        }

        // Find the students based on studentIds
        const students = await userModel.find({ regNumber: { $in: studentIds } });
        console.log(students);

        // Update the class with the assigned students
        schoolClass.years.forEach((classYear) => {
            console.log(parsedYear);
            console.log(classYear.year);

            if (classYear.year === parsedYear) {
                console.log("hi");

                students.forEach((student) => {
                    const existingStudent = classYear.students.find((s) => s.reg_number === student.regNumber);
                    console.log(student);

                    let studentGrade = {
                        grade: className,
                        subjects: []
                    };

                    for (const subject of classYear.subjects) {

                        console.log("subs", subject);

                        studentGrade.subjects.push({
                            name: subject.name,
                            tests: []
                        });

                    }

                    if (!existingStudent) {
                        classYear.students.push({
                            reg_number: student.regNumber,
                            name: `${student.firstname} ${student.lastname}`,
                            grades: [studentGrade] // Assuming grades will be populated later
                        });


                    }
                });

            } else {
                console.log("yo");

            }


        });


        // Save the updated class
        await schoolClass.save();

        return NextResponse.json(
            { message: "Students assigned successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "An error occurred while assigning students" },
            { status: 500 }
        );
    }
};
