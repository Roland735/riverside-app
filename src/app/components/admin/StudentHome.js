import React, { useState, useEffect } from "react";
import {
  LineChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
} from "recharts";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "tailwindcss/tailwind.css";
import StudentInfoCard from "./StudentInfoCard";
import Link from "next/link";

const StudentPerformance = ({ regNumber }) => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/getStudentInfo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ registrationNumber: regNumber }),
        });
        const result = await response.json();
        setStudentData(result.data);
        console.log(result.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!studentData) {
    return <div>No data available</div>;
  }

  // Colors for pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  // Overall average mark
  const overallAverageMark =
    studentData.performance.reduce((acc, cur) => acc + cur.mark, 0) /
    studentData.performance.length;

  // Calculate attendance percentages
  const attendanceCounts = studentData.attendance.reduce((acc, cur) => {
    acc[cur.position] = (acc[cur.position] || 0) + 1;
    return acc;
  }, {});

  const attendanceTotal = studentData.attendance.length;
  const attendancePercentages = {
    Absent: ((attendanceCounts[0] || 0) / attendanceTotal) * 100,
    Sick: ((attendanceCounts[1] || 0) / attendanceTotal) * 100,
    Excused: ((attendanceCounts[2] || 0) / attendanceTotal) * 100,
    Late: ((attendanceCounts[3] || 0) / attendanceTotal) * 100,
    Present: ((attendanceCounts[4] || 0) / attendanceTotal) * 100,
  };

  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-bold mb-4 text-cyan-950 dark:text-slate-50">
        {studentData.studentName}&apos;s Performance Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1">
          <StudentInfoCard studentData={studentData} />
        </div>
        <div className="bg-slate-300 dark:bg-slate-700 text-cyan-950 dark:text-slate-50 p-4 rounded-lg shadow-md col-span-1">
          <h2 className="text-xl font-bold mb-4">Overall Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={studentData.performance}
                dataKey="mark"
                nameKey="subject"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {studentData.performance.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-slate-300 dark:bg-slate-700 text-cyan-950 dark:text-slate-50 p-4 rounded-lg shadow-md col-span-1 flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold mb-4 text-start">Overall Average</h2>
          <div style={{ width: 200, height: 200 }}>
            <CircularProgressbar
              value={overallAverageMark}
              maxValue={100}
              text={`${overallAverageMark.toFixed(1)}%`}
              styles={buildStyles({
                textColor: "#8884d8",
                pathColor: "#8884d8",
                trailColor: "#d6d6d6",
              })}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="bg-slate-300 dark:bg-slate-700 text-cyan-950 dark:text-slate-50 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Performance by Subject</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={studentData.performance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="mark" fill="#8884d8" />
              {/* <Bar dataKey="maxMark" fill="#82ca9d" /> */}
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-slate-300 dark:bg-slate-700 text-cyan-950 dark:text-slate-50 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Attendance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={studentData.attendance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis dataKey="position" />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="position" stroke="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-4">
            <h3 className="text-lg font-bold">Attendance Key</h3>
            <ul className="list-disc list-inside">
              <li>0 - Absent ({attendancePercentages.Absent.toFixed(1)}%)</li>
              <li>1 - Sick ({attendancePercentages.Sick.toFixed(1)}%)</li>
              <li>2 - Excused ({attendancePercentages.Excused.toFixed(1)}%)</li>
              <li>3 - Late ({attendancePercentages.Late.toFixed(1)}%)</li>
              <li>4 - Present ({attendancePercentages.Present.toFixed(1)}%)</li>
            </ul>
          </div>
        </div>
        <div className="bg-slate-300 dark:bg-slate-700 text-cyan-950 dark:text-slate-50 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Assignments</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={studentData.assignments}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="maxScore" fill="#82ca9d" />{" "}
              <Bar dataKey="score" fill="#8884d8" />
              <Bar dataKey="minimumScore" fill="#991b1b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-slate-300 dark:bg-slate-700 text-cyan-950 dark:text-slate-50 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Tests</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={studentData.tests}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="maxScore" fill="#82ca9d" />{" "}
              <Bar dataKey="score" fill="#8884d8" />
              <Bar dataKey="minimumScore" fill="#991b1b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-slate-300 dark:bg-slate-700 text-cyan-950 dark:text-slate-50 p-4 rounded-lg shadow-md mt-4">
        <h2 className="text-xl font-bold mb-4">Subjects Overview</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignment Avg
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test Avg
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quiz Avg
                </th> */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {studentData.performance.map((subject, index) => (
                <tr key={subject.subject}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {subject.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div style={{ width: 50, height: 50 }}>
                      <CircularProgressbar
                        value={studentData.assignments[index].score}
                        maxValue={100}
                        text={`${Math.round(
                          studentData.assignments[index].score
                        )}%`}
                        styles={buildStyles({
                          textColor: `${studentData.assignments[index].score > 70
                              ? "#22c55e"
                              : `${studentData.assignments[index].score > 50
                                ? "#facc15"
                                : `${studentData.assignments[index].score >
                                  30
                                  ? "#f43f5e"
                                  : "#991b1b"
                                }`
                              }`
                            }`,
                          pathColor: `${studentData.assignments[index].score > 70
                              ? "#22c55e"
                              : `${studentData.assignments[index].score > 50
                                ? "#facc15"
                                : `${studentData.assignments[index].score >
                                  30
                                  ? "#f43f5e"
                                  : "#991b1b"
                                }`
                              }`
                            }`,
                          trailColor: "#d6d6d6",
                        })}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div style={{ width: 50, height: 50 }}>
                      <CircularProgressbar
                        value={studentData.tests[index].score}
                        maxValue={100}
                        text={`${Math.round(studentData.tests[index].score)}%`}
                        styles={buildStyles({
                          textColor: `${studentData.tests[index].score > 70
                              ? "#82ca9d"
                              : `${studentData.tests[index].score > 50
                                ? "#facc15"
                                : `${studentData.tests[index].score > 30
                                  ? "#f43f5e"
                                  : "#991b1b"
                                }`
                              }`
                            }`,
                          pathColor: `${studentData.tests[index].score > 70
                              ? "#82ca9d"
                              : `${studentData.tests[index].score > 50
                                ? "#facc15"
                                : `${studentData.tests[index].score > 30
                                  ? "#f43f5e"
                                  : "#991b1b"
                                }`
                              }`
                            }`,
                          trailColor: "#d6d6d6",
                        })}
                      />
                    </div>
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap">
                    <div style={{ width: 50, height: 50 }}>
                      <CircularProgressbar
                        value={studentData.quizzes[index].score}
                        maxValue={100}
                        text={`${studentData.quizzes[index].score}%`}
                        styles={buildStyles({
                          textColor: "#8884d8",
                          pathColor: "#8884d8",
                          trailColor: "#d6d6d6",
                        })}
                      />
                    </div>
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/dashboard/admin/StudentClassSubject/${studentData.registrationNumber}/${subject.subject}/student`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentPerformance;
