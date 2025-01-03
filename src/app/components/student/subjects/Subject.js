import { useState } from "react";
import { motion } from "framer-motion";
import { AiOutlineArrowLeft } from "react-icons/ai";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Line,
} from "recharts";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Link from "next/link";
import { sub } from "date-fns";

// Function to calculate the average score
const calculateAverage = (test) => {
  if (!test || test.length === 0) return 0;
  const total = test.reduce((sum, grade) => sum + (grade.testMark || 0), 0);
  return (total / test.length).toFixed(2);
};

// Function to convert a score to a Cambridge grade
const getCambridgeGrade = (score) => {
  if (score >= 90) return "A*";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  if (score >= 40) return "E";
  return "U";
};

const analyzeAnomalies = (topics) => {
  if (!topics || topics.length === 0) return [];
  return topics.filter(
    (topic) =>
      topic.testAverage !== null && topic.testAverage < topic.assignmentAverage
  );
};
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};
const SubjectDetailPage = ({ subjectData }) => {
  console.log(subjectData);
  const [activeTab, setActiveTab] = useState("assignments");

  const subjectDetail = subjectData.subjectDetail || {};
  const averageScore = calculateAverage(subjectDetail.tests || []);
  const anomalies = analyzeAnomalies(subjectDetail.topics || []);

  const renderTabContent = () => {
    let data;
    let columns = [];

    switch (activeTab) {
      case "assignments":
        data = subjectDetail.assignments || [];
        columns = [
          { key: "assignmentName", label: "Assignment Name" },
          { key: "assignedDate", label: "Assigned Date" },
          { key: "assignmentMark", label: "Percentage" },
          { key: "absent", label: "Absent" },
          { key: "absent", label: "Late" },
        ];
        break;
      case "tests":
        data = subjectDetail.tests || [];
        columns = [
          { key: "testName", label: "Test Name" },
          { key: "assignedDate", label: "Assigned Date" },
          { key: "testMark", label: "Mark" },
          { key: "testPercentage", label: "Percentage" },
          { key: "testPosition", label: "Position" },
          { key: "highest", label: "Highest" },
          { key: "absent", label: "Absent" },
        ];
        break;
      case "exams":
        data = subjectDetail.exams || [];
        columns = [
          { key: "examName", label: "Exam Name" },
          { key: "assignedDate", label: "Assigned Date" },
          { key: "examMark", label: "Mark" },
          { key: "examPercentage", label: "Percentage" },
          { key: "examPosition", label: "Position" },
          { key: "absent", label: "Absent" },
        ];
        break;
      case "quizzes":
        data = subjectDetail.quizzes || [];
        columns = [
          { key: "quizName", label: "Quiz Name" },
          { key: "assignedDate", label: "Assigned Date" },
          { key: "quizMark", label: "Mark" },
          { key: "quizPercentage", label: "Percentage" },
          { key: "quizPosition", label: "Position" },
          { key: "absent", label: "Absent" },
        ];
        break;
      default:
        data = [];
    }

    return (
      <div className="border border-gray-200 rounded-lg mb-8 overflow-x-auto">
        <table className="w-full min-w-max divide-y divide-gray-200">
          <thead className="bg-gray-200 dark:bg-cyan-950">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Download
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((item, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                  >
                    {item[column.key] || "N/A"}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <button className="bg-cyan-950 text-white py-1 px-3 rounded">
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (!subjectData || !subjectDetail) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-full sm:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto px-4 py-10">
      <motion.div
        className="absolute shadow-lg transform -skew-y-6 sm:skew-y-0 sm:rounded-lg"
        layoutId="subject-detail-background"
      />
      <div className="relative dark:bg-slate-700 sm:rounded-lg sm:p-5 p-6">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-gray-500 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-300 mb-4"
        >
          <AiOutlineArrowLeft className="mr-2" />
          Back
        </button>
        <motion.div layoutId="subject-title">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {subjectDetail.name || "No Name"}
          </h1>
        </motion.div>
        <p className="text-gray-500 dark:text-gray-300 mt-2">
          {subjectDetail.description || "No Description"}
        </p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            {(subjectDetail.currentTeacher || []).map((topic, index) => (
              <div
                key={index}
                className="flex items-center justify-between mb-4 bg-gray-500 rounded-md p-2"
              >
                {console.log(subjectDetail.currentTeacher)}
                <div className="px-6 py-4 whitespace-nowrap text-lg font-medium text-gray-900 dark:text-white">
                  Teacher: {topic.name || "N/A"}
                </div>
                {/* add image here */}
                <div className="flex items-center justify-center">
                  {topic.image === "" ? (
                    <div className=" h-24 w-24 rounded-full p-3 flex items-center justify-center bg-slate-400">
                      <span className="text-center text-xs"> No Image yet</span>
                    </div>
                  ) : (
                    <div className=" h-24 w-24 rounded-full p-1 flex items-center justify-center bg-emerald-400">
                      <img
                        src={topic.image}
                        alt="Topic Image"
                        className="rounded-full w-full h-full"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
            {/* <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Teacher: {subjectDetail.currentTeacher || "N/A"}
            </h2> */}
            {/* <p className="text-gray-500 dark:text-gray-300">
              Credits: {subjectDetail.credits || "N/A"}
            </p> */}
            {/* <p className="text-gray-500 dark:text-gray-300">
              Schedule: {subjectDetail.schedule || "N/A"}
            </p> */}
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow flex items-center justify-center">
            <div style={{ width: 100, height: 100 }}>
              <CircularProgressbar
                value={averageScore}
                text={`${averageScore}%`}
                styles={buildStyles({
                  textColor: "gray",
                  pathColor: "#82ca9d",
                  trailColor: "#d6d6d6",
                })}
              />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Grades
              </h3>
              <p className="text-gray-500 dark:text-gray-300">
                Average Score: {averageScore} ({getCambridgeGrade(averageScore)}
                )
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Topics
          </h3>
          <div className="border border-gray-200 rounded-lg overflow-x-auto">
            <table className="w-full min-w-max divide-y divide-gray-200">
              <thead className="bg-gray-200 dark:bg-cyan-950">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignment Average
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test Average
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {(subjectDetail.topics || []).map((topic, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {topic.scheduleNumber || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {topic.title || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {topic.completed ? "Yes" : "No"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(topic.startDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(topic.endDate) || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {topic.assignmentAverage || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {topic.testAverage || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Assignments, Tests, Exams, and Quizzes
          </h3>
          <div className="flex space-x-4 mb-4">
            {["assignments", "tests", "exams", "quizzes"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded ${
                  activeTab === tab
                    ? "bg-cyan-600 text-white"
                    : "bg-gray-200 dark:bg-cyan-950 text-gray-700 dark:text-gray-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          {renderTabContent()}
        </div>

        {anomalies.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Anomalies
            </h3>
            <div className="border border-gray-200 rounded-lg overflow-x-auto">
              <table className="w-full min-w-max divide-y divide-gray-200">
                <thead className="bg-gray-200 dark:bg-cyan-950">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Topic
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assignment Average
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Test Average
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {anomalies.map((topic, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {topic.title || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {topic.assignmentAverage || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {topic.testAverage || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Bar Chart of Test
          </h3>
          <div className="border border-gray-200 rounded-lg overflow-x-auto p-4 bg-white dark:bg-gray-800">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={subjectDetail.tests || []}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="testName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="testMark" fill="#8884d8">
                  <LabelList dataKey="testMark" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Bar Chart of Assignments
          </h3>
          <div className="border border-gray-200 rounded-lg overflow-x-auto p-4 bg-white dark:bg-gray-800">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={subjectDetail.assignments || []}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="assignmentName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="assignmentMark" fill="#8884d8">
                  <LabelList dataKey="assignmentMark" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Line Chart of
          </h3>
          <div className="border border-gray-200 rounded-lg overflow-x-auto p-4 bg-white dark:bg-gray-800">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={subjectDetail.tests || []}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="testMark" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="testMark" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Line Chart of Assignments
          </h3>
          <div className="border border-gray-200 rounded-lg overflow-x-auto p-4 bg-white dark:bg-gray-800">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={subjectDetail.assignments || []}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="assignmentName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="assignmentMark"
                  stroke="#82ca9d"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Radar Chart of Topics
          </h3>
          <div className="border border-gray-200 rounded-lg overflow-x-auto p-4 bg-white dark:bg-gray-800">
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={subjectDetail.topics || []}>
                <PolarGrid />
                <PolarAngleAxis dataKey="title" />
                <PolarRadiusAxis />
                <Radar
                  name="Assignment Average"
                  dataKey="assignmentAverage"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
                <Radar
                  name="Test Average"
                  dataKey="testAverage"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectDetailPage;
