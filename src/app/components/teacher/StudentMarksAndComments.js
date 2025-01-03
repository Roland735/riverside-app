import { useState, useEffect } from "react";
import { FaUser, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify"; // Import ToastContainer and toast
import "react-toastify/dist/ReactToastify.css";

// Helper Functions (same as before)
const generateGraphData = (student) => [
  { name: "Test 1", mark: student.testMark },
  { name: "Assignment", mark: student.assignmentMark },
  { name: "Final", mark: student.finalMark },
];

const generateSubjectGraphData = (subjects) =>
  subjects.map((subject) => ({
    name: subject.name,
    mark: subject.mark,
  }));

const getBackgroundColor = (mark) => {
  if (mark >= 80) return "bg-green-600";
  if (mark >= 70) return "bg-green-500";
  if (mark >= 60) return "bg-yellow-500";
  if (mark >= 50) return "bg-orange-500";
  if (mark >= 40) return "bg-red-500";
  return "bg-gray-500";
};

const StudentCard = ({
  student,
  handleSaveComment,
  className,
  attendanceTotal,
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [comment, setComment] = useState(student.comment);
  const [attendance, setAttendance] = useState(student.AttendanceMark);
  const [isSaving, setIsSaving] = useState(false);

  // Reset comment and attendance when a new student is selected
  useEffect(() => {
    setComment(student.comment);
    setAttendance(student.AttendanceMark);
  }, [student]);

  function calculateAverageMark(student) {
    let totalMarks = 0;
    console.log(student);

    let count = 0;

    // Check each mark using switch statements
    switch (true) {
      case student.assignmentMark > 0:
        totalMarks += student.assignmentMark;
        count++;
        break;
    }

    switch (true) {
      case student.testMark > 0:
        totalMarks += student.testMark;
        count++;
        break;
    }

    switch (true) {
      case student.finalMark > 0:
        totalMarks += student.finalMark;
        count++;
        break;
    }

    // Calculate average
    return count > 0 ? (totalMarks / count).toFixed(2) : "N/A"; // or use 0 or any placeholder you'd like when all marks are 0
  }

  // Example usage:
  const avgMark = calculateAverageMark(student);

  return (
    <div className="p-4 bg-white dark:bg-rose-900 rounded-lg shadow-md">
      {/* Image and Student Info */}
      <div className="flex items-center mb-2">
        {!student.image || student.image === "" ? (
          <FaUser className="w-12 h-12 text-gray-500 mr-2" />
        ) : (
          <Image
            src={student.image}
            alt={student.name}
            width={48}
            height={48}
            className="rounded-full mr-2"
          />
        )}

        <div>
          <h3 className="text-lg font-semibold">{student.name}</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Reg No: {student.regNumber}
          </p>
        </div>
      </div>

      {/* Subject Cards */}
      <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-4">
        {student.subjects.map((subject, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg text-white ${getBackgroundColor(
              subject.mark
            )}`}
          >
            <h4 className="text-md">{subject.name}</h4>
            <p className="font-bold">{subject.mark}%</p>
          </div>
        ))}
      </div>

      {/* Statistics */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        {[
          // { title: "Assignment Mark", value: student.assignmentMark },
          // { title: "Test Mark", value: student.testMark },
          { title: "Final Mark", value: student.finalMark },
          { title: "Average Mark", value: avgMark },
        ].map(({ title, value }, index) => (
          <div
            key={index}
            className="p-4 bg-rose-100 dark:bg-rose-300 border border-rose-300 dark:border-rose-600 rounded-lg shadow hover:shadow-lg transition-shadow duration-200"
          >
            <h4 className="text-rose-600 dark:text-rose-950">{title}</h4>
            <p className="font-bold text-xl text-rose-800 dark:text-rose-900">
              {Math.round(value)}%
            </p>
          </div>
        ))}
      </div>

      {/* Performance Graph */}
      <div className="mt-4">
        <h4 className="text-gray-600 dark:text-gray-300 mb-2">
          Performance Graph
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={generateGraphData(student)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="mark" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Subject Performance Graph */}
      <div className="mt-4">
        <h4 className="text-gray-600 dark:text-gray-300 mb-2">
          Subject Performance Graph
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={generateSubjectGraphData(student.subjects)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="mark" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Comment Section */}
      <textarea
        className="w-full p-2 border rounded-md"
        placeholder="Enter comment for the student"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <div className="mt-4">
        <label
          htmlFor="attendance"
          className="text-gray-600 dark:text-gray-300"
        >
          Attendance
        </label>
        <input
          type="number"
          id="attendance"
          value={attendance}
          onChange={(e) => setAttendance(e.target.value)}
          placeholder="Enter the total number of days"
          className="w-full p-2 border rounded-md"
        />
        <span className="font-bold text-cyan-950">
          Out of {attendanceTotal}
        </span>
        <br />
        <button
          className={`mt-2 bg-rose-500 dark:bg-rose-500 hover:bg-rose-600 text-white py-1 px-4 rounded-md disabled:bg-gray-400`}
          disabled={isSaving}
          onClick={() => {
            setIsSaving(true);
            handleSaveComment(
              student.regNumber,
              comment,
              className,
              attendance,
              attendanceTotal
            );
            setIsSaving(false);
          }}
        >
          {isSaving ? "Saving..." : "Save Comment"}
        </button>
      </div>
    </div>
  );
};

// Tabs for classes and students
const TeacherComments = ({ year, period }) => {
  const [classes, setClasses] = useState([]);
  const [activeClassIndex, setActiveClassIndex] = useState(0);
  const [activeStudentIndex, setActiveStudentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(`/api/getClassTeacherData`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ myYear: year, myPeriod: period }),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [year, period]);

  const handleSaveComment = async (
    regNumber,
    comment,
    className,
    attendance,
    attendanceTotal
  ) => {
    try {
      const response = await fetch(`/api/saveClassTeacherComment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          regNumber,
          comment,
          className,
          attendance,
          attendanceTotal,
        }),
      });

      if (!response.ok) {
        throw new Error("Error saving comment");
      }

      // Update the classes state with the new comment and attendance
      setClasses((prevClasses) =>
        prevClasses.map((classData) =>
          classData.className === className
            ? {
                ...classData,
                students: classData.students.map((student) =>
                  student.regNumber === regNumber
                    ? {
                        ...student,
                        comment,
                        AttendanceMark: attendance,
                      }
                    : student
                ),
              }
            : classData
        )
      );

      toast.success("Comment saved successfully");
    } catch (error) {
      toast.error("Failed to save comment");
    }
  };

  if (loading) return <div>Loading...</div>;

  const activeClass = classes[activeClassIndex];
  const activeStudent = activeClass.students[activeStudentIndex];

  return (
    <div className="p-4 w-full">
      {/* Class Tabs */}
      <div className="mb-4">
        {classes.map((classData, classIndex) => (
          <div key={classIndex} className="mb-2">
            {/* Accordion Header */}
            <div
              className={`p-2 cursor-pointer bg-gray-200 ${
                classIndex === activeClassIndex
                  ? "bg-gray-200 dark:text-gray-200 text-cyan-950  dark:bg-rose-900 hover:bg-rose-600"
                  : "bg-gray-200 text-black dark:bg-rose-500 hover:bg-rose-600"
              } rounded-lg`}
              onClick={() => setActiveClassIndex(classIndex)}
            >
              {classData.className}
            </div>

            {/* Accordion Body - Students List */}
            {classIndex === activeClassIndex && (
              <div className="mt-2 ml-4">
                {classData.students.map((student, studentIndex) => (
                  <button
                    key={studentIndex}
                    className={`p-2 mr-2 mb-2 ${
                      studentIndex === activeStudentIndex
                        ? "bg-blue-500 text-white"
                        : student.comment
                        ? "bg-green-500 text-white" // Green background if comment exists
                        : "bg-gray-200 text-black"
                    } rounded-lg`}
                    onClick={() => setActiveStudentIndex(studentIndex)}
                  >
                    {student.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Selected Student's Data */}
      <StudentCard
        student={activeStudent}
        handleSaveComment={handleSaveComment}
        className={activeClass.className}
        attendanceTotal={activeClass.attendanceTotal}
      />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
      />
    </div>
  );
};

export default TeacherComments;
