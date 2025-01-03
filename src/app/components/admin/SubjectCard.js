import React from "react";
import { FaUserGraduate, FaArrowUp, FaArrowDown, FaChalkboardTeacher } from "react-icons/fa";
import { MdOutlineSchool } from "react-icons/md";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const SubjectCard = ({ subjectData }) => {
    const { subject, cambridgeGrade, standardDeviation, teachers, headOfDepartment, averageMark } = subjectData;

    const getRingColor = (mark) => {
        if (mark >= 80) return "#3B82F6"; // blue for high marks
        if (mark >= 50) return "#FBBF24"; // yellow for moderate marks
        return "#EF4444"; // red for low marks
    };

    return (
        <div className="flex-1 bg-slate-300 dark:bg-slate-700 text-cyan-950 dark:text-slate-300  rounded-lg shadow-md p-6">
            <div className="flex justify-between my-4">
                <h3 className="text-xl font-bold mb-2">{subject}</h3>
                <div className="w-24 h-24 lg:w-32 lg:h-32 ml-4 lg:ml-8">
                    <CircularProgressbar
                        value={averageMark}
                        maxValue={100}
                        text={`${Math.round(averageMark)}%`}
                        styles={buildStyles({
                            pathColor: getRingColor(averageMark),
                            textColor: "#3b82f6",
                            trailColor: "rgba(255, 255, 255, 0.2)",
                        })}
                    />
                </div>
            </div>
            <p className="text-lg flex items-center">
                <FaUserGraduate className="mr-2" /> {cambridgeGrade}
            </p>
            <p className="text-lg flex items-center">
                <span className="font-semibold">Standard Deviation:</span> {standardDeviation}
            </p>

            <p className="text-lg flex items-center">
                <MdOutlineSchool className="mr-2" /> Head of Department: {headOfDepartment}
            </p>
            <button className="mt-4 bg-cyan-600 text-white rounded-md px-4 py-2">
                More Info
            </button>
        </div>
    );
};

export default SubjectCard;
