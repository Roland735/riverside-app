
import { studentModel } from "@/models/studentModel";
import { NextResponse } from "next/server";
import { connectDB } from "@/configs/dbConfig";
import Exam from "@/models/examModel";

connectDB();

export async function POST(req) {
    try {
        const body = await req.json();
        const { excelData, paperNumber, subjectName, grade, term, invigilator, paperAverages, examMarkAverage, examDate
        } = body;
        const period = term;

        // Initialize variables for calculations
        let totalMark = 0;
        let examMarks = [];
        let highestExamMark = 0;
        let lowestExamMark = 100;
        let highestExamStudent = "";
        let papersList = [];
        let allAnomalies = [];

        for (const paper in paperAverages) {
            const paperaverageMark = paperAverages[paper];
            let randomNum = Math.floor(Math.random() * 100);

            papersList.push({
                paper_id: `paper_${randomNum}_${paper}_${Date.now()}`,
                paper_number: paper,
                paper_mark: paperaverageMark,
                paper_percentage: paperaverageMark,
                absent: false,
            });

        }

        // Loop through the array of student data
        for (const studentData of excelData) {
            const { regNumber, examMark } = studentData;

            // Calculate total mark, highest mark, and lowest mark
            totalMark += examMark;
            examMarks.push(examMark);
            if (examMark > highestExamMark) {
                highestExamMark = examMark;
                highestExamStudent = regNumber;
            }
            if (examMark < lowestExamMark) {
                lowestExamMark = examMark;
            }

            // Prepare papers array
            let papersArray = [];
            let anomaliesList = []; // Initialize anomalies list for each student

            for (let i = 1; i <= paperNumber; i++) {
                let paperPercentage = (studentData[`paper${i}`] / studentData[`paper${i}Total`]) * 100;
                let paperthreshold = paperPercentage - paperAverages[`paper${i}`];

                if (paperthreshold > 30) {
                    anomaliesList.push({
                        student_id: studentData.regNumber,
                        mark: paperPercentage,
                        paperNumber: i,
                        type: "good",
                        deviation: paperthreshold
                    });
                }
                if (paperthreshold < -35) {
                    anomaliesList.push({
                        student_id: studentData.regNumber,
                        mark: paperPercentage,
                        paperNumber: i,
                        type: "bad",
                        deviation: paperthreshold
                    });
                }

                papersArray.push({
                    paper_id: `paper_${i}_${regNumber}_${Date.now()}`,
                    paper_number: i,
                    paper_mark: studentData[`paper${i}`],
                    paper_percentage: paperPercentage,
                    absent: false
                });
            }

            allAnomalies = allAnomalies.concat(anomaliesList); // Concatenate anomaliesList for each student

            // Create exam instance
            const exam = {
                exam_id: `exam_${regNumber}_${Date.now()}`,
                papers: papersArray,
                term: period,
                exam_mark: examMark,
                exam_percentage: examMark, // Assuming exam mark is the percentage
                exam_position: 1 // You can calculate this based on the exam marks of all students
            };

            // Find or create the student
            let student = await studentModel.findOne({ reg_number: regNumber });

            if (!student) {
                student = new studentModel({
                    reg_number: regNumber,
                    grade: grade
                });
            }

            // Update or create subject for the student
            let subjectFound = false;
            for (const subject of student.subjects) {
                if (subject.name === subjectName) {
                    subject.exams.push(exam);
                    subjectFound = true;
                    break;
                }
            }

            if (!subjectFound) {
                student.subjects.push({
                    name: subjectName,
                    exams: [exam]
                });
            }


            // Save the updated student
            await student.save();
        }
        console.log(allAnomalies)
        console.log(papersList)

        // Calculate median
        examMarks.sort((a, b) => a - b);
        const median = calculateMedian(examMarks);

        // Calculate average exam mark
        const averageExamMark = totalMark / excelData.length;

        // Calculate variance and standard deviation
        const variance = calculateVariance(examMarks, averageExamMark);
        const standardDeviation = Math.sqrt(variance);

        // Create exam instance
        const newExam = new Exam({
            exam_id: `exam_${Date.now()}`,
            highest_mark: highestExamMark,
            lowest_mark: lowestExamMark,
            highest_student: highestExamStudent,
            term: period,
            exam_date: examDate,
            subject: subjectName,
            class: grade,
            average_mark: averageExamMark,
            exam_median: median,
            exam_invigilator: invigilator, // Placeholder value, update as needed
            standard_deviation: standardDeviation,
            anomalies: allAnomalies, // Insert all anomalies
            papers: papersList,
            paperNumber: paperNumber
        });

        // Save the exam instance
        await newExam.save();

        return NextResponse.json({
            message: 'Exam data successfully uploaded',
            exam: newExam
        });
    } catch (error) {
        console.error('Error uploading exam data:', error);
        return NextResponse.json({
            error: 'Exam data could not be uploaded'
        }, { status: 500 });
    }
}

function calculateMedian(values) {
    const middle = Math.floor(values.length / 2);
    if (values.length % 2 === 0) {
        return (values[middle - 1] + values[middle]) / 2;
    } else {
        return values[middle];
    }
}

function calculateVariance(values, mean) {
    const squaredDifferences = values.map(value => Math.pow(value - mean, 2));
    const sumSquaredDifferences = squaredDifferences.reduce((acc, curr) => acc + curr, 0);
    return sumSquaredDifferences / values.length;
}
