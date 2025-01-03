import { useState, useEffect } from 'react';
import { FaUserCircle, FaSortAlphaDown, FaSortAlphaUp, FaFileExport } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { useRouter } from 'next/navigation';  // Import useRouter from next/router

const StudentsList = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFields, setSelectedFields] = useState({
        regNumber: true,
        name: true,
        class: true,
        section: true,
        dateOfAdmission: true,
    });
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc'); // Track sort order
    const router = useRouter();  // Initialize useRouter

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch('/api/get-students');
                if (!response.ok) {
                    throw new Error('Failed to fetch students');
                }
                const data = await response.json();
                setStudents(data);
                setFilteredStudents(data); // Initialize filteredStudents with all students
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    // Filter students based on search term
    useEffect(() => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const filtered = students.filter(student =>
            student.name.toLowerCase().includes(lowerCaseSearchTerm) ||
            student.lastName.toLowerCase().includes(lowerCaseSearchTerm) ||
            student.regNumber.toLowerCase().includes(lowerCaseSearchTerm)
        );
        setFilteredStudents(filtered);
    }, [searchTerm, students]);

    // Handle field selection
    const handleFieldChange = (field) => {
        setSelectedFields((prev) => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    // Handle sort
    const handleSort = (field) => {
        const sorted = [...filteredStudents].sort((a, b) => {
            if (a[field] < b[field]) return sortOrder === 'asc' ? -1 : 1;
            if (a[field] > b[field]) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
        setFilteredStudents(sorted);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Toggle sort order
    };

    // Export to Excel
    const exportToExcel = () => {
        const data = filteredStudents.map((student) => {
            let row = {};
            if (selectedFields.regNumber) row.RegNumber = student.regNumber;
            if (selectedFields.name) row.Name = `${student.name} ${student.lastName}`;
            if (selectedFields.class) row.Class = student.class;
            if (selectedFields.section) row.Section = student.section;
            if (selectedFields.dateOfAdmission) row.DateOfAdmission = new Date(student.dateOfAdmission).toLocaleDateString();
            return row;
        });

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
        XLSX.writeFile(workbook, 'Students_List.xlsx');
    };

    // Navigate to student details page
    const handleRowClick = (student) => {
        router.push(`studentDetailInformation/${student.regNumber}`);  // Navigate to dynamic route based on regNumber
    };

    if (loading) {
        return <div className="text-center text-lg">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-6 text-sky-600 dark:text-sky-400">List of Students</h1>

            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search by name or reg number"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4 p-2 border border-gray-300 rounded-lg w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />

            {/* Stylish Filter Controls */}
            <div className="mb-6 flex flex-wrap gap-4">
                <button
                    onClick={() => handleFieldChange('regNumber')}
                    className={`p-2 rounded-lg text-white transition-colors ${selectedFields.regNumber ? 'bg-sky-500' : 'bg-gray-400'} hover:bg-sky-600`}
                >
                    Reg Number
                </button>
                <button
                    onClick={() => handleFieldChange('name')}
                    className={`p-2 rounded-lg text-white transition-colors ${selectedFields.name ? 'bg-sky-500' : 'bg-gray-400'} hover:bg-sky-600`}
                >
                    Name
                </button>
                <button
                    onClick={() => handleFieldChange('class')}
                    className={`p-2 rounded-lg text-white transition-colors ${selectedFields.class ? 'bg-sky-500' : 'bg-gray-400'} hover:bg-sky-600`}
                >
                    Class
                </button>
                <button
                    onClick={() => handleFieldChange('section')}
                    className={`p-2 rounded-lg text-white transition-colors ${selectedFields.section ? 'bg-sky-500' : 'bg-gray-400'} hover:bg-sky-600`}
                >
                    Section
                </button>
                <button
                    onClick={() => handleFieldChange('dateOfAdmission')}
                    className={`p-2 rounded-lg text-white transition-colors ${selectedFields.dateOfAdmission ? 'bg-sky-500' : 'bg-gray-400'} hover:bg-sky-600`}
                >
                    Date of Admission
                </button>
            </div>

            {/* Sorting */}
            <div className="mb-6 flex items-center gap-2">
                <label htmlFor="sortField" className="text-lg font-medium">Sort by:</label>
                <select
                    id="sortField"
                    value={sortField}
                    onChange={(e) => {
                        setSortField(e.target.value);
                        handleSort(e.target.value);
                    }}
                    className="p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                >
                    <option value="">Select a field</option>
                    <option value="name">Name</option>
                    <option value="regNumber">Reg Number</option>
                    <option value="class">Class</option>
                    <option value="dateOfAdmission">Date of Admission</option>
                </select>
                <button onClick={() => handleSort(sortField)} className="text-xl p-2">
                    {sortOrder === 'asc' ? <FaSortAlphaDown className="text-sky-500" /> : <FaSortAlphaUp className="text-sky-500" />}
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                    <thead className="bg-sky-500 text-white">
                        <tr>
                            <th className="px-4 py-3 text-left">Image</th>
                            {selectedFields.regNumber && <th className="px-4 py-3 text-left">Reg Number</th>}
                            {selectedFields.name && <th className="px-4 py-3 text-left">Name</th>}
                            {selectedFields.class && <th className="px-4 py-3 text-left">Class</th>}
                            {selectedFields.section && <th className="px-4 py-3 text-left">Section</th>}
                            {selectedFields.dateOfAdmission && <th className="px-4 py-3 text-left">Date of Admission</th>}
                        </tr>
                    </thead>
                    <tbody className="bg-gray-100 dark:bg-gray-800">
                        {filteredStudents.map((student, index) => (
                            <tr
                                key={index}
                                className="text-center border-b border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                                onClick={() => handleRowClick(student)}  // Handle row click
                            >
                                <td className="px-4 py-4">
                                    {student.image ? (
                                        <img src={student.image} alt={`${student.name} ${student.lastName}`} className="h-8 w-8 rounded-full" />
                                    ) : (
                                        <FaUserCircle className="text-gray-500 h-8 w-8" />
                                    )}
                                </td>
                                {selectedFields.regNumber && <td className="px-4 py-4 text-left ">{student.regNumber}</td>}
                                {selectedFields.name && <td className="px-4 py-4 text-left  ">{student.name} {student.lastName}</td>}
                                {selectedFields.class && <td className="px-4 py-4 text-left ">{student.class}</td>}
                                {selectedFields.section && <td className="px-4 py-4 text-left   ">{student.section}</td>}
                                {selectedFields.dateOfAdmission && <td className="px-4 py-4 text-left   ">{new Date(student.dateOfAdmission).toLocaleDateString()}</td>}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Export Button */}
            <button
                onClick={exportToExcel}
                className="mt-6 p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center gap-2"
            >
                <FaFileExport />
                Export to Excel
            </button>
        </div>
    );
};

export default StudentsList;
