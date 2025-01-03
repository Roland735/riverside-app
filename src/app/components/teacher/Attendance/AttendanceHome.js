"use client";
import { useState, useEffect } from 'react';
import { FaCheck, FaSearch } from 'react-icons/fa';
import 'tailwindcss/tailwind.css';

const attendanceStatuses = ["Present", "Absent", "Late", "Excused", "Sick"];

export default function Attendance() {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0]; // YYYY-MM-DD format
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch('/api/getAttendanceStudents', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ classTeacher: "Alice Martin", year: 2025 }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();

                if (!Array.isArray(data)) {
                    throw new Error('Data format is incorrect');
                }

                setStudents(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const handleStatusChange = (reg_number, newStatus) => {
        setStudents((prev) =>
            prev.map((student) =>
                student.reg_number === reg_number ? { ...student, status: newStatus } : student
            )
        );
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleMakeAllPresent = () => {
        setStudents((prev) =>
            prev.map((student) => ({ ...student, status: "Present" }))
        );
    };

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    const handleSaveAttendance = async () => {
        setIsUploading(true);
        try {
            for (const student of students) {
                await fetch('/api/updateAttendance', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        classTeacher: "Alice Martin",
                        year: 2025,
                        reg_number: student.reg_number,
                        newStatus: student.status,
                        date: selectedDate
                    }),
                });
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsUploading(false);
        }
    };

    const filteredStudents = Array.isArray(students) ? students.filter((student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    return (
        <div className="container mx-auto p-4 text-cyan-950 section-bg">
            {isLoading ? (
                <div className="text-center">Loading...</div>
            ) : (
                <>
                    {error && (
                        <div className="text-center text-red-500 mt-4">
                            You are not yet assigned a class
                        </div>
                    )}
                    {isUploading && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white text-cyan-950 p-4 rounded shadow">
                                Uploading attendance, please wait...
                            </div>
                        </div>
                    )}
                    <h1 className="text-2xl font-bold mb-4 text-slate-700 dark:text-slate-50">Attendance</h1>
                    <div className="flex items-center mb-4">
                        <button
                            className="flex items-center px-4 py-2 rounded bg-green-500 text-white"
                            onClick={handleMakeAllPresent}
                        >
                            <FaCheck className="mr-2" />
                            Make Everyone Present
                        </button>
                        <div className="ml-4 flex items-center">
                            <FaSearch className="mr-2" />
                            <input
                                type="text"
                                placeholder="Search students..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="px-2 py-1 border rounded text-cyan-950"
                            />
                        </div>
                        <div className="ml-4 flex items-center">
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={handleDateChange}
                                className="px-2 py-1 border rounded text-cyan-950"
                            />
                        </div>
                    </div>
                    {filteredStudents.length > 0 ? (
                        <ul>
                            {filteredStudents.map((student) => (
                                <li
                                    key={student.reg_number}
                                    className="flex items-center justify-between mb-2 p-2 border-2 rounded border-sky-600 hover:bg-emerald-600 transition-all duration-200 cursor-pointer"
                                >
                                    <span className='dark:text-slate-200'>{student.name}</span>
                                    <div className="flex items-center">
                                        {attendanceStatuses.map((status) => (
                                            <button
                                                key={status}
                                                className={`px-2 py-1 mx-1 rounded ${student.status === status ? 'bg-green-500 text-white' : 'bg-gray-200 text-cyan-950'
                                                    }`}
                                                onClick={() => handleStatusChange(student.reg_number, status)}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center text-red-500 mt-4">
                            No students found.
                        </div>
                    )}
                    <button
                        className="mt-4 px-4 py-2 rounded bg-blue-500 text-white"
                        onClick={handleSaveAttendance}
                    >
                        Save Attendance
                    </button>
                </>
            )}
        </div>
    );
}
