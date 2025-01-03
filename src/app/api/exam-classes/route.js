import { NextResponse } from 'next/server';
import { connectDB } from "@/configs/dbConfig";
import Exam from '@/models/examModel';
import { userModel } from '@/models/userModel'; // Import user model
import { SchoolClass } from "@/models/GradeSyllabus"; // Import SchoolClass schema

connectDB();

export async function POST(req) {
    try {
        console.log("Fetching exam classes...");

        const { regNumber, year, period } = await req.json();
        const myYear = parseInt(year);
        const myPeriod = period;
        console.log("Received data:", { regNumber, year, period });



        // Fetch all the exam classes from the database
        const examClasses = await Exam.find({});
        console.log("Exam classes fetched");

        // Initialize the response data
        const responseData = [];

        // Process each class
        for (const examClass of examClasses) {
            console.log("Processing class:", examClass.className);
            const classData = {
                className: examClass.className,
                subjects: []
            };

            // Process each year
            if (examClass.years.length > 0) {
                for (const year of examClass.years) {
                    console.log("Processing year:", year.year, myYear);

                    if (year.year === myYear) {


                        // Process each subject
                        if (year.subjects.length > 0) {
                            for (const subject of year.subjects) {
                                console.log("Processing subject:", subject.name);
                                let subjectData = {
                                    subjectName: subject.name,
                                    students: [],
                                    classTeachers: [],
                                };

                                // Initialize student data map
                                const studentMap = new Map();
                                let teacherFound = false;

                                console.log(subject);



                                if (subject.exams.length > 0) {
                                    for (const exam of subject.exams) {
                                        console.log("Processing exam:", exam);


                                        // Process each paper
                                        if (exam.papers.length > 0) {


                                            for (const paper of exam.papers) {
                                                console.log("Processing paper:", paper);

                                                // Process each student
                                                if (year.students.length > 0) {
                                                    // Collect all promises
                                                    const studentPromises = year.students.flat().map(async (student) => {
                                                        try {
                                                            console.log(student.exams);

                                                            const studentExam = student.exams.find(e => e.period === myPeriod);
                                                            ;
                                                            if (studentExam) {
                                                                const subjectExam = studentExam.subjects.find(s => s.name === subject.name);
                                                                console.log("subject exaaa", subjectExam);

                                                                if (subjectExam) {
                                                                    const mySubjectExam = subjectExam.exams.find(e => e.period === exam.period);
                                                                    console.log(mySubjectExam.teacher);
                                                                    mySubjectExam.teacher.forEach(element => {
                                                                        console.log(element);

                                                                        if (element.regNumber === regNumber) {
                                                                            teacherFound = true;
                                                                            console.log("Teacher found:", element);
                                                                        }
                                                                    }

                                                                    );
                                                                    if (teacherFound) {



                                                                        if (mySubjectExam) {
                                                                            const behaviorGrade = mySubjectExam.behaviorGrade;
                                                                            const assessmentMark = mySubjectExam.classAverage;
                                                                            console.log("Behavior grade:", behaviorGrade);
                                                                            console.log("Assessment mark:", assessmentMark);

                                                                            const examPaper = mySubjectExam.papers.find(p => p.paperNumber === paper.paperNumber);
                                                                            if (examPaper && examPaper.confirmed) {
                                                                                console.log("Processing confirmed paper:", examPaper);

                                                                                if (!studentMap.has(student.studentId.regNumber)) {
                                                                                    console.log("Processing student:", student.studentId.name);

                                                                                    // Fetch user data including profile picture
                                                                                    const user = await userModel.findOne({ regNumber: student.studentId.regNumber }).exec();
                                                                                    studentMap.set(student.studentId.regNumber, {
                                                                                        name: student.studentId.name,
                                                                                        regNumber: student.studentId.regNumber,
                                                                                        image: user ? user.profilePicture : '', // Get the profile picture URL
                                                                                        papers: [],
                                                                                        finalMark: 0,
                                                                                        testAvgMark: 0, // Placeholder for test average mark
                                                                                        assignmentAvgMark: 0, // Placeholder for assignment average mark
                                                                                        comment: mySubjectExam.TeacherComments,
                                                                                        behaviorGrade: behaviorGrade,
                                                                                        assessmentMark: assessmentMark,
                                                                                    });
                                                                                }

                                                                                const studentData = studentMap.get(student.studentId.regNumber);
                                                                                studentData.papers.push({
                                                                                    paperName: `Paper ${paper.paperNumber}`,
                                                                                    mark: examPaper.percentage || 0,
                                                                                    avgMark: 0, // Placeholder for average mark
                                                                                    highestMark: 0, // Placeholder for highest mark
                                                                                    lowestMark: 0, // Placeholder for lowest mark
                                                                                });
                                                                                console.log("Student data:", studentData);
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            } else {
                                                                console.log("No papers found for this subject.");
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

                                // Calculate average, highest, lowest marks and fetch additional data
                                const studentDataArray = Array.from(studentMap.values());

                                await Promise.all(studentDataArray.map(async (studentData) => {
                                    const papers = studentData.papers;
                                    if (papers.length > 0) {
                                        let totalMarks = 0;
                                        let highestMark = Number.NEGATIVE_INFINITY;
                                        let lowestMark = Number.POSITIVE_INFINITY;

                                        papers.forEach(paper => {
                                            totalMarks += paper.mark;
                                            highestMark = Math.max(highestMark, paper.mark);
                                            lowestMark = Math.min(lowestMark, paper.mark);
                                        });

                                        const avgMark = totalMarks / papers.length;
                                        papers.forEach(paper => {
                                            paper.avgMark = avgMark;
                                            paper.highestMark = highestMark;
                                            paper.lowestMark = lowestMark;
                                        });

                                        studentData.finalMark = avgMark; // Assuming final mark is the average mark
                                    }

                                    // Fetch SchoolClass data for year 2025
                                    const schoolClass = await SchoolClass.findOne({ className: examClass.className, 'years.year': myYear }).exec();
                                    console.log("SchoolClass:", schoolClass);

                                    if (schoolClass) {
                                        const year2025 = schoolClass.years.find(y => y.year === myYear);
                                        if (year2025) {
                                            const subjectFromClass = year2025.students.find(s => s.reg_number === studentData.regNumber)?.grades.find(g => g.grade === examClass.className)?.subjects.find(s => s.name === subject.name);
                                            if (subjectFromClass) {
                                                studentData.testAvgMark = subjectFromClass.testAverage || 0;
                                                studentData.assignmentAvgMark = subjectFromClass.assignmentAverage || 0;
                                            }
                                        }
                                    }
                                }));

                                // Add student data to subjectData
                                subjectData.students.push(...studentDataArray);

                                // Add subjectData to classData.subjects
                                if (subjectData.students.length > 0) {
                                    classData.subjects.push(subjectData);
                                }
                            }
                        }
                    }
                }
            }

            if (classData.subjects.length > 0) {
                responseData.push(classData);
                console.log("After pushing, Class data:", classData);
            }
        }

        console.log("Data processed successfully");

        // Return the success response
        return NextResponse.json(responseData, { status: 200 });
    } catch (error) {
        console.error("Error fetching exam data:", error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
