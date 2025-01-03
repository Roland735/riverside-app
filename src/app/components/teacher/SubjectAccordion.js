import { useState } from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiDownload,
  FiUpload,
} from "react-icons/fi";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import StudentSlide from "./StudentSlide";
import axios from "axios";

const SubjectAccordion = ({ subject, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [fileGB, setFileGB] = useState("");
  const [uploadedStudents, setUploadedStudents] = useState([]);
  const [uploadedGBStudents, setUploadedGBStudents] = useState([]);

  const [fileName, setFileName] = useState("");
  const [fileGBName, setFileGBName] = useState("");

  // Function to calculate the percentage of students with comments
  const calculateCommentPercentage = () => {
    const totalStudents = subject.students.length;
    const studentsWithComments = subject.students.filter(
      (student) =>
        student.comment &&
        typeof student.comment === "string" &&
        student.comment.trim() !== ""
    ).length;
    return totalStudents > 0
      ? ((studentsWithComments / totalStudents) * 100).toFixed(2)
      : "0.00";
  };

  // Function to download students data as Excel
  const handleDownload = () => {
    const studentsData = subject.students.map((student) => ({
      RegNumber: student.regNumber,
      Name: student.name,
      FinalMark: student.finalMark,
      TestAvgMark: student.testAvgMark,
      AssignmentAvgMark: student.assignmentAvgMark,
      ...(subject.papers || []).reduce(
        (acc, paper, index) => ({
          ...acc,
          [`Paper${index + 1}Name`]: paper.paperName,
          [`Paper${index + 1}Mark`]: paper.mark,
          [`Paper${index + 1}AvgMark`]: paper.avgMark,
          [`Paper${index + 1}HighestMark`]: paper.highestMark,
          [`Paper${index + 1}LowestMark`]: paper.lowestMark,
        }),
        {}
      ),
      Comment: student.comment || "",
    }));

    const numPapers = subject.papers ? subject.papers.length : 0;
    const ws = XLSX.utils.json_to_sheet(studentsData);

    ws["!cols"] = [
      { wpx: 150 },
      { wpx: 150 },
      { wpx: 100 },
      { wpx: 100 },
      { wpx: 100 },
      ...Array(numPapers * 5).fill({ wpx: 120 }),
      { wpx: 300 },
    ];

    studentsData.forEach((student, index) => {
      const rowIndex = index + 2;
      const cellAddress = `G${rowIndex}`;
      if (ws[cellAddress]) {
        ws[cellAddress].s = {
          alignment: {
            wrapText: true,
            vertical: "top",
          },
        };
      }
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      "students.xlsx"
    );
  };
  // Function to calculate the percentage of students with an assessmentMark > 0
  const calculateAssessmentMarkPercentage = () => {
    const totalStudents = subject.students.length;
    const studentsWithMarks = subject.students.filter(
      (student) => student.assessmentMark > 0
    ).length;
    return totalStudents > 0
      ? ((studentsWithMarks / totalStudents) * 100).toFixed(2)
      : "0.00";
  };

  const assessmentMarkPercentage = calculateAssessmentMarkPercentage();
  const handleDownloadGB = () => {
    const studentsData = subject.students.map((student) => ({
      RegNumber: student.regNumber,
      Name: student.name,
      BehaviorGrade: student.behaviorGrade || " ",
      AssessMentMark: student.assessmentMark || " ",
    }));

    const ws = XLSX.utils.json_to_sheet(studentsData);

    ws["!cols"] = [{ wpx: 150 }, { wpx: 150 }, { wpx: 100 }, { wpx: 100 }];

    studentsData.forEach((student, index) => {
      const rowIndex = index + 2;
      const cellAddress = `G${rowIndex}`;
      if (ws[cellAddress]) {
        ws[cellAddress].s = {
          alignment: {
            wrapText: true,
            vertical: "top",
          },
        };
      }
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      "students.xlsx"
    );
  };

  // Function to handle file upload and parse Excel
  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFileName(uploadedFile.name); // Set the file name
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const students = XLSX.utils.sheet_to_json(sheet);

        setUploadedStudents(students);
      };
      reader.readAsArrayBuffer(uploadedFile);
    }
  };

  // Function to handle file upload and parse Excel
  const handleFileUploadGB = async (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFileGBName(uploadedFile.name); // Set the file name
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const students = XLSX.utils.sheet_to_json(sheet);

        setUploadedGBStudents(students);
      };
      reader.readAsArrayBuffer(uploadedFile);
    }
  };

  // Function to upload comments for all students
  const handleUploadComments = async () => {
    try {
      const response = await axios.post("/api/save-comments", {
        className,
        subjectName: subject.subjectName,
        students: uploadedStudents, // Send the parsed students with comments
      });

      if (response.status === 200) {
        alert("Comments uploaded successfully!");
      }
    } catch (error) {
      console.error("Error uploading comments:", error);
      alert("Failed to upload comments.");
    }
  };
  // Function to upload comments for all students
  const handleUploadGradesAndBehavior = async () => {
    try {
      const response = await axios.post("/api/saveGB", {
        className,
        subjectName: subject.subjectName,
        students: uploadedGBStudents, // Send the parsed students with comments
      });

      if (response.status === 200) {
        alert("Comments uploaded successfully!");
      }
    } catch (error) {
      console.error("Error uploading comments:", error);
      alert("Failed to upload comments.");
    }
  };

  return (
    <div className="mb-4 border dark:border-gray-600 rounded-md ">
      {console.log(subject.students)}
      <div
        className="p-2 flex justify-between items-center bg-gray-100 dark:bg-gray-700 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-gray-900 dark:text-gray-100">
          {subject.subjectName}
        </span>
        <div className="text-gray-900 dark:text-gray-100 flex items-center space-x-2">
          <strong>Comments Entered:</strong> {calculateCommentPercentage()}%
          {isOpen ? <FiChevronUp /> : <FiChevronDown />}
        </div>
      </div>
      {isOpen && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800">
          <div className="mb-4 flex justify-between items-start flex-col space-y-4">
            <div className="flex space-x-4">
              <button
                onClick={handleDownloadGB}
                className="flex items-center px-4 py-2 bg-rose-500 text-white rounded-lg shadow-md hover:bg-rose-600"
              >
                <FiDownload className="mr-2" /> Download Assessment & Grade List
              </button>
              <label className="flex items-center px-4 py-2 bg-rose-500 text-white rounded-lg shadow-md hover:bg-rose-600 cursor-pointer">
                <FiUpload className="mr-2" /> Upload Assessment & Grade List
                Excel
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileUploadGB}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleUploadGradesAndBehavior}
                className="flex items-center px-4 py-2 bg-rose-500 text-white rounded-lg shadow-md hover:bg-rose-600"
              >
                <FiUpload className="mr-2" /> Upload Behavior Grades And
                Assessment
              </button>
            </div>
            {fileGBName && (
              <div className="mb-4 text-cyan-950 dark:text-gray-100">
                <strong>Uploaded File:</strong> {fileGBName}
              </div>
            )}
            {uploadedGBStudents.length > 0 && (
              <div className="mb-4 border-cyan-700 border-2 p-2 rounded-md w-full">
                <table className="table-auto w-full text-left border-collapse text-cyan-950 dark:text-gray-100">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">RegNumber</th>
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Behavior Grade</th>
                      <th className="px-4 py-2">Class Average</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploadedGBStudents.map((student, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2">{student.RegNumber}</td>
                        <td className="px-4 py-2">{student.Name}</td>
                        <td className="px-4 py-2">{student.BehaviorGrade}</td>
                        <td className="px-4 py-2">{student.AssessMentMark}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Check if 75% of students have assessmentMark > 0 */}
            {assessmentMarkPercentage >= 75 ? (
              <div className="flex space-x-4">
                <button
                  onClick={handleDownload}
                  className="flex items-center px-4 py-2 bg-rose-500 text-white rounded-lg shadow-md hover:bg-rose-600"
                >
                  <FiDownload className="mr-2" /> Download List
                </button>
                <label className="flex items-center px-4 py-2 bg-rose-500 text-white rounded-lg shadow-md hover:bg-rose-600 cursor-pointer">
                  <FiUpload className="mr-2" /> Upload Excel
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={handleUploadComments}
                  className="flex items-center px-4 py-2 bg-rose-500 text-white rounded-lg shadow-md hover:bg-rose-600"
                >
                  <FiUpload className="mr-2" /> Upload Comments
                </button>
              </div>
            ) : (
              <div className="text-red-600 dark:text-red-400"></div>
            )}
          </div>

          {/* Show file name if uploaded */}
          {fileName && (
            <div className="mb-4 text-cyan-950 dark:text-gray-100">
              <strong>Uploaded File:</strong> {fileName}
            </div>
          )}

          {/* Display preview table if students are uploaded */}
          {uploadedStudents.length > 0 && (
            <div className="mb-4 border-cyan-700 border-2 p-2 rounded-md  ">
              {/* Check if 75% of students have assessmentMark > 0 */}
              {assessmentMarkPercentage >= 75 ? (
                <table className="table-auto w-full text-left border-collapse text-cyan-950 dark:text-gray-100">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">RegNumber</th>
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Comment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploadedStudents.map((student, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2">{student.RegNumber}</td>
                        <td className="px-4 py-2">{student.Name}</td>
                        <td className="px-4 py-2">{student.Comment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-red-600 dark:text-red-400">
                  Note: Less than 75% of the students have an class average
                  mark. Please review before proceeding.
                </div>
              )}
            </div>
          )}

          {/* Check if 75% of students have assessmentMark > 0 */}
          {assessmentMarkPercentage >= 75 ? (
            <StudentSlide
              students={subject.students}
              subjectName={subject.subjectName}
              className={className}
            />
          ) : (
            <div className="text-red-600 dark:text-red-400">
              Note: Less than 75% of the students have an class average mark.
              Please review before proceeding.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubjectAccordion;
