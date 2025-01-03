// components/Anomalies.js

import React, { useState } from "react";
import { FaExclamationCircle } from "react-icons/fa";

const Anomalies = ({ gradeName, classes }) => {
    const [activeTab, setActiveTab] = useState("positive");

    // Filter classes based on active tab (positive or negative anomalies)
    const filteredClasses = classes.filter((classData) => {
        if (activeTab === "positive") {
            return (
                parseInt(classData.markChange) > 0 ||
                parseInt(classData.attendance.replace("%", "")) >= 80 ||
                classData.subjects.some((sub) => sub.mark < 50) ||
                classData.teachers.length === 1
            );
        } else {
            return (
                parseInt(classData.markChange) < 0 ||
                parseInt(classData.attendance.replace("%", "")) < 80 ||
                classData.subjects.some((sub) => sub.mark > 90) ||
                classData.teachers.length > 2
            );
        }
    });

    const getAnomalyType = (classData) => {
        if (activeTab === "positive") {
            if (parseInt(classData.markChange) > 0) {
                return `Mark Increase: +${classData.markChange}`;
            } else if (parseInt(classData.attendance.replace("%", "")) >= 80) {
                return `High Attendance: ${classData.attendance}`;
            } else if (classData.subjects.some((sub) => sub.mark < 50)) {
                return `Low Subject Marks`;
            } else if (classData.teachers.length === 1) {
                return `Single Teacher`;
            }
        } else {
            if (parseInt(classData.markChange) < 0) {
                return `Mark Decrease: ${classData.markChange}`;
            } else if (parseInt(classData.attendance.replace("%", "")) < 80) {
                return `Low Attendance: ${classData.attendance}`;
            } else if (classData.subjects.some((sub) => sub.mark > 90)) {
                return `High Subject Marks`;
            } else if (classData.teachers.length > 2) {
                return `Multiple Teachers`;
            }
        }
        return "";
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4 text-cyan-950 dark:text-slate-50">
                Anomalies in {gradeName}
            </h2>
            {/* Tab Navigation */}
            <div className="flex mb-4">
                <button
                    onClick={() => setActiveTab("positive")}
                    className={`${activeTab === "positive"
                        ? "bg-cyan-600 text-white"
                        : "bg-gray-300 text-gray-800"
                        } px-4 py-2 rounded-l-md`}
                >
                    Positive Anomalies
                </button>
                <button
                    onClick={() => setActiveTab("negative")}
                    className={`${activeTab === "negative"
                        ? "bg-cyan-600 text-white"
                        : "bg-gray-300 text-gray-800"
                        } px-4 py-2 rounded-r-md`}
                >
                    Negative Anomalies
                </button>
            </div>
            {/* Anomalies Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Class Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Anomaly Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Details
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredClasses.length > 0 ? (
                            filteredClasses.map((classData, index) => (
                                <tr
                                    key={index}
                                    className={`${activeTab === "positive"
                                        ? "bg-green-700 text-white"
                                        : "bg-red-900 text-white"
                                        }`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium">
                                            {classData.class}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium flex items-center">
                                            <FaExclamationCircle className="mr-2" />
                                            {getAnomalyType(classData)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium">
                                            <button className="text-cyan-600 hover:text-cyan-900 focus:outline-none">
                                                More Info
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr className="text-center text-lg text-green-500">
                                <td colSpan="3">No anomalies found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Anomalies;
