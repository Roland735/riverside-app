import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const PerformanceChart = ({ data }) => {
    return (
        <div className="bg-slate-300 dark:bg-slate-700 text-cyan-950 dark:text-slate-300  rounded-lg shadow-md p-4">
            <h2 className="text-xl font-bold mb-4">Performance Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="className" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="assignment" stroke="#8884d8" name="Assignment" />
                    <Line type="monotone" dataKey="test" stroke="#82ca9d" name="Test" />
                    <Line type="monotone" dataKey="quiz" stroke="#ffc658" name="Quiz" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PerformanceChart;
