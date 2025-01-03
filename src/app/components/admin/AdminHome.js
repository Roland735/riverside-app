import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import {
  FaRegChartBar,
  FaClipboardList,
  FaBook,
  FaUsers,
  FaTasks,
  FaCheckCircle,
} from "react-icons/fa";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Head from "next/head";

const AdminDashboard = () => {
  const [mySession, setMySession] = useState(null);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [adminAverageMark, setAdminAverageMark] = useState(0); // Initialize with 0
  const [attendanceRange, setAttendanceRange] = useState("week");
  const [attendanceData, setAttendanceData] = useState([]);
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    async function getSessionData() {
      const session = await getSession();
      setMySession(session);
    }
    getSessionData();
  }, []);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await fetch("/api/adminHome");
        const data = await response.json();
        console.log(data);

        setGrades(data.grades);
        setTotalStudents(data.totalStudents);
        setTotalTeachers(data.totalTeachers);
        setAdminAverageMark(data.adminAverageMark);

        if (data.grades.length > 0) {
          setAttendanceData(data.grades[0].attendanceData);
        }
      } catch (error) {
        console.error("Error fetching grades:", error);
      }
    };

    fetchGrades();
  }, []);

  if (!mySession || !mySession.user || !mySession.user.role) {
    return <div>Loading...</div>; // Show a loading state until mySession is set or if role is not defined
  }

  return (
    <div className="min-h-screen section-bg">
      <Head>
        <title>My page title</title>
      </Head>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Welcome, {mySession.user.firstname} {mySession.user.lastname}!
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <div className="flex items-center space-x-4">
              <FaUsers className="text-3xl text-cyan-500" />
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Total Students
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {totalStudents}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <div className="flex items-center space-x-4">
              <FaUsers className="text-3xl text-purple-500" />
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Total Teachers
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {totalTeachers}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <div className="flex items-center space-x-4">
              <FaCheckCircle className="text-3xl text-green-500" />
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Avg Exam Scores
                </h2>
                <p className="text-gray-600 dark:text-gray-300">Current: 78%</p>
                <p className="text-green-500 dark:text-green-400">+1.5%</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <div className="flex items-center space-x-4">
              <FaTasks className="text-3xl text-red-500" />
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Avg Assignment Scores
                </h2>
                <p className="text-gray-600 dark:text-gray-300">Current: 85%</p>
                <p className="text-green-500 dark:text-green-400">+2%</p>
              </div>
            </div>
          </div>
        </div>
        {attendanceData.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md my-5">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Attendance Over Time
            </h2>
            <div className="flex justify-center space-x-4 mb-4">
              <button
                onClick={() => setAttendanceRange("week")}
                className={`${attendanceRange === "week"
                    ? "bg-cyan-600 text-white"
                    : "bg-gray-300 dark:bg-gray-600 text-gray-800"
                  } px-4 py-2 rounded-lg focus:outline-none`}
              >
                Week
              </button>
              <button
                onClick={() => setAttendanceRange("month")}
                className={`${attendanceRange === "month"
                    ? "bg-cyan-600 text-white"
                    : "bg-gray-300 dark:bg-gray-600 text-gray-800"
                  } px-4 py-2 rounded-lg focus:outline-none`}
              >
                Month
              </button>
              <button
                onClick={() => setAttendanceRange("semester")}
                className={`${attendanceRange === "semester"
                    ? "bg-cyan-600 text-white"
                    : "bg-gray-300 dark:bg-gray-600 text-gray-800"
                  } px-4 py-2 rounded-lg focus:outline-none`}
              >
                Semester
              </button>
              <button
                onClick={() => setAttendanceRange("year")}
                className={`${attendanceRange === "year"
                    ? "bg-cyan-600 text-white"
                    : "bg-gray-300 dark:bg-gray-600 text-gray-800"
                  } px-4 py-2 rounded-lg focus:outline-none`}
              >
                Year
              </button>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart
                data={attendanceData[attendanceRange]}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="colorAttendance"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="attendance"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorAttendance)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className=" bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md my-5 text-center text-cyan-950 dark:text-cyan-50 ">
            Before you can see attendance over time, Class Teachers need to add
            attendance.
          </div>
        )}
        {grades && grades.length > 0 ? (
          <div className="mb-8">
            {grades.map((grade, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg w-full my-4 transition-transform transform "
              >
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 border-b-2 border-gray-200 dark:border-gray-600 pb-2">
                  Grade {index + 1} Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {grade.subjectsData.map((subject, subjectIndex) => (
                    <div
                      key={subjectIndex}
                      className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-800 dark:text-gray-200">
                          {/* Optionally, you can use icons or images here */}
                          <span className="text-xl font-bold">
                            {subject.name.charAt(0)}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                          {subject.name}
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex justify-between text-gray-600 dark:text-gray-300">
                          <span>Students:</span>
                          <span>{subject.students}</span>
                        </div>
                        <div className="flex justify-between text-gray-600 dark:text-gray-300">
                          <span>Quiz Avg:</span>
                          <span
                            className={`font-medium ${subject.quizAvg > 50
                                ? "text-green-500"
                                : "text-red-500"
                              }`}
                          >
                            {subject.quizAvg}%
                          </span>
                        </div>
                        <div className="flex justify-between text-gray-600 dark:text-gray-300">
                          <span>Assignment Avg:</span>
                          <span
                            className={`font-medium ${subject.assignmentAvg > 50
                                ? "text-green-500"
                                : "text-red-500"
                              }`}
                          >
                            {subject.assignmentAvg}%
                          </span>
                        </div>
                        <div className="flex justify-between text-gray-600 dark:text-gray-300">
                          <span>Test Avg:</span>
                          <span
                            className={`font-medium ${subject.testAvg > 50 || subject.testAvg === 0
                                ? "text-green-500"
                                : "text-red-500"
                              }`}
                          >
                            {subject.testAvg}%
                          </span>
                        </div>
                        {/* Optionally, include performance data here */}
                        {/* <div className="col-span-full mt-4">
                  <div className="flex items-center space-x-2">
                    {subject.performanceData.map((performance, performanceIndex) => (
                      <div key={performanceIndex} className="flex items-center">
                        <div className="w-10 h-10">
                          <CircularProgressbar
                            value={performance.score}
                            text={`${performance.score}%`}
                            styles={buildStyles({
                              textSize: "16px",
                              textColor: "#4CAF50",
                              pathColor: "#4CAF50",
                              trailColor: "#D6D6D6",
                            })}
                          />
                        </div>
                        <span className="text-gray-600 dark:text-gray-300 ml-2">
                          {performance.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div> */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-screen text-gray-600 dark:text-gray-300">
            No grades found
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
