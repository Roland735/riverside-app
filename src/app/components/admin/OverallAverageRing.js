import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const OverallAverageRing = ({ data }) => {
    const overallAverage = data.reduce((sum, entry) => sum + entry.mark, 0) / data.length;

    const pieData = [
        { name: 'Average', value: overallAverage },
        { name: 'Remaining', value: 100 - overallAverage },
    ];

    const COLORS = ['#0088FE', '#00C49F'];

    return (
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-center">
            <ResponsiveContainer width={150} height={150}>
                <PieChart>
                    <Pie
                        data={pieData}
                        startAngle={90}
                        endAngle={-270}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <div className="text-center">
                <div className="text-xl font-medium text-black">{Math.round(overallAverage)}%</div>
                <div className="text-gray-500">Overall Average</div>
            </div>
        </div>
    );
};

export default OverallAverageRing;
