import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { FaArrowUp, FaArrowDown, FaEquals } from "react-icons/fa";

const ClassCard = ({ classData }) => {
    const { className, averageMark, teachers, cambridgeGrade, markChange, attendance, subjectName } = classData;

    return (
        <div className="dark:bg-slate-700 bg-slate-300 text-white rounded-lg shadow-md px-8 py-4 flex items-center justify-between">

            <div className="flex flex-col items-start justify-start space-y-2">
                <h2 className="text-2xl font-bold mb-2 dark:text-slate-50 text-cyan-950 ">
                    {className}: {subjectName}
                </h2>
                <p className="text-lg dark:text-slate-50 text-cyan-950 ">
                    <span className="font-semibold dark:text-slate-50 text-cyan-950 ">Cambridge Grade:</span>{" "}
                    {cambridgeGrade}
                </p>
                <p className="text-lg">
                    <span className="font-semibold dark:text-slate-50 text-cyan-950 ">Mark Change:</span>{" "}
                    {parseInt(markChange) > 0 ? (
                        <span className="text-green-500">
                            <FaArrowUp className="inline-block text-lg" />
                            {markChange}
                        </span>
                    ) : parseInt(markChange) < 0 ? (
                        <span className="text-red-500">
                            <FaArrowDown className="inline-block text-lg" />
                            {markChange}
                        </span>
                    ) : (
                        <span className="text-cyan-950">
                            <FaEquals className="inline-block text-lg" />
                            {markChange}
                        </span>
                    )}
                </p>
                <p className="text-lg dark:text-slate-50 text-cyan-950 ">
                    <span className="font-semibold dark:text-slate-50 text-cyan-950 ">Attendance:</span>{" "}
                    {attendance}
                </p>
                <p className="text-lg dark:text-slate-50 text-cyan-950 ">
                    <span className="font-semibold">Teachers:</span>{" "}
                    {teachers.join(", ")}
                </p>
            </div>
            <div className="text-center mb-4">

                <div className="w-24 h-24 lg:w-32 lg:h-32">
                    <CircularProgressbar
                        value={averageMark}
                        maxValue={100}
                        text={`${Math.round(averageMark)}%`}
                        styles={buildStyles({
                            pathColor: '#3B82F6',  // Replace with your desired color or function
                            textColor: "white",
                            trailColor: "rgba(255, 255, 255, 0.2)",
                        })}
                    />
                </div>
            </div>
        </div>
    );
};

export default ClassCard;
