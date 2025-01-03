import React, { useState } from "react";
import { FaUser, FaArrowUp, FaArrowDown } from "react-icons/fa";

const StudentTable = ({ students }) => {
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");

    const sortStudents = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortOrder("asc");
        }
    };

    const sortedStudents = [...students].sort((a, b) => {
        // Determine the value to compare based on sortBy
        let aValue, bValue;

        if (sortBy === "name") {
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
        } else if (sortBy === "assignment") {
            aValue = parseInt(a.assignment) || 0;
            bValue = parseInt(b.assignment) || 0;
        } else if (sortBy === "test") {
            aValue = parseInt(a.test) || 0;
            bValue = parseInt(b.test) || 0;
        } else if (sortBy === "quiz") {
            aValue = parseInt(a.quiz) || 0;
            bValue = parseInt(b.quiz) || 0;
        } else if (sortBy === "change") {
            aValue = parseInt(a.change) || 0;
            bValue = parseInt(b.change) || 0;
        } else {
            // Default case or handle additional sorting criteria
            aValue = 0; // Example default value, adjust as needed
            bValue = 0; // Example default value, adjust as needed
        }

        // Implement sorting logic based on the values and sortOrder
        if (sortOrder === "asc") {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
    });

    const toggleSortIcon = (column) => {
        if (sortBy === column) {
            return sortOrder === "asc" ? <FaArrowUp className="ml-1" /> : <FaArrowDown className="ml-1" />;
        }
        return null;
    };

    return (
        <div className="bg-slate-300 dark:bg-slate-700 dark:text-slate-50 text-cyan-950 rounded-lg shadow-md p-4">
            <h2 className="text-xl font-bold mb-4">Student Performance</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-slate-300 dark:bg-slate-700">
                        <tr>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium dark:text-slate-50 text-cyan-950 uppercase tracking-wider cursor-pointer"
                                onClick={() => sortStudents("name")}
                            >
                                Name {toggleSortIcon("name")}
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium dark:text-slate-50 text-cyan-950 uppercase tracking-wider cursor-pointer"
                                onClick={() => sortStudents("assignment")}
                            >
                                Assignment {toggleSortIcon("assignment")}
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium dark:text-slate-50 text-cyan-950 uppercase tracking-wider cursor-pointer"
                                onClick={() => sortStudents("test")}
                            >
                                Test {toggleSortIcon("test")}
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium dark:text-slate-50 text-cyan-950 uppercase tracking-wider cursor-pointer"
                                onClick={() => sortStudents("quiz")}
                            >
                                Quiz {toggleSortIcon("quiz")}
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium dark:text-slate-50 text-cyan-950 uppercase tracking-wider cursor-pointer"
                                onClick={() => sortStudents("change")}
                            >
                                Change {toggleSortIcon("change")}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium dark:text-slate-50 text-cyan-950 uppercase tracking-wider">
                                Link
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-slate-300 dark:bg-slate-700  divide-y divide-gray-200">
                        {sortedStudents.map((student, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            {student.imageUrl ? (
                                                <img className="h-10 w-10 rounded-full" src={student.imageUrl} alt={student.name} />
                                            ) : (
                                                <FaUser className="h-10 w-10 text-gray-400" />
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium dark:text-slate-50 text-cyan-950 ">
                                                {student.name}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm dark:text-slate-50 text-cyan-950 ">{student.assignment}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm dark:text-slate-50 text-cyan-950 ">{student.test}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm dark:text-slate-50 text-cyan-950 ">{student.quiz}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {parseInt(student.change) > 0 ? (
                                        <span className="text-green-500 flex items-center">
                                            <FaArrowUp className="mr-1" />
                                            {student.change}
                                        </span>
                                    ) : parseInt(student.change) < 0 ? (
                                        <span className="text-red-500 flex items-center">
                                            <FaArrowDown className="mr-1" />
                                            {student.change}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">No change</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <a href={`/dashboard/admin/student/${student.regNumber}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                        Link
                                    </a>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentTable;
