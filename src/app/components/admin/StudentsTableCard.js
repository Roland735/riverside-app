import React from "react";

const StudentsTableCard = ({ studentsData }) => {
    return (
        <div className="bg-slate-300 dark:bg-slate-700 dark:text-slate-50 text-cyan-950  rounded-lg shadow-md p-4 mt-4">
            <h3 className="text-xl font-bold mb-4">Students and Their Marks</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium  text-cyan-950  uppercase tracking-wider">
                                Student Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium  text-cyan-950  uppercase tracking-wider">
                                Overall Mark
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium  text-cyan-950  uppercase tracking-wider">
                                Assignment Mark
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium  text-cyan-950  uppercase tracking-wider">
                                Test Mark
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium  text-cyan-950  uppercase tracking-wider">
                                Quiz Mark
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {studentsData.map((student, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium  text-cyan-950 ">
                                        {student.studentName}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm  text-cyan-950 text-center  ">{Math.round(student.mark)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm  text-cyan-950 text-center  ">{Math.round(student.assignment)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm  text-cyan-950 text-center  ">{Math.round(student.test)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm  text-cyan-950 text-center  ">{Math.round(student.quiz)}</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentsTableCard;
