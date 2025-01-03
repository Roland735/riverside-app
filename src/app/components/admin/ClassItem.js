import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import Link from "next/link";

const ClassItem = ({ classData, year, grade }) => (
  <div className="block my-4">
    <div className="dark:bg-slate-800 bg-slate-300 p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1">
      <div className="flex items-center justify-between ">
        <div className="text-lg font-bold text-cyan-950 dark:text-cyan-50">
          {classData.class} - {classData.className}
        </div>
        <div className="text-xl font-bold text-gray-700 dark:text-slate-50">
          {Math.round(classData.mark)}
        </div>
      </div>
      <div className="mt-2 flex items-center">
        <div
          className={`text-${parseInt(classData.markChange) >= 0 ? "green" : "red"
            }-500`}
        >
          {parseInt(classData.markChange) > 0 ? (
            <FaArrowUp className="inline-block text-lg" />
          ) : parseInt(classData.markChange) < 0 ? (
            <FaArrowDown className="inline-block text-lg" />
          ) : (
            <div className="inline-block text-gray-400">-</div>
          )}
          <span className="ml-1">{classData.markChange}</span>
        </div>
        <div className="flex items-center ml-auto">
          <div className="text-sm text-gray-400">
            {classData.cambridgeGrade}
          </div>
        </div>
      </div>
      <div className="mt-3">
        {/* <div className="text-sm text-gray-600 dark:text-slate-50">
          Attendance: {classData.attendance}
        </div> */}
        <div className="text-sm text-gray-600 dark:text-slate-50 flex items-center space-x-2">
          <div className="">Teachers:</div>
          {classData.teachers.map((teacher) => (
            <div key={teacher.id}>{teacher.name}</div> // Add a unique key prop
          ))}

        </div>
      </div>
      <div className="bg-blue-800  mt-4 p-4 rounded-lg text-slate-50 cursor-pointer">
        <Link
          href={`/dashboard/admin/${classData.class}/${classData.className}/${year}`}
          passHref
        >
          More Info
        </Link>
      </div>
    </div>
  </div>
);

export default ClassItem;
