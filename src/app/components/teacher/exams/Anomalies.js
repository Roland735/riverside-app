"use client";
import React, { useState } from "react";
import { AiOutlineBarChart, AiOutlineLineChart } from "react-icons/ai";

const students = [
  {
    id: 1,
    name: "John Doe",
    class: 40,
    exam: 60,
    deviation: 10, // positive anomaly
    changeExamMark: +5, // improvement
    changeCourseworkAvg: +2,
    examAvgDiff: 5,
    courseworkAvgDiff: -2,
  },
  {
    id: 2,
    name: "Jane Smith",
    class: 55,
    exam: 70,
    deviation: -5, // negative anomaly
    changeExamMark: -3, // decline
    changeCourseworkAvg: -1,
    examAvgDiff: -10,
    courseworkAvgDiff: 3,
  },
  {
    id: 3,
    name: "Alice Johnson",
    class: 80,
    exam: 85,
    deviation: 0, // no anomaly
    changeExamMark: +2,
    changeCourseworkAvg: +1,
    examAvgDiff: 5,
    courseworkAvgDiff: -2,
  },
  {
    id: 4,
    name: "David Miller",
    class: 65,
    exam: 72,
    deviation: 3, // positive anomaly
    changeExamMark: +4,
    changeCourseworkAvg: +0.5,
    examAvgDiff: 2,
    courseworkAvgDiff: -1,
  },
  {
    id: 5,
    name: "Mary Williams",
    class: 78,
    exam: 82,
    deviation: -2, // negative anomaly
    changeExamMark: -1,
    changeCourseworkAvg: -0.5,
    examAvgDiff: -4,
    courseworkAvgDiff: 2,
  },
  {
    id: 6,
    name: "Michael Brown",
    class: 90,
    exam: 95,
    deviation: +8, // positive anomaly
    changeExamMark: +7,
    changeCourseworkAvg: +3,
    examAvgDiff: 10,
    courseworkAvgDiff: -5,
  },
  {
    id: 7,
    name: "Emily Jones",
    class: 50,
    exam: 62,
    deviation: -7, // negative anomaly
    changeExamMark: -4,
    changeCourseworkAvg: -2,
    examAvgDiff: -8,
    courseworkAvgDiff: 4,
  },
  {
    id: 8,
    name: "Charles Garcia",
    class: 62,
    exam: 70,
    deviation: 0, // no anomaly
    changeExamMark: +5,
    changeCourseworkAvg: +1,
    examAvgDiff: 3,
    courseworkAvgDiff: -2,
  },
  {
    id: 9,
    name: "Sarah Lee",
    class: 85,
    exam: 90,
    deviation: +7, // positive anomaly
    changeExamMark: +6,
    changeCourseworkAvg: +2.5,
    examAvgDiff: 8,
    courseworkAvgDiff: -3.5,
  },
  {
    id: 10,
    name: "Daniel Davis",
    class: 75,
    exam: 80,
    deviation: -3, // negative anomaly
    changeExamMark: -2,
    changeCourseworkAvg: -1,
    examAvgDiff: -5,
    courseworkAvgDiff: 3,
  },
];

const Anomalies = ({}) => {
  const [activeTab, setActiveTab] = useState("negative"); // Initial tab

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const filteredStudents =
    activeTab === "all"
      ? students
      : students.filter((student) => student.deviation > 0); // Filter for positive anomalies

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden my-5 w-full ">
      <div className="flex border-b border-gray-200  justify-evenly items-center">
        <button
          className={`px-4 py-2 flex items-center justify-center ${
            activeTab === "negative"
              ? "bg-rose-800 text-gray-100 font-bold"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => handleTabClick("negative")}
        >
          <AiOutlineBarChart className="mr-2 text-lg" /> Negative Anomalies
        </button>
        <button
          className={`px-4 py-2 flex items-center justify-center ${
            activeTab === "positive"
              ? "bg-emerald-600 text-gray-800 font-bold"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => handleTabClick("positive")}
        >
          <AiOutlineLineChart className="mr-2 text-lg" /> Positive Anomalies
        </button>
        <button
          className={`px-4 py-2 flex items-center justify-center ${
            activeTab === "all"
              ? "bg-gray-200 text-gray-800 font-bold"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => handleTabClick("all")}
        >
          All
        </button>
      </div>
      <div className="p-4">
        {filteredStudents.length > 0 ? (
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Change in Exam Mark</th>
                <th className="py-2 px-4">Change in Coursework Avg</th>
                <th className="py-2 px-4">Class Exam Avg Diff.</th>
                <th className="py-2 px-4">Class CW Avg Diff.</th>
                <th className="py-2 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-2 px-4 ">{student.name}</td>
                  <td className="py-2 px-4 text-center">
                    {student.changeExamMark}
                  </td>
                  <td className="py-2 px-4 text-center">
                    {student.changeCourseworkAvg}
                  </td>
                  <td className="py-2 px-4 text-center">
                    {student.examAvgDiff}
                  </td>
                  <td className="py-2 px-4 text-center">
                    {student.courseworkAvgDiff}
                  </td>
                  <td className="py-2 px-4 text-center">
                    {/* Replace with your link creation logic */}
                    <a
                      href={`/student/${student.id}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      View Details
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600 text-center">
            No anomalies found for this tab.
          </p>
        )}
      </div>
    </div>
  );
};

export default Anomalies;
