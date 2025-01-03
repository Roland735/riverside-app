// components/OverallAverageCard.js
import { useState } from 'react';

const OverallAverageCard = ({ average, change, grade }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md flex-grow">
            <h2 className="text-lg font-semibold">Overall Average</h2>
            <div className="flex justify-between items-center mt-2">
                <div>
                    <p className="text-gray-600 dark:text-gray-400">Average Mark</p>
                    <p className="text-3xl font-bold">{average}</p>
                </div>
                <div className="flex items-center">
                    <p className="text-gray-600 dark:text-gray-400">Change</p>
                    <p className={`ml-2 ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {change >= 0 ? '+' : '-'}
                        {Math.abs(change)}
                    </p>
                </div>
            </div>
            <div className="mt-4">
                <p className="text-gray-600 dark:text-gray-400">Cambridge Grade</p>
                <p className={`text-xl font-semibold ${grade === 'A*' || grade === 'A' ? 'text-green-500' : grade === 'B' || grade === 'C' ? 'text-yellow-500' : 'text-red-500'}`}>{grade}</p>
            </div>
        </div>
    );
};

export default OverallAverageCard;
