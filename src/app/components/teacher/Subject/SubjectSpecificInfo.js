"use client";
import React, { useEffect, useState } from "react";
import StudentCard from "./StudentCard";
import {
  CartesianGrid,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const DataComponent = ({ data, title }) => {
  console.log(data.areaData);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    highestStudent,
    lowestStudent,
    mostImprovedStudent,
    mostUnimprovedStudent,
    scatterData,
    areaData,
  } = data;

  if (!isClient) {
    return null; // Avoid rendering on the server
  }

  return (
    <div className="p-6  rounded-lg shadow-md w-full combination borders">
      <h1 className="text-xl font-bold mb-4 textColor">{title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            title: "Highest Performing Student",
            student: highestStudent,
            delay: 0,
          },
          {
            title: "Lowest Performing Student",
            student: lowestStudent,
            delay: 0.2,
          },
          {
            title: "Most Improved Student",
            student: mostImprovedStudent,
            delay: 0.4,
          },
          {
            title: "Most Unimproved Student",
            student: mostUnimprovedStudent,
            delay: 0.6,
          },
        ].map(({ title, student, delay }, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className="bg-cyan-950 p-4 rounded-lg shadow-md"
          >
            <h2 className="text-lg font-semibold mb-4 text-cyan-200">
              {title}
            </h2>
            <StudentCard student={student} />
          </motion.div>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-6 items-center w-full justify-between">
        <div className="mt-8 bg-cyan-950 p-6 rounded-md">
          <h2 className="text-lg font-semibold mb-4 text-cyan-200">
            Scatter Graph for All Student Marks
          </h2>
          <ResponsiveContainer width={480} height={400}>
            <ScatterChart>
              <CartesianGrid />
              <XAxis dataKey="name" />
              <YAxis type="number" dataKey="score" name="Score" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter name="Students" data={scatterData} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-8 bg-cyan-950 p-6 rounded-md">
          <h2 className="text-lg font-semibold mb-4 text-cyan-200">
            Area Graph for All Topics
          </h2>
          <div className="w-full flex justify-center items-center">
            <ResponsiveContainer width={480} height={400}>
              <AreaChart data={areaData}>
                <CartesianGrid />
                <XAxis dataKey="title" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  fill="#8884d8"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataComponent;
