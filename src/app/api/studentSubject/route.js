import { connectDB } from "@/configs/dbConfig";
import { SchoolClass } from "@/models/GradeSyllabus";
import { NextResponse } from "next/server";
import { userModel } from "@/models/userModel";

connectDB();

export async function POST(req) {
    try {
        console.log("hi");

        const body = await req.json();

        const { regNumber } = body;

        const subjectName = decodeURIComponent(body.subjectName);
        const className = decodeURIComponent(body.className);
        console.log(regNumber, subjectName, className)



        if (!regNumber || !subjectName) {
            return NextResponse.json(
                { message: "Registration number and subject name are required" },
                { status: 400 }
            );
        }

        // Fetch the student's data for the year 2025
        const studentClass = await SchoolClass.findOne(
            {
                "years.year": 2025,
                "years.students.reg_number": regNumber,
                "className": className,
            },
            {
                "years.$": 1,
                className: 1,

            }
        );



        if (!studentClass) {
            return NextResponse.json({ message: "Student or subject not found" }, { status: 404 });
        }
        console.log("class", studentClass);


        const studentYearData = studentClass.years?.find(yea => yea.year === 2025);
        const studentInfo = studentYearData.students?.find(stu => stu.reg_number === regNumber);

        const subTopicData = studentYearData.subjects?.find(sub => sub.name === subjectName);
        console.log("sub", subTopicData);


        // console.log(subTopicData);


        if (!studentInfo) {
            return NextResponse.json({ message: "Student not found" }, { status: 404 });
        }


        const gradeInfo = studentInfo.grades?.find(gra => gra.grade === className);





        const subjectData = gradeInfo.subjects?.find(subject => subject.name === subjectName);

        // console.log(`subject....`, subjectData);
        console.log(subjectData);

        const teachers = subTopicData.currentTeachers.map(teacher => teacher.name);


        if (teachers.length === 0) {
            teachers.push("No teacher assigned yet");
        }
        let teacherImages = []

        for (const teacher of teachers) {

            console.log(teacher);

            const teacherData = await userModel.aggregate([
                {
                    $addFields: {
                        fullName: { $concat: ["$firstname", " ", "$lastname"] }
                    }
                },
                {
                    $match: {
                        fullName: teacher
                    }
                },
                {
                    $limit: 1 // To ensure only one document is returned
                }
            ]);
            console.log(teacherData.length);
            if (teacherData.length > 0) {
                console.log("hi");
                teacherData.forEach(data => {
                    teacherImages.push({ name: teacher, image: data.profilePicture });


                });
            } else {
                teacherImages.push({ name: teacher, image: "" });
            }

        }

        console.log(teacherImages);



        if (!subjectData) {
            return NextResponse.json({ message: "Subject data not found" }, { status: 404 });
        }



        const subjectDetail = {
            name: subjectData.name,
            className: studentClass.className,
            currentTeacher: teacherImages,
            previousTeachers: subjectData.previous_teachers?.map(teacher => teacher.teacher_name) || [],
            topics: subTopicData.topicsTaught?.map(topic => ({
                scheduleNumber: topic.scheduleNumber,
                title: topic.title,
                completed: topic.completed,
                startDate: topic.startDate,
                endDate: topic.endDate,
                assignmentAverage: topic.assignmentAverage,
                testAverage: topic.testAverage,
                confirmation: topic.confirmation,
                teachers: topic.teachers?.map(teacher => teacher.name) || [],
            })) || [],
            testAverageMark: subjectData.testAverage,
            assignmentAverageMark: subjectData.assignmentAverage,
            quizzesAverage: subjectData.quizzesAverage,
            exams: subjectData.exams?.map(exam => ({
                examId: exam.exam_id,
                term: exam.term,
                examMark: exam.exam_mark,
                examPercentage: exam.exam_percentage,
                examPosition: exam.exam_position,
                papers: exam.papers?.map(paper => ({
                    paperId: paper.paper_id,
                    paperNumber: paper.paper_number,
                    paperMark: paper.paper_mark,
                    paperPercentage: paper.paper_percentage,
                    paperPosition: paper.paper_position,
                    highest: paper.highest,
                    absent: paper.absent,
                })) || [],
            })) || [],
            assignments: subjectData.assignments?.map(assignment => ({
                assignmentId: assignment.assignment_id,
                assignmentName: assignment.assignment_name,
                assignmentMark: assignment.assignment_mark,
                assignmentPercentage: assignment.assignment_percentage,
                assignmentPosition: assignment.assignment_position,
                assignedDate: assignment.assigned_date,
                absent: assignment.absent,
            })) || [],
            tests: subjectData.tests?.map(test => ({
                testId: test.test_id,
                testName: test.test_name,
                testMark: test.test_mark,
                testPercentage: test.test_percentage,
                testPosition: test.test_position,
                assignedDate: test.assigned_date,
                highest: test.highest,
                absent: test.absent,
            })) || [],
            quizzes: subjectData.quizzes?.map(quiz => ({
                quizId: quiz.quiz_id,
                quizName: quiz.quiz_name,
                quizMark: quiz.quiz_mark,
                quizPercentage: quiz.quiz_percentage,
                quizPosition: quiz.quiz_position,
                assignedDate: quiz.assigned_date,
                highest: quiz.highest,
                absent: quiz.absent,
            })) || [],
        };
        console.log(subjectDetail);


        return NextResponse.json({
            studentName: studentInfo.name,
            subjectDetail
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching student data:", error);
        return NextResponse.json(
            { message: "Error fetching student data", error: error.message },
            { status: 500 }
        );
    }
}
