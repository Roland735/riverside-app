import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

const AnomalyClassesCard = ({ anomalyClasses }) => {
    return (
        <div className="bg-slate-300 dark:bg-slate-700 text-cyan-950 dark:text-slate-300  rounded-lg shadow-md p-4 mt-4">
            <h2 className="text-xl font-bold mb-4 flex items-center">
                <FaExclamationTriangle className="mr-2 text-red-500" />
                Anomaly Classes
            </h2>
            {anomalyClasses.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Class Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Average Mark
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Teachers
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Number of Students
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Description
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {anomalyClasses.map((classData, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {classData.className}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {classData.averageMark}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {classData.teachers.join(", ")}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {classData.numberOfStudents}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {`Average mark ${classData.averageMark} is below the threshold.`}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-sm text-gray-500">No anomaly classes found.</p>
            )}
        </div>
    );
};

export default AnomalyClassesCard;
