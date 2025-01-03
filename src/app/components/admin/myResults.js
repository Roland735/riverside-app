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

import { QRCodeCanvas } from "qrcode.react";
import QRCode from "qrcode"; // Use the QRCode package for QR code generation
import JSZip from "jszip";
import { saveAs } from "file-saver";
import ClassSlide from "./ClassSlide";
import StudentSlides from "./ClassSlide";

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

const StudentsSlide = ({ session }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch data from the API
    useEffect(() => {
        const fetchStudentsData = async () => {
            try {
                const response = await fetch("/api/all-reports", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        period: "Mid-First term",
                        year: 2025,
                    }),
                });
                const data = await response.json();
                console.log(data);

                setStudents(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching students data:", error);
                toast.error("Failed to load students data.");
                setLoading(false);
            }
        };

        fetchStudentsData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (!students.length) return <div>No students data available.</div>;

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
    const generateQRCode = async (pdf, qrCodeValue) => {
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

    const downloadPDF = async (student) => {
        const pdf = new jsPDF();
        try {
            if (student.schoolLogoUrl) {
                const logoDataURL = await getImageDataURL(student.schoolLogoUrl);
                pdf.addImage(logoDataURL, "PNG", 80, 10, 50, 50); // School logo on top
            }
            await generateQRCode(pdf, "https://example.com"); // QR code generation
            generatePDFContent(pdf, student); // PDF content
        } catch (error) {
            console.error("Error loading images for PDF:", error);
            generatePDFContent(pdf, student); // Continue PDF generation
        }
        return pdf; // Return pdf object for ZIP handling
    };

    // Function to handle PDF content generation
    const generatePDFContent = (pdf, student) => {
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
        generateTableAndComments(pdf, student);

        // Save the PDF
        pdf.save(`${student.name || "student"}-report.pdf`);
        toast.success("PDF generated successfully!");
    };

    // Function to generate table and comments
    const generateTableAndComments = (pdf, student) => {
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

        // Comments Section
        pdf.setFontSize(12);
        pdf.setTextColor(60, 60, 60);
        pdf.text("Comments:", 10, pdf.autoTable.previous.finalY + 10);
        pdf.setFontSize(10);
        pdf.text(`Class Teacher Comment: ${student.classTeacherComment || ""}`, 10, pdf.autoTable.previous.finalY + 20);
        pdf.text(`Admin Comment: ${student.adminComment || ""}`, 10, pdf.autoTable.previous.finalY + 30);
        pdf.text(`AI Comment: ${student.aiComment || ""}`, 10, pdf.autoTable.previous.finalY + 40);

        // Signature Line
        pdf.setFontSize(12);
        pdf.text("Signature: _________________________", 10, pdf.autoTable.previous.finalY + 50);
    };

    const generateZipFile = async () => {
        const zip = new JSZip();

        // Group students by their className
        const groupedStudents = students.reduce((acc, student) => {
            const className = student.className.trim(); // Trim to avoid leading/trailing spaces
            if (!acc[className]) {
                acc[className] = [];
            }
            acc[className].push(student);
            return acc;
        }, {});

        // Loop through each group (class folder)
        for (const className in groupedStudents) {
            const classFolder = zip.folder(className); // Create a folder for the class
            for (const student of groupedStudents[className]) {
                const pdf = await downloadPDF(student); // Generate PDF for the student
                const pdfBlob = pdf.output("blob");
                classFolder.file(`${student.name}-report.pdf`, pdfBlob); // Add file to the class folder
            }
        }

        // Generate the ZIP file
        const zipBlob = await zip.generateAsync({ type: "blob" });
        saveAs(zipBlob, "students-reports.zip");
        toast.success("ZIP file with student reports generated successfully!");
    };



    // Function to calculate the background color for each subject card
    const getBackgroundColor = (testAverage) => {
        if (testAverage >= 80) return "bg-green-200";
        if (testAverage >= 60) return "bg-yellow-200";
        if (testAverage >= 40) return "bg-orange-200";
        if (testAverage === 0) return "bg-gray-200"; // Neutral color for 0
        return "bg-red-200";
    };

    // Function to group students by their class name
    const groupStudentsByClass = (students) => {
        const classGroups = {};
        students.forEach((student) => {
            const className = student.className || "Unknown Class";
            if (!classGroups[className]) {
                classGroups[className] = [];
            }
            classGroups[className].push(student);
        });
        return classGroups;
    };

    // Group students by class
    const groupedStudents = groupStudentsByClass(students);

    return (
        <div className="w-full ">
            <button
                onClick={generateZipFile}
                className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
            >
                Download All Reports as ZIP
            </button>
            <div className="w-full">
                <StudentSlides groupedStudents={groupedStudents} downloadPDF={downloadPDF} />
            </div>
        </div>
    );
};

export default StudentsSlide;
