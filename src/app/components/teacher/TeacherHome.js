"use client";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import {
  FaChartLine,
  FaCheckCircle,
  FaRegChartBar,
  FaClipboardList,
  FaUsers,
  FaExclamationTriangle,
} from "react-icons/fa";
import {
  CircularProgressbar,
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import RadialSeparators from "./RadialSeparators";
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
import Loading from "../Universal/loader";

const TeacherDashboard = () => {
  const [mySession, setMySession] = useState(null);
  const [classes, setClasses] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [attendanceRate, setAttendanceRate] = useState(null);
  const [late, setLate] = useState(null);
  const [excused, setExcused] = useState(null);
  const [sick, setSick] = useState(null);
  const [absent, setAbsent] = useState(null);
  const [submissionRate, setSubmissionRate] = useState(null);
  const [quizAverages, setQuizAverages] = useState(null);
  const [testAverages, setTestAverages] = useState(null);
  const [assignmentAverages, setAssignmentAverages] = useState(null);
  const [teacherAverageMark, setTeacherAverageMark] = useState(null);
  const [averageTeacherMark, setAverageTeacherMark] = useState(null);

  useEffect(() => {
    async function getSessionData() {
      const session = await getSession();
      setMySession(session);
    }
    getSessionData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (
        mySession &&
        mySession.user &&
        mySession.user.firstname &&
        mySession.user.lastname
      ) {
        const teacherName = `${mySession.user.firstname} ${mySession.user.lastname}`;
        const response = await fetch("/api/teacherhome", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ teacherName }),
        });
        const data = await response.json();
        console.log(data);

        if (data && data.classes) {
          setClasses(data.classes);
        }
        if (data && data.totalAttendance !== undefined) {
          setAttendanceRate(data.totalAttendance);
        }
        if (data && data.sick !== undefined) {
          setSick(data.sick);
        }
        if (data && data.absent !== undefined) {
          setAbsent(data.absent);
        }
        if (data && data.excused !== undefined) {
          setExcused(data.excused);
        }
        if (data && data.late !== undefined) {
          setLate(data.late);
        }
        if (data && data.submissionRate !== undefined) {
          setSubmissionRate(data.submissionRate);
        }
        if (data && data.quizAverages !== undefined) {
          setQuizAverages(data.quizAverages);
        }
        if (data && data.testAverages !== undefined) {
          setTestAverages(data.testAverages);
        }
        if (data && data.assignmentAverages !== undefined) {
          setAssignmentAverages(data.assignmentAverages);
        }
        if (data && data.teacherAverageMark !== undefined) {
          setTeacherAverageMark(data.teacherAverageMark);
        }
        if (
          quizAverages !== null &&
          testAverages !== null &&
          assignmentAverages !== null
        ) {
          setAverageTeacherMark(
            (testAverages + quizAverages + assignmentAverages) / 3
          );
        }
      }
    }
    fetchData();
  }, [mySession]);

  useEffect(() => {
    const total = classes.reduce(
      (sum, classItem) => sum + classItem.students,
      0
    );
    setTotalStudents(total);
  }, [classes]);

  if (!mySession || !mySession.user || !mySession.user.role) {
    return <Loading />; // Show a loading state until mySession is set or if role is not defined
  }

  return (
    <div className="min-h-screen section-bg">
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Welcome, {mySession.user.firstname} {mySession.user.lastname}!
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Average Mark
            </h2>
            <CircularProgressbarWithChildren
              value={teacherAverageMark}
              text={`${Math.round(teacherAverageMark)}%`}
              strokeWidth={10}
              styles={buildStyles({
                strokeLinecap: "butt",
              })}
            >
              <RadialSeparators
                count={12}
                style={{
                  background: "#fff",
                  width: "2px",
                  // This needs to be equal to props.strokeWidth
                  height: `${10}%`,
                }}
              />
            </CircularProgressbarWithChildren>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Quiz
            </h2>
            <CircularProgressbarWithChildren
              value={quizAverages}
              text={`${Math.round(quizAverages)}%`}
              strokeWidth={10}
              styles={buildStyles({
                strokeLinecap: "butt",
              })}
            >
              <RadialSeparators
                count={12}
                style={{
                  background: "#fff",
                  width: "2px",
                  // This needs to be equal to props.strokeWidth
                  height: `${10}%`,
                }}
              />
            </CircularProgressbarWithChildren>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Test
            </h2>
            <CircularProgressbarWithChildren
              value={testAverages}
              text={`${Math.round(testAverages)}%`}
              strokeWidth={10}
              styles={buildStyles({
                strokeLinecap: "butt",
              })}
            >
              <RadialSeparators
                count={12}
                style={{
                  background: "#fff",
                  width: "2px",
                  // This needs to be equal to props.strokeWidth
                  height: `${10}%`,
                }}
              />
            </CircularProgressbarWithChildren>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Assignments
            </h2>
            <CircularProgressbarWithChildren
              value={assignmentAverages}
              text={`${Math.round(assignmentAverages)}%`}
              strokeWidth={10}
              styles={buildStyles({
                strokeLinecap: "butt",
              })}
            >
              <RadialSeparators
                count={12}
                style={{
                  background: "#fff",
                  width: "2px",
                  // This needs to be equal to props.strokeWidth
                  height: `${10}%`,
                }}
              />
            </CircularProgressbarWithChildren>
          </div>

          <DashboardStatCard
            icon={<FaUsers className="text-3xl text-cyan-500" />}
            title="Total Students"
            value={totalStudents}
          />
          <DashboardStatCard
            icon={<FaChartLine className="text-3xl text-blue-500" />}
            title="Attendance Rate"
            value={`${Math.round(attendanceRate)}%`}
            trend="2% increase since last week"
          />
          {sick !== null && (
            <DashboardStatCard
              icon={
                <FaExclamationTriangle className="text-3xl text-yellow-500" />
              }
              title="Sick"
              value={`${Math.round(sick)}%`}
              trend="2% increase since last week"
            />
          )}
          {absent !== null && (
            <DashboardStatCard
              icon={<FaExclamationTriangle className="text-3xl text-red-500" />}
              title="Absent"
              value={`${Math.round(absent)}%`}
              trend="2% increase since last week"
            />
          )}
          {late !== null && (
            <DashboardStatCard
              icon={
                <FaExclamationTriangle className="text-3xl text-orange-500" />
              }
              title="Late"
              value={`${Math.round(late)}%`}
              trend="2% increase since last week"
            />
          )}
          {excused !== null && (
            <DashboardStatCard
              icon={
                <FaExclamationTriangle className="text-3xl text-purple-500" />
              }
              title="Excused"
              value={`${Math.round(excused)}%`}
              trend="2% increase since last week"
            />
          )}
          <DashboardStatCard
            icon={<FaCheckCircle className="text-3xl text-green-500" />}
            title="Submission Rate"
            value={`${Math.round(submissionRate)}%`}
            trend="3% decrease since last week"
          />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Classes You Teach
        </h2>
        <div className="space-y-6">
          {classes.map((classItem, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg w-full my-4 transition-transform transform "
            >
              <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 border-b-2 border-gray-300 dark:border-gray-600 pb-3">
                {classItem.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <DashboardClassStatCard
                  title="Students"
                  value={classItem.students}
                  icon="👨‍🎓"
                />
                <DashboardClassStatCard
                  title="Quiz Average"
                  value={`${Math.round(classItem.quizAvg)}%`}
                  icon="📊"
                  isPercentage
                />
                <DashboardClassStatCard
                  title="Test Average"
                  value={`${Math.round(classItem.testAvg)}%`}
                  icon="📝"
                  isPercentage
                />
                <DashboardClassStatCard
                  title="Anomalies"
                  value={classItem.anomalies}
                  icon="⚠️"
                />
                <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-lg col-span-full">
                  <h4 className="text-xl font-medium text-gray-800 dark:text-white mb-4">
                    Performance Data
                  </h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={classItem.performanceData}>
                      <defs>
                        <linearGradient
                          id="colorScore"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#8884d8"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#8884d8"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" tick={{ fill: "#8884d8" }} />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#8884d8",
                          color: "#fff",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="score"
                        stroke="#8884d8"
                        fillOpacity={1}
                        fill="url(#colorScore)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Separate reusable components for dashboard statistics cards

const DashboardStatCard = ({ icon, title, value, trend }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
    <div className="flex items-center space-x-4">
      {title === "Test Averages" ||
      title === "Quiz Averages" ||
      title === "Assignment Averages" ? (
        <></>
      ) : (
        icon
      )}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          {title}
        </h2>

        <>
          <p className="text-gray-600 dark:text-gray-300">{value}</p>
          {trend && <p className="text-green-500">{trend}</p>}
        </>
      </div>
    </div>
  </div>
);

const DashboardClassStatCard = ({ title, value, icon, isPercentage }) => (
  <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-lg flex items-center space-x-4 transition-transform transform hover:scale-105">
    <div className="text-3xl">{icon}</div>
    <div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
        {title}
      </h3>
      <p
        className={`text-2xl font-bold ${
          isPercentage
            ? value > 50
              ? "text-green-500"
              : "text-red-500"
            : "text-gray-800 dark:text-white"
        }`}
      >
        {value}
      </p>
    </div>
  </div>
);

export default TeacherDashboard;
