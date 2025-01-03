// import { connectDB } from "@/configs/dbConfig";
// import { studentModel } from "@/models/studentModel";
// import { quizModel } from "@/models/examModel"; // Assuming you have a model named quizModel for quizzes
// import { SchoolClass } from "@/models/GradeSyllabus";
// import { NextResponse } from "next/server";

// connectDB();

// export async function POST(req) {
//     try {
//         const body = await req.json();
//         const { excelData, subjectName, grade, term, assignDate, quizName } = body;

//         const data = excelData;
//         const period = term;

//         let totalMarks = 0;
//         let highestMark = -Infinity;
//         let lowestMark = Infinity;
//         let highestStudents = [];
//         let lowestStudents = [];
//         let marks = [];

//         for (const studentData of data) {
//             const { regNumber, quizMark } = studentData;

//             let student = await studentModel.findOne({ reg_number: regNumber });

//             if (!student) {
//                 student = new studentModel({
//                     reg_number: regNumber,
//                     name: studentData.name,
//                     lastname: studentData.lastname,
//                     grades: []
//                 });
//             }

//             const quiz = {
//                 quiz_id: `${regNumber}_${Date.now()}`,
//                 quiz_name: quizName,
//                 quiz_mark: quizMark,
//                 assigned_date: assignDate,
//                 quiz_position: 0,
//                 quiz_percentage: 0,
//                 highest: false,
//                 absent: false
//             };

//             let gradeFound = false;
//             for (const gradeObj of student.grades) {
//                 if (gradeObj.grade === grade) {
//                     let subjectFound = false;
//                     for (const subject of gradeObj.subjects) {
//                         if (subject.name === subjectName) {
//                             subject.quizzes.push(quiz);
//                             const totalQuizMarks = subject.quizzes.reduce((sum, q) => sum + q.quiz_mark, 0);
//                             subject.quizAverage = totalQuizMarks / subject.quizzes.length;
//                             subjectFound = true;
//                             break;
//                         }
//                     }
//                     if (!subjectFound) {
//                         const newSubject = {
//                             name: subjectName,
//                             quizzes: [quiz],
//                             quizAverage: quizMark
//                         };
//                         gradeObj.subjects.push(newSubject);
//                     }
//                     gradeFound = true;
//                     break;
//                 }
//             }

//             if (!gradeFound) {
//                 student.grades.push({
//                     grade: grade,
//                     subjects: [{
//                         name: subjectName,
//                         quizzes: [quiz],
//                         quizAverage: quizMark
//                     }]
//                 });
//             }

//             await student.save();

//             totalMarks += quizMark;
//             marks.push(quizMark);

//             if (quizMark > highestMark) {
//                 highestMark = quizMark;
//                 highestStudents = [regNumber];
//             } else if (quizMark === highestMark) {
//                 highestStudents.push(regNumber);
//             }

//             if (quizMark < lowestMark) {
//                 lowestMark = quizMark;
//                 lowestStudents = [regNumber];
//             } else if (quizMark === lowestMark) {
//                 lowestStudents.push(regNumber);
//             }

//             const schoolClass = await SchoolClass.findOne({ className: grade, 'years.year': 2025 });
//             if (schoolClass) {
//                 for (const year of schoolClass.years) {
//                     if (year.year === 2025) {
//                         for (const subject of year.subjects) {
//                             if (subject.name === subjectName) {
//                                 let studentFound = false;
//                                 for (const studentDetail of year.students) {
//                                     if (studentDetail.reg_number === regNumber) {
//                                         studentFound = true;
//                                         let studentGradeFound = false;
//                                         for (const studentGrade of studentDetail.grades) {
//                                             if (studentGrade.grade === grade) {
//                                                 let subjectFound = false;
//                                                 for (const studentSubject of studentGrade.subjects) {
//                                                     if (studentSubject.name === subjectName) {
//                                                         studentSubject.quizzes.push(quiz);
//                                                         const totalQuizMarks = studentSubject.quizzes.reduce((sum, q) => sum + q.quiz_mark, 0);
//                                                         studentSubject.quizAverage = totalQuizMarks / studentSubject.quizzes.length;
//                                                         subjectFound = true;
//                                                         break;
//                                                     }
//                                                 }
//                                                 if (!subjectFound) {
//                                                     studentGrade.subjects.push({
//                                                         name: subjectName,
//                                                         quizzes: [quiz],
//                                                         quizAverage: quizMark
//                                                     });
//                                                 }
//                                                 studentGradeFound = true;
//                                                 break;
//                                             }
//                                         }
//                                         if (!studentGradeFound) {
//                                             studentDetail.grades.push({
//                                                 grade: grade,
//                                                 subjects: [{
//                                                     name: subjectName,
//                                                     quizzes: [quiz],
//                                                     quizAverage: quizMark
//                                                 }]
//                                             });
//                                         }
//                                         break;
//                                     }
//                                 }
//                                 if (!studentFound) {
//                                     year.students.push({
//                                         reg_number: regNumber,
//                                         name: studentData.name,
//                                         lastname: studentData.lastname,
//                                         grades: [{
//                                             grade: grade,
//                                             subjects: [{
//                                                 name: subjectName,
//                                                 quizzes: [quiz],
//                                                 quizAverage: quizMark
//                                             }]
//                                         }]
//                                     });
//                                 }
//                             }
//                         }
//                     }
//                 }
//                 await schoolClass.save();
//             }
//         }

//         const meanMark = totalMarks / data.length;

//         marks.sort((a, b) => a - b);
//         const middleIndex = Math.floor(marks.length / 2);
//         const medianMark = (marks.length % 2 === 0) ? (marks[middleIndex - 1] + marks[middleIndex]) / 2 : marks[middleIndex];

//         const range = highestMark - lowestMark;

//         const variance = marks.reduce((sum, mark) => sum + Math.pow(mark - meanMark, 2), 0) / marks.length;
//         const standardDeviation = Math.sqrt(variance);

//         const sortedMarks = [...marks].sort((a, b) => b - a);
//         const positions = marks.map(mark => sortedMarks.indexOf(mark) + 1);

//         for (const studentData of data) {
//             const { regNumber, quizMark } = studentData;

//             let student = await studentModel.findOne({ reg_number: regNumber });

//             if (student) {
//                 for (const gradeObj of student.grades) {
//                     if (gradeObj.grade === grade) {
//                         for (const subject of gradeObj.subjects) {
//                             if (subject.name === subjectName) {
//                                 for (const quiz of subject.quizzes) {
//                                     if (quiz.quiz_mark === quizMark && quiz.quiz_name === quizName) {
//                                         quiz.quiz_position = positions[marks.indexOf(quizMark)];
//                                         quiz.quiz_percentage = (quizMark / highestMark) * 100;
//                                         quiz.highest = quizMark === highestMark;
//                                     }
//                                 }
//                                 break;
//                             }
//                         }
//                         break;
//                     }
//                 }
//                 await student.save();
//             }
//         }

//         const quizInstance = new quizModel({
//             quiz_id: `_${Date.now()}`,
//             quizName: quizName,
//             quiz_average_percentage: meanMark,
//             assigned_date: assignDate,
//             absents: 0,
//             median: medianMark,
//             range: range,
//             highest_percentage: highestMark,
//             highest_students: highestStudents,
//             lowest_percentage: lowestMark,
//             lowest_students: lowestStudents,
//             standard_deviation: standardDeviation,
//             term: period,
//             grade_class: grade,
//             subject: subjectName,
//             total_quizzes: data.length,
//             anomalies: [],
//             assigned_by: "",
//         });

//         await quizInstance.save();

//         const schoolClass = await SchoolClass.findOne({ className: grade, 'years.year': 2025 });

//         if (schoolClass) {
//             for (const year of schoolClass.years) {
//                 if (year.year === 2025) {
//                     for (const subject of year.subjects) {
//                         if (subject.name === subjectName) {

//                             subject.quizAverageMark = meanMark;

//                             subject.highestQuizMark = highestStudents.map(regNumber => ({
//                                 reg_number: regNumber,
//                                 name: data.find(student => student.regNumber === regNumber).name
//                             }));
//                             subject.lowestQuizMark = lowestStudents.map(regNumber => ({
//                                 reg_number: regNumber,
//                                 name: data.find(student => student.regNumber === regNumber).name
//                             }));

//                             for (const topic of subject.topicsTaught) {
//                                 if (topic.title === quizName) {
//                                     if (!topic.completed) {
//                                         topic.quizAverage = meanMark;
//                                         if (topic.assignmentAverage > 0 && topic.testAverage > 0 && topic.quizAverage > 0) {
//                                             topic.completed = true;
//                                         }
//                                     }
//                                     break;
//                                 }
//                             }

//                             subject.OveralAverageMark = calculateOverallAverage(subject, 'assignmentAverage', 'testAverage', 'quizAverage');
//                             subject.highestOveralMark = calculateHighestOverall(subject, 'assignmentAverage', 'testAverage', 'quizAverage');
//                             subject.lowestOveralMark = calculateLowestOverall(subject, 'assignmentAverage', 'testAverage', 'quizAverage');
//                             subject.mostImprovedQuizStudent = calculateMostImproved(subject.quizzes);
//                             subject.mostImprovedOveralStudent = calculateMostImprovedOverall(subject.grades);
//                             subject.leastImprovedQuizStudent = calculateLeastImproved(subject.quizzes);
//                             subject.leastImprovedOveralStudent = calculateLeastImprovedOverall(subject.grades);

//                             break;
//                         }
//                     }
//                 }
//             }
//             await schoolClass.save();
//         }

//         return NextResponse.json({
//             message: 'Quiz data added successfully',
//             meanMark: meanMark,
//             medianMark: medianMark,
//             range: range,
//             standardDeviation: standardDeviation
//         }, { status: 200 });
//     } catch (error) {
//         console.error('Error adding quiz data:', error);
//         return NextResponse.json({
//             message: 'Error adding quiz data',
//             error: error.message,
//         }, { status: 500 });
//     }
// }

// function calculateOverallAverage(subject, ...averageFields) {
//     const total = averageFields.reduce((sum, field) => sum + (subject[field] || 0), 0);
//     return total / averageFields.length;
// }

// function calculateHighestOverall(subject, ...averageFields) {
//     const students = [];
//     averageFields.forEach(field => {
//         if (Array.isArray(subject[field]) && subject[field].length > 0) {
//             const maxField = Math.max(...subject[field].map(student => student.quiz_mark));
//             students.push(subject[field].find(student => student.quiz_mark === maxField));
//         }
//     });
//     return students;
// }

// function calculateLowestOverall(subject, ...averageFields) {
//     const students = [];
//     averageFields.forEach(field => {
//         if (Array.isArray(subject[field]) && subject[field].length > 0) {
//             const minField = Math.min(...subject[field].map(student => student.quiz_mark));
//             students.push(subject[field].find(student => student.quiz_mark === minField));
//         }
//     });
//     return students;
// }

// function calculateMostImproved(quizzes) {
//     let mostImprovedStudent = null;
//     let maxImprovement = -Infinity;

//     if (Array.isArray(quizzes) && quizzes.length > 0) {
//         quizzes.forEach(quiz => {
//             const improvement = quiz.quizAverage - quiz.changeQuiz;
//             if (improvement > maxImprovement) {
//                 maxImprovement = improvement;
//                 mostImprovedStudent = quiz;
//             }
//         });
//     }

//     return mostImprovedStudent;
// }

// function calculateMostImprovedOverall(grades) {
//     let mostImprovedStudent = null;
//     let maxImprovement = -Infinity;

//     if (Array.isArray(grades) && grades.length > 0) {
//         grades.forEach(grade => {
//             if (Array.isArray(grade.subjects) && grade.subjects.length > 0) {
//                 grade.subjects.forEach(subject => {
//                     const improvement = subject.subjectAverage - subject.changeQuiz;
//                     if (improvement > maxImprovement) {
//                         maxImprovement = improvement;
//                         mostImprovedStudent = subject;
//                     }
//                 });
//             }
//         });
//     }

//     return mostImprovedStudent;
// }

// function calculateLeastImproved(quizzes) {
//     let leastImprovedStudent = null;
//     let maxDecline = Infinity;

//     if (Array.isArray(quizzes) && quizzes.length > 0) {
//         quizzes.forEach(quiz => {
//             const improvement = quiz.quizAverage - quiz.changeQuiz;
//             if (improvement < maxDecline) {
//                 maxDecline = improvement;
//                 leastImprovedStudent = quiz;
//             }
//         });
//     }

//     return leastImprovedStudent;
// }

// function calculateLeastImprovedOverall(grades) {
//     let leastImprovedStudent = null;
//     let maxDecline = Infinity;

//     if (Array.isArray(grades) && grades.length > 0) {
//         grades.forEach(grade => {
//             if (Array.isArray(grade.subjects) && grade.subjects.length > 0) {
//                 grade.subjects.forEach(subject => {
//                     const improvement = subject.subjectAverage - subject.changeQuiz;
//                     if (improvement < maxDecline) {
//                         maxDecline = improvement;
//                         leastImprovedStudent = subject;
//                     }
//                 });
//             }
//         });
//     }

//     return leastImprovedStudent;
// }

