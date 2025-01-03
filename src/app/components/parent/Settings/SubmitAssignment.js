import { useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import ExcelTemplateDownload from "./ExcelTemplateDownload";

function UploadAssignments({ subject, title, gradeProp, type }) {
  console.log(title);

  // onchange states
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);
  const [grade, setGrade] = useState(gradeProp);
  const [subjectName, setSubjectName] = useState(subject);
  const [term, setTerm] = useState(null);
  const [assignmentName, setAssignmentName] = useState(title);
  const [assignDate, setAssignDate] = useState(""); // Initialize assignDate with an empty string

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
      !grade ||
      !subjectName ||
      !excelData ||
      !term ||
      !assignDate ||
      !assignmentName
    ) {
      toast.error(
        "Please fill out all required fields and upload an Excel file."
      );
      return;
    }
    if (type === "assignment") {
      console.log(excelData);

      const response = await fetch("/api/assignmentUpload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grade,
          subjectName,
          excelData,
          term,
          assignDate,
          assignmentName,
        }),
      });
      if (!response.ok) {
        console.error(`Error adding ${type}:`, response.statusText);
        toast.error(
          `Error adding ${type}. Please try again or contact IT support.`
        );
        return;
      }
    } else if (type === "quiz") {
      const response = await fetch("/api/quizUpload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grade,
          subjectName,
          excelData,
          term,
          assignDate,
          assignmentName,
        }),
      });
      if (!response.ok) {
        console.error(`Error adding ${type}:`, response.statusText);
        toast.error(
          `Error adding ${type}. Please try again or contact IT support.`
        );
        return;
      }
    } else if (type === "test") {
      const response = await fetch("/api/testUpload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grade,
          subjectName,
          excelData,
          term,
          assignDate,
          assignmentName,
        }),
      });
      if (!response.ok) {
        console.error(`Error adding ${type}:`, response.statusText);
        toast.error(
          `Error adding ${type}. Please try again or contact IT support.`
        );
        return;
      }
    }

    toast.success(`${type}s uploaded successfully!`);

    // // Clear the form
    // setGrade(null);
    // setSubjectName(null);
    // setExcelData(null);
    // setExcelFile(null);
    // setTerm(null);
    // setAssignmentName(null);
    // setAssignDate(""); // Reset assignDate to an empty string
  };
  return (
    <div className="w-full ">
      <ExcelTemplateDownload
        className={gradeProp}
        title={title}
        subjectName={subjectName}
        templateType={type}
      />
      <h3 className=" text-xl my-8 font-semibold border-b-2 border-cyan-700 text-cyan-900 dark:text-cyan-950">
        Upload {type} for
        <span className="text-green-600 px-3 py-1 rounded-md ">{title}</span>
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
          type="submit"
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
      <div className="viewer my-3">
        {excelData ? (
          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              <thead>
                <tr className="bg-cyan-950 text-slate-200 capitalize">
                  {Object.keys(excelData[0]).map((key, index) => (
                    <th key={index} className="px-4 py-2">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-cyan-950">
                {excelData.map((individualExcelData, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-cyan-800" : "bg-cyan-900"}
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
          <div className="text-center py-4 text-cyan-900 dark:text-cyan-950">
            No File is uploaded yet!
          </div>
        )}
      </div>
      <form
        action=""
        className="flex flex-col space-y-3"
        onSubmit={(event) => handleSubmit(event)}
      >
        <div className="flex flex-col space-y-3">
          <label
            htmlFor=""
            className="text-cyan-900 dark:text-cyan-950 tracking-wide font-bold border-b-2 border-emerald-600"
          >
            Subject name: {subject}
          </label>
        </div>
        <div className="flex flex-col space-y-3">
          <label
            htmlFor=""
            className="text-cyan-900 dark:text-cyan-950 tracking-wide font-bold border-b-2 border-emerald-600"
          >
            <span className="capitalize">{type}</span> name:{title}{" "}
          </label>
        </div>
        <div className="flex flex-col space-y-3">
          <label
            htmlFor=""
            className="text-cyan-900 dark:text-cyan-950 tracking-wide font-bold border-b-2 border-emerald-600 "
          >
            Grade: {gradeProp}
          </label>
        </div>
        <div className="flex flex-col space-y-3">
          <label htmlFor="" className="text-cyan-900 dark:text-cyan-950">
            Date Assigned:
          </label>
          <input
            type="Date"
            onChange={(e) => setAssignDate(e.target.value)}
            className="border-2 border-emerald-600 rounded p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
          />
        </div>
        <div className="flex flex-col space-y-3">
          <label htmlFor="" className="text-cyan-900 dark:text-cyan-950">
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
            {/* Add more terms as needed */}
          </select>
        </div>

        <div className="flex flex-col space-y-3">
          <input
            type="submit"
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

export default UploadAssignments;
