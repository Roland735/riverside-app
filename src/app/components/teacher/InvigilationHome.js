import { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaSearch } from 'react-icons/fa';
import 'tailwindcss/tailwind.css';

const attendanceStatuses = ["Present", "Absent", "Disqualified"];

export default function ExamAttendance({ name, regNumber, period, year }) {
    const [studentsByClassAndPaper, setStudentsByClassAndPaper] = useState({});
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
                const response = await fetch('/api/getExamStudents', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ invigilator: name, examPeriod: "Mid-Term", year: year }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                console.log(data);

                if (!Array.isArray(data.subjectsAndClasses)) {
                    throw new Error('Data format is incorrect');
                }

                // Transform data to include level and section
                const formattedData = data.subjectsAndClasses.reduce((acc, item) => {
                    const { subjectName, className, level, section, paperNumber, students } = item;

                    if (!acc[subjectName]) {
                        acc[subjectName] = {};
                    }

                    if (!acc[subjectName][className]) {
                        acc[subjectName][className] = { level, section, papers: {} };
                    }

                    if (!acc[subjectName][className].papers[paperNumber]) {
                        acc[subjectName][className].papers[paperNumber] = { students: [] };
                    }

                    // Add students to the corresponding paper
                    acc[subjectName][className].papers[paperNumber].students = acc[subjectName][className].papers[paperNumber].students.concat(students);

                    return acc;
                }, {});

                setStudentsByClassAndPaper(formattedData);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudents();
    }, [name]);

    const handleStatusChange = (subjectName, className, paperNumber, reg_number, newStatus) => {
        setStudentsByClassAndPaper((prev) => ({
            ...prev,
            [subjectName]: {
                ...prev[subjectName],
                [className]: {
                    ...prev[subjectName][className],
                    papers: {
                        ...prev[subjectName][className].papers,
                        [paperNumber]: {
                            ...prev[subjectName][className].papers[paperNumber],
                            students: prev[subjectName][className].papers[paperNumber].students.map((student) =>
                                student.reg_number === reg_number ? { ...student, status: newStatus } : student
                            )
                        }
                    }
                }
            }
        }));
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleMakeAllPresent = (subjectName, className, paperNumber) => {
        setStudentsByClassAndPaper((prev) => ({
            ...prev,
            [subjectName]: {
                ...prev[subjectName],
                [className]: {
                    ...prev[subjectName][className],
                    papers: {
                        ...prev[subjectName][className].papers,
                        [paperNumber]: {
                            ...prev[subjectName][className].papers[paperNumber],
                            students: prev[subjectName][className].papers[paperNumber].students.map((student) => ({ ...student, status: "Present" }))
                        }
                    }
                }
            }
        }));
    };

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    const handleSaveEntityAttendance = async (subjectName, className, paperNumber) => {
        setIsUploading(true);
        try {
            const classData = studentsByClassAndPaper[subjectName][className].papers[paperNumber];
            const { level, section } = studentsByClassAndPaper[subjectName][className];

            for (const student of classData.students) {
                await fetch('/api/updateExamAttendance', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        examPeriod: period,
                        myYear: year,
                        name: student.name,
                        reg_number: student.reg_number,
                        newStatus: student.status,
                        date: selectedDate,
                        paperNumber,
                        subjectName,
                        className,
                        level,
                        section,
                        invigilator: { name: name, regNumber: regNumber },
                    }),
                });
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsUploading(false);
        }
    };

    const filteredStudentsByClassAndPaper = Object.keys(studentsByClassAndPaper).reduce((acc, subjectName) => {
        acc[subjectName] = {};

        Object.keys(studentsByClassAndPaper[subjectName]).forEach((className) => {
            const classData = studentsByClassAndPaper[subjectName][className];
            acc[subjectName][className] = { ...classData, papers: {} };

            Object.keys(classData.papers).forEach((paperNumber) => {
                acc[subjectName][className].papers[paperNumber] = {
                    students: classData.papers[paperNumber].students.filter((student) =>
                        student.name.toLowerCase().includes(searchTerm.toLowerCase())
                    ),
                };
            });
        });

        return acc;
    }, {});

    return (
        <div className="container mx-auto p-4 text-cyan-950 section-bg">
            {isLoading ? (
                <div className="text-center">Loading...</div>
            ) : (
                <>
                    {error && (
                        <div className="text-center text-red-500 mt-4">
                            Error: {error}
                        </div>
                    )}
                    {isUploading && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white text-cyan-950 p-4 rounded shadow">
                                Uploading attendance, please wait...
                            </div>
                        </div>
                    )}
                    <h1 className="text-2xl font-bold mb-4 text-slate-700 dark:text-slate-50">Exam Attendance</h1>
                    <div className="flex items-center mb-4">
                        <FaSearch className="mr-2" />
                        <input
                            type="text"
                            placeholder="Search students..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="px-2 py-1 border rounded text-cyan-950"
                        />
                        <div className="ml-4 flex items-center">
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={handleDateChange}
                                className="px-2 py-1 border rounded text-cyan-950"
                            />
                        </div>
                    </div>
                    {Object.keys(filteredStudentsByClassAndPaper).length > 0 ? (
                        Object.keys(filteredStudentsByClassAndPaper).map((subjectName) => (
                            <div key={subjectName} className="mb-6">
                                <h2 className="text-xl font-semibold mb-2 text-slate-600 dark:text-slate-200">
                                    {subjectName}
                                </h2>
                                {Object.keys(filteredStudentsByClassAndPaper[subjectName]).map((className) => {
                                    const classData = filteredStudentsByClassAndPaper[subjectName][className];
                                    return (
                                        <div key={className} className="mb-6">
                                            <h3 className="text-lg font-semibold mb-2 text-slate-500 dark:text-slate-300">
                                                {className} {classData.level} {classData.section}
                                            </h3>
                                            {Object.keys(classData.papers).map((paperNumber) => {
                                                const paper = classData.papers[paperNumber];
                                                return (
                                                    <div key={paperNumber} className="mb-6">
                                                        <h4 className="text-lg font-semibold mb-2 text-slate-500 dark:text-slate-300">
                                                            Paper {paperNumber}
                                                        </h4>
                                                        <div className="flex items-center mb-4">
                                                            <button
                                                                className="flex items-center px-4 py-2 rounded bg-green-500 text-white"
                                                                onClick={() => handleMakeAllPresent(subjectName, className, paperNumber)}
                                                            >
                                                                <FaCheck className="mr-2" />
                                                                Mark All Present
                                                            </button>
                                                            <button
                                                                className="flex items-center px-4 py-2 ml-4 rounded bg-blue-500 text-white"
                                                                onClick={() => handleSaveEntityAttendance(subjectName, className, paperNumber)}
                                                            >
                                                                Save Attendance
                                                            </button>
                                                        </div>
                                                        <ul>
                                                            {paper.students.map((student) => (
                                                                <li
                                                                    key={student.reg_number}
                                                                    className="flex items-center mb-2 border-b py-1 text-slate-700 dark:text-slate-300"
                                                                >
                                                                    <span className="flex-1">{student.name}</span>
                                                                    {attendanceStatuses.map((status) => (
                                                                        <button
                                                                            key={status}
                                                                            onClick={() =>
                                                                                handleStatusChange(subjectName, className, paperNumber, student.reg_number, status)
                                                                            }
                                                                            className={`px-2 py-1 mx-1 rounded ${student.status === status ? 'bg-cyan-500 text-white' : 'bg-gray-200 text-cyan-700'
                                                                                }`}
                                                                        >
                                                                            {status}
                                                                        </button>
                                                                    ))}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                        ))
                    ) : (
                        <div>No students found for the search term.</div>
                    )}
                </>
            )}
        </div>
    );
}
