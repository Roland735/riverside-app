import React from "react";
import { FaExclamationTriangle, FaArrowUp, FaArrowDown, FaEquals } from "react-icons/fa";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import StudentAnalysis from "./StudentAnalysis";
import StudentTable from "./StudentTable";
import AssignmentCard from "./AssignmentCard";
import TestCard from "./TestCard";
import QuizCard from "./QuizCard";
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import Link from "next/link";

function getCambridgeGrade(mark) {


    if (mark >= 90) return "A+";
    if (mark >= 80) return "A";
    if (mark >= 70) return "B";
    if (mark >= 60) return "C";
    if (mark >= 50) return "C";
    if (mark >= 40) return "D";
    if (mark >= 30) return "E";
    if (mark >= 20) return "U";
    return "Ungraded";
}

const ClassAnalysis = ({ classData, studentData, category }) => {
    console.log(classData);

    const getRingColor = (mark) => {
        if (mark >= 80) return "#3B82F6"; // blue for high marks
        if (mark >= 50) return "#FBBF24"; // yellow for moderate marks
        return "#EF4444"; // red for low marks
    };

    const averageMark = classData.subjects
        .filter(sub => sub.mark > 0)
        .reduce((sum, sub) => sum + sub.mark, 0) /
        classData.subjects.filter(sub => sub.mark > 0).length;


    // Sample data for overall marks of subjects
    const overallMarksData = classData.subjects.map((subject) => ({
        subject: subject.subject,
        mark: subject.mark,
    }));

    // Sample data for assignment, test, quiz performance
    const performanceData = classData.subjects.map((subject) => ({
        subject: subject.subject,
        assignment: subject.assignment,
        test: subject.test,
        quiz: subject.quiz,
    }));

    // Sample student data with scores and change


    return (
        <div className="p-4 space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 gap-4 w-full">

            {/* Class Overview */}
            <div className="bg-slate-500 rounded-lg shadow-md p-6 flex flex-col items-center">
                <div className="mb-6 flex flex-col items-center">
                    <h2 className="text-2xl font-bold text-cyan-950 mb-4 text-center">
                        {classData.class}
                    </h2>
                    <CircularProgressbar
                        value={averageMark}
                        maxValue={100}
                        text={`${Math.round(averageMark)}%`}
                        styles={buildStyles({
                            pathColor: getRingColor(averageMark),
                            textColor: "white",
                            trailColor: "rgba(255, 255, 255, 0.2)",
                        })}
                    />
                </div>
                <div className="w-full flex flex-col space-y-3 text-lg text-white">
                    <div className="flex justify-between">
                        <span className="font-semibold">Cambridge Grade:</span>
                        <span>{getCambridgeGrade(averageMark)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold">Mark Change:</span>
                        {parseInt(classData.markChange) > 0 ? (
                            <span className="flex items-center text-green-500">
                                <FaArrowUp className="mr-1" />
                                {classData.markChange}
                            </span>
                        ) : parseInt(classData.markChange) < 0 ? (
                            <span className="flex items-center text-red-500">
                                <FaArrowDown className="mr-1" />
                                {classData.markChange}
                            </span>
                        ) : (
                            <span className="flex items-center text-gray-400">
                                <FaEquals className="mr-1" />
                                {classData.markChange}
                            </span>
                        )}
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold">Attendance:</span>
                        <span>{classData.attendance}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold">Teachers:</span>
                        <span>{classData.teachers.join(", ")}</span>
                    </div>
                </div>
            </div>


            {/* Subject Performance Chart */}
            <div className="bg-slate-300 dark:bg-slate-700 rounded-lg shadow-md p-4">
                <h2 className="text-xl font-bold mb-4 dark:text-slate-50 text-cyan-950">Subject Performance</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 ">
                        <thead className="bg-slate-600 ">
                            <tr className="">
                                <th className="px-6 py-3 text-left text-xs font-medium dark:text-slate-50 text-cyan-950 uppercase tracking-wider">
                                    Subject
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium dark:text-slate-50 text-cyan-950 uppercase tracking-wider">
                                    Mark
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium dark:text-slate-50 text-cyan-950 uppercase tracking-wider">
                                    Link
                                </th>
                            </tr>
                        </thead>
                        <tbody className=" divide-y divide-gray-200 dark:text-slate-50 text-cyan-950">
                            {classData.subjects.map((subject, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium">
                                            {subject.subject}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium">
                                            {subject.mark}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium">
                                            <Link href={`/dashboard/admin/classSubject/${subject.subject}/${classData.className}/2025`}>More Info</Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Line Chart for Assignment, Test, Quiz */}
            <div className="bg-slate-300 dark:bg-slate-700 rounded-lg shadow-md p-4">
                <h2 className="text-xl font-bold mb-4 text-slate-950 dark:text-slate-50">Performance Overview</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                        data={performanceData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="subject" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="assignment" stroke="#8884d8" name="Assignment" />
                        <Line type="monotone" dataKey="test" stroke="#82ca9d" name="Test" />
                        <Line type="monotone" dataKey="quiz" stroke="#ffc658" name="Quiz" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Area Chart for Overall Marks */}
            <div className="bg-slate-300 dark:bg-slate-700 rounded-lg shadow-md p-4">
                <h2 className="text-xl font-bold mb-4 dark:text-slate-50 text-cyan-950">Overall Marks</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                        data={overallMarksData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="subject" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="mark" stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Assignment Card */}
            <AssignmentCard
                averageMark={70} // Example average mark for assignment
                submissionRate={85} // Example submission rate for assignment
                change="+5" // Example change for assignment
            />

            {/* Test Card */}
            <TestCard
                averageMark={75} // Example average mark for test
                change="-3" // Example change for test
            />

            {/* Quiz Card */}
            <QuizCard
                averageMark={80} // Example average mark for quiz
                submissionRate={90} // Example submission rate for quiz
                change="+8" // Example change for quiz
            />

            {/* Additional Analysis */}
            <div className="lg:col-span-2">
                <StudentAnalysis category={category} />
            </div>

            {/* Student Table */}
            <div className="lg:col-span-2">
                <StudentTable students={studentData} />
            </div>
        </div>
    );
};

export default ClassAnalysis;
