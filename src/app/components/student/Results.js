import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast } from "react-hot-toast";
import { FaChartLine, FaClipboard, FaAward } from "react-icons/fa";
import { QRCodeCanvas } from "qrcode.react";
import QRCode from "qrcode"; // Use the QRCode package for QR code generation

// Function to calculate Cambridge grading
const getCambridgeGrade = (mark) => {
  if (mark >= 90) return "A*";
  if (mark >= 80) return "A";
  if (mark >= 70) return "B";
  if (mark >= 60) return "C";
  if (mark >= 50) return "D";
  if (mark >= 40) return "E";
  return "F";
};

// Function to calculate overall statistics (average marks)
const calculateStatistics = (subjects) => {
  const totalTestMarks = subjects.reduce(
    (acc, subject) => acc + subject.testMark,
    0
  );
  const totalAssignmentMarks = subjects.reduce(
    (acc, subject) => acc + subject.assignmentMark,
    0
  );
  const totalClassAverage = subjects.reduce(
    (acc, subject) => acc + subject.classAverage,
    0
  );
  const totalFinalMarks = subjects.reduce(
    (acc, subject) => acc + subject.finalMark,
    0
  );
  const numSubjects = subjects.length;

  let numfinalMark = 0;
  let numTest = 0;
  let numClassAverage = 0;
  let numAss = 0;

  for (let i = 0; i < subjects.length; i++) {
    if (subjects[i].finalMark > 0) numfinalMark++;
    if (subjects[i].testMark > 0) numTest++;
    if (subjects[i].classAverage > 0) numClassAverage++;
    if (subjects[i].assignmentMark > 0) numAss++;
  }

  return {
    avgTestMark: (totalTestMarks / numTest).toFixed(2),
    avgAssignmentMark: (totalAssignmentMarks / numAss).toFixed(2),
    avgFinalMark: (totalFinalMarks / numfinalMark).toFixed(2),
    avgClassAverage: (totalClassAverage / numClassAverage).toFixed(2),
  };
};

const StudentGraph = ({ session }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch data from the API
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch("/api/student-report", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            regNumber: session.user.regNumber,
            period: "Mid-First term",
            year: 2025,
          }),
        });
        const data = await response.json();
        setStudent(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching student data:", error);
        toast.error("Failed to load student data.");
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!student) return <div>No student data available.</div>;

  const statistics = calculateStatistics(student.subjects);

  // Utility function to convert image to data URL using Promises
  const getImageDataURL = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous"; // Handle cross-origin images
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = reject;
      img.src = src;
    });
  };

  // Function to generate and add the QR code to the PDF
  const generateQRCode = async (pdf) => {
    const qrCodeValue = "http://your-report-url.com"; // Replace with your actual report URL
    const qrCodeCanvas = document.createElement("canvas");
    const qrCodeSize = 128;

    // Generate QR Code
    QRCode.toCanvas(
      qrCodeCanvas,
      qrCodeValue,
      { width: qrCodeSize },
      async (error) => {
        if (error) {
          console.error("Error generating QR code:", error);
          return;
        }
        const qrCodeDataURL = qrCodeCanvas.toDataURL("image/png");
        pdf.addImage(qrCodeDataURL, "PNG", 170, 20, 30, 30); // Add QR code to the PDF
        console.log("QR Code added to PDF");
      }
    );
  };

  const downloadPDF = async () => {
    const pdf = new jsPDF();
    try {
      // Load school logo if available
      if (student.schoolLogoUrl) {
        const logoDataURL = await getImageDataURL(student.schoolLogoUrl);
        pdf.addImage(logoDataURL, "PNG", 80, 10, 50, 50); // School logo on top of the PDF
        console.log("Logo added to PDF");
      }

      // Generate QR Code
      await generateQRCode(pdf);

      // Generate the remaining PDF content after images are loaded
      generatePDFContent(pdf);
    } catch (error) {
      console.error("Error loading images for PDF:", error);
      generatePDFContent(pdf); // Proceed with PDF generation without images if error occurs
    }
  };

  // Function to handle PDF content generation
  const generatePDFContent = (pdf) => {
    pdf.setTextColor(60, 60, 60);
    pdf.setFontSize(14);
    pdf.text(`${student.schoolName || "School Name"}`, 10, 50);
    pdf.setFontSize(12);
    // Optional: Draw a line under the header

    pdf.text(`Student Report: ${student.name || ""}`, 10, 60);

    pdf.text(`Registration Number: ${student.regNumber || ""}`, 10, 65);

    pdf.text(`Exam Period: ${student.examPeriod || ""}`, 10, 70);

    pdf.text(`Attendance: ${student.attendancePercentage || ""}%`, 10, 75);

    // Generate the subject marks table, statistics, and other sections...
    generateTableAndComments(pdf);

    // Save the PDF
    pdf.save(`${student.name || "student"}-report.pdf`);
    toast.success("PDF generated successfully!");
  };

  // Function to generate table and comments
  // Function to generate table and comments
  const generateTableAndComments = (pdf) => {
    // Cambridge Grading Guide Table
    pdf.setFontSize(12);
    pdf.setTextColor(60, 60, 60); // Darker gray for text
    pdf.text("Cambridge Grading Guide:", 10, 85);
    pdf.autoTable({
      startY: 90,
      head: [["A*", "A", "B", "C", "D", "E", "F"]],
      body: [
        ["90-100", "80-89", "70-79", "60-69", "50-59", "40-49", "Below 40"],
        [
          "Out Standing",
          "Very Good",
          "Good",
          "Satisfactory",
          "Requires Improvement",
          "Below Expectations",
          "Need for concern",
        ],
      ],
      styles: { fontSize: 10, cellPadding: 5 },
      theme: "grid",
      headStyles: {
        fillColor: [244, 63, 94],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
    });

    // Subject Marks Table
    const tableData = student.subjects.map((subject, index) => [
      index + 1,
      subject.name || "",
      subject.behaviorGrade || "",
      subject.classAverage || "",
      subject.finalMark || "",
      getCambridgeGrade(subject.finalMark),
      subject.subjectTeacherComment || "",
    ]);

    pdf.setFontSize(12);
    pdf.text("Subject Performance:", 10, pdf.autoTable.previous.finalY + 10);
    pdf.autoTable({
      startY: pdf.autoTable.previous.finalY + 15,
      head: [
        [
          "#",
          "Subject",
          "Behavior Grade",
          "Term Average",
          "Final Mark",
          "Grade",
          "Teacher Comment",
        ],
      ],
      body: tableData,
      styles: { fontSize: 10, cellPadding: 5 },
      theme: "grid",
      headStyles: {
        fillColor: [244, 63, 94],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
    });

    // Overall Statistics Table
    const statistics = calculateStatistics(student.subjects);
    pdf.setFontSize(12);
    pdf.text("Overall Statistics:", 10, pdf.autoTable.previous.finalY + 10);

    pdf.autoTable({
      startY: pdf.autoTable.previous.finalY + 15,
      head: [["Statistic", "Average Mark"]],
      body: [
        ["Average Class Average", statistics.avgClassAverage],
        ["Average Final Mark", statistics.avgFinalMark],
      ],
      styles: { fontSize: 10, cellPadding: 5 },
      theme: "grid",
      headStyles: {
        fillColor: [244, 63, 94],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
    });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen w-full">
      {/* School logo */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex space-x-2 items-center">
          <img
            src={student.schoolLogoUrl}
            alt="School Logo"
            className="w-16 h-16 mr-4 bg-white rounded-full"
          />
          <h1 className="text-3xl font-bold text-red-800">
            {student.schoolName}
          </h1>
        </div>

        <div className="mb-4">
          <QRCodeCanvas value="http://your-report-url.com" size={128} />
          {/* Replace with your actual report URL */}
        </div>
      </div>
      {/* Student Details */}
      <div className="mb-6 flex items-center">
        <img
          src={student.imageUrl}
          alt="Student"
          className="w-20 h-20 rounded-full mr-4"
        />
        <div>
          <h1 className="text-2xl font-bold mb-2">
            Student Report: {student.name}
          </h1>
          <p>Registration Number: {student.regNumber}</p>
          <p>Attendance: {student.attendancePercentage}%</p>
          <p>Exam Period: {student.examPeriod}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* {/* <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
                        <FaClipboard className="text-blue-500 text-3xl mr-4" />
                        {/* <div>
                            <p className="text-lg font-semibold">Test Avg</p>
                            <p className="text-xl">{statistics.avgTestMark}</p>
                        </div> */}
        {/* <div>
                            <p className="text-lg font-semibold">Behavior Grade</p>
                            <p className="text-xl">{statistics.avgTestMark}</p>
                        </div> 
                    </div>  */}
        <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
          <FaChartLine className="text-green-500 text-3xl mr-4" />
          <div>
            <p className="text-lg font-semibold">Class Average</p>
            <p className="text-xl">{statistics.avgClassAverage}</p>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
          <FaAward className="text-yellow-500 text-3xl mr-4" />
          <div>
            <p className="text-lg font-semibold">Final Avg</p>
            <p className="text-xl">{statistics.avgFinalMark}</p>
          </div>
        </div>
      </div>

      {/* Subject Performance Table */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Subject Performance</h2>
        <table className="table-auto w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Subject</th>
              {/* <th className="px-4 py-2">Test Mark</th>
                                <th className="px-4 py-2">Assignment Mark</th> */}
              <th className="px-4 py-2">Behavior Grade</th>
              <th className="px-4 py-2">Class Average</th>
              <th className="px-4 py-2">Final Mark</th>
              <th className="px-4 py-2">Grade</th>
              <th className="px-4 py-2">Teacher Comment</th>
            </tr>
          </thead>
          <tbody>
            {student.subjects.map((subject, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">{subject.name}</td>
                {/* <td className="px-4 py-2">{subject.testMark}</td>
                                    <td className="px-4 py-2">{subject.assignmentMark}</td> */}
                <td className="px-4 py-2">{subject.behaviorGrade}</td>
                <td className="px-4 py-2">{subject.classAverage}</td>
                <td className="px-4 py-2">{subject.finalMark}</td>
                <td className="px-4 py-2">
                  {getCambridgeGrade(subject.finalMark)}
                </td>
                <td className="px-4 py-2">{subject.subjectTeacherComment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold mb-4">Student Performance Graph</h2>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={student.subjects}>
          <defs>
            <linearGradient id="colorTest" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <CartesianGrid strokeDasharray="3 3" />
          <Area
            type="monotone"
            dataKey="finalMark"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorTest)"
          />
        </AreaChart>
      </ResponsiveContainer>

      <button
        onClick={downloadPDF}
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Download Report as PDF
      </button>
    </div>
  );
};

export default StudentGraph;
