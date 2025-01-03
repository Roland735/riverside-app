import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const LineGraph = ({ data }) => {
    // Prepare data for the line chart
    const lines = [];
    data.grades.forEach((gradeItem, gradeIndex) => {
        const gradeName = gradeItem.gradeName;

        data.classes.forEach((grade) => {
            grade.classes.forEach((classItem) => {
                if (!lines[classItem.class]) {
                    lines[classItem.class] = {
                        name: classItem.class,
                        data: []
                    };
                }

                lines[classItem.class].data.push({
                    grade: gradeName,
                    mark: classItem.mark,
                });
            });
        });
    });

    // Convert lines data into an array for rendering
    const lineData = Object.values(lines);

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart
                data={lineData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="grade" />
                <YAxis />
                <Tooltip />
                <Legend />
                {lineData.map((line, index) => (
                    <Line
                        key={index}
                        type="monotone"
                        dataKey="mark"
                        name={line.name}
                        data={line.data}
                        stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
                        dot={false}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
};

export default LineGraph;
