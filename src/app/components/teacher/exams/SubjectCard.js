import React from "react";
import { AiFillStar } from "react-icons/ai";

const SubjectCard = ({ averageMark, dataType }) => {
    return (
        <div className="flex flex-col w-1/5 bg-white shadow-md rounded-lg overflow-hidden">
            <div className="flex-grow px-4 py-5">
                <h5 className="text-xl font-bold text-gray-800">{dataType}</h5>
                <p className="text-gray-600 mt-1">
                    Mark:
                    <span className="inline-block ml-2 text-xl font-bold text-gray-900">
                        {averageMark}
                    </span>
                </p>
            </div>
            <div className="flex items-center px-4 py-3 bg-gray-200">
                <AiFillStar className="text-yellow-400 text-2xl" />
                <span className="ml-2 text-sm text-gray-600">Good Effort!</span>
            </div>
        </div>
    );
};

export default SubjectCard;
