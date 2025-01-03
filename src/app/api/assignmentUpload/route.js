import { connectDB } from "@/configs/dbConfig";
import { studentModel } from "@/models/studentModel";
import { assignmentModel } from "@/models/documentData";
import { SchoolClass } from "@/models/GradeSyllabus";
import { NextResponse } from "next/server";

connectDB();

export async function POST(req) {
    try {
        const body = await req.json();
        const { excelData, subjectName, grade, term, assignDate, assignmentName } = body;

        const data = excelData;
        const period = term;

        let totalMarks = 0;
        let highestMark = -Infinity;
        let lowestMark = Infinity;
        let highestStudents = [];
        let lowestStudents = [];
        let marks = [];

        for (const studentData of data) {
            const { regNumber, assignmentMark } = studentData;

            let student = await studentModel.findOne({ reg_number: regNumber });

            if (!student) {
                student = new studentModel({
                    reg_number: regNumber,
                    name: studentData.name,
                    lastname: studentData.lastname,
                    grades: []
                });
            }

            const assignment = {
                assignment_id: `${regNumber}_${Date.now()}`,
                assignment_name: assignmentName,
                assignment_mark: assignmentMark,
                assigned_date: assignDate,
                assignment_position: 0,
                assignment_percentage: 0,
                highest: false,
                absent: false
            };

            let gradeFound = false;
            let subAv = 0
            for (const gradeObj of student.grades) {
                if (gradeObj.grade === grade) {
                    let subjectFound = false;
                    for (const subject of gradeObj.subjects) {
                        if (subject.name === subjectName) {
                            console.log("subject", subject.subjectAverage);
                            subject.assignments.push(assignment);
                            const totalAssignmentMarks = subject.assignments.reduce((sum, a) => sum + a.assignment_mark, 0);

                            subject.assignmentAverage = totalAssignmentMarks / subject.assignments.length;
                            console.log(subject.testAverage + subject.assignmentAverage);


                            subAv = (subject.assignmentAverage + subject.testAverage) / 2



                            subject.subjectAverage = subAv
                            subjectFound = true;

                            break;
                        }
                    }

                    if (!subjectFound) {

                        const newSubject = {
                            name: subjectName,
                            assignments: [assignment],
                            assignmentAverage: assignmentMark,
                            subjectAverage: assignmentMark
                        };
                        gradeObj.subjects.push(newSubject);
                    }
                    gradeFound = true;
                    break;
                }
            }

            if (!gradeFound) {
                student.grades.push({
                    grade: grade,
                    subjects: [{
                        name: subjectName,
                        assignments: [assignment],
                        assignmentAverage: assignmentMark,
                        subjectAverage: assignmentMark
                    }]
                });
            }

            await student.save();
            console.log("here is student", student.grades[0].subjects[0]);

            totalMarks += assignmentMark;
            marks.push(assignmentMark);

            if (assignmentMark > highestMark) {
                highestMark = assignmentMark;
                highestStudents = [regNumber];
            } else if (assignmentMark === highestMark) {
                highestStudents.push(regNumber);
            }

            if (assignmentMark < lowestMark) {
                lowestMark = assignmentMark;
                lowestStudents = [regNumber];
            } else if (assignmentMark === lowestMark) {
                lowestStudents.push(regNumber);
            }

            const schoolClass = await SchoolClass.findOne({ className: grade, 'years.year': 2025 });
            if (schoolClass) {
                for (const year of schoolClass.years) {
                    if (year.year === 2025) {
                        for (const subject of year.subjects) {
                            if (subject.name === subjectName) {
                                let studentFound = false;
                                for (const studentDetail of year.students) {
                                    if (studentDetail.reg_number === regNumber) {
                                        studentFound = true;
                                        let studentGradeFound = false;
                                        for (const studentGrade of studentDetail.grades) {
                                            if (studentGrade.grade === grade) {
                                                let subjectFound = false;
                                                for (const studentSubject of studentGrade.subjects) {
                                                    if (studentSubject.name === subjectName) {
                                                        studentSubject.assignments.push(assignment);
                                                        const totalAssignmentMarks = studentSubject.assignments.reduce((sum, a) => sum + a.assignment_mark, 0);
                                                        studentSubject.assignmentAverage = totalAssignmentMarks / studentSubject.assignments.length;
                                                        subjectFound = true;
                                                        break;
                                                    }
                                                }
                                                if (!subjectFound) {
                                                    studentGrade.subjects.push({
                                                        name: subjectName,
                                                        assignments: [assignment],
                                                        assignmentAverage: assignmentMark
                                                    });
                                                }
                                                studentGradeFound = true;
                                                break;
                                            }
                                        }
                                        if (!studentGradeFound) {
                                            studentDetail.grades.push({
                                                grade: grade,
                                                subjects: [{
                                                    name: subjectName,
                                                    assignments: [assignment],
                                                    assignmentAverage: assignmentMark
                                                }]
                                            });
                                        }
                                        break;
                                    }
                                }
                                if (!studentFound) {
                                    year.students.push({
                                        reg_number: regNumber,
                                        name: studentData.name,
                                        lastname: studentData.lastname,
                                        grades: [{
                                            grade: grade,
                                            subjects: [{
                                                name: subjectName,
                                                assignments: [assignment],
                                                assignmentAverage: assignmentMark
                                            }]
                                        }]
                                    });
                                }
                            }
                        }
                    }
                }
                await schoolClass.save();
            }
        }

        const meanMark = totalMarks / data.length;

        marks.sort((a, b) => a - b);
        const middleIndex = Math.floor(marks.length / 2);
        const medianMark = (marks.length % 2 === 0) ? (marks[middleIndex - 1] + marks[middleIndex]) / 2 : marks[middleIndex];

        const range = highestMark - lowestMark;

        const variance = marks.reduce((sum, mark) => sum + Math.pow(mark - meanMark, 2), 0) / marks.length;
        const standardDeviation = Math.sqrt(variance);

        const sortedMarks = [...marks].sort((a, b) => b - a);
        const positions = marks.map(mark => sortedMarks.indexOf(mark) + 1);

        for (const studentData of data) {
            const { regNumber, assignmentMark } = studentData;

            let student = await studentModel.findOne({ reg_number: regNumber });

            if (student) {
                for (const gradeObj of student.grades) {
                    if (gradeObj.grade === grade) {
                        for (const subject of gradeObj.subjects) {
                            if (subject.name === subjectName) {
                                for (const assignment of subject.assignments) {
                                    if (assignment.assignment_mark === assignmentMark && assignment.assignment_name === assignmentName) {
                                        assignment.assignment_position = positions[marks.indexOf(assignmentMark)];
                                        assignment.assignment_percentage = (assignmentMark / highestMark) * 100;
                                        assignment.highest = assignmentMark === highestMark;
                                    }
                                }
                                break;
                            }
                        }
                        break;
                    }
                }
                await student.save();
            }
        }

        const assignmentInstance = new assignmentModel({
            assignment_id: `_${Date.now()}`,
            assignmentName: assignmentName,
            assignment_average_percentage: meanMark,
            assigned_date: assignDate,
            absents: 0,
            median: medianMark,
            range: range,
            highest_percentage: highestMark,
            highest_students: highestStudents,
            lowest_percentage: lowestMark,
            lowest_students: lowestStudents,
            standard_deviation: standardDeviation,
            term: period,
            grade_class: grade,
            subject: subjectName,
            total_assignments: data.length,
            anomalies: [],
            assigned_by: "",
        });

        await assignmentInstance.save();

        const schoolClass = await SchoolClass.findOne({ className: grade, 'years.year': 2025 });

        if (schoolClass) {
            for (const year of schoolClass.years) {
                if (year.year === 2025) {
                    for (const subject of year.subjects) {
                        if (subject.name === subjectName) {

                            subject.assignmentAverageMark = meanMark;

                            subject.highestAssignmentMark = highestStudents.map(regNumber => ({
                                reg_number: regNumber,
                                name: data.find(student => student.regNumber === regNumber).name
                            }));
                            subject.lowestAssignmentMark = lowestStudents.map(regNumber => ({
                                reg_number: regNumber,
                                name: data.find(student => student.regNumber === regNumber).name
                            }));

                            for (const topic of subject.topicsTaught) {
                                if (topic.title === assignmentName) {
                                    if (!topic.completed) {
                                        topic.assignmentAverage = meanMark;
                                        if (topic.assignmentAverage > 0 && topic.testAverage > 0) {
                                            topic.completed = true;
                                        }
                                    }
                                    break;
                                }
                            }

                            subject.OveralAverageMark = calculateOverallAverage(subject, 'assignmentAverage', 'testAverage', 'quizAverage');
                            subject.highestOveralMark = calculateHighestOverall(subject, 'assignmentAverage', 'testAverage', 'quizAverage');
                            subject.lowestOveralMark = calculateLowestOverall(subject, 'assignmentAverage', 'testAverage', 'quizAverage');
                            subject.mostImprovedAssignmentStudent = calculateMostImproved(subject.assignments);
                            subject.mostImprovedOveralStudent = calculateMostImprovedOverall(subject.grades);
                            subject.leastImprovedAssignmentStudent = calculateLeastImproved(subject.assignments);
                            subject.leastImprovedOveralStudent = calculateLeastImprovedOverall(subject.grades);

                            break;
                        }
                    }
                }
            }
            await schoolClass.save();
        }

        return NextResponse.json({
            message: 'Assignment data added successfully',
            meanMark: meanMark,
            medianMark: medianMark,
            range: range,
            standardDeviation: standardDeviation
        }, { status: 200 });
    } catch (error) {
        console.error('Error adding assignment data:', error);
        return NextResponse.json({
            message: 'Error adding assignment data',
            error: error.message,
        }, { status: 500 });
    }
}

function calculateOverallAverage(subject, ...averageFields) {
    const total = averageFields.reduce((sum, field) => sum + (subject[field] || 0), 0);
    return total / averageFields.length;
}

function calculateHighestOverall(subject, ...averageFields) {
    const students = [];
    averageFields.forEach(field => {
        if (Array.isArray(subject[field]) && subject[field].length > 0) {
            const maxField = Math.max(...subject[field].map(student => student.assignment_mark));
            students.push(subject[field].find(student => student.assignment_mark === maxField));
        }
    });
    return students;
}

function calculateLowestOverall(subject, ...averageFields) {
    const students = [];
    averageFields.forEach(field => {
        if (Array.isArray(subject[field]) && subject[field].length > 0) {
            const minField = Math.min(...subject[field].map(student => student.assignment_mark));
            students.push(subject[field].find(student => student.assignment_mark === minField));
        }
    });
    return students;
}

function calculateMostImproved(assignments) {
    let mostImprovedStudent = null;
    let maxImprovement = -Infinity;

    if (Array.isArray(assignments) && assignments.length > 0) {
        assignments.forEach(assignment => {
            const improvement = assignment.assignmentAverage - assignment.changeAssignment;
            if (improvement > maxImprovement) {
                maxImprovement = improvement;
                mostImprovedStudent = assignment;
            }
        });
    }

    return mostImprovedStudent;
}

function calculateMostImprovedOverall(grades) {
    let mostImprovedStudent = null;
    let maxImprovement = -Infinity;

    if (Array.isArray(grades) && grades.length > 0) {
        grades.forEach(grade => {
            if (Array.isArray(grade.subjects) && grade.subjects.length > 0) {
                grade.subjects.forEach(subject => {
                    const improvement = subject.subjectAverage - subject.changeAssignment;
                    if (improvement > maxImprovement) {
                        maxImprovement = improvement;
                        mostImprovedStudent = subject;
                    }
                });
            }
        });
    }

    return mostImprovedStudent;
}

function calculateLeastImproved(assignments) {
    let leastImprovedStudent = null;
    let maxDecline = Infinity;

    if (Array.isArray(assignments) && assignments.length > 0) {
        assignments.forEach(assignment => {
            const improvement = assignment.assignmentAverage - assignment.changeAssignment;
            if (improvement < maxDecline) {
                maxDecline = improvement;
                leastImprovedStudent = assignment;
            }
        });
    }

    return leastImprovedStudent;
}

function calculateLeastImprovedOverall(grades) {
    let leastImprovedStudent = null;
    let maxDecline = Infinity;

    if (Array.isArray(grades) && grades.length > 0) {
        grades.forEach(grade => {
            if (Array.isArray(grade.subjects) && grade.subjects.length > 0) {
                grade.subjects.forEach(subject => {
                    const improvement = subject.subjectAverage - subject.changeAssignment;
                    if (improvement < maxDecline) {
                        maxDecline = improvement;
                        leastImprovedStudent = subject;
                    }
                });
            }
        });
    }

    return leastImprovedStudent;
}
