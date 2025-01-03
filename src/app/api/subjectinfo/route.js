// Import necessary modules and functions
import { NextResponse } from "next/server";
import { connectDB } from "@/configs/dbConfig";
import { SchoolClass } from "@/models/GradeSyllabus";
import { userModel } from "@/models/userModel";

// Connect to MongoDB
connectDB(); // Assuming this connects to your MongoDB instance

// Function to format student data
const formatStudentData = (student) => {
    if (!student) {
        return { name: "N/A", score: 0, change: 0, grade: "N/A" };
    }
    return {
        name: student.name || "N/A",
        score: student.assignmentAverage || 0,
        change: student.changeAssignment || 0,
        grade: student.grade || "N/A"
    };
};

// Function to format area data
const formatAreaData = (topics, keyExtractor, valueExtractor) => {
    if (!Array.isArray(topics) || topics.length === 0) {
        return [];
    }
    return topics.map(topic => ({
        title: topic[keyExtractor],
        value: typeof valueExtractor === 'function' ? valueExtractor(topic) : topic[valueExtractor]
    }));
};

// Function to find and format scatter data based on subjectName, className, and year
const formatScatterData = async (subjectName, className, year, dataType) => {
    try {
        // Find the school class based on className
        const schoolClass = await SchoolClass.findOne({ className });

        // Handle case where class is not found
        if (!schoolClass) {
            throw new Error("Class not found");
        }

        // Find the year within the class
        const classYear = schoolClass.years.find(y => y.year === year);

        // Handle case where year is not found for the given class
        if (!classYear) {
            throw new Error("Year not found for the given class");
        }

        // Initialize an array to store scatter data
        let scatterData = [];

        // Iterate through each student in the year
        classYear.students.forEach(student => {
            // Find the grade that matches the className within each student's grades
            const grade = student.grades.find(g => g.grade === className);

            // If grade is found, find the subjectDetail within the grade's subjects
            if (grade) {
                const subjectDetail = grade.subjects.find(s => s.name === subjectName);

                // If subjectDetail is found, push appropriate data to scatterData
                if (subjectDetail) {
                    let score = 0;
                    let mark = 0;
                    switch (dataType) {
                        case 'assignment':
                            score = subjectDetail.assignmentAverage || 0;
                            break;
                        case 'test':
                            score = subjectDetail.testAverage || 0;
                            break;
                        case 'overall':
                            mark = (subjectDetail.testAverage + subjectDetail.assignmentAverage) / 2;
                            score = mark || 0;
                            break;
                        // Add more cases for other data types as needed
                        default:
                            score = 0;
                            break;
                    }
                    scatterData.push({
                        name: student.name || "N/A",
                        score: score
                    });
                }
            }
        });

        return scatterData;
    } catch (error) {
        throw new Error(`Error fetching scatter data: ${error.message}`);
    }
};

// Define your POST route function
export async function POST(req) {
    try {
        // Parse request body
        const { subjectName, className, year } = await req.json();

        // Validate required fields
        if (!subjectName || !className || !year) {
            return NextResponse.json({ message: "Subject name, class name, and year are required" }, { status: 400 });
        }

        // Find the school class based on className
        const schoolClass = await SchoolClass.findOne({ className });

        // Handle case where class is not found
        if (!schoolClass) {
            return NextResponse.json({ message: "Class not found" }, { status: 404 });
        }

        // Find the year within the class
        const classYear = schoolClass.years.find(y => y.year === year);

        // Handle case where year is not found for the given class
        if (!classYear) {
            return NextResponse.json({ message: "Year not found for the given class" }, { status: 404 });
        }

        // Find the subject within the year
        const subject = classYear.subjects.find(s => s.name === subjectName);

        // Fetch scatter data for assignmentData
        const scatterDataAssignment = await formatScatterData(subjectName, className, year, 'assignment');

        // Fetch scatter data for testData
        const scatterDataTest = await formatScatterData(subjectName, className, year, 'test');

        // Fetch scatter data for overallData (assuming average of assignment and test)
        const scatterDataOverall = await formatScatterData(subjectName, className, year, 'overall');

        // Fetch topics data from the subject
        const topics = subject.topicsTaught.map(topic => ({
            name: topic.title,
            progress: topic.completed ? "Completed" : "In Progress",
            status: topic.completed ? "Inactive" : "Active",
            averageAssignment: topic.assignmentAverage,
            averageTest: topic.testAverage,
            averageQuiz: (topic.assignmentAverage + topic.testAverage) / 2,
            id: topic.scheduleNumber,
        }));

        // Constructing assignmentData
        const assignmentData = {
            highestStudent: formatStudentData(subject.highestAssignmentMark),
            lowestStudent: formatStudentData(subject.lowestAssignmentMark),
            mostImprovedStudent: formatStudentData(subject.mostImprovedAssignmentStudent),
            mostUnimprovedStudent: formatStudentData(subject.leastImprovedAssignmentStudent),
            scatterData: scatterDataAssignment,
            areaData: formatAreaData(subject.topicsTaught, 'title', 'assignmentAverage')
        };

        // Constructing testData
        const testData = {
            highestStudent: formatStudentData(subject.highestTestMark),
            lowestStudent: formatStudentData(subject.lowestTestMark),
            mostImprovedStudent: formatStudentData(subject.mostImprovedTestStudent),
            mostUnimprovedStudent: formatStudentData(subject.leastImprovedTestStudent),
            scatterData: scatterDataTest,
            areaData: formatAreaData(subject.topicsTaught, 'title', 'testAverage')
        };
        console.log("subject", subject);
        const teachers = subject.currentTeachers;
        console.log(teachers);

        const teacherDataWithPics = await userModel.find({ role: "teacher" });
        const teacherData = teacherDataWithPics.map(teacher => {
            const teacherPic = teacher.profilePicture;
            return {
                name: `${teacher.firstname} ${teacher.lastname}`,
                pic: teacherPic,
            }
        })
        console.log(teacherData);
        let myArray = [];
        for (let i = 0; i < teachers.length; i++) {
            if (`${teachers[i].name}` === `${teacherData[i].name}`) {
                myArray.push(teacherData[i]);
            }
        }


        // Constructing overallData
        const overallData = {
            highestStudent: formatStudentData(subject.highestOverallMark),
            lowestStudent: formatStudentData(subject.lowestOverallMark),
            mostImprovedStudent: formatStudentData(subject.mostImprovedOverallStudent),
            mostUnimprovedStudent: formatStudentData(subject.leastImprovedOverallStudent),
            scatterData: scatterDataOverall,
            areaData: formatAreaData(subject.topicsTaught, 'title', (t) => (t.assignmentAverage + t.testAverage) / 2)
        };

        // Return response with data including topics
        return NextResponse.json({ assignmentData, testData, overallData, topics, teacherData: myArray }, { status: 200 });

    } catch (error) {
        // Handle any errors
        console.error('Error fetching subject data:', error);
        return NextResponse.json({ message: 'Error fetching subject data', error: error.message }, { status: 500 });
    }
}
