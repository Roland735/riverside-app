import React, { useState } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import Select from 'react-select';
import Link from 'next/link'; // Import Link from next/link

const ClassesTableCard = ({ classesData }) => {
    const [teacherFilter, setTeacherFilter] = useState(null);
    const [markRange, setMarkRange] = useState({ min: 0, max: 100 });
    const [studentRange, setStudentRange] = useState({ min: 0, max: Infinity });
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortOrder("asc");
        }
    };

    const toggleSortIcon = (column) => {
        if (sortBy === column) {
            return sortOrder === "asc" ? <FaArrowUp className="ml-1" /> : <FaArrowDown className="ml-1" />;
        }
        return null;
    };

    const handleClearFilters = () => {
        setTeacherFilter(null);
        setMarkRange({ min: 0, max: 100 });
        setStudentRange({ min: 0, max: Infinity });
        setSearchQuery("");
    };

    const teachers = [...new Set(classesData.flatMap(classInfo => classInfo.teachers))];
    const teacherOptions = teachers.map(teacher => ({ value: teacher, label: teacher }));

    const filteredClasses = classesData
        .filter((classInfo) => {
            if (teacherFilter && !classInfo.teachers.includes(teacherFilter.value)) {
                return false;
            }
            if (classInfo.averageMark < markRange.min || classInfo.averageMark > markRange.max) {
                return false;
            }
            if (classInfo.numberOfStudents < studentRange.min || classInfo.numberOfStudents > studentRange.max) {
                return false;
            }
            if (searchQuery && !(
                classInfo.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
                classInfo.teachers.some(teacher => teacher.toLowerCase().includes(searchQuery.toLowerCase()))
            )) {
                return false;
            }
            return true;
        })
        .sort((a, b) => {
            let aValue, bValue;

            if (sortBy === "className") {
                aValue = a.className;
                bValue = b.className;
            } else if (sortBy === "averageMark") {
                aValue = a.averageMark;
                bValue = b.averageMark;
            } else if (sortBy === "numberOfStudents") {
                aValue = a.numberOfStudents;
                bValue = b.numberOfStudents;
            } else {
                return 0;
            }

            if (aValue < bValue) {
                return sortOrder === "asc" ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortOrder === "asc" ? 1 : -1;
            }
            return 0;
        });

    return (
        <div className="flex-1 bg-slate-300 dark:bg-slate-700 text-cyan-950 dark:text-slate-300  rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-6">Classes Taking the Subject</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search by Class or Teacher</label>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 focus:border-cyan-500 focus:ring-cyan-500"
                        placeholder="Search..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Teacher</label>
                    <Select
                        options={teacherOptions}
                        onChange={setTeacherFilter}
                        value={teacherFilter}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        isClearable
                        placeholder="Select a teacher..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Average Mark Range</label>
                    <div className="flex space-x-2">
                        <input
                            type="number"
                            value={markRange.min}
                            onChange={(e) => setMarkRange({ ...markRange, min: Number(e.target.value) })}
                            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 focus:border-cyan-500 focus:ring-cyan-500"
                            placeholder="Min"
                        />
                        <input
                            type="number"
                            value={markRange.max}
                            onChange={(e) => setMarkRange({ ...markRange, max: Number(e.target.value) })}
                            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 focus:border-cyan-500 focus:ring-cyan-500"
                            placeholder="Max"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Number of Students</label>
                    <div className="flex space-x-2">
                        <input
                            type="number"
                            value={studentRange.min}
                            onChange={(e) => setStudentRange({ ...studentRange, min: Number(e.target.value) })}
                            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 focus:border-cyan-500 focus:ring-cyan-500"
                            placeholder="Min"
                        />
                        <input
                            type="number"
                            value={studentRange.max}
                            onChange={(e) => setStudentRange({ ...studentRange, max: Number(e.target.value) })}
                            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 focus:border-cyan-500 focus:ring-cyan-500"
                            placeholder="Max"
                        />
                    </div>
                </div>
                <div className="col-span-1 md:col-span-4">
                    <button
                        onClick={handleClearFilters}
                        className="mt-4 bg-red-500 text-white rounded-md px-4 py-2"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort("className")}
                            >
                                Class
                                {toggleSortIcon("className")}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort("averageMark")}
                            >
                                Average Mark
                                {toggleSortIcon("averageMark")}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Teachers
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort("numberOfStudents")}
                            >
                                Number of Students
                                {toggleSortIcon("numberOfStudents")}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredClasses.map((classInfo, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {classInfo.className}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{classInfo.averageMark}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{classInfo.teachers.join(", ")}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{classInfo.numberOfStudents}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Link href={`/class/${encodeURIComponent(classInfo.className)}`} passHref legacyBehavior>
                                        <a className="text-cyan-600 hover:underline">
                                            Analyze Class
                                        </a>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClassesTableCard;
