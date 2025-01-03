import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const SubjectBarChart = ({ data }) => {
    const chartData = data.map(subject => ({
        name: subject.name,
        lastYear: subject.marks.lastYear,
        currentYear: subject.marks.current,
    }));

    return (
        <div className="bg-white dark:bg-cyan-950 text-slate-700 dark:text-slate-50 shadow-lg rounded-lg p-6 m-4 w-full max-w-6xl">
            <h2 className="text-2xl font-bold mb-4 text-cyan-950 dark:text-cyan-300">Subject Averages Comparison</h2>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData} barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="lastYear" fill="#8884d8" name="Last Year" radius={[10, 10, 0, 0]} />
                    <Bar dataKey="currentYear" fill="#82ca9d" name="Current Year" radius={[10, 10, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SubjectBarChart;
