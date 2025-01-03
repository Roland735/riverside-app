import React from "react";
import { FaChartLine, FaCheckCircle, FaRegChartBar, FaClipboardList } from 'react-icons/fa';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';

function TeacherHome() {
    const data = [
        { name: 'Week 1', attendance: 85, assignments: 90, quizzes: 78, tests: 82 },
        { name: 'Week 2', attendance: 87, assignments: 88, quizzes: 80, tests: 84 },
        { name: 'Week 3', attendance: 82, assignments: 85, quizzes: 76, tests: 80 },
        { name: 'Week 4', attendance: 88, assignments: 92, quizzes: 82, tests: 86 },
    ];
    return <div className="min-h-screen bg-gradient-to-tr from-slate-50 via-slate-100 to-gray-300 dark:bg-gradient-to-tr dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">

        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Teacher Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                    <FaChartLine className="text-3xl text-blue-500" />
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mt-4">Attendance Rate</h2>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="attendance" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                    <FaCheckCircle className="text-3xl text-green-500" />
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mt-4">Assignments Averages</h2>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="assignments" stroke="#82ca9d" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                    <FaRegChartBar className="text-3xl text-yellow-500" />
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mt-4">Quiz Averages</h2>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="quizzes" stroke="#ffc658" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                    <FaClipboardList className="text-3xl text-red-500" />
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mt-4">Test Averages</h2>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="tests" stroke="#ff7300" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    </div>;
}

export default TeacherHome;
