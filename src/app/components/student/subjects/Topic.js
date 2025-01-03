import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const MockTopicData = {
    id: 1,
    title: "Mathematics",
    performance: {
        overallScore: 85,
        assignments: [
            { id: 1, title: "Assignment 1", score: 90 },
            { id: 2, title: "Assignment 2", score: 80 },
        ],
        quizzes: [
            { id: 1, title: "Quiz 1", score: 85, date: "2024-06-01" },
            { id: 2, title: "Quiz 2", score: 88, date: "2024-06-08" },
        ],
        tests: [
            { id: 1, title: "Test 1", score: 85, date: "2024-06-01" },
            { id: 2, title: "Test 2", score: 88, date: "2024-06-08" },
        ],
    },
    teacherFeedback: [
        { id: 1, teacher: "Ms. Smith", feedback: "Great job on Assignment 1!" },
        { id: 2, teacher: "Mr. Johnson", feedback: "Keep up the good work!" },
    ],
};

const TopicPerformancePage = () => {
    const { overallScore, assignments, quizzes, tests } = MockTopicData.performance;

    return (
        <div className="container mx-auto mt-8 dark:bg-slate-700 p-3">
            <h1 className="text-3xl font-semibold mb-4 text-cyan-950 dark:text-white">{MockTopicData.title} Performance</h1>

            <div className="mb-8 flex items-center">
                <div style={{ width: 100, height: 100 }}>
                    <CircularProgressbar
                        value={overallScore}
                        text={`${overallScore}%`}
                        styles={buildStyles({
                            textColor: "white",
                            pathColor: "#82ca9d",
                            trailColor: "#d6d6d6",
                        })}
                    />
                </div>
                <div className="ml-4">
                    <h2 className="text-xl font-semibold dark:text-slate-100 text-slate-900">Overall Performance</h2>
                    <p className="dark:text-slate-200 text-cyan-950">Overall Score: {overallScore}%</p>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-semibold dark:text-slate-100 text-slate-900">Assignments</h2>
                <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-200 dark:bg-gray-700 dark:text-slate-200 text-cyan-950 dark:text-slate-200 text-cyan-950">
                        <tr>
                            <th className="px-4 py-2">Title</th>
                            <th className="px-4 py-2">Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignments.map(assignment => (
                            <tr key={assignment.id}>
                                <td className="border px-4 py-2 dark:text-slate-200 text-cyan-950">{assignment.title}</td>
                                <td className="border px-4 py-2 dark:text-slate-200 text-cyan-950">{assignment.score}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-semibold dark:text-slate-100 text-slate-900">Quizzes</h2>
                <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-200 dark:bg-gray-700 dark:text-slate-200 text-cyan-950">
                        <tr>
                            <th className="px-4 py-2">Title</th>
                            <th className="px-4 py-2">Score</th>
                            <th className="px-4 py-2">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quizzes.map(quiz => (
                            <tr key={quiz.id}>
                                <td className="border px-4 py-2 dark:text-slate-200 text-cyan-950">{quiz.title}</td>
                                <td className="border px-4 py-2 dark:text-slate-200 text-cyan-950">{quiz.score}%</td>
                                <td className="border px-4 py-2 dark:text-slate-200 text-cyan-950">{quiz.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-semibold dark:text-slate-100 text-slate-900">Tests</h2>
                <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-200 dark:bg-gray-700 dark:text-slate-200 text-cyan-950">
                        <tr>
                            <th className="px-4 py-2">Title</th>
                            <th className="px-4 py-2">Score</th>
                            <th className="px-4 py-2">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tests.map(test => (
                            <tr key={test.id}>
                                <td className="border px-4 py-2 dark:text-slate-200 text-cyan-950">{test.title}</td>
                                <td className="border px-4 py-2 dark:text-slate-200 text-cyan-950">{test.score}%</td>
                                <td className="border px-4 py-2 dark:text-slate-200 text-cyan-950">{test.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-semibold dark:text-slate-100 text-slate-900">Progress Graph</h2>
                <LineChart width={600} height={300} data={tests}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="score" stroke="#8884d8" />
                </LineChart>
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-semibold dark:text-slate-100 text-slate-900">Teacher Feedback</h2>
                <ul>
                    {MockTopicData.teacherFeedback.map(feedback => (
                        <li key={feedback.id}>
                            <span className="dark:text-slate-200 text-cyan-950">{feedback.teacher}:</span> <span className="dark:text-slate-200 text-cyan-950">{feedback.feedback}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-semibold dark:text-slate-100 text-slate-900">Study Resources</h2>
                <div className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg">
                    <p className="dark:text-slate-200 text-cyan-950">Here you can find additional study resources to help you understand the topic better:</p>
                    <ul className="mt-4">
                        <li className="dark:text-slate-200 text-cyan-950">Resource 1</li>
                        <li className="dark:text-slate-200 text-cyan-950">Resource 2</li>
                        <li className="dark:text-slate-200 text-cyan-950">Resource 3</li>
                    </ul>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-semibold dark:text-slate-100 text-slate-900">Goal Setting</h2>
                <div className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg">
                    <p className="dark:text-slate-200 text-cyan-950">Set your academic goals for this topic and track your progress:</p>
                    <form className="mt-4">
                        <label className="block mb-2 dark:text-slate-200 text-cyan-950">Goal:</label>
                        <input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="Enter your goal" />
                        <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-cyan-950 dark:text-white rounded-lg hover:bg-blue-600">Set Goal</button>
                    </form>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-semibold dark:text-slate-100 text-slate-900">Comparison</h2>
                <div className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg">
                    <p className="dark:text-slate-200 text-cyan-950">Compare your performance with the class average:</p>
                    <div className="flex items-center mt-4">
                        <div className="w-1/2 pr-4">
                            <p className="dark:text-slate-200 text-cyan-950">Your Score:</p>
                            <p className="text-3xl font-semibold text-blue-500">85%</p>
                        </div>
                        <div className="w-1/2 pl-4 border-l">
                            <p className="dark:text-slate-200 text-cyan-950">Class Average:</p>
                            <p className="text-3xl font-semibold text-blue-500">80%</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopicPerformancePage;
