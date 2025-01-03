import { connectDB } from "@/configs/dbConfig";
import { studentModel } from "@/models/studentModel";
import { testModel } from "@/models/documentData";
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
            const { regNumber, testMark } = studentData;

            let student = await studentModel.findOne({ reg_number: regNumber });

            if (!student) {
                student = new studentModel({
                    reg_number: regNumber,
                    name: studentData.name,
                    lastname: studentData.lastname,
                    grades: []
                });
            }

            const test = {
                test_id: `${regNumber}_${Date.now()}`,
                test_name: assignmentName,
                test_mark: testMark,
                assigned_date: assignDate,
                test_position: 0,
                test_percentage: 0,
                highest: false,
                absent: false
            };

            let gradeFound = false;
            for (const gradeObj of student.grades) {
                if (gradeObj.grade === grade) {
                    let subjectFound = false;
                    for (const subject of gradeObj.subjects) {
                        if (subject.name === subjectName) {
                            subject.tests.push(test);
                            const totalTestMarks = subject.tests.reduce((sum, t) => sum + t.test_mark, 0);
                            subject.testAverage = totalTestMarks / subject.tests.length;
                            subjectFound = true;
                            break;
                        }
                    }
                    if (!subjectFound) {
                        const newSubject = {
                            name: subjectName,
                            tests: [test],
                            testAverage: testMark
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
                        tests: [test],
                        testAverage: testMark
                    }]
                });
            }

            await student.save();

            totalMarks += testMark;
            marks.push(testMark);

            if (testMark > highestMark) {
                highestMark = testMark;
                highestStudents = [regNumber];
            } else if (testMark === highestMark) {
                highestStudents.push(regNumber);
            }

            if (testMark < lowestMark) {
                lowestMark = testMark;
                lowestStudents = [regNumber];
            } else if (testMark === lowestMark) {
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
                                                        studentSubject.tests.push(test);
                                                        const totalTestMarks = studentSubject.tests.reduce((sum, t) => sum + t.test_mark, 0);
                                                        studentSubject.testAverage = totalTestMarks / studentSubject.tests.length;
                                                        subjectFound = true;
                                                        // calculate change test mark
                                                        let myTestMark = 0;
                                                        let previousDate = new Date(1900, 1, 2); // February 2, 1900 (Month is 0-indexed, so 1 = February)

                                                        for (const studentTest of studentSubject.tests) {
                                                            if (studentTest.assigned_date > previousDate) {
                                                                myTestMark = studentTest.test_mark;
                                                                previousDate = studentTest.assigned_date;
                                                            }
                                                        }
                                                        console.log(test);

                                                        studentSubject.changeTest = test.test_mark - myTestMark;

                                                        break;
                                                    }


                                                }
                                                if (!subjectFound) {
                                                    studentGrade.subjects.push({
                                                        name: subjectName,
                                                        tests: [test],
                                                        testAverage: testMark
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
                                                    tests: [test],
                                                    testAverage: testMark
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
                                                tests: [test],
                                                testAverage: testMark
                                            }]
                                        }]
                                    });
                                }
                                // change in test mark 


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
            const { regNumber, testMark } = studentData;

            let student = await studentModel.findOne({ reg_number: regNumber });

            if (student) {
                for (const gradeObj of student.grades) {
                    if (gradeObj.grade === grade) {
                        for (const subject of gradeObj.subjects) {
                            if (subject.name === subjectName) {
                                for (const test of subject.tests) {
                                    if (test.test_mark === testMark && test.test_name === assignmentName) {
                                        test.test_position = positions[marks.indexOf(testMark)];
                                        test.test_percentage = (testMark / highestMark) * 100;
                                        test.highest = testMark === highestMark;
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

        const testInstance = new testModel({
            test_id: `_${Date.now()}`,
            testName: assignmentName,
            test_average_percentage: meanMark,
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
            total_tests: data.length,
            anomalies: [],
            assigned_by: "",
        });

        await testInstance.save();

        const schoolClass = await SchoolClass.findOne({ className: grade, 'years.year': 2025 });

        // most improved





        if (schoolClass) {
            for (const year of schoolClass.years) {
                if (year.year === 2025) {
                    for (const subject of year.subjects) {
                        if (subject.name === subjectName) {

                            subject.testaverageMark = meanMark;


                            let highestchangeStudent = '';
                            let highestchange = Number.NEGATIVE_INFINITY; // Start with the lowest possible value

                            let lowestChangestudent = '';
                            let lowestChange = Number.POSITIVE_INFINITY; // Start with the highest possible value

                            let myHighest = [];
                            let myLowest = [];

                            year.students.forEach(student => {
                                student.grades.forEach(myGrade => {
                                    if (myGrade.grade === grade) {
                                        myGrade.subjects.forEach(subject => {
                                            if (subject.name === subjectName) {
                                                if (subject.changeTest > highestchange) {
                                                    highestchange = subject.changeTest;
                                                    highestchangeStudent = student.reg_number;
                                                }
                                                if (subject.changeTest < lowestChange) {
                                                    lowestChange = subject.changeTest;
                                                    lowestChangestudent = student.reg_number;
                                                }
                                            }
                                        });
                                    }
                                });
                            });

                            // Check if the student registration numbers were correctly assigned
                            if (highestchangeStudent && lowestChangestudent) {
                                // Add the highest change student
                                myHighest.push({ regNumber: highestchangeStudent, change: highestchange });
                                console.log(myHighest);


                                // Add the lowest change student
                                myLowest.push({ regNumber: lowestChangestudent, change: lowestChange });
                                console.log(myLowest);
                                console.log(subject.mostImprovedTestStudent);



                                // Push the data into the arrays
                                subject.mostImprovedTestStudent = myHighest;
                                subject.leastImprovedTestStudent = myLowest;
                            } else {
                                console.error("No valid students found for most/least improved calculations");
                            }



                            subject.highestTestMark = highestStudents.map(regNumber => ({
                                reg_number: regNumber,
                                name: data.find(student => student.regNumber === regNumber).name
                            }));
                            subject.lowestTestMark = lowestStudents.map(regNumber => ({
                                reg_number: regNumber,
                                name: data.find(student => student.regNumber === regNumber).name
                            }));

                            for (const topic of subject.topicsTaught) {
                                if (topic.title === assignmentName) {
                                    if (!topic.completed) {
                                        topic.testAverage = meanMark;
                                        if (topic.testAverage > 0 && topic.assignmentAverage > 0) {
                                            topic.completed = true;
                                        }
                                    }
                                    break;
                                }
                            }
                            console.log("test", subject);



                            subject.OveralAverageMark = calculateOverallAverage(subject, 'assignmentAverage', 'testAverage', 'quizAverage');
                            subject.highestOveralMark = calculateHighestOverall(subject, 'assignmentAverage', 'testAverage', 'quizAverage');
                            subject.lowestOveralMark = calculateLowestOverall(subject, 'assignmentAverage', 'testAverage', 'quizAverage');
                            subject.mostImprovedTestStudent = calculateMostImproved(subject.tests);
                            subject.mostImprovedOveralStudent = calculateMostImprovedOverall(subject.grades);
                            subject.leastImprovedTestStudent = calculateLeastImproved(subject.tests);
                            subject.leastImprovedOveralStudent = calculateLeastImprovedOverall(subject.grades);

                            break;
                        }
                    }
                }
            }
            await schoolClass.save();
        }

        return NextResponse.json({
            message: 'Test data added successfully',
            meanMark: meanMark,
            medianMark: medianMark,
            range: range,
            standardDeviation: standardDeviation
        }, { status: 200 });
    } catch (error) {
        console.error('Error adding test data:', error);
        return NextResponse.json({
            message: 'Error adding test data',
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
            const maxField = Math.max(...subject[field].map(student => student.test_mark || student.assignment_mark));
            students.push(subject[field].find(student => (student.test_mark || student.assignment_mark) === maxField));
        }
    });
    return students;
}

function calculateLowestOverall(subject, ...averageFields) {
    const students = [];
    averageFields.forEach(field => {
        if (Array.isArray(subject[field]) && subject[field].length > 0) {
            const minField = Math.min(...subject[field].map(student => student.test_mark || student.assignment_mark));
            students.push(subject[field].find(student => (student.test_mark || student.assignment_mark) === minField));
        }
    });
    return students;
}

function calculateMostImproved(tests) {
    console.log(tests);

    let mostImprovedStudent = null;
    let maxImprovement = -Infinity;

    if (Array.isArray(tests) && tests.length > 0) {
        tests.forEach(test => {
            const improvement = test.testAverage - test.changeTest;
            if (improvement > maxImprovement) {
                maxImprovement = improvement;
                mostImprovedStudent = test;
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
                    const improvement = subject.subjectAverage - subject.changeTest;
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

function calculateLeastImproved(tests) {
    let leastImprovedStudent = null;
    let maxDecline = Infinity;

    if (Array.isArray(tests) && tests.length > 0) {
        tests.forEach(test => {
            const improvement = test.testAverage - test.changeTest;
            if (improvement < maxDecline) {
                maxDecline = improvement;
                leastImprovedStudent = test;
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
                    const improvement = subject.subjectAverage - subject.changeTest;
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
