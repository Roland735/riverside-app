import React from 'react';
import {
    ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const StudentAnomalies = ({ data }) => {
    // Categorize anomalies
    const topPerformers = data.filter(student => student.average > 90);
    const lowPerformers = data.filter(student => student.average < 50);

    return (
        <div className=" dark:bg-cyan-950   shadow-lg rounded-lg p-6 m-4 w-full max-w-6xl">
            <h2 className="text-2xl font-bold mb-4 text-cyan-950 dark:text-cyan-300">Student Anomalies</h2>

            <h3 className="text-xl font-bold mt-4 mb-2 text-gray-700">Top Performers</h3>
            <ResponsiveContainer width="100%" height={200}>
                <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="category" dataKey="name" name="Student" />
                    <YAxis type="number" dataKey="average" name="Average Marks" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Top Performers" data={topPerformers} fill="#82ca9d" />
                </ScatterChart>
            </ResponsiveContainer>
            <div className="overflow-x-auto mt-6">
                <table className="min-w-full bg-white dark:bg-cyan-900 rounded-md ">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Student</th>
                            <th className="py-2 px-4 border-b">Average Marks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topPerformers.map((student, index) => (
                            <tr key={index}>
                                <td className="py-2 px-4 border-b">{student.name}</td>
                                <td className="py-2 px-4 border-b">{student.average}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <h3 className="text-xl font-bold mt-4 mb-2 text-gray-700">Low Performers</h3>
            <ResponsiveContainer width="100%" height={200}>
                <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="category" dataKey="name" name="Student" />
                    <YAxis type="number" dataKey="average" name="Average Marks" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Low Performers" data={lowPerformers} fill="#ff6666" />
                </ScatterChart>
            </ResponsiveContainer>
            <div className="overflow-x-auto mt-6">
                <table className="min-w-full bg-white dark:bg-cyan-900 rounded-md">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Student</th>
                            <th className="py-2 px-4 border-b">Average Marks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lowPerformers.map((student, index) => (
                            <tr key={index}>
                                <td className="py-2 px-4 border-b">{student.name}</td>
                                <td className="py-2 px-4 border-b">{student.average}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentAnomalies;
