

import React from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const Week = ({ topic, weeks, assignmentAverage, testAverage, completed }) => {
    return (
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div>
                <h5 className="text-lg font-bold">{topic}</h5>
                <p className="text-sm text-gray-600">{weeks} weeks</p>
            </div>
            <div className="flex items-center">
                <p className="text-sm text-gray-600">Assignment Average: {assignmentAverage}</p>
                <p className="text-sm text-gray-600">Test Average: {testAverage}</p>
                {completed ? (
                    <FaCheckCircle className="text-green-500" />
                ) : (
                    <FaTimesCircle className="text-red-500" />
                )}
            </div>
        </div>
    );
};

export default Week;

