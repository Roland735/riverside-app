import { connectDB } from "@/configs/dbConfig";
import Exam from "@/models/examModel";
import { SchoolClass } from "@/models/GradeSyllabus";
import { NextResponse } from "next/server";

// The POST handler function for creating and fetching exam period data
export async function POST(request) {
    try {
        // Parse the incoming request body (should contain period and year)
        const { period, year } = await request.json();
        console.log(period, year);

        // Connect to the database
        await connectDB();

        // Find exams for the given period and year within subjects
        const exams = await Exam.find({
            "years.year": year,
            "years.subjects.exams.period": period,
        });
        const classData = await SchoolClass.find({
            "years.year": year,

        });

        console.log(exams);

        // Safely check if exams data is available and the structure is correct
        const firstExam = exams.length > 0 ? exams[0] : null;
        const firstYear = firstExam?.years.find(y => y.year === year);
        const firstSubject = firstYear?.subjects[0];
        const firstPeriodExam = firstSubject?.exams[0];

        const startDate = firstPeriodExam?.startDate ? firstPeriodExam.startDate.toISOString().split("T")[0] : "";
        const endDate = firstPeriodExam?.endDate ? firstPeriodExam.endDate.toISOString().split("T")[0] : "";

        // Group exams by period and structure the response data accordingly
        const periods = [
            {
                id: 1, // Assuming you only query one period at a time
                name: period,
                startDate,  // Use the safely checked startDate
                endDate,    // Use the safely checked endDate
                stages: [
                    {
                        id: 1,
                        name: "Exam Period Creation",
                        progress: 100,
                        link: "/create-exam-period",
                        tableData: [], // No specific data for this stage
                        withLink: false,
                    },
                    {
                        id: 2,
                        name: "Subject Teachers Submit Exams",
                        // Calculate progress based on the percentage of exams where status is true
                        progress: (() => {
                            const relevantExams = exams.flatMap(examClass =>
                                examClass.years
                                    .filter(y => y.year === year)
                                    .flatMap(y => y.subjects.flatMap(subject =>
                                        subject.exams.filter(p => p.period === period).map(exam => ({
                                            className: examClass.className,
                                            subject: subject.name,
                                            teacher: classData.find(c => c.className === examClass.className)?.years.find(y => y.year === year)?.subjects.find(s => s.name === subject.name)?.currentTeachers.map(teacher => teacher.name).join(', ') || '',
                                            status: exam.papers.length > 0 ? true : false,
                                        }))
                                    ))
                            );

                            // Calculate progress as a percentage of true statuses
                            const totalExams = relevantExams.length;
                            const completedExams = relevantExams.filter(exam => exam.status === true).length;

                            return totalExams > 0 ? (completedExams / totalExams) * 100 : 0;
                        })(),
                        link: "/subject-teacher-submit",
                        withLink: false,
                        tableData: exams.flatMap(examClass =>
                            examClass.years
                                .filter(y => y.year === year)
                                .flatMap(y => y.subjects.flatMap(subject =>
                                    subject.exams.filter(p => p.period === period).map(exam => ({
                                        className: examClass.className,
                                        subject: subject.name,
                                        teacher: classData.find(c => c.className === examClass.className)?.years.find(y => y.year === year)?.subjects.find(s => s.name === subject.name)?.currentTeachers.map(teacher => teacher.name).join(', ') || '',
                                        status: exam.papers.length > 0 ? true : false,
                                    }))
                                ))
                        ),
                    },
                    {
                        id: 3,
                        name: "Admin Approval and Invigilator Assignment",
                        // Calculate progress based on the percentage of papers with ExamApproved (paper.confirmed) as true
                        progress: (() => {
                            const relevantPapers = exams.flatMap(examClass =>
                                examClass.years
                                    .filter(y => y.year === year)
                                    .flatMap(y => y.subjects.flatMap(subject =>
                                        subject.exams.filter(e => e.period === period).flatMap(exam =>
                                            exam.papers.map(paper => ({
                                                className: examClass.className,
                                                subject: subject.name,
                                                paper: paper.paperNumber,
                                                invigilator: paper.invigilator.length > 0 ? paper.invigilator[0].name : "Not Assigned",
                                                marker: paper.marker.length > 0 ? paper.marker[0].name : "Not Assigned",
                                                ExamApproved: paper.confirmed,
                                            }))
                                        )
                                    ))
                            );

                            // Calculate progress as a percentage of papers where ExamApproved is true
                            const totalPapers = relevantPapers.length;
                            const approvedPapers = relevantPapers.filter(paper => paper.ExamApproved === true).length;

                            return Math.round(totalPapers > 0 ? (approvedPapers / totalPapers) * 100 : 0);
                        })(),
                        link: `/dashboard/admin/confirmExams/${period}/${year}`,
                        withLink: true,
                        tableData: exams.flatMap(examClass =>
                            examClass.years
                                .filter(y => y.year === year)
                                .flatMap(y => y.subjects.flatMap(subject =>
                                    subject.exams.filter(e => e.period === period).flatMap(exam =>
                                        exam.papers.map(paper => ({
                                            className: examClass.className,
                                            subject: subject.name,
                                            paper: paper.paperNumber,
                                            invigilator: paper.invigilator.length > 0 ? paper.invigilator[0].name : "Not Assigned",
                                            marker: paper.marker.length > 0 ? paper.marker[0].name : "Not Assigned",
                                            ExamApproved: paper.confirmed,
                                        }))
                                    )
                                ))
                        ),
                    },
                    {
                        id: 4,
                        name: "Invigilators Mark Attendance",
                        // Calculate progress based on the percentage of exams where attendanceMarked is true
                        progress: (() => {
                            const relevantExams = exams.flatMap(examClass =>
                                examClass.years
                                    .filter(y => y.year === year)
                                    .flatMap(y => y.subjects.flatMap(subject =>
                                        subject.exams.filter(e => e.period === period).map(exam => ({
                                            attendanceMarked: exam.attendanceMarked,
                                        }))
                                    ))
                            );

                            // Calculate progress as a percentage of attendanceMarked being true
                            const totalExams = relevantExams.length;
                            const markedAttendanceExams = relevantExams.filter(exam => exam.attendanceMarked === true).length;

                            return totalExams > 0 ? (markedAttendanceExams / totalExams) * 100 : 0;
                        })(),
                        link: "/invigilator-attendance",
                        withLink: false,
                        tableData: exams.flatMap(examClass =>
                            examClass.years
                                .filter(y => y.year === year)
                                .flatMap(y => y.subjects.flatMap(subject =>
                                    subject.exams.filter(e => e.period === period).flatMap(exam =>
                                        exam.papers.map(paper => ({
                                            subject: subject.name,
                                            className: examClass.className,
                                            paper: `${subject.name} Paper ${paper.paperNumber}`,
                                            attendanceMarked: exam.attendanceMarked,
                                        }))
                                    )
                                ))
                        ),
                    },
                    {
                        id: 5,
                        name: "Markers Upload Marks",
                        withLink: false,
                        // Calculate progress based on the percentage of exams where marksUploaded is true
                        progress: (() => {
                            const relevantExams = exams.flatMap(examClass =>
                                examClass.years
                                    .filter(y => y.year === year)
                                    .flatMap(y => y.subjects.flatMap(subject =>
                                        subject.exams.filter(e => e.period === period).map(exam => ({
                                            marksUploaded: exam.marksUploaded,
                                        }))
                                    ))
                            );

                            // Calculate progress as a percentage of exams with marksUploaded as true
                            const totalExams = relevantExams.length;
                            const examsWithMarksUploaded = relevantExams.filter(exam => exam.marksUploaded === true).length;

                            return Math.round(totalExams > 0 ? (examsWithMarksUploaded / totalExams) * 100 : 0);
                        })(),
                        link: "/marker-upload",
                        tableData: exams.flatMap(examClass =>
                            examClass.years
                                .filter(y => y.year === year)
                                .flatMap(y => y.subjects.flatMap(subject =>
                                    subject.exams.filter(e => e.period === period).flatMap(exam =>
                                        exam.papers.map(paper => ({
                                            subject: subject.name,
                                            className: examClass.className,
                                            paper: `${subject.name} Paper ${paper.paperNumber}`,
                                            marksUploaded: exam.marksUploaded,
                                        }))
                                    )
                                ))
                        ),
                    },

                    {
                        id: 6,
                        name: "Subject Comment",
                        // Calculate progress based on the percentage of exams with SubjectComment (or classComment) present
                        progress: (() => {
                            const relevantExams = exams.flatMap(examClass =>
                                examClass.years
                                    .filter(y => y.year === year)
                                    .flatMap(y => y.subjects.flatMap(subject =>
                                        subject.exams.filter(e => e.period === period).map(exam => ({
                                            classComment: exam.classComment,
                                            SubjectComment: exam.SubjectComment,
                                        }))
                                    ))
                            );

                            // Calculate progress as a percentage of exams with either classComment or SubjectComment
                            const totalExams = relevantExams.length;
                            const examsWithComments = relevantExams.filter(exam => exam.classComment || exam.SubjectComment).length;

                            return totalExams > 0 ? (examsWithComments / totalExams) * 100 : 0;
                        })(),
                        link: "/class-teacher-comments",
                        withLink: false,
                        tableData: exams.flatMap(examClass =>
                            examClass.years
                                .filter(y => y.year === year)
                                .flatMap(y => y.subjects.flatMap(subject =>
                                    subject.exams.filter(e => e.period === period).flatMap(exam =>
                                        exam.papers.map(paper => ({
                                            subject: subject.name,
                                            className: examClass.className,
                                            classTeacher: exam.SubjectComment || false,
                                        }))
                                    )
                                ))
                        ),
                    },
                    {
                        id: 7,
                        name: "Class Comment",

                        // Calculate progress based on whether all exams have classTeachersComments
                        progress: exams.length > 0
                            ? Math.round(
                                (exams.filter(examClass => {
                                    let classComments = 0;
                                    let total = 0;
                                    let bool = false;

                                    examClass.years
                                        .filter(y => y.year === year)
                                        .flatMap(y => y.students.flatMap(student =>
                                            student[0].exams.filter(e => e.period === period).forEach(exam => {
                                                total += 1;

                                                if (exam.classTeachersComments !== "" && exam.classTeachersComments !== undefined) {
                                                    classComments += 1;
                                                }
                                            })
                                        ));

                                    if (classComments === total && total > 0) {
                                        bool = true;
                                    }

                                    return bool; // Return true if the class is complete
                                }).length / exams.length) * 100
                            ) : 0, // Return 0 if there are no exams
                        link: `/dashboard/admin/HeadmasterComment/${period}/${year}`,
                        withLink: false,
                        tableData: exams.flatMap(examClass => {
                            let classComments = 0;
                            let total = 0;
                            let bool = false;

                            examClass.years
                                .filter(y => y.year === year)
                                .flatMap(y => y.students.flatMap(student =>
                                    student[0].exams.filter(e => e.period === period).forEach(exam => {
                                        total += 1;

                                        if (exam.classTeachersComments !== "" && exam.classTeachersComments !== undefined) {
                                            classComments += 1;
                                        }
                                    })
                                ));

                            if (classComments === total && total > 0) {
                                bool = true;
                            }

                            return {
                                Class: examClass.className,
                                classComments: Math.round(total > 0 ? (classComments / total) * 100 : 0),
                                inSights: `${classComments}/${total}`,
                                classTeachers: examClass.classTeachers.map(teacher => teacher.name),
                                Complete: bool,
                            };
                        }),
                    },
                    {
                        id: 9,
                        name: "Head Master Comment",
                        // Calculate progress based on whether all exams have classTeachersComments
                        progress: exams.length > 0
                            ? Math.round(
                                (exams.filter(examClass => {
                                    let classComments = 0;
                                    let total = 0;
                                    let bool = false;

                                    examClass.years
                                        .filter(y => y.year === year)
                                        .flatMap(y => y.students.flatMap(student =>
                                            student[0].exams.filter(e => e.period === period).forEach(exam => {
                                                total += 1;

                                                if (exam.adminComments !== "" && exam.adminComments !== undefined) {
                                                    classComments += 1;
                                                }
                                            })
                                        ));

                                    if (classComments === total && total > 0) {
                                        bool = true;
                                    }

                                    return bool; // Return true if the class is complete
                                }).length / exams.length) * 100
                            ) : 0, // Return 0 if there are no exams
                        link: `/dashboard/admin//HeadmasterComment/${period}/${year}`,
                        withLink: true,
                        tableData: exams.flatMap(examClass => {
                            let classComments = 0;
                            let total = 0;
                            let bool = false;

                            examClass.years
                                .filter(y => y.year === year)
                                .flatMap(y => y.students.flatMap(student =>
                                    student[0].exams.filter(e => e.period === period).forEach(exam => {
                                        total += 1;

                                        if (exam.adminComments !== "" && exam.adminComments !== undefined) {
                                            classComments += 1;
                                        }
                                    })
                                ));

                            if (classComments === total && total > 0) {
                                bool = true;
                            }

                            return {
                                Class: examClass.className,
                                classComments: Math.round(total > 0 ? (classComments / total) * 100 : 0),
                                inSights: `${classComments}/${total}`,
                                classTeachers: examClass.classTeachers.map(teacher => teacher.name),
                                Complete: bool,
                            };
                        }),
                    },
                    {
                        id: 8,
                        name: "Fees Clearance",
                        progress: 100,
                        link: `/dashboard/admin/StudentReportsPage/${period}/${year}`,
                        tableData: [], // No specific data for this stage
                        withLink: true,
                    },
                    {
                        id: 10,
                        name: "Download Reports",
                        // Calculate progress based on whether all exams have classTeachersComments
                        progress: 100,
                        link: `/dashboard/admin/myResult`,
                        withLink: true,
                        tableData: {},
                    },


                ],
            }
        ];


        // Return the periods array in the response
        return NextResponse.json({ periods });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
