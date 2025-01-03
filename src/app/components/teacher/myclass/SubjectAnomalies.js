import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const SubjectAnomalies = ({ data }) => {
    // Categorize anomalies
    const significantDrops = data.filter(subject => subject.marks.change < -10);
    const significantRises = data.filter(subject => subject.marks.change > 10);

    return (
        <div className="text-slcyan-950 dark:text-slate-50 dark:bg-cyan-950  shadow-lg rounded-lg p-6 m-4 w-full max-w-6xl">
            <h2 className="text-2xl font-bold mb-4 text-cyan-950 dark:text-cyan-300">Subject Anomalies</h2>

            <h3 className="text-xl font-bold mt-4 mb-2 text-gray-700">Significant Drops</h3>
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={significantDrops}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="marks.change" fill="#ff6666" name="Change" radius={[10, 10, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
            <div className="overflow-x-auto mt-6">
                <table className="min-w-full bg-white dark:bg-cyan-900 rounded-md ">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Subject</th>
                            <th className="py-2 px-4 border-b">Change</th>
                        </tr>
                    </thead>
                    <tbody>
                        {significantDrops.map((subject, index) => (
                            <tr key={index}>
                                <td className="py-2 px-4 border-b">{subject.name}</td>
                                <td className="py-2 px-4 border-b">{subject.marks.change}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <h3 className="text-xl font-bold mt-4 mb-2 text-gray-700">Significant Rises</h3>
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={significantRises}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="marks.change" fill="#82ca9d" name="Change" radius={[10, 10, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
            <div className="overflow-x-auto mt-6">
                <table className="min-w-full  bg-white dark:bg-cyan-900 rounded-md ">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Subject</th>
                            <th className="py-2 px-4 border-b">Change</th>
                        </tr>
                    </thead>
                    <tbody>
                        {significantRises.map((subject, index) => (
                            <tr key={index}>
                                <td className="py-2 px-4 border-b">{subject.name}</td>
                                <td className="py-2 px-4 border-b">{subject.marks.change}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SubjectAnomalies;
