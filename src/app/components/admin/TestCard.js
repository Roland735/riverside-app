import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const TestCard = ({ averageMark, change }) => {
    return (
        <div className="bg-slate-300 dark:bg-slate-700 rounded-lg shadow-md p-4 mb-4">
            <h2 className="text-xl font-bold mb-4 dark:text-slate-50 text-cyan-950">Test Performance</h2>
            <div className="flex items-center justify-between mb-2 dark:text-slate-50 text-cyan-950">
                <div>
                    <p className="text-lg font-semibold">Average Mark: {averageMark}</p>
                    <p className="text-sm dark:text-slate-50 text-cyan-950">Out of 100</p>
                </div>
            </div>
            <div className="dark:text-slate-50 text-cyan-950">
                <p className="text-lg font-semibold">Change: {parseInt(change) > 0 ? (
                    <span className="text-green-500 flex items-center">
                        <FaArrowUp className="mr-1" />
                        {change}
                    </span>
                ) : parseInt(change) < 0 ? (
                    <span className="text-red-500 flex items-center">
                        <FaArrowDown className="mr-1" />
                        {change}
                    </span>
                ) : (
                    <span className="text-gray-400">No change</span>
                )}</p>
            </div>
        </div>
    );
};

export default TestCard;
