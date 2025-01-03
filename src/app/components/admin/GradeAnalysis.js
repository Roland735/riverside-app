// components/GradeAnalysis.js

import React from "react";
import { motion } from "framer-motion";
import {
  FaArrowUp,
  FaArrowDown,
  FaEquals,
  FaChalkboardTeacher,
  FaUserGraduate,
} from "react-icons/fa";
import { MdOutlineSchool } from "react-icons/md";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Anomalies from "./Anomalies";
import Link from "next/link";

const GradeAnalysis = ({ gradeName, classes }) => {
  // Calculate average attendance
  const totalAttendance = classes.reduce(
    (acc, curr) => acc + parseInt(curr.attendance),
    0
  );
  const avgAttendance = totalAttendance / classes.length;

  // Prepare data for Recharts BarChart
  const subjects = ["Maths", "English", "Science"];
  const data = subjects.map((subject) => {
    const subjectData = { subject };
    classes.forEach((cls) => {
      const classSubject = cls.subjects.find((sub) => sub.subject === subject);
      if (classSubject) {
        subjectData[cls.class] = classSubject.mark;
      }
    });
    return subjectData;
  });

  const getRingColor = (mark) => {
    if (mark >= 80) return "green";
    if (mark >= 50) return "yellow";
    return "red";
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Grade Analysis Cards */}
      <div className="">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {classes.map((classData, index) => {
            const averageMark =
              classData.subjects.reduce((sum, sub) => sum + sub.mark, 0) /
              classData.subjects.length;
            return (
              <motion.div
                key={index}
                className="bg-slate-300 dark:bg-slate-700 text-cyan-950 dark:text-slate-50 rounded-lg shadow-md p-4 flex flex-col lg:flex-row items-center lg:items-stretch justify-between mb-4"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex-1">
                  <div className="flex justify-between my-4">
                    <h3 className="text-xl font-bold mb-2">
                      {classData.class}
                    </h3>
                    <div className="w-24 h-24 lg:w-32 lg:h-32 ml-4 lg:ml-8">
                      <CircularProgressbar
                        value={averageMark}
                        maxValue={100}
                        text={`${Math.round(averageMark)}%`}
                        styles={buildStyles({
                          pathColor: getRingColor(averageMark),
                          textColor: "white",
                          trailColor: "rgba(255, 255, 255, 0.2)",
                        })}
                      />
                    </div>
                  </div>
                  <p className="text-lg flex items-center">
                    <FaUserGraduate className="mr-2" />{" "}
                    {classData.cambridgeGrade}
                  </p>
                  <p className="text-lg flex items-center">
                    {parseInt(classData.markChange) > 0 ? (
                      <span className="text-green-500 flex items-center">
                        <FaArrowUp className="mr-2" />
                        {classData.markChange}
                      </span>
                    ) : parseInt(classData.markChange) < 0 ? (
                      <span className="text-red-500 flex items-center">
                        <FaArrowDown className="mr-2" />
                        {classData.markChange}
                      </span>
                    ) : (
                      <span className="text-gray-400 flex items-center">
                        <FaEquals className="mr-2" />
                        {classData.markChange}
                      </span>
                    )}
                  </p>
                  <p className="text-lg flex items-center">
                    <MdOutlineSchool className="mr-2" /> {classData.attendance}
                  </p>
                  <p className="text-lg flex items-center mb-5">
                    <FaChalkboardTeacher className="mr-2" />{" "}
                    {classData.teachers.join(", ")}
                  </p>
                  <Link
                    href={`/dashboard/admin/${classData.class}/${gradeName}/2025`}
                    className=" bg-cyan-600 text-white rounded-md px-4 py-2"
                  >
                    More Info
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recharts Bar Chart */}
      <div className="bg-slate-300 dark:bg-slate-700 text-cyan-950 dark:text-slate-50 rounded-lg shadow-md p-4">
        <h2 className="text-xl font-bold mb-4">Marks Comparison</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="subject" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Class A" fill="#8884d8" />
            <Bar dataKey="Class B" fill="#82ca9d" />
            <Bar dataKey="Class C" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Anomalies Component */}
      <Anomalies gradeName={gradeName} classes={classes} />
    </div>
  );
};

export default GradeAnalysis;
