import { useEffect, useState } from "react";
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
import { FaChartLine, FaClipboard, FaAward, FaUserCircle } from "react-icons/fa";

export default function StudentSlides({ groupedStudents, downloadPDF }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [headmasterComment, setHeadmasterComment] = useState("");

    const studentsArray = Object.entries(groupedStudents).flatMap(
        ([className, students]) =>
            students.map((student) => ({ className, ...student, headmasterComment: "" }))
    );

    const getCambridgeGrade = (mark) => {
        if (mark >= 90) return "A*";
        if (mark >= 80) return "A";
        if (mark >= 70) return "B";
        if (mark >= 60) return "C";
        if (mark >= 50) return "D";
        if (mark >= 40) return "E";
        return "F";
    };

    const fetchHeadmasterComment = async (regNumber, className) => {
        try {
            const response = await fetch(`/api/getHeadmasterComment?regNumber=${regNumber}&className=${className}`);
            if (response.ok) {
                const data = await response.json();
                const comment = data.headmasterComment || "";

                // Update only the specific student's comment
                studentsArray[currentSlide].headmasterComment = comment;
                setHeadmasterComment(comment); // Set local state for text area display
            }
        } catch (error) {
            console.error("Error fetching headmaster comment:", error);
        }
    };

    useEffect(() => {
        const student = studentsArray[currentSlide];
        fetchHeadmasterComment(student.regNumber, student.className);
    }, [currentSlide]);

    const updateHeadmasterComment = async () => {
        try {
            const student = studentsArray[currentSlide];
            const response = await fetch("/api/updateHeadmasterComment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    regNumber: student.regNumber,
                    headmasterComment,
                    className: student.className,
                }),
            });
            if (response.ok) {
                student.headmasterComment = headmasterComment;
                alert("Headmaster comment updated successfully");
            } else {
                alert("Failed to update comment");
            }
        } catch (error) {
            console.error("Error updating comment:", error);
            alert("An error occurred while updating the comment");
        }
    };

    const nextSlide = () => setCurrentSlide((prev) => (prev === studentsArray.length - 1 ? 0 : prev + 1));
    const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? studentsArray.length - 1 : prev - 1));

    const student = studentsArray[currentSlide];

    return (
        <div className="relative w-full mx-auto p-4">
            <div className="text-center mb-4">
                <h2 className="text-xl font-bold">{student.className}</h2>
                <div className="bg-white rounded-lg shadow-md p-4">
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
                        </div>
                        {/* Student Details */}
                        <div className="mb-6 flex items-center">
                            {student.imageUrl ? (
                                <img
                                    src={student.imageUrl}
                                    alt="Student Image"
                                    className="w-16 h-16 mr-4 bg-white rounded-full"
                                />
                            ) : (
                                <FaUserCircle className="w-16 h-16 mr-4 bg-gray-200 rounded-full text-gray-500" />
                            )}
                            <div className="text-start">
                                <h1 className="text-2xl font-bold mb-2">
                                    Student Report: {student.name}
                                </h1>
                                <p>Registration Number: {student.regNumber}</p>
                                <p>Attendance: {student.attendancePercentage}%</p>
                                <p>Exam Period: {student.examPeriod}</p>
                            </div>
                        </div>



                        {/* Subject Performance Table */}
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-2 text-start py-10">Subject Performance</h2>
                            <table className="table-auto w-full bg-white shadow-md rounded-lg overflow-hidden">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="px-4 py-2">Subject</th>
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

                        {/* Student Performance Graph */}
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
                    </div>
                    {/* Headmaster Comment Section */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2 text-start py-2">Headmaster Comment</h2>
                        <p className="text-start mb-2 text-gray-700">
                            Current Comment: {headmasterComment || "No comment available"}
                        </p>
                        <textarea
                            className="w-full p-2 border rounded-md"
                            value={headmasterComment}
                            onChange={(e) => setHeadmasterComment(e.target.value)}
                            placeholder="Enter new headmaster comment"
                        />
                        <button
                            onClick={updateHeadmasterComment}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
                        >
                            Save Comment
                        </button>
                    </div>

                    {/* Download Report Button */}
                    <div className="mt-4">
                        <button
                            onClick={() => downloadPDF(student)}
                            className="bg-green-500 text-white px-4 py-2 rounded-md"
                        >
                            Download Report PDF
                        </button>
                    </div>
                </div>
            </div>
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-4">
                <button onClick={prevSlide} className="text-blue-500 font-bold">Previous</button>
                <button onClick={nextSlide} className="text-blue-500 font-bold">Next</button>
            </div>
        </div>
    );
}
