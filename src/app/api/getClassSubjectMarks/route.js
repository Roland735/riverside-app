import { connectDB } from "@/configs/dbConfig";
import { SchoolClass } from "@/models/GradeSyllabus";
import { NextResponse } from "next/server";

function getCambridgeGrade(mark1, mark2) {
    const averageMark = (mark1 + mark2) / 2;
    if (averageMark >= 90) {
        return 'A*';
    } else if (averageMark >= 80) {
        return 'A';
    } else if (averageMark >= 70) {
        return 'B';
    } else if (averageMark >= 60) {
        return 'C';
    } else if (averageMark >= 50) {
        return 'D';
    } else if (averageMark >= 40) {
        return 'E';
    } else {
        return 'U'; // U = ungraded
    }
}




export async function POST(req) {
    await connectDB();

    try {
        const { className, year, subjectName } = await req.json();
        const yearAsInt = parseInt(year, 10);
        console.log(className, year, subjectName);


        const classData = await SchoolClass.findOne({ className })
            .populate({
                path: 'years.subjects.currentTeachers',
                model: 'User'
            })
            .populate('years.subjects.topicsTaught');
        console.log("hi");


        if (!classData) {
            return NextResponse.json({ message: 'Class not found' }, { status: 404 });
        }
        console.log("hi");

        const currentYear = classData.years.find(y => y.year === yearAsInt);
        if (!currentYear) {
            return NextResponse.json({ message: 'Year not found' }, { status: 404 });
        }
        console.log("hi");

        const subject = currentYear.subjects.find(sub => sub.name === subjectName);
        if (!subject) {
            return NextResponse.json({ message: 'Subject not found' }, { status: 404 });
        }
        console.log("hi");
        const studentsData = currentYear.students.map(student => {
            const assignment = student.grades[0]?.subjects[0]?.assignments[0] || {};
            const test = student.grades[0]?.subjects[0]?.tests[0] || {};
            const quiz = student.grades[0]?.subjects[0]?.quizzes[0] || {};

            return {
                studentName: student.name,
                mark: assignment.assignment_mark || 0,
                assignment: assignment.assignment_mark || 0,
                test: test.test_mark || 0,
                quiz: quiz.quiz_mark || 0
            };
        });
        console.log("hi");

        const topicsData = subject.topicsTaught.map(topic => ({
            topicName: `Topic ${topic.scheduleNumber}`,
            title: topic.title,
            scheduleNumber: topic.scheduleNumber,
            averageMark: topic.assignmentAverage
        }));
        console.log(subject);
        console.log("hi");


        const response = {
            classData: {
                className: classData.className,
                subjectName: subjectName,
                averageMark: (subject.testaverageMark + subject.assignmentAverageMark) / 2 || 0,
                teachers: subject.currentTeachers.map(teacher => teacher.name),
                cambridgeGrade: getCambridgeGrade(subject.testaverageMark, subject.assignmentAverageMark), // This value would need to be calculated or stored elsewhere
                markChange: "+2", // This value would need to be calculated or stored elsewhere
                attendance: "85%" // This value would need to be calculated or stored elsewhere
            },
            mostImprovedData: {
                studentName: subject.mostImprovedOveralStudent?.[0]?.name || "N/A",
                change: "+10" // This value would need to be calculated or stored elsewhere
            },
            leastImprovedData: {
                studentName: subject.leastImprovedOveralStudent?.[0]?.name || "N/A",
                change: "-5" // This value would need to be calculated or stored elsewhere
            },
            bestStudentData: {
                studentName: subject.highestOveralMark?.[0]?.name || "N/A",
                mark: subject.highestOveralMark?.[0]?.grades[0].subjects[0].exams[0].exam_mark || 0
            },
            lowestStudentData: {
                studentName: subject.lowestOveralMark?.[0]?.name || "N/A",
                mark: subject.lowestOveralMark?.[0]?.grades[0].subjects[0].exams[0].exam_mark || 0
            },
            studentsData,
            topicsData
        };
        console.log("hi");

        return NextResponse.json(response);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
