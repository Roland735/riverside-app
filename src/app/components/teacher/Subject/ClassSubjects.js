import React, { useState } from 'react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

const getStatus = (marks) => {
    return marks.current >= 50 ? 'Passed' : 'Failed';
};

const getGrade = (marks) => {
    if (marks >= 90) return 'A*';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B';
    if (marks >= 60) return 'C';
    if (marks >= 50) return 'D';
    if (marks >= 40) return 'E';
    return 'U';
};

const SubjectList = ({ subjects }) => {
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

    const getNestedValue = (obj, key) => key.split('.').reduce((o, i) => o[i], obj);

    const sortedSubjects = [...subjects].sort((a, b) => {
        const aValue = getNestedValue(a, sortConfig.key);
        const bValue = getNestedValue(b, sortConfig.key);

        if (aValue < bValue) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    });

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const SortIcon = ({ column }) => {
        if (sortConfig.key !== column) return <FaSort />;
        return sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />;
    };

    return (
        <div className="bg-white dark:bg-cyan-950 shadow-lg rounded-lg p-6 m-4 w-full max-w-6xl">
            <h2 className="text-2xl font-bold mb-4text-cyan-950 dark:text-cyan-300">Subjects</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-cyan-950">
                    <thead>
                        <tr>
                            {['name', 'marks.current', 'marks.highest', 'marks.lowest', 'marks.mostImproved', 'marks.change', 'grade'].map((key) => (
                                <th
                                    key={key}
                                    className="py-2 px-4 border-b cursor-pointer text-sm leading-5 text-left text-gray-500 uppercase tracking-wider"
                                    onClick={() => requestSort(key)}
                                >
                                    {key.split('.').pop().replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                                    <SortIcon column={key} />
                                </th>
                            ))}
                            <th className="py-2 px-4 border-b">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedSubjects.map((subject, index) => (
                            <tr key={index} className='text-cyan-900 dark:text-cyan-100'>
                                <td className="py-2 px-4 border-b">{subject.name}</td>
                                <td className="py-2 px-4 border-b">{Math.round(subject.marks.current)}</td>
                                <td className="py-2 px-4 border-b">{Math.round(subject.marks.highest)}</td>
                                <td className="py-2 px-4 border-b">{Math.round(subject.marks.lowest)}</td>
                                <td className="py-2 px-4 border-b">{Math.round(subject.marks.mostImproved)}</td>
                                <td className="py-2 px-4 border-b">{Math.round(subject.marks.change)}%</td>
                                <td className="py-2 px-4 border-b">{getGrade(subject.marks.current)}</td>
                                <td className={`py-2 px-4 border-b ${subject.marks.current >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                                    {getStatus(subject.marks)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SubjectList;
