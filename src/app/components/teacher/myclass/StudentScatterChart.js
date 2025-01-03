import React from 'react';
import {
    ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const StudentScatterChart = ({ data }) => {
    const scatterData = data.map(student => ({
        name: student.name,
        average: student.average,
    }));

    return (
        <div className="text-slate-700 dark:bg-cyan-950 shadow-lg rounded-lg p-6 m-4 w-full max-w-6xl">
            <h2 className="text-2xl font-bold mb-4 text-cyan-950 dark:text-cyan-300">Student Average Marks</h2>
            <ResponsiveContainer width="100%" height={400}>
                <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="category" dataKey="name" name="Student" />
                    <YAxis type="number" dataKey="average" name="Average Marks" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Legend />
                    <Scatter name="Student Average" data={scatterData} fill="#8884d8" />
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
};

export default StudentScatterChart;
