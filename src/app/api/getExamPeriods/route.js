import { connectDB } from "@/configs/dbConfig";
import Exam from "@/models/examModel";
import { SchoolClass } from "@/models/GradeSyllabus";
import { NextResponse } from "next/server";

connectDB();

export async function POST(request) {
    try {
        const { name } = await request.json();
        console.log(name);


        // Find all classes where the teacher teaches any subject for the specified year
        const classes = await SchoolClass.find({
            "years.year": 2025,
            "years.subjects.currentTeachers.name": name
        });
        console.log(classes);

        // Prepare the response data
        let result = [];

        classes.forEach(cls => {
            cls.years.forEach(yearObj => {
                console.log(yearObj);

                if (yearObj.year === 2025) {

                    yearObj.subjects.forEach(subject => {
                        console.log(subject);

                        if (subject.currentTeachers.some(teacher => teacher.name === name)) {
                            result.push({
                                className: cls.className,
                                subjectName: subject.name
                            });
                        }
                    });
                }
            });
        });




        let latestPeriod = null;
        let latestStartDate = null;
        let returnPeriod = [];

        // Loop through each class name and fetch exams
        // for (let className of classNames) {
        const exams = await Exam.find({
        });
        console.log(exams);


        // Find the exam with the latest start date
        exams.forEach(exam => {
            console.log(exam);

            exam.years.forEach(yearObj => {
                console.log(yearObj);

                yearObj.subjects.forEach(subject => {
                    subject.exams.forEach(subjectExam => {
                        console.log(subjectExam);
                        if (!latestStartDate || new Date(subjectExam.startDate) > latestStartDate) {
                            latestStartDate = new Date(subjectExam.startDate);
                            latestPeriod = subjectExam.period;
                        }

                    })


                });
            });
        });
        // }
        console.log(latestPeriod);
        returnPeriod.push(latestPeriod);
        console.log(result);



        return NextResponse.json({ returnPeriod, result }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
