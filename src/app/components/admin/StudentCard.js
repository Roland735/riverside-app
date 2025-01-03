import React from "react";
import { FaUser } from "react-icons/fa";

const StudentCard = ({ title, data }) => {
    const { studentName, mark, imageUrl } = data;

    return (
        <div className="bg-slate-300 dark:bg-slate-700 dark:text-slate-50 text-cyan-950  rounded-lg shadow-md p-4 flex items-center justify-center space-x-4">
            <div className="flex-shrink-0 h-16 w-16">
                {imageUrl ? (
                    <img className="h-16 w-16 rounded-full" src={imageUrl} alt={studentName} />
                ) : (
                    <div className="h-16 w-16 flex items-center justify-center bg-gray-200 rounded-full">
                        <FaUser className="h-8 w-8 text-gray-400" />
                    </div>
                )}
            </div>
            <div className="flex flex-col items-start justify-center">
                <h3 className="text-lg font-bold mb-1">{title}</h3>
                <p className="text-lg">{studentName}</p>
                <p className="text-sm text-gray-600">Mark: {mark}</p>
            </div>
        </div>
    );
};

export default StudentCard;
