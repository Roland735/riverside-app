import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import "tailwindcss/tailwind.css";

export default function ClassAccordionPage({ name, regNumber, period, year }) {
  const [activeClass, setActiveClass] = useState({});
  const [classData, setClassData] = useState([]);
  const [fileData, setFileData] = useState({});
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    fetchClassData();
  }, []);

  const fetchClassData = async () => {
    try {
      const response = await fetch("/api/getClassData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, regNumber, period: period, year: year }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("data", data);

      setClassData(data.data);
    } catch (error) {
      console.error("Error fetching class data", error);
    }
  };

  const toggleAccordion = (className, paperNumber) => {
    const key = `${className}-${paperNumber}`;
    setActiveClass((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const downloadExcelTemplate = (className, students, paper) => {
    if (!students || students.length === 0) {
      alert("No students data available to download.");
      return;
    }

    const sheetData = [];
    const headers = ["Reg Number", "Name", "Mark"];
    sheetData.push(headers);

    students.forEach((student) => {
      const row = [student.regNumber, student.name, ""];
      sheetData.push(row);
    });

    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, className);

    XLSX.writeFile(wb, `${className}_${paper.paperName}_Marks_Template.xlsx`);
  };

  const handleExcelUpload = (event, className, paperNumber, subject) => {
    const file = event.target.files[0];
    const key = `${subject}-${paperNumber}`;
    if (file) {
      console.log(key);

      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const processedData = jsonData.slice(1).map((row) => ({
          regNumber: row[0],
          name: row[1],
          mark: parseFloat(row[2]) || 0,
        }));

        const stats = calculateStatistics(processedData);

        setFileData((prevData) => ({
          ...prevData,
          [key]: {
            fileName: file.name,
            excelData: processedData,
            totalMarks: 0,
            statistics: stats,
          },
        }));
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const calculateStatistics = (data) => {
    const marks = data.map((student) => student.mark);
    const average = marks.reduce((acc, mark) => acc + mark, 0) / marks.length;
    const sortedMarks = [...marks].sort((a, b) => a - b);
    const median = sortedMarks[Math.floor(sortedMarks.length / 2)];
    const stdDev = Math.sqrt(
      marks.reduce((acc, mark) => acc + Math.pow(mark - average, 2), 0) /
      marks.length
    );

    return { average, median, stdDev };
  };

  const handleShowChart = (key) => {
    if (fileData[key]?.excelData && fileData[key]?.totalMarks) {
      const chartData = fileData[key].excelData.map((item) => ({
        name: item.name,
        mark: item.mark,
        percentage: (item.mark / fileData[key].totalMarks) * 100,
      }));
      setFileData((prevData) => ({
        ...prevData,
        [key]: {
          ...prevData[key],
          chartData,
          showChart: true,
        },
      }));
    }
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return "A*";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B";
    if (percentage >= 60) return "C";
    if (percentage >= 50) return "D";
    if (percentage >= 40) return "E";
    return "U"; // U = ungraded, below 40%
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case "A*":
        return "bg-green-200 text-cyan-900 dark:bg-green-900 dark:text-green-100";
      case "A":
        return "bg-green-300 text-cyan-900 dark:bg-green-700 dark:text-green-100";
      case "B":
        return "bg-yellow-200 text-cyan-900 dark:bg-yellow-900 dark:text-yellow-100";
      case "C":
        return "bg-yellow-300 text-cyan-900 dark:bg-yellow-700 dark:text-yellow-100";
      case "D":
        return "bg-orange-200 text-cyan-900 dark:bg-orange-900 dark:text-orange-100";
      case "E":
        return "bg-orange-300 text-cyan-900 dark:bg-orange-700 dark:text-orange-100";
      case "U":
        return "bg-red-300 text-cyan-900 dark:bg-red-900 dark:text-red-100";
      default:
        return "";
    }
  };

  const submitData = async (paperNumber, className, subject) => {
    const key = `${subject}-${paperNumber}`;
    if (!fileData[key]?.totalMarks) {
      alert("Please enter the total marks before submitting.");
      return;
    }

    try {
      const dataToSend = {
        regNumber,
        paperNumber,
        className,
        subject,
        examPeriod: period,
        examYear: parseInt(year),
        students: fileData[key]?.excelData.map((student) => {
          const totalMarks = Number(fileData[key]?.totalMarks); // Ensure totalMarks is a number
          return {
            regNumber: student.regNumber,
            mark: student.mark,
            total: totalMarks,
            percentage: totalMarks > 0 ? (student.mark / totalMarks) * 100 : 0, // Avoid division by zero
          };
        }),
      };


      const response = await fetch("/api/submitStudentMarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      alert("Data submitted successfully!");
    } catch (error) {
      alert("Failed to submit data.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Classes
      </h1>

      {classData.map((cls) =>
        cls.papers.map((paper) => {
          const key = `${paper.paperName}-${paper.paperNumber}`;
          const file = fileData[key];
          return (
            <div key={key} className="mb-6">
              {console.log(cls)
              }
              <div
                className="accordion-header cursor-pointer p-4 bg-gray-200 dark:bg-gray-800 dark:text-gray-200 rounded-lg flex justify-between items-center shadow-md hover:bg-gray-300 dark:hover:bg-gray-700"
                onClick={() =>
                  toggleAccordion(paper.paperName, paper.paperNumber)
                }
              >
                <h2 className="font-semibold text-lg">
                  <span>{paper.paperName}</span> <span>{cls.className}</span>
                  <br />
                  <span className="text-sky-500">
                    {" "}
                    Paper {paper.paperNumber}
                  </span>
                </h2>
                <span>{activeClass[key] ? "▲" : "▼"}</span>
              </div>

              {activeClass[key] && (
                <div className="accordion-body bg-white dark:bg-gray-900 dark:text-gray-300 rounded-lg p-6 mt-4 shadow-md">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
                    <label className="flex items-center cursor-pointer">
                      <span className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mr-3">
                        Choose File
                      </span>
                      <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={(e) =>
                          handleExcelUpload(e, cls.className, paper.paperNumber, paper.paperName)
                        }
                        className="hidden"
                      />
                    </label>
                    {file?.fileName && (
                      <p className="text-gray-700 dark:text-gray-300">
                        Uploaded File: {file.fileName}
                      </p>
                    )}
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
                      onClick={() =>
                        downloadExcelTemplate(
                          cls.className,
                          cls.students,
                          paper
                        )
                      }
                    >
                      Download Excel Template
                    </button>
                  </div>

                  {file?.excelData && (
                    <>
                      <div className="mt-6">
                        <table className="min-w-full table-auto bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-300 shadow-md rounded-lg">
                          <thead>
                            <tr>
                              <th className="px-6 py-4 text-left">
                                Reg Number
                              </th>
                              <th className="px-6 py-4 text-left">Name</th>
                              <th className="px-6 py-4 text-left">Mark</th>
                              <th className="px-6 py-4 text-left">
                                Percentage
                              </th>
                              <th className="px-6 py-4 text-left">Grade</th>
                            </tr>
                          </thead>
                          <tbody>
                            {file.excelData.map((student, index) => {
                              const percentage =
                                (student.mark / file.totalMarks) * 100;
                              const grade = getGrade(percentage);
                              const gradeColor = getGradeColor(grade);
                              return (
                                <tr key={index} className={`${gradeColor}`}>
                                  <td className="px-6 py-4">
                                    {student.regNumber}
                                  </td>
                                  <td className="px-6 py-4">{student.name}</td>
                                  <td className="px-6 py-4">{student.mark}</td>
                                  <td className="px-6 py-4">
                                    {percentage.toFixed(2)}%
                                  </td>
                                  <td className="px-6 py-4">{grade}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-4">
                        <label className="block mb-2 text-lg font-semibold">
                          Total Marks:
                        </label>
                        <input
                          type="number"
                          value={file.totalMarks}
                          onChange={(e) =>
                            setFileData((prevData) => ({
                              ...prevData,
                              [key]: {
                                ...prevData[key],
                                totalMarks: e.target.value,
                              },
                            }))
                          }
                          className="border p-2 w-full"
                        />
                      </div>
                      <div className="mt-4">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
                          onClick={() => handleShowChart(key)}
                        >
                          Show Chart {console.log(key)}

                        </button>
                      </div>

                      {file.showChart && (
                        <div className="mt-6">
                          <ScatterChart
                            width={800}
                            height={400}
                            margin={{
                              top: 20,
                              right: 20,
                              bottom: 20,
                              left: 20,
                            }}
                          >
                            <CartesianGrid />
                            <XAxis
                              type="number"
                              dataKey="mark"
                              name="Mark"
                              unit="mark"
                            />
                            <YAxis
                              type="number"
                              dataKey="percentage"
                              name="Percentage"
                              unit="%"
                            />
                            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                            <Legend />
                            <Scatter
                              name="Student Marks"
                              data={file.chartData}
                              fill="#8884d8"
                            />
                          </ScatterChart>
                        </div>
                      )}
                    </>
                  )}

                  <div className="flex items-center justify-end mt-6">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
                      onClick={() =>
                        submitData(
                          paper.paperNumber,
                          cls.className,
                          paper.paperName
                        )
                      }
                    >
                      Submit Marks
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
