import { NextResponse } from 'next/server';
import { connectDB } from "@/configs/dbConfig";
import Exam from '@/models/examModel';
import { SchoolClass } from '@/models/GradeSyllabus';
import { userModel } from '@/models/userModel';

connectDB();

export async function POST(req) {
    try {
        console.log("Stage 1: Received Request");

        // Parse request body
        const { invigilator, examPeriod, myYear, reg_number, newStatus, date, paperNumber, subjectName, name, className
        } = await req.json();
        const year = parseInt(myYear);

        console.log("Stage 2: Parsed Request Body", { year, invigilator, examPeriod, year, reg_number, newStatus, date, paperNumber, subjectName, name, className });

        // Find the exam class for the specific year and exam period
        const examClass = await Exam.findOne({
            "years.year": year,
            className: className,
            "years.subjects.exams.period": examPeriod,
            "years.subjects.name": subjectName,
            "years.subjects.exams.papers.paperNumber": paperNumber
        });

        if (!examClass) {
            console.log("Stage 3: Exam class not found");
            return NextResponse.json({ message: 'Exam class not found' }, { status: 404 });
        }

        console.log("Stage 4: Exam class found", examClass);

        const StudentClass = await SchoolClass.findOne({
            "className": className,
            "years.year": year,
            "years.subjects.name": subjectName
        });

        if (!StudentClass) {
            console.log("Stage 5: StudentClass not found");
            return NextResponse.json({ message: 'StudentClass not found' }, { status: 404 });
        }

        console.log("Stage 6: StudentClass found", StudentClass);

        const userNamesAndRegNumbers = await userModel.find({
            role: "teacher",
        }).select("firstname lastname regNumber");

        if (!userNamesAndRegNumbers) {
            console.log("Stage 7: User not found");
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        console.log("Stage 8: User data found", userNamesAndRegNumbers);

        const yearData = StudentClass.years.find((yea) => yea.year === year);
        if (!yearData) {
            console.log("Stage 9: Year not found in StudentClass");
            return NextResponse.json({ message: 'Year not found' }, { status: 404 });
        }

        console.log("Stage 10: Year data found", yearData);

        const subjectData = yearData.subjects.find((subject) => subject.name === subjectName);
        if (!subjectData) {
            console.log("Stage 11: Subject not found in the specified year");
            return NextResponse.json({ message: 'Subject not found' }, { status: 404 });
        }

        console.log("Stage 12: Subject data found", subjectData);

        const classTeacherNames = subjectData.currentTeachers ? subjectData.currentTeachers.map((teacher) => teacher.name) : [];
        console.log("Stage 13: Class teacher names found", classTeacherNames);

        let Teacher = [];

        classTeacherNames.forEach(teacher => {
            const user = userNamesAndRegNumbers.find((user) => `${user.firstname} ${user.lastname}` === teacher);
            if (user) {
                Teacher.push({
                    name: teacher,
                    regNumber: user.regNumber
                });
            }
        });

        console.log("Stage 14: Teachers processed", Teacher);

        // Find or create the year data in examClass
        let yearDataExamClass = examClass.years.find((y) => y.year === year);
        if (!yearDataExamClass) {
            console.log("Stage 15: Year not found in Exam class");
            return NextResponse.json({ message: 'Year not found in Exam class' }, { status: 404 });
        }

        console.log("Stage 16: Year data found in Exam class", yearDataExamClass);

        // Find or create the subject within the year
        let subject = yearDataExamClass.subjects.find((s) => s.name === subjectName);
        if (!subject) {
            console.log("Stage 17: Subject not found in Exam class, creating new subject...");
            subject = {
                name: subjectName,
                exams: []
            };
            yearDataExamClass.subjects.push(subject);
        }

        console.log("Stage 18: Subject in Exam class found or created", subject);

        // Find or create the exam within the subject's exams
        let exam = subject.exams.find((e) => e.period === examPeriod);
        if (!exam) {
            console.log("Stage 19: Exam period not found in subject, creating new exam...");
            exam = {
                period: examPeriod,
                papers: []
            };
            subject.exams.push(exam);
        }

        console.log("Stage 20: Exam found or created", exam);

        // Find or create the paper within the exam
        let paper = exam.papers.find((p) => p.paperNumber === paperNumber);
        if (!paper) {
            console.log("Stage 21: Paper not found in exam, creating new paper...");
            paper = {
                paperNumber: paperNumber,
                attendance: []
            };
            exam.papers.push(paper);
        }

        console.log("Stage 22: Paper found or created", paper);

        // Find or create the student record
        let student = yearDataExamClass.students.find((stu) => stu.some((studde) => studde.studentId.regNumber === reg_number));
        if (!student) {
            console.log("Stage 23: Student not found in Exam class, creating new student...");
            let myPaper = null;
            let mySubject = null;
            examClass.years.forEach((y) => {
                console.log("year found", year);
                if (y.year === year) {
                    console.log("year found");
                    y.subjects.forEach((s) => {
                        console.log("year found");
                        if (s.name === subjectName) {
                            mySubject = s;
                            console.log("year found");
                            s.exams.forEach((e) => {
                                console.log("year found");
                                e.papers.forEach((p) => {
                                    console.log("year found");
                                    if (p.paperNumber === paperNumber) {

                                        myPaper = p;

                                    }
                                });
                            });
                        }
                    });
                }
            })
            console.log(mySubject);

            let theExam = {
                period: examPeriod,
                teacher: Teacher,
                startDate: mySubject.exams[0].startDate,
                endDate: date,
                papers: [{
                    paperNumber: myPaper.paperNumber,
                    paperUrl: '',
                    duration: myPaper.duration,
                    invigilator: myPaper.invigilator,
                    uploadedExam: '',
                    confirmed: myPaper.confirmed,
                    mark: 0,
                    total: 0,
                    percentage: 0,
                    comment: '',
                    marker: myPaper.marker,
                    attendance: newStatus,
                }],

                examApproved: mySubject.exams[0].examApproved,
                marksConfirmed: mySubject.exams[0].marksConfirmed,
                TeacherComments: '',
                AIComment: ''
            }
            student = {
                studentId: {
                    name: name,
                    regNumber: reg_number
                },
                exams: [
                    {
                        period: examPeriod,
                        subjects: [{
                            name: subjectName,
                            exams: [theExam]
                        }],
                        finalMark: 0,
                        totalMarks: 0,
                        totalPercentage: 0,
                        AIComment: '',
                        adminComments: '',
                        classTeachersComments: '',
                        attendance: [{
                            date: date,
                            present: `${newStatus === 'present' ? 1 : 0}`,
                            late: `${newStatus === 'late' ? 1 : 0}`,
                            excused: `${newStatus === 'excused' ? 1 : 0}`,
                            sick: `${newStatus === 'sick' ? 1 : 0}`,
                            absent: `${newStatus === 'absent' ? 1 : 0}`,
                        }],


                    }

                ]
            };
            console.log("my student", student);

            yearDataExamClass.students.push(student);
            console.log(yearDataExamClass.students);

        }

        console.log("Stage 24: Student found or created", student);

        // Find or create the student's exam record
        let studentExam = (Array.isArray(student) ? student[0].exams : student.exams).find((exam) => exam.period === examPeriod);

        console.log("Stage 25: Student exam found or created", studentExam);


        if (!studentExam) {
            console.log("Stage 25: Student exam not found, creating new student exam...");
            let myPaper = null;
            let mySubject = null;
            examClass.years.forEach((y) => {
                console.log("year found", year);
                if (y.year === year) {
                    console.log("year found");
                    y.subjects.forEach((s) => {
                        console.log("year found");
                        if (s.name === subjectName) {
                            mySubject = s;
                            console.log("year found");
                            s.exams.forEach((e) => {
                                console.log("year found");
                                e.papers.forEach((p) => {
                                    console.log("year found");
                                    if (p.paperNumber === paperNumber) {

                                        myPaper = p;
                                    }
                                });
                            });
                        }
                    });
                }
            })


            studentExam = {
                period: examPeriod,
                presentPercentage: 0,
                latePercentage: 0,
                excusedPercentage: 0,
                sickPercentage: 0,
                absentPercentage: 0,
                subjects: [
                    {
                        name: subjectName,
                        exams: [{
                            period: examPeriod,
                            teacher: Teacher,
                            startDate: mySubject.exams[0].startDate,
                            endDate: date,
                            papers: [{
                                paperNumber: myPaper.paperNumber,
                                paperUrl: '',
                                duration: myPaper.duration,
                                invigilator: myPaper.invigilator,
                                uploadedExam: '',
                                confirmed: myPaper.confirmed,
                                mark: 0,
                                total: 0,
                                percentage: 0,
                                comment: '',
                                marker: myPaper.marker,
                                attendance: newStatus,
                            }],

                            examApproved: mySubject.exams[0].examApproved,
                            marksConfirmed: mySubject.exams[0].marksConfirmed,
                            TeacherComments: '',
                            AIComment: ''
                        }

                        ]
                    }
                ],
                attendance: []
            };
            console.log("Stage 25: Student exam created", student);

            student[0].exams.push(studentExam);
        }

        console.log("Stage 26: Student exam found or created", studentExam);

        if (studentExam) {

            // Process attendance update logic
            let subjectFound = false;
            studentExam.subjects.forEach((subject) => {
                if (subject.name === subjectName) {
                    console.log("Stage 27: Subject found for attendance update");
                    subject.exams.forEach((exam) => {
                        if (exam.period === examPeriod) {
                            let myPaper = null;
                            let paperFound = false;
                            console.log("Stage 28: Exam found for attendance update");
                            exam.papers.forEach((paper) => {
                                if (paper.paperNumber === paperNumber) {
                                    console.log("Stage 29: Paper found for attendance update");
                                    paper.attendance = newStatus;
                                    paper.attendanceMarked = true;
                                    paperFound = true;
                                } else {

                                    examClass.years.forEach((y) => {
                                        console.log("year found", year);
                                        if (y.year === year) {
                                            console.log("year found");
                                            y.subjects.forEach((s) => {
                                                console.log("year found");
                                                if (s.name === subjectName) {
                                                    console.log("year found");
                                                    s.exams.forEach((e) => {
                                                        console.log("year found");
                                                        e.papers.forEach((p) => {
                                                            console.log("year found");
                                                            if (p.paperNumber === paperNumber) {

                                                                myPaper = p;
                                                            }
                                                        });
                                                    });
                                                }
                                            });
                                        }
                                    })


                                }
                            });
                            if (!paperFound) {
                                exam.papers.push({
                                    paperNumber: myPaper.paperNumber,
                                    paperUrl: '',
                                    duration: myPaper.duration,
                                    invigilator: myPaper.invigilator,
                                    uploadedExam: myPaper.uploadedExam,
                                    confirmed: myPaper.confirmed,
                                    mark: 0,
                                    total: 0,
                                    percentage: 0,
                                    comment: 0,
                                    marker: myPaper.marker,
                                    attendance: newStatus,
                                });
                                console.log("myPaper", paper);
                            }


                        }
                    });
                    subjectFound = true;
                } else {
                    console.log("Stage 30: Subject not found for attendance update");


                }
            });
            if (!subjectFound) {
                console.log("Stage 31: Subject not found for attendance update");
                let myPaper = null;
                let mySubject = null;
                examClass.years.forEach((y) => {
                    console.log("year found", year);
                    if (y.year === year) {
                        console.log("year found");
                        y.subjects.forEach((s) => {
                            console.log("year found");
                            if (s.name === subjectName) {
                                mySubject = s;
                                console.log("year found");
                                s.exams.forEach((e) => {
                                    console.log("year found");
                                    e.papers.forEach((p) => {
                                        console.log("year found");
                                        if (p.paperNumber === paperNumber) {

                                            myPaper = p;
                                        }
                                    });
                                });
                            }
                        });
                    }
                })
                console.log("my sub", mySubject.exams[0].startDate);

                studentExam.subjects.push(
                    {
                        name: subjectName,
                        exams: [{
                            period: examPeriod,
                            teacher: Teacher,
                            startDate: mySubject.exams[0].startDate,
                            endDate: date,
                            papers: [{
                                paperNumber: myPaper.paperNumber,
                                paperUrl: '',
                                duration: myPaper.duration,
                                invigilator: myPaper.invigilator,
                                uploadedExam: '',
                                confirmed: myPaper.confirmed,
                                mark: 0,
                                total: 0,
                                percentage: 0,
                                comment: '',
                                marker: myPaper.marker,
                                attendance: newStatus,
                            }],

                            examApproved: mySubject.exams[0].examApproved,
                            marksConfirmed: mySubject.exams[0].marksConfirmed,
                            TeacherComments: '',
                            AIComment: ''
                        }]
                    }
                )

            }
        }

        examClass.years.forEach((y) => {
            console.log("year found", year);
            if (y.year === 2025) {
                console.log("year found");

                y.subjects.forEach((s) => {
                    console.log("year found");
                    if (s.name === subjectName) {
                        console.log("year found");
                        s.exams.forEach((exam) => {
                            console.log("year found");
                            if (exam.period === examPeriod) {
                                console.log();

                                exam.teacher = Teacher;
                                console.log("year found");
                                let allMarked = true;
                                exam.papers.forEach((paper) => {
                                    console.log("year found");
                                    if (paper.paperNumber === paperNumber) {
                                        console.log("paper found", paper);

                                        paper.attendanceMarked = true;

                                    }
                                    if (paper.attendanceMarked === false) {
                                        allMarked = false;
                                    }
                                })
                                exam.attendanceMarked = allMarked;

                            }
                        })
                    }
                })
            }
        })
        console.log("Stage 30: Attendance updated successfully");

        // Save the updated examClass document
        await examClass.save();
        console.log("Stage 31: Exam class updated and saved successfully");

        return NextResponse.json({ message: 'Attendance updated successfully' });

    } catch (error) {
        console.error('Stage ERROR: Error updating attendance', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
