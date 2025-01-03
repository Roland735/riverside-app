import React, { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import { FaArrowDown, FaCheck, FaTimes, FaMedal, FaTrophy, FaChartLine } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export default function ConfirmMarksPage({ name, regNumber }) {
    const [classData, setClassData] = useState([]);
    const [activeClass, setActiveClass] = useState({});
    const [confirmedPapers, setConfirmedPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUploadedMarks();
    }, []);

    const fetchUploadedMarks = async () => {
        try {
            const response = await fetch('/api/midterm-reports-marks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(), // Adjust the payload as needed
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log("Fetched data:", data);
            setClassData(data);
            setConfirmedPapers(data.flatMap(cls => cls.subjects.flatMap(subject => subject.papers.filter(paper => paper.confirmed))));
        } catch (error) {
            console.error("Error fetching uploaded marks", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleAccordion = (className, subjectName) => {
        const key = `${className}-${subjectName}`;
        setActiveClass((prevState) => ({
            ...prevState,
            [key]: !prevState[key],
        }));
    };

    const confirmSubject = async (className, subjectName) => {
        try {
            const response = await fetch('/api/confirm-paper', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ className, subjectName, examPeriod: "Mid-First term" }), // Send class and subject details
            });

            if (!response.ok) {
                throw new Error('Failed to confirm the subject');
            }

            await fetchUploadedMarks(); // Reload the data after confirming
        } catch (error) {
            console.error("Error confirming subject", error);
        }
    };

    const getGrade = (percentage) => {
        if (percentage >= 90) return "A*";
        if (percentage >= 80) return "A";
        if (percentage >= 70) return "B";
        if (percentage >= 60) return "C";
        if (percentage >= 50) return "D";
        if (percentage >= 40) return "E";
        return "U";
    };

    const getGradeColor = (grade) => {
        switch (grade) {
            case "A*":
                return "bg-green-200";
            case "A":
                return "bg-green-300";
            case "B":
                return "bg-yellow-200";
            case "C":
                return "bg-yellow-300";
            case "D":
                return "bg-orange-200";
            case "E":
                return "bg-orange-300";
            case "U":
                return "bg-red-300";
            default:
                return "";
        }
    };

    const getAccolade = (position) => {
        if (position === 1) return <FaTrophy className="text-yellow-500" />;
        if (position === 2) return <FaMedal className="text-gray-500" />;
        if (position === 3) return <FaMedal className="text-bronze-500" />;
        return null;
    };

    const calculateStatistics = (students) => {
        const marks = students.map(student => student.mark || 0);
        const numOfStudents = marks.length;

        if (numOfStudents === 0) return {
            averageMark: 0,
            medianMark: 0,
            highestMark: 0,
            lowestMark: 0,
            standardDeviation: 0,
            markDistribution: {}
        };

        const averageMark = marks.reduce((sum, mark) => sum + mark, 0) / numOfStudents;
        const sortedMarks = [...marks].sort((a, b) => a - b);
        const medianMark = numOfStudents % 2 === 0
            ? (sortedMarks[numOfStudents / 2 - 1] + sortedMarks[numOfStudents / 2]) / 2
            : sortedMarks[Math.floor(numOfStudents / 2)];
        const highestMark = Math.max(...marks);
        const lowestMark = Math.min(...marks);

        const variance = marks.reduce((sum, mark) => sum + Math.pow(mark - averageMark, 2), 0) / numOfStudents;
        const standardDeviation = Math.sqrt(variance);

        const markDistribution = marks.reduce((acc, mark) => {
            const range = Math.floor(mark / 10) * 10;
            acc[range] = (acc[range] || 0) + 1;
            return acc;
        }, {});

        return { averageMark, medianMark, highestMark, lowestMark, standardDeviation, markDistribution };
    };

    const totalPapers = classData.flatMap(cls => cls.subjects.flatMap(subject => subject.papers)).length;
    const totalConfirmed = confirmedPapers.length;
    const progress = totalPapers ? (totalConfirmed / totalPapers) * 100 : 0;

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                Confirm Uploaded Marks
            </h1>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Overall Progress</h2>
                <div className="flex items-center space-x-4">
                    <div className="w-24 h-24">
                        <CircularProgressbar
                            value={progress}
                            text={`${progress.toFixed(0)}%`}
                            styles={buildStyles({
                                pathColor: `rgba(62, 152, 199, ${progress / 100})`,
                                textColor: '#f88',
                                trailColor: '#d6d6d6',
                            })}
                        />
                    </div>
                    <div className="flex-1">
                        <div className="relative w-full bg-gray-200 rounded-full h-4">
                            <div
                                className="absolute top-0 left-0 h-4 bg-blue-500 rounded-full"
                                style={{ width: `${progress}%` }}
                            ></div>
                            <span className="absolute right-0 top-0 h-4 flex items-center pr-2">
                                <FaArrowDown />
                            </span>
                        </div>
                        <p className="text-gray-700 mt-2">
                            {totalConfirmed} / {totalPapers} papers confirmed
                        </p>
                    </div>
                </div>
            </div>

            {classData.map((cls) => (
                <div key={cls.className} className="mb-6">
                    <h2 className="text-2xl font-bold mb-4">{cls.className}</h2>

                    {cls.subjects.map((subject) => {
                        const key = `${cls.className}-${subject.subjectName}`;
                        const allPapersConfirmed = subject.papers.every(paper => paper.confirmed);

                        return (
                            <div key={subject.subjectName} className="mb-4">
                                <h3 className="text-xl font-semibold mb-2">{subject.subjectName}</h3>

                                {subject.papers.map((paper) => {
                                    const paperKey = `${cls.className}-${subject.subjectName}-${paper.paperNumber}`;
                                    const { averageMark, medianMark, highestMark, lowestMark, standardDeviation, markDistribution } = calculateStatistics(paper.students);

                                    const markDistributionData = markDistribution ? Object.entries(markDistribution).map(([range, count]) => ({
                                        range: `${range}-${parseInt(range) + 9}`,
                                        count
                                    })) : [];

                                    const sortedStudents = [...paper.students].sort((a, b) => b.mark - a.mark);

                                    return (
                                        <div key={paperKey} className="mb-6">
                                            <div
                                                className="accordion-header cursor-pointer p-4 bg-gray-200 dark:bg-gray-800 dark:text-gray-200 rounded-lg flex justify-between items-center shadow-md hover:bg-gray-300"
                                                onClick={() => toggleAccordion(cls.className, subject.subjectName)}
                                            >
                                                <div>
                                                    <h4 className="text-lg font-medium">Paper {paper.paperNumber}</h4>
                                                    <p className="text-sm">Total Marks: {paper.students.length}</p>
                                                </div>
                                                <div className="flex items-center">
                                                    {paper.confirmed ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />}
                                                    <span className="ml-2">{activeClass[key] ? "Hide" : "Show"}</span>
                                                </div>
                                            </div>

                                            {activeClass[key] && (
                                                <div className="accordion-content p-4 border border-gray-300 dark:border-gray-700 rounded-lg mt-2">
                                                    {/* Add Charts and other content */}
                                                    <BarChart width={500} height={300} data={markDistributionData}>
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis dataKey="range" />
                                                        <YAxis />
                                                        <Tooltip />
                                                        <Legend />
                                                        <Bar dataKey="count" fill="#8884d8" />
                                                    </BarChart>

                                                    <table className="table-auto w-full mt-4">
                                                        <thead>
                                                            <tr>
                                                                <th className="px-4 py-2">Position</th>
                                                                <th className="px-4 py-2">Name</th>
                                                                <th className="px-4 py-2">Mark</th>
                                                                <th className="px-4 py-2">Grade</th>
                                                                <th className="px-4 py-2">Accolade</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {sortedStudents.map((student, index) => {
                                                                const grade = getGrade(student.mark);
                                                                const gradeColor = getGradeColor(grade);
                                                                const accolade = getAccolade(index + 1);
                                                                return (
                                                                    <tr key={student.regNumber} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                                                        <td className="border px-4 py-2 text-center">{index + 1}</td>
                                                                        <td className="border px-4 py-2">{student.name}</td>
                                                                        <td className="border px-4 py-2 text-center">{student.mark}</td>
                                                                        <td className={`border px-4 py-2 text-center ${gradeColor}`}>
                                                                            {grade}
                                                                        </td>
                                                                        <td className="border px-4 py-2 text-center">{accolade}</td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                {/* Confirm Button moved here, outside paper loop */}
                                <div className="mt-4">
                                    <button
                                        onClick={() => confirmSubject(cls.className, subject.subjectName)}
                                        disabled={allPapersConfirmed}
                                        className={`px-4 py-2 rounded-lg font-semibold ${allPapersConfirmed ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'
                                            }`}
                                    >
                                        {allPapersConfirmed ? 'Subject Confirmed' : 'Confirm All Papers for Subject'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}
