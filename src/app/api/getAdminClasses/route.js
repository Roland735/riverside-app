// src/pages/api/students.js

import { connectDB } from "@/configs/dbConfig";
import { SchoolClass } from "@/models/GradeSyllabus"; // Assuming GradeSyllabus is your file name
import { userModel } from "@/models/userModel"; // Assuming userModel is defined in userModel.js
import { list } from "firebase/storage";
import { NextResponse } from "next/server";

// Connect to the database
connectDB();



export const POST = async (req) => {
    try {
        console.log("hi");
        const { className } = await req.json();
        // Fetch data from the database
        const classes = await SchoolClass.find({ "className": className }).populate('years.students');
        const users = await userModel.find();

        // Transform the data into the desired format
        const formattedData = classes.map(schoolClass => ({
            className: schoolClass.className,
            subjects: schoolClass.years.flatMap(year => year.subjects.map(subject => ({
                subject: subject.name,
                mark: (subject.assignmentAverageMark + subject.testaverageMark) / 2,
                assignment: subject.assignmentAverageMark,
                test: subject.testaverageMark,
                quiz: subject.quizAverageMark
            }))),

            markChange: '+2', // You may calculate or fetch this value accordingly
            attendance: '85%', // You may calculate or fetch this value accordingly
            teachers: schoolClass.classTeachers.map(teacher => teacher.name)
        }));

        const students = classes.map(schoolClass => schoolClass.years.map(year => {
            console.log("hi")
            let studentName = "";
            let regNumber = "";
            let assignment = 0;
            let test = 0;
            let quiz = 0;
            let attendance = 0;
            let change = 0;
            let listOfStudents = [];
            if (year.year === 2025) {
                console.log("hi")
                year.students.map(student => {
                    console.log(student)
                    studentName = student.name;
                    regNumber = student.reg_number;
                    student.grades.map(grade => {
                        console.log(grade)
                        if (grade.grade === className) {
                            console.log(grade)

                            // calculate average assignment mark


                            for (let i = 0; i < grade.subjects.length; i++) {
                                assignment += grade.subjects[i].assignmentAverage;
                                test += grade.subjects[i].testAverage;
                                quiz += grade.subjects[i].quizzesAverage;

                            }
                            assignment = assignment / grade.subjects.length;
                            test = test / grade.subjects.length;
                            quiz = quiz / grade.subjects.length;
                            console.log(assignment)

                            listOfStudents.push({
                                name: studentName,
                                regNumber: regNumber,
                                assignment: Math.round(assignment),
                                change: 0,
                                test: Math.round(test),
                                quiz: Math.round(quiz),
                                imageUrl: ""
                            })
                            assignment = 0;
                            test = 0;
                            quiz = 0;
                            console.log(listOfStudents);


                        }
                        console.log(listOfStudents);
                    })
                    console.log(listOfStudents);


                })
                console.log(listOfStudents);



            } else {
                return [];
            }
            return listOfStudents;

        }));
        console.log(students[0][0]);

        const myStudents = students[0][0];
        console.log(myStudents);

        myStudents.map(student => {
            console.log(student)
            const user = users.find(u => u.regNumber === student.regNumber);
            console.log(user)
            student.imageUrl = user.profilePicture;
        })
        console.log(myStudents);



        let category = [];


        // best and worst students
        const bestStudents = myStudents.reduce((acc, student) => {
            console.log(student);


            if (student.test > acc.test) {
                acc.test = student.test;
                acc.student = student;
            }
            return acc;
        }, { test: 0, student: {}, title: 'Best Student', type: 'test' });

        category.push(bestStudents);



        const worstStudents = myStudents.reduce((acc, student) => {
            if (student.test < acc.test) {
                acc.test = student.test;
                acc.student = student;
            }
            return acc;
        }, { test: Infinity, student: {}, title: 'Worst Student', type: 'test' });
        category.push(worstStudents);


        const mostImproved = myStudents.reduce((acc, student) => {
            if (student.test > acc.test) {
                acc.test = student.test;
                acc.student = student;
            }
            return acc;
        }, { test: 0, student: {}, title: 'Most Improved', type: 'test' });
        category.push(mostImproved);


        const leastImproved = myStudents.reduce((acc, student) => {
            if (student.test < acc.test) {
                acc.test = student.test;
                acc.student = student;
            }
            return acc;
        }, { test: Infinity, student: {}, title: 'Least Improved', type: 'test' });
        category.push(leastImproved);


        const bestAssignment = myStudents.reduce((acc, student) => {
            if (student.assignment > acc.assignment) {
                acc.assignment = student.assignment;
                acc.student = student;
            }
            return acc;
        }, { assignment: 0, student: {}, title: 'Best Assignments', type: 'assignment' });
        category.push(bestAssignment);


        const worstAssignment = myStudents.reduce((acc, student) => {
            if (student.assignment < acc.assignment) {
                acc.assignment = student.assignment;
                acc.student = student;
            }
            return acc;
        }, { assignment: Infinity, student: {}, title: 'Least Assignments', type: 'assignment' });
        category.push(worstAssignment);



        console.log(category);



        return NextResponse.json({ classes: formattedData, students: myStudents, category: category }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
};
