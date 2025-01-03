import {
  FaUserAlt,
  FaTrophy,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaSpinner,
  FaSave,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";

// Function to determine the background color based on the mark using Cambridge A Level grading
const getBackgroundColor = (mark) => {
  if (mark >= 80) return "bg-green-600"; // A* (Excellent)
  if (mark >= 70) return "bg-green-500"; // A (Very Good)
  if (mark >= 60) return "bg-yellow-500"; // B (Good)
  if (mark >= 50) return "bg-orange-500"; // C (Satisfactory)
  if (mark >= 40) return "bg-red-500"; // D (Pass)
  return "bg-gray-500"; // E (Fail)
};
const getBBackgroundColor = (mark) => {
  if (mark === "A*") return "bg-green-600"; // A* (Excellent)
  if (mark === "A") return "bg-green-500"; // A (Very Good)
  if (mark === "B") return "bg-yellow-500"; // B (Good)
  if (mark === "C") return "bg-orange-500"; // C (Satisfactory)
  if (mark === "D") return "bg-red-500"; // D (Pass)
  if (mark === "E") return "bg-red-500"; // D (Pass)
  if (mark === "F") return "bg-red-500"; // D (Pass)
  return "bg-gray-500"; // E (Fail)
};

const StudentDetails = ({
  student,
  subjectName,
  onSaveComment,
  className,
  comment,
}) => {
  console.log(student);

  const [loading, setLoading] = useState(true);
  const [currentComment, setCurrentComment] = useState(""); // Controlled by parent
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Simulate data loading delay
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSaveComment = async () => {
    setIsSaving(true);
    try {
      await axios.post("/api/save-comment", {
        subjectName,
        regNumber: student.regNumber,
        comment: currentComment,
        className,
      });
      if (onSaveComment) {
        onSaveComment(student.regNumber, currentComment); // Save the current comment
      }

      setError("");
    } catch (err) {
      setError("Failed to save comment.");
    } finally {
      setIsSaving(false);
      student.comment = currentComment;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <FaSpinner className="animate-spin text-4xl text-sky-500" />
        <p className="ml-3 text-sky-500">Loading student details...</p>
      </div>
    );
  }

  return (
    <div className="mb-4 p-4 border dark:border-gray-600 rounded-md w-full bg-white dark:bg-gray-800">
      {/* Student Profile Section */}
      <div className="flex items-center space-x-4 mb-4">
        {student.image ? (
          <img
            src={student.image}
            alt={`${student.name}'s profile`}
            className="w-16 h-16 rounded-full border dark:border-gray-500"
          />
        ) : (
          <FaUserAlt className="w-16 h-16 rounded-full text-sky-500 border p-2" />
        )}
        <div className="text-gray-900 dark:text-gray-100">
          <strong>{student.name}</strong>
          <p className="text-gray-700 dark:text-gray-300">
            Reg Number: {student.regNumber}
          </p>
        </div>
      </div>
      {/* Cards for statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {student.papers.map((paper, index) => (
          <div
            key={index}
            className={`${getBackgroundColor(
              paper.mark
            )} text-white p-4 rounded-lg shadow-md`}
          >
            <h3 className="font-semibold mb-2 flex items-center space-x-2">
              <FaChartLine /> <span>{paper.paperName}</span>
            </h3>
            <p className="flex items-center space-x-2">
              <FaTrophy />{" "}
              <span>
                <strong>Mark:</strong> {Math.round(paper.mark)}
              </span>
            </p>
            <p className="flex items-center space-x-2">
              <FaChartLine />{" "}
              <span>
                <strong>Avg Mark:</strong> {Math.round(paper.avgMark)}
              </span>
            </p>
            <p className="flex items-center space-x-2">
              <FaArrowUp />{" "}
              <span>
                <strong>Highest Mark:</strong> {Math.round(paper.highestMark)}
              </span>
            </p>
            <p className="flex items-center space-x-2">
              <FaArrowDown />{" "}
              <span>
                <strong>Lowest Mark:</strong> {Math.round(paper.lowestMark)}
              </span>
            </p>
          </div>
        ))}
      </div>
      {/* Final statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className={`p-4 rounded-lg shadow-md ${getBackgroundColor(
            student.finalMark
          )} text-white flex items-center space-x-2`}
        >
          <FaTrophy />{" "}
          <span>
            <strong>Final Mark:</strong> {Math.round(student.finalMark)}
          </span>
        </div>
        <div
          className={`p-4 rounded-lg shadow-md ${getBBackgroundColor(
            student.behaviorGrade
          )} text-white flex items-center space-x-2`}
        >
          <FaChartLine />{" "}
          <span>
            <strong>Behavior Grade:</strong> {student.behaviorGrade}
          </span>
        </div>
        <div
          className={`p-4 rounded-lg shadow-md ${getBackgroundColor(
            student.assessmentMark
          )} text-white flex items-center space-x-2`}
        >
          <FaChartLine />{" "}
          <span>
            <strong>Class Average Mark:</strong>{" "}
            {Math.round(student.assessmentMark)}
          </span>
        </div>
      </div>
      <div className="mb-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md mt-4">
        <span className="font-semibold text-cyan-950 dark:text-cyan-50">
          Teacher Comment:{" "}
        </span>
        <span className="text-cyan-950 dark:text-cyan-50">
          {student.comment}
        </span>
      </div>
      {/* Comment Section */}
      <div className="mt-4">
        <textarea
          value={currentComment}
          onChange={(e) => {
            const words = e.target.value.trim().split(/\s+/);
            if (words.length <= 30) {
              setCurrentComment(e.target.value); // Allow input if the word count is 30 or fewer
            }
          }}
          placeholder="Enter comment (max 30 words)"
          className="w-full p-2 border dark:border-gray-700 rounded-md dark:bg-gray-900 dark:text-gray-100"
        />
        <p className="text-sm mt-1">
          {currentComment.trim().split(/\s+/).length}/30 words
        </p>
        {currentComment.trim().split(/\s+/).length === 30 && (
          <p className="text-red-500 text-sm mt-1">You have reached the 30-word limit.</p>
        )}
      </div>

      {/* Teacher Comment Section */}

      {/* Save Button */}
      <div className="flex justify-end mt-2">
        <button
          onClick={handleSaveComment}
          className="flex items-center px-4 py-2 bg-sky-500 text-white rounded-lg shadow-md hover:bg-sky-600"
          disabled={isSaving}
        >
          {isSaving ? (
            <FaSpinner className="animate-spin mr-2" />
          ) : (
            <FaSave className="mr-2" />
          )}
          {isSaving ? "Saving..." : "Save Comment"}
        </button>
      </div>
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </div>
  );
};

export default StudentDetails;
