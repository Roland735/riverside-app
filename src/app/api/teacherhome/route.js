import { connectDB } from "@/configs/dbConfig";
import { Teacher } from "@/models/Teacher";
import { NextResponse } from "next/server";
import { SchoolClass } from "@/models/GradeSyllabus";

connectDB();

export async function POST(req) {
    try {
        const body = await req.json();
        const { teacherName } = body;

        if (!teacherName) {
            return NextResponse.json({ message: "Teacher name is required" }, { status: 400 });
        }

        const teacher = await Teacher.findOne({ name: teacherName });
        console.log(teacher);



        if (!teacher) {
            return NextResponse.json({ message: "Teacher not found" }, { status: 404 });
        }

        const schoolClass = await SchoolClass.find({

            "years.year": 2025,
        });

        const teacherClass = await SchoolClass.find({
            "classTeachers.name": teacherName,
        });

        const yea = teacherClass.map(element => {
            return element.years.find(yea => yea.year === 2025)
        })

        let present = 0;
        let absent = 0;
        let late = 0;
        let sick = 0;
        let excused = 0;

        schoolClass.forEach(element => {
            element.years.forEach(yea => {


                if (yea.year === 2025) {
                    present = present + yea.presentPercentage
                    absent = absent + yea.absentPercentage
                    late = late + yea.latePercentage
                    sick = sick + yea.sickPercentage
                    excused = excused + yea.excusedPercentage
                }

            })
        });

        present = present / schoolClass.length
        late = late / schoolClass.length
        absent = absent / schoolClass.length
        excused = excused / schoolClass.length
        sick = sick / schoolClass.length


        console.log("hi");

        const activeClasses = await Promise.all(teacher.activeClasses.map(async (activeClass) => {
            console.log(activeClass);

            const classDetails = await SchoolClass.findOne({ className: activeClass.className });

            console.log(classDetails);



            if (!classDetails) {
                return null;
            }

            const year2025 = classDetails.years.find(year => year.year === 2025);


            console.log("hi");


            if (!year2025) {
                return null;
            }


            console.log("hi");

            const subjects = await Promise.all(year2025.subjects.map(async (subject) => {
                const studentsCount = year2025.students.filter(student =>
                    student.grades.some(grade =>
                        grade.grade === activeClass.className &&
                        grade.subjects.some(sub => sub.name === subject.name)
                    )
                ).length;

                console.log("hi");



                const anomalies = getAnomalies(subject);

                const performanceData = await Promise.all(year2025.students.map(async (student) => {
                    const studentGrade = student.grades.find(grade => grade.grade === activeClass.className);
                    if (!studentGrade) {
                        return {
                            name: student.name,
                            score: 0
                        };
                    }



                    const subjectDetail = studentGrade.subjects.find(sub => sub.name === subject.name);


                    if (!subjectDetail) {

                        return {
                            name: student.name,
                            score: 0
                        };
                    }



                    return {
                        name: student.name,
                        score: subjectDetail.testAverage || 0,

                    };
                }));

                console.log("hi")
                const mysubject = year2025.subjects.find(sub => sub.name === subject.name);

                const subjectCurrentTeachers = mysubject.currentTeachers || [];


                return {
                    name: `${activeClass.className} - ${subject.name}`,
                    students: studentsCount,
                    currentTeachers: subjectCurrentTeachers || [],
                    quizAvg: subject.quizAverageMark || 0,
                    assignmentAvg: subject.assignmentAverageMark || 0,
                    testAvg: subject.testaverageMark || 0,
                    anomalies: anomalies,
                    performanceData: performanceData,

                };

            }));
            console.log("hi")

            return {
                name: activeClass.className,
                subjects: subjects.filter(subject => subject !== null), // Filter out null subjects

            };
        }));
        console.log("hi")


        console.log("activeClasses", activeClasses);


        const processedClasses = new Set();

        console.log("hi")
        const classes = activeClasses.flatMap(curr => {
            console.log("hi")
            if (processedClasses.has(curr.name)) return [];
            console.log(curr.subjects)

            let filteredSubjects = []
            curr.subjects.forEach(subject => {

                subject.currentTeachers.forEach(teacher => {
                    if (teacher.name === teacherName) {
                        filteredSubjects.push(subject)
                    }
                })
            });




            console.log(curr)

            if (filteredSubjects.length > 0) {
                processedClasses.add(curr.name);
                console.log(processedClasses);

                return filteredSubjects;
            }
            console.log("hi")

            return [];
        });
        console.log("hi")

        console.log(classes);


        // Generate random numbers for the rates
        const attendanceRate = Math.floor(Math.random() * 101); // Random number between 0 and 100
        const submissionRate = Math.floor(Math.random() * 101); // Random number between 0 and 100

        console.log("hi")
        // Calculate averages for the teacher
        const quizAverages = calculateAverage(classes, 'quizAvg');
        const testAverages = calculateAverage(classes, 'testAvg');
        const assignmentAverages = calculateAverage(classes, 'assignmentAvg');
        let teacherAverageMark = 0;
        console.log("hi")

        // Assuming teacherAverageMark is an average of all the averages
        if (quizAverages > 0 && testAverages > 0 && assignmentAverages > 0) {
            teacherAverageMark = (quizAverages + testAverages + assignmentAverages) / 3;
        } else if (quizAverages > 0 && testAverages > 0 && assignmentAverages === 0) {
            teacherAverageMark = (quizAverages + testAverages) / 2;
        } else if (quizAverages > 0 && testAverages === 0 && assignmentAverages > 0) {
            teacherAverageMark = (quizAverages + assignmentAverages) / 2;
        } else if (quizAverages === 0 && testAverages > 0 && assignmentAverages > 0) {
            teacherAverageMark = (testAverages + assignmentAverages) / 2;
        } else if (quizAverages > 0 && testAverages > 0 && assignmentAverages === 0) {
            teacherAverageMark = (quizAverages + testAverages) / 2;
        } else if (quizAverages === 0 && testAverages === 0 && assignmentAverages > 0) {
            teacherAverageMark = assignmentAverages;
        } else if (quizAverages === 0 && testAverages > 0 && assignmentAverages === 0) {
            teacherAverageMark = testAverages;
        } else if (quizAverages > 0 && testAverages === 0 && assignmentAverages === 0) {
            teacherAverageMark = quizAverages;
        } else if (quizAverages === 0 && testAverages === 0 && assignmentAverages === 0) {
            teacherAverageMark = 0;
        }

        console.log(attendanceAverage(yea, "presentPercentage"));

        console.log("hi")


        return NextResponse.json({
            classes,
            attendanceRate,
            submissionRate,
            quizAverages,
            testAverages,
            assignmentAverages,
            teacherAverageMark,
            totalAttendance: attendanceAverage(yea, "presentPercentage"),
            excused: attendanceAverage(yea, "excusedPercentage"),
            late: attendanceAverage(yea, "latePercentage"),
            sick: attendanceAverage(yea, "sickPercentage"),
            absent: attendanceAverage(yea, "absentPercentage")

        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching classes:', error);
        return NextResponse.json({ message: 'Error fetching classes', error: error.message }, { status: 500 });
    }
}

function getAnomalies(subject) {
    const anomalies = [];
    const lowScoreThreshold = 50;

    if (subject.students) {
        const lowScoringStudents = subject.students.filter(student => student.assignmentAverage < lowScoreThreshold);
        if (lowScoringStudents.length > 0) {
            anomalies.push(`${lowScoringStudents.length} students with consistently low scores`);
        }
    }

    return anomalies.join(", ") || "No significant anomalies";
}
function calculateAverage(classes, field) {
    // Filter classes where classItem[field] is greater than 0
    const filteredClasses = classes.filter(classItem => classItem[field] > 0);

    // Calculate total sum of filtered classItem[field] values
    const total = filteredClasses.reduce((sum, classItem) => sum + classItem[field], 0);

    // Return average if there are classes with classItem[field] > 0, otherwise return 0
    return filteredClasses.length > 0 ? total / filteredClasses.length : 0;
}
function attendanceAverage(attendance, field) {
    console.log(attendance);


    let total = 0;
    for (let i = 0; i < attendance.length; i++) {
        total += attendance[i][field];
    }
    return total / attendance.length || 0;


}


