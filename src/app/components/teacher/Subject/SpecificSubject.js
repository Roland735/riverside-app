"use client";
// pages/SpecificSubjectAnalysis.js

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";
import DataComponent from "./SubjectSpecificInfo";
import TopicTable from "../topics/Tables";

const SpecificSubjectAnalysis = ({ subjectName, className, year, role }) => {
  const [isOnTrack, setIsOnTrack] = useState(true);
  const [data, setData] = useState({
    assignmentData: null,
    testData: null,
    overallData: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/subjectinfo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ subjectName, year, className }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result = await response.json();
        console.log(result.teacherData);

        setData({
          assignmentData: result.assignmentData,
          testData: result.testData,
          overallData: result.overallData,
          topics: result.topics,
          currentTeachers: result.teacherData,
        });

        // Update the isOnTrack state based on the fetched data if needed
        // setIsOnTrack(determineTrackStatus(result));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subjectName, year]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4 dark:text-cyan-50 text-cyan-900">
        {subjectName} Analysis
      </h1>
      <div className="flex flex-col lg:flex-row lg:space-x-8 mb-8 items-stretch">
        <div className="w-full lg:w-1/3 mb-8 lg:mb-0 flex-grow">
          <div className="textColor combination shadow-md p-6 rounded-md h-full flex flex-col justify-between">
            <div className="">
              <h2 className="text-xl font-semibold mb-2 ">Class Information</h2>
              <p className="mb-1">
                <span className="font-bold">Class Name:</span> {className}
              </p>
              {/* <p className="mb-1">
                                <span className="font-bold">Grade:</span> {parseInt(className, 10)}
                            </p> */}{" "}
              <span className="font-bold">Current Teachers:</span>{" "}
              {console.log(data.currentTeachers)}
              {data.currentTeachers.map((teacher, index) => (
                <div key={index} className="flex items-center mb-1">
                  <img
                    src={
                      teacher.pic
                        ? teacher.pic
                        : "https://via.placeholder.com/40"
                    }
                    alt={teacher.name} // Use teacher.name for the alt text
                    className="w-10 h-10 rounded-full mr-2"
                  />
                  <p>
                    {teacher.name} {/* Display teacher's name */}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/3 mb-8 lg:mb-0 flex-grow ">
          <div className=" combination shadow-md p-6 rounded-md h-full flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">Status</h2>
              <p className="text-lg">
                Status:{" "}
                <span
                  className={`font-bold ${
                    isOnTrack ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isOnTrack ? "On Track" : "Not On Track"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      {console.log(data.topics)}
      <TopicTable
        topics={data.topics}
        role={role}
        year={year}
        className={className}
        subjectName={subjectName}
      />
      <div className="grid grid-cols-1 gap-6 w-full">
        {data.assignmentData && (
          <DataComponent
            data={data.assignmentData}
            title="Assignment Performance"
          />
        )}
        {data.testData && (
          <DataComponent data={data.testData} title="Test Performance" />
        )}
        {data.overallData && (
          <DataComponent data={data.overallData} title="Overall Performance" />
        )}
      </div>
    </div>
  );
};

export default SpecificSubjectAnalysis;
