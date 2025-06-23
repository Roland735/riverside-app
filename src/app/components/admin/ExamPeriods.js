"use client"
// pages/ExamPeriods.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaCalendarAlt } from 'react-icons/fa';

export default function ExamPeriods({ role }) {
    const [examPeriods, setExamPeriods] = useState([]); // Initialize as an empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExamPeriods = async () => {
            try {
                const response = await fetch('/api/get-exam-periods'); // Replace with your actual API route
                if (!response.ok) {
                    throw new Error('Failed to fetch exam periods');
                }
                const data = await response.json();

                // Log the fetched data to understand its structure
                console.log('Fetched exam periods data:', data);

                // Extract the data array from the response
                const examData = data.data; // Access the 'data' property

                // Ensure the fetched data is an array
                if (Array.isArray(examData)) {
                    setExamPeriods(examData);
                } else {
                    throw new Error('Fetched data is not an array');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchExamPeriods();
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center dark:bg-rose-900 bg-gray-100">Loading...</div>;
    }

    if (error) {
        return <div className="min-h-screen flex items-center justify-center dark:bg-rose-900 bg-gray-100">Error: {error}</div>;
    }

    return (
        <div className="min-h-screen dark:bg-rose-900 bg-gray-100 p-6 w-full">
            <h1 className="text-3xl font-bold mb-6 text-center dark:text-white text-rose-700">Exam Periods</h1>
            <div className="space-y-8">
                {examPeriods.map((yearData) => (
                    <div key={yearData.year} className="space-y-4">
                        <h2 className="text-2xl font-semibold dark:text-white text-rose-600">{yearData.year}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {yearData.periods.map((period, index) => (
                                <Link
                                    key={index}
                                    href={
                                        role === "teacher"
                                            ? `/dashboard/teacher/examTracking/${period.name}/${yearData.year}`
                                            : role === "admin"
                                                ? `/dashboard/admin/examTracking/${period.name}/${yearData.year}`
                                                : `/dashboard/student/examTracking/${period.name}/${yearData.year}`
                                    }
                                    className="block"
                                >
                                    <div className="cursor-pointer flex items-center p-4 bg-white dark:bg-rose-800 rounded-lg shadow-md dark:text-white text-gray-800 transition transform hover:scale-105 hover:shadow-lg">
                                        <FaCalendarAlt className="text-rose-500 dark:text-rose-300 mr-4" size={32} />
                                        <div>
                                            <h3 className="text-xl font-semibold">{period.name}</h3>
                                            <p className="text-sm">{period.date}</p>
                                            nice
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
