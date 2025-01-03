import React from "react";
import { FaArrowUp, FaArrowDown, FaUser } from "react-icons/fa";

const PerformanceCard = ({ title, data }) => {
    const { studentName, change, imageUrl } = data;

    return (
        <div className="dark:text-slate-50 text-cyan-950 bg-slate-300 dark:bg-slate-700  rounded-lg shadow-md p-4">
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            <div className="flex items-center">
                <div className="flex-shrink-0 h-16 w-16">
                    {imageUrl ? (
                        <img className="h-16 w-16 rounded-full" src={imageUrl} alt={studentName} />
                    ) : (
                        <div className="h-16 w-16 flex items-center justify-center bg-gray-200 rounded-full">
                            <FaUser className="h-8 w-8 text-gray-400" />
                        </div>
                    )}
                </div>
                <div className="flex-1 ml-4">
                    <p className="text-lg">
                        <span className="font-semibold">Student Name:</span> {studentName}
                    </p>
                    <p className="text-lg">
                        <span className="font-semibold">Change:</span>{" "}
                        {parseInt(change) > 0 ? (
                            <span className="text-green-500">
                                <FaArrowUp className="inline-block text-lg" />
                                {change}
                            </span>
                        ) : parseInt(change) < 0 ? (
                            <span className="text-red-500">
                                <FaArrowDown className="inline-block text-lg" />
                                {change}
                            </span>
                        ) : (
                            <span className="text-gray-400">No change</span>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PerformanceCard;
