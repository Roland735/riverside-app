"use client";
// import { data } from "autoprefixer";
import { useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { all } from "axios";

function UploadExam() {
  const [examDate, setExamDate] = useState("");
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);
  const [grade, setGrade] = useState(null);
  const [paperNumber, setPaperNumber] = useState(null);
  const [subjectName, setSubjectName] = useState(null);
  const [term, setTerm] = useState(null);
  const [invigilator, setInvigilator] = useState("");

  // Handle date change
  const handleDateChange = (e) => {
    setExamDate(e.target.value);
  };

  // submit state
  const [excelData, setExcelData] = useState(null);

  // onchange event
  const handleFile = (e) => {
    let fileTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    let selectedFile = e.target.files[0];

    if (selectedFile) {
      if (selectedFile && fileTypes.includes(selectedFile.type)) {
        setTypeError(null);
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          setExcelFile(e.target.result);
        };
      } else {
        setTypeError("Please select only excel file types");
        setExcelFile(null);
      }
    } else {
      console.log("Please select your file");
    }
  };

  // submit event
  const handleFileSubmit = (e) => {
    e.preventDefault();
    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: "buffer" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      setExcelData(data);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    if (
      !examDate ||
      !grade ||
      !paperNumber ||
      !subjectName ||
      !excelData ||
      !term ||
      !invigilator
    ) {
      toast.error(
        "Please fill out all required fields and upload an Excel file."
      );
      return;
    }

    // Calculate average mark for each paper
    let paperAverages = {};
    for (let i = 1; i <= paperNumber; i++) {
      let totalPaperMark = 0;
      let totalPaperMarks = 0;
      excelData.forEach((studentData) => {
        totalPaperMark += studentData[`paper${i}`]; // Assuming the key is 'paper1', 'paper2', etc.
        totalPaperMarks += studentData[`paper${i}Total`];
      });
      totalPaperMarks = totalPaperMarks / excelData.length;
      paperAverages[`paper${i}`] = totalPaperMark / excelData.length;
      paperAverages[`paper${i}`] =
        (paperAverages[`paper${i}`] / totalPaperMarks) * 100;
    }

    // Calculate average exam mark
    let totalExamMark = 0;
    excelData.forEach((studentData) => {
      totalExamMark += studentData.examMark;
    });
    const examMarkAverage = totalExamMark / excelData.length;

    try {
      const response = await fetch("/api/examUpload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examDate,
          grade,
          paperNumber,
          subjectName,
          excelData,
          term,
          invigilator,
          paperAverages, // Include the average marks for each paper
          examMarkAverage, // Include the average exam mark
        }),
      });

      if (!response.ok) {
        console.error("Error adding exam:", response.statusText);
        toast.error(
          "Error adding exam. Please try again or contact IT support."
        );
        return;
      }

      toast.success("Profile updated successfully!");

      console.log("Student saved successfully!");
      // Handle success (e.g., clear the form, show a success message)
    } catch (error) {
      console.error("Error uploading exam data:", error);
      toast.error("Error adding exam. Please try again or contact IT support.");
    }
  };

  return (
    <div className="w-full">
      <h3 className=" text-xl my-8 font-semibold border-b-2 border-cyan-700 text-cyan-900 dark:text-cyan-50">
        Upload Exam Marks
      </h3>

      {/* form */}
      <form className="w-full" onSubmit={handleFileSubmit}>
        <input
          type="file"
          className="border-2 bg-cyan-700 border-emerald-600 rounded p-2 text-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
          required
          onChange={handleFile}
        />
        <button
          type="submit "
          className="my-5 border-2 bg-cyan-700 border-emerald-600 rounded p-2 text-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-36"
        >
          UPLOAD
        </button>
        {typeError && (
          <div className="alert alert-danger" role="alert">
            {typeError}
          </div>
        )}
      </form>
      <div className="viewer">
        {excelData ? (
          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              <thead>
                <tr className="bg-cyan-950 text-[#fff]">
                  {Object.keys(excelData[0]).map((key, index) => (
                    <th key={index} className="px-4 py-2">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-cyan-50">
                {excelData.map((individualExcelData, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-cyan-700" : "bg-cyan-800"}
                  >
                    {Object.keys(individualExcelData).map((key, index) => (
                      <td key={index} className="border px-4 py-2">
                        {individualExcelData[key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-4 text-cyan-50  bg-cyan-700">
            No File is uploaded yet!
          </div>
        )}
      </div>
      <form
        action=""
        className="flex flex-col space-y-3 my-4"
        onSubmit={(event) => handleSubmit(event)}
      >
        <div className="flex flex-col space-y-3">
          <label htmlFor="" className="text-cyan-900 dark:text-cyan-50">
            Exam Date:
          </label>
          <input
            type="date"
            value={examDate}
            onChange={handleDateChange}
            className="border-2 border-emerald-600 rounded p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
          />
        </div>
        <div className="flex flex-col space-y-3">
          <label htmlFor="" className="text-cyan-900 dark:text-cyan-50">
            Number of Papers:
          </label>
          <input
            type="number"
            placeholder="Roland"
            onChange={(e) => setPaperNumber(e.target.value)}
            className="border-2 border-emerald-600 rounded p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
          />
        </div>

        <div className="flex flex-col space-y-3">
          <label htmlFor="" className="text-cyan-900 dark:text-cyan-50">
            Subject Name:
          </label>
          <select
            onChange={(e) => setSubjectName(e.target.value)}
            className="border-2 border-emerald-600 rounded p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
          >
            <option value="">Select Subject</option>
            <option value="Math">Math</option>
            <option value="Geography">Geography</option>
            <option value="Science">Science</option>
            <option value="English">English</option>
            {/* Add more subjects as needed */}
          </select>
        </div>
        <div className="flex flex-col space-y-3">
          <label htmlFor="" className="text-cyan-900 dark:text-cyan-50">
            Term:
          </label>
          <select
            onChange={(e) => setTerm(e.target.value)}
            className="border-2 border-emerald-600 rounded p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
          >
            <option value="">Select Period</option>
            <option value="First Term">First Term</option>
            <option value="Second Term">Second Term</option>
            <option value="Third Term">Third Term</option>
            {/* Add more subjects as needed */}
          </select>
        </div>
        <div className="flex flex-col space-y-3">
          <label htmlFor="" className="text-cyan-900 dark:text-cyan-50">
            Invigilator:
          </label>
          <input
            type="text"
            onChange={(e) => setInvigilator(e.target.value)}
            className="border-2 border-emerald-600 rounded p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
          />
        </div>

        <div className="flex flex-col space-y-3">
          <label htmlFor="" className="text-cyan-900 dark:text-cyan-50">
            Grade:
          </label>
          <select
            onChange={(e) => setGrade(e.target.value)}
            className="border-2 border-emerald-600 rounded p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
          >
            <option value="">Select Grade</option>
            <option value="1">Grade 1</option>
            <option value="2">Grade 2</option>
            <option value="3">Grade 3</option>
            {/* Add more grade options as needed */}
          </select>
        </div>

        <div className="flex flex-col space-y-3">
          <input
            type="submit"
            placeholder="96 Newstead Marlborough Harare"
            className={`border-2 ${
              excelData ? "bg-cyan-700" : "bg-slate-400"
            } border-emerald-600 rounded p-2 text-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-36`}
            disabled={!excelFile}
          />
        </div>

        <div className="flex flex-col space-y-3"></div>
      </form>

      {/* view data */}
    </div>
  );
}

export default UploadExam;
