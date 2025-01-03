import { useState, useEffect } from 'react';
// Toast
import { toast, ToastContainer } from 'react-toastify';

const StudentReportsPage = ({ year, period }) => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [missingReasons, setMissingReasons] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState({});

    useEffect(() => {
        const fetchStudentsData = async () => {
            try {
                const response = await fetch('/api/get-report-students', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        year: year,
                        period: period,
                    }),
                });

                const data = await response.json();
                console.log(data);


                const initialSelectedStudents = {};
                const updatedStudents = data.map((student) => {
                    initialSelectedStudents[student.id] = student.selected;
                    return {
                        ...student,
                        reason: student.reason || '',
                    };
                });

                setStudents(updatedStudents);
                setFilteredStudents(updatedStudents);
                setSelectedStudents(initialSelectedStudents);
            } catch (error) {
                console.error('Error fetching student data:', error);
            }
        };

        fetchStudentsData();
    }, []);

    useEffect(() => {
        setFilteredStudents(
            students.filter((student) =>
                student.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, students]);

    const handleSelectAll = (e) => {
        const isChecked = e.target.checked;
        const updatedSelectedStudents = {};

        filteredStudents.forEach((student) => {
            updatedSelectedStudents[student.id] = isChecked;
        });

        setSelectedStudents(updatedSelectedStudents);
    };

    const handleSelectStudent = (id) => {
        setSelectedStudents((prev) => ({
            ...prev,
            [id]: !prev[id], // Toggle between true and false
        }));
    };

    const handleReasonChange = (id, reason) => {
        setFilteredStudents((prev) =>
            prev.map((student) =>
                student.id === id ? { ...student, reason } : student
            )
        );
    };

    const updateSelectedStudents = async () => {
        const missingReasonsList = filteredStudents.filter(
            (student) => !selectedStudents[student.id] && !student.reason
        );

        if (missingReasonsList.length > 0) {
            setMissingReasons(missingReasonsList);
        } else {
            const updatedData = filteredStudents.map((student) => ({
                id: student.id,
                selected: selectedStudents[student.id], // Ensure correct true/false value
                reason: student.reason,
            }));



            try {
                const response = await fetch('/api/update-student-receiving-status', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ students: updatedData, year, period }),
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data.message);
                    toast.success('Students updated successfully!');
                } else {
                    console.error('Failed to update students:', await response.json());
                }
            } catch (error) {
                console.error('Error updating students:', error);
            }
        }
    };

    return (
        <div className="p-4 bg-rose-100 dark:bg-rose-900 rounded-lg shadow-lg w-full">
            <h1 className="text-2xl font-bold mb-4 text-rose-700 dark:text-rose-200">Update Students for Reports</h1>

            <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border border-rose-300 mb-4 w-full rounded-md dark:border-rose-600 dark:bg-rose-800 dark:text-rose-100"
            />

            <table className="min-w-full table-auto border-collapse bg-white dark:bg-rose-800 shadow-md rounded-lg">
                <thead>
                    <tr className="bg-rose-200 dark:bg-rose-700">
                        <th className="border px-4 py-2">
                            <input type="checkbox" onChange={handleSelectAll} /> Select All (Receive Reports)
                        </th>
                        <th className="border px-4 py-2">Name</th>
                        <th className="border px-4 py-2">Class</th>
                        <th className="border px-4 py-2">Reason (if not receiving)</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredStudents.map((student) => (
                        <tr key={student.id} className="border-b even:bg-rose-100 dark:even:bg-rose-900">
                            <td className="border px-4 py-2">
                                <input
                                    type="checkbox"
                                    checked={!!selectedStudents[student.id]} // Convert to boolean
                                    onChange={() => handleSelectStudent(student.id)}
                                />
                            </td>
                            <td className="border px-4 py-2">{student.name}</td>
                            <td className="border px-4 py-2">{student.class}</td>
                            <td className="border px-4 py-2">
                                {!selectedStudents[student.id] && (
                                    <select
                                        value={student.reason || ''}
                                        onChange={(e) => handleReasonChange(student.id, e.target.value)}
                                        className="p-2 border border-rose-300 w-full rounded-md dark:border-rose-600 dark:bg-rose-800 dark:text-rose-100"
                                    >
                                        <option value="">Select Reason</option>
                                        <option value="Absent">Absent</option>
                                        <option value="Fee Balance">Fee Balance</option>
                                        <option value="Other">Other</option>
                                    </select>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button
                onClick={updateSelectedStudents}
                className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-500 dark:bg-rose-800 dark:hover:bg-rose-700 transition duration-200"
            >
                Update Selected Students
            </button>

            {missingReasons.length > 0 && (
                <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-md shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Missing Reasons for Students</h2>
                        <ul className="mb-4">
                            {missingReasons.map((student) => (
                                <li key={student.id} className="mb-2">
                                    {student.name} ({student.class}) - No reason selected
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => setMissingReasons([])}
                            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            <ToastContainer />
        </div>
    );
};

export default StudentReportsPage;
