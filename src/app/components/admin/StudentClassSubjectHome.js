// Import necessary modules and components
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import StudentInfoCard from './StudentInfoCard';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts';
import SubjectTopicsTable from './SubjectTopicsTable'; // Import the new component

// Define the StudentSubjectPerformance component
const StudentSubjectPerformance = ({ regNumber, subject }) => {
    const [studentSubjectPerformanceData, setStudentSubjectPerformanceData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/studentClassSubject', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        // Add your request body here
                        regNumber: regNumber,
                        subjectName: subject,
                    }),
                });
                const data = await response.json();
                console.log(data);
                setStudentSubjectPerformanceData(data.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                console.error('Error fetching student subject performance data:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Helper function to calculate average for tests, quizzes, or assignments
    const calculateAverage = (items) => {
        console.log(items);
        let totalScore = 0;

        items.forEach(item => {
            totalScore += item.score;
        });
        let average = totalScore / items.length;

        return average.toFixed(2);
    };

    // Helper function to calculate overall average mark for a topic
    const calculateOverallAverage = (topic) => {
        const totalTests = calculateAverage(topic.tests);
        const totalQuizzes = calculateAverage(topic.assignments);
        const overallAverage = (parseFloat(totalTests) + parseFloat(totalQuizzes)) / 2;
        return overallAverage.toFixed(2);
    };

    // Function to calculate percentage
    const calculatePercentage = (value, total) => {
        return (value / total) * 100;
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!studentSubjectPerformanceData) {
        return <div>No data available</div>;
    }

    // Calculate total scores for tests, quizzes, and assignments
    console.log(studentSubjectPerformanceData.subject.topics);

    const totalTests = studentSubjectPerformanceData.subject.topics.reduce((acc, topic) => {
        return acc + parseFloat(calculateAverage(topic.tests));
    }, 0);

    const totalQuizzes = studentSubjectPerformanceData.subject.topics.reduce((acc, topic) => {
        return acc + parseFloat(calculateAverage(topic.assignments));
    }, 0);

    const totalAssignments = studentSubjectPerformanceData.subject.topics.reduce((acc, topic) => {
        return acc + parseFloat(calculateAverage(topic.assignments));
    }, 0);

    // Colors for pie chart sectors
    const COLORS = ['#0088FE', '#00C49F'];

    // Calculate overall average mark (example calculation)
    const overallAverage = studentSubjectPerformanceData.subject.topics.reduce((acc, topic) => {
        return acc + parseFloat(calculateOverallAverage(topic));
    }, 0) / studentSubjectPerformanceData.subject.topics.length;

    return (
        <div className="p-4 w-full space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Student Information Card */}
                <div className="col-span-1">
                    <StudentInfoCard studentData={studentSubjectPerformanceData} />
                </div>

                {/* Pie Chart */}
                <div className="col-span-1 bg-slate-300 dark:bg-slate-700 text-cyan-950 dark:text-slate-300 p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Performance Distribution</h2>
                    {console.log(studentSubjectPerformanceData.pieChartData)}

                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={studentSubjectPerformanceData.pieChartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                label
                            >
                                {studentSubjectPerformanceData.pieChartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <RechartsTooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Circular Progress for Overall Average */}
                <div className="col-span-1 bg-slate-300 dark:bg-slate-700 text-cyan-950 dark:text-slate-300 p-4 rounded-lg shadow-md flex flex-col items-center">
                    <h2 className="text-xl font-bold mb-4">Overall Average</h2>
                    {console.log(studentSubjectPerformanceData.tests)}
                    <CircularProgressbar
                        value={calculateAverage(studentSubjectPerformanceData.tests)}
                        text={`${calculateAverage(studentSubjectPerformanceData.tests)}%`}
                        strokeWidth={10}
                        styles={buildStyles({
                            strokeLinecap: 'round',
                            textSize: '20px',
                            pathTransitionDuration: 0.5,
                            pathColor: `rgba(62, 152, 199, ${overallAverage / 100})`,
                            textColor: '#020617',
                            trailColor: '#d6d6d6',
                        })}
                    />
                </div>
            </div>

            {/* Performance Trend Line Chart */}
            <div className="bg-slate-300 dark:bg-slate-700 text-cyan-950 dark:text-slate-300 p-4 rounded-lg shadow-md mb-4 md:col-span-2">
                <h2 className="text-xl font-bold mb-4">Performance Trend</h2>

                <ResponsiveContainer width="100%" height={400}>
                    {console.log(studentSubjectPerformanceData.performance)}

                    <LineChart data={studentSubjectPerformanceData.performance}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="mark" stroke="#8884d8" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Area Charts for Tests and Quizzes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tests Area Chart */}
                <div className="bg-slate-300 dark:bg-slate-700 text-cyan-950 dark:text-slate-300 p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Tests</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={studentSubjectPerformanceData.tests}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="score" fill="#8884d8" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Quizzes Area Chart */}
                <div className="bg-slate-300 dark:bg-slate-700 text-cyan-950 dark:text-slate-300 p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Assignments</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        {console.log(studentSubjectPerformanceData.assignments)}

                        <AreaChart data={studentSubjectPerformanceData.assignments}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="score" fill="#8884d8" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Subject Topics Table */}
            <SubjectTopicsTable studentSubjectPerformanceData={studentSubjectPerformanceData.subject.topics} />
        </div>
    );
};

export default StudentSubjectPerformance;
