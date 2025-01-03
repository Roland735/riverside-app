// components/StudentSlider.js
import { useState } from 'react';
import { FaArrowDown, FaArrowLeft, FaArrowRight, FaArrowUp, FaChartLine, FaTrophy, FaUserAlt } from 'react-icons/fa';

// Function to determine the background color based on the mark using Cambridge A Level grading
const getBackgroundColor = (mark) => {
    if (mark >= 80) return "bg-green-600"; // A* (Excellent)
    if (mark >= 70) return "bg-green-500"; // A (Very Good)
    if (mark >= 60) return "bg-yellow-500"; // B (Good)
    if (mark >= 50) return "bg-orange-500"; // C (Satisfactory)
    if (mark >= 40) return "bg-red-500"; // D (Pass)
    return "bg-gray-500"; // E (Fail)
};

const StudentSlider = ({ students }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % students.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? students.length - 1 : prevIndex - 1
        );
    };

    const student = students[currentIndex];

    if (!student) {
        return <p>No student data available</p>; // Handle case where student data is missing
    }

    return (
        <div className="relative w-full">
            {/* Slider Content */}
            <div className="p-4 border dark:border-gray-600 rounded-md w-full bg-white dark:bg-gray-800">
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

                {/* Marks and Papers Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {student.papers.map((paper, index) => (
                        <div
                            key={index}
                            className={`text-white p-4 rounded-lg shadow-md ${getBackgroundColor(paper.mark)}`}
                        >
                            <h3 className="font-semibold mb-2 flex items-center space-x-2">
                                <FaChartLine /> <span>{paper.paperName}</span>
                            </h3>
                            <p className="flex items-center space-x-2">
                                <FaTrophy /> <span><strong>Mark:</strong> {Math.round(paper.mark)}</span>
                            </p>
                            <p className="flex items-center space-x-2">
                                <FaChartLine /> <span><strong>Avg Mark:</strong> {Math.round(paper.avgMark)}</span>
                            </p>
                            <p className="flex items-center space-x-2">
                                <FaArrowUp /> <span><strong>Highest Mark:</strong> {Math.round(paper.highestMark)}</span>
                            </p>
                            <p className="flex items-center space-x-2">
                                <FaArrowDown /> <span><strong>Lowest Mark:</strong> {Math.round(paper.lowestMark)}</span>
                            </p>
                        </div>
                    ))}
                </div>

                {/* Final Mark */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div
                        className={`p-4 rounded-lg shadow-md ${getBackgroundColor(student.finalMark)} text-white flex items-center space-x-2`}
                    >
                        <FaTrophy /> <span><strong>Final Mark:</strong> {Math.round(student.finalMark)}</span>
                    </div>
                </div>

                {/* Teacher Comment Section */}
                <div className="mb-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md mt-4">
                    <span className="font-semibold text-cyan-950 dark:text-cyan-50">
                        Teacher Comment:{" "}
                    </span>
                    <span className="text-cyan-950 dark:text-cyan-50">
                        {student.comment}
                    </span>
                </div>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={handlePrev}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 bg-gray-200 rounded-full shadow-md hover:bg-gray-300"
            >
                <FaArrowLeft className="text-gray-700" />
            </button>
            <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 bg-gray-200 rounded-full shadow-md hover:bg-gray-300"
            >
                <FaArrowRight className="text-gray-700" />
            </button>
        </div>
    );
};

export default StudentSlider;
