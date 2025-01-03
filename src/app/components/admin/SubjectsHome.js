// pages/SubjectsHome.js
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaChalkboardTeacher, FaSchool } from 'react-icons/fa';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const SubjectsHome = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await fetch('/api/subjects/overview');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setSubjects(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSubjects();
    }, []);

    if (loading) return <div className="text-center py-6">Loading...</div>;
    if (error) return <div className="text-center py-6 text-red-500">Error: {error}</div>;

    return (
        <div className="min-h-screen py-6 w-full">
            <div className="w-full px-4 py-10 bg-white dark:bg-slate-600 borders shadow-lg rounded-3xl">
                <div className="w-full">
                    <div className="flex items-center justify-center mb-8">
                        <FaSchool className="text-sky-500 text-4xl" />
                        <h1 className="text-2xl font-bold text-gray-900 ml-4">School Subjects</h1>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-3">
                        {subjects.map((subject, index) => (
                            <div key={index} className="p-4 bg-gray-50 dark:bg-slate-200 rounded-lg shadow-md">
                                <div className="flex items-center mb-2">
                                    <FaChalkboardTeacher className="text-sky-500 text-2xl mr-3" />
                                    <h2 className="text-xl font-semibold text-gray-900">{subject.name}</h2>
                                </div>
                                <p className="text-gray-700 mb-2 min-h-24">Teachers: {subject.teachers.join(', ')}</p>
                                <div className="flex items-center mb-2">
                                    <div className="w-16 h-16">
                                        <CircularProgressbar
                                            value={subject.averageMark}
                                            text={`${Math.round(subject.averageMark)}%`}
                                            styles={buildStyles({
                                                textSize: '24px',
                                                pathColor: '#0ea5e9',
                                                textColor: '#0ea5e9',
                                            })}
                                        />
                                    </div>
                                    <span className="ml-4 text-gray-700">Average Mark: {subject.averageMark}%</span>
                                </div>
                                <Link href={`/dashboard/admin/subjects/${subject.name}`} passHref>
                                    <button className="bg-sky-500 text-white py-2 px-4 rounded hover:bg-sky-600 w-full mt-2">
                                        View {subject.name}
                                    </button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubjectsHome;
