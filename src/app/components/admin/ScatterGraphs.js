import React from "react";
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const ScatterGraphs = ({ studentsData }) => {
    // Generate index-based data for XAxis
    const indexedData = studentsData.map((student, index) => ({
        ...student,
        index,
    }));

    // Custom tick formatter to show student names
    const renderCustomAxisTick = (tickProps) => {
        const { x, y, payload } = tickProps;
        const studentName = indexedData[payload.value]?.studentName || payload.value;
        return (
            <g transform={`translate(${x},${y})`}>
                <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-45)">
                    {studentName}
                </text>
            </g>
        );
    };

    // Custom tooltip formatter to show student names on hover
    const renderCustomTooltip = ({ payload }) => {
        if (payload && payload.length) {
            const student = indexedData[payload[0].payload.index];
            return (
                <div className="custom-tooltip bg-white p-2 border border-gray-300 rounded shadow">
                    <p className="label font-semibold">{`Student: ${student.studentName}`}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="intro">{`${entry.name}: ${entry.value}`}</p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-slate-300 dark:bg-slate-700 dark:text-slate-50 text-cyan-950  rounded-lg shadow-md p-4">
            <h2 className="text-xl font-bold mb-4">Scatter Graphs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> {/* Increase gap to 8 */}
                {/* Scatter Graph for Overall Marks */}
                <div className="mb-8  text-cyan-950 ">
                    <h3 className="text-lg font-semibold mb-2 dark:text-slate-50 text-cyan-950 ">Overall Marks</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <ScatterChart>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                type="number"
                                dataKey="index"
                                name="Student"
                                tick={renderCustomAxisTick}
                            />
                            <YAxis type="number" dataKey="mark" name="Overall Mark" />
                            <Tooltip content={renderCustomTooltip} cursor={{ strokeDasharray: "3 3" }} />
                            <Legend />
                            <Scatter name="Students" data={indexedData} fill="#8884d8" />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>

                {/* Scatter Graph for Assignment Marks */}
                <div className="mb-8  text-cyan-950 ">
                    <h3 className="text-lg font-semibold mb-2 dark:text-slate-50 text-cyan-950 ">Assignment Marks</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <ScatterChart>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                type="number"
                                dataKey="index"
                                name="Student"
                                tick={renderCustomAxisTick}
                            />
                            <YAxis type="number" dataKey="assignment" name="Assignment Mark" />
                            <Tooltip content={renderCustomTooltip} cursor={{ strokeDasharray: "3 3" }} />
                            <Legend />
                            <Scatter
                                name="Students"
                                data={indexedData}
                                fill="#82ca9d"
                                line
                                shape="cross"
                            />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>

                {/* Scatter Graph for Test Marks */}
                <div className="mb-8 text-cyan-950 ">
                    <h3 className="text-lg font-semibold mb-2 dark:text-slate-50 text-cyan-950 ">Test Marks</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <ScatterChart>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                type="number"
                                dataKey="index"
                                name="Student"
                                tick={renderCustomAxisTick}
                            />
                            <YAxis type="number" dataKey="test" name="Test Mark" />
                            <Tooltip content={renderCustomTooltip} cursor={{ strokeDasharray: "3 3" }} />
                            <Legend />
                            <Scatter
                                name="Students"
                                data={indexedData}
                                fill="#ffc658"
                                line
                                shape="diamond"
                            />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>

                {/* Scatter Graph for Quiz Marks */}
                <div className="mb-8  text-cyan-950 ">
                    <h3 className="text-lg font-semibold mb-2 dark:text-slate-50 text-cyan-950 ">Quiz Marks</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <ScatterChart>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                type="number"
                                dataKey="index"
                                name="Student"
                                tick={renderCustomAxisTick}
                            />
                            <YAxis type="number" dataKey="quiz" name="Quiz Mark" />
                            <Tooltip content={renderCustomTooltip} cursor={{ strokeDasharray: "3 3" }} />
                            <Legend />
                            <Scatter
                                name="Students"
                                data={indexedData}
                                fill="#8884d8"
                                line
                                shape="star"
                            />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ScatterGraphs;
