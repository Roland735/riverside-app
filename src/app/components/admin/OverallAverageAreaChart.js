import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const OverallAverageAreaChart = ({ data }) => {
    return (
        <div className="bg-slate-300 dark:bg-slate-700 text-cyan-950 dark:text-slate-300  rounded-lg shadow-md p-4">
            <h2 className="text-xl font-bold mb-4">Overall Average Marks</h2>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="className" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="averageMark" stroke="#8884d8" fill="#8884d8" name="Overall Average" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default OverallAverageAreaChart;
