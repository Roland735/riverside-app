"use client";
import { useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";

function UploadUsers() {
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);
  const [excelData, setExcelData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
    event.preventDefault();

    if (!excelData) {
      toast.error("Please upload an Excel file.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/registerusers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(excelData),
      });

      if (!response.ok) {
        console.error("Error adding users:", response.statusText);
        toast.error(
          "Error adding users. Please try again or contact IT support."
        );
        return;
      }

      toast.success("Users uploaded successfully!");

      // Clear the form
      setExcelData(null);
      setExcelFile(null);
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full p-4 md:p-8">
      <h3 className="text-xl my-8 font-semibold border-b-2 border-cyan-700 text-cyan-900 dark:text-cyan-950">
        Upload Users
      </h3>

      <form className="w-full" onSubmit={handleFileSubmit}>
        <input
          type="file"
          className="border-2 bg-cyan-700 border-emerald-600 rounded p-2 text-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
          required
          onChange={handleFile}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="my-5 border-2 bg-cyan-700 border-emerald-600 rounded p-2 text-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-36"
          disabled={!excelFile || isLoading}
        >
          {isLoading ? "Uploading..." : "UPLOAD"}
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
          <input
            type="submit"
            className={`border-2 ${
              excelData ? "bg-cyan-700" : "bg-slate-400"
            } border-emerald-600 rounded p-2 text-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-36`}
            disabled={!excelData || isLoading}
          />
          {isLoading && (
            <div className="text-center text-cyan-900 dark:text-cyan-950">
              Creating users...
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default UploadUsers;
