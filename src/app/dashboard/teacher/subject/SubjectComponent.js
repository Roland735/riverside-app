"use client";
// pages/SubjectAnalysis.js

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";
import DataComponent from "@/app/components/teacher/Subject/SubjectSpecificInfo";



const assignmentData = {
    highestStudent: { name: "John Doe", score: 85, change: 10, grade: "A" },
    lowestStudent: { name: "Bob Williams", score: 55, change: -10, grade: "C" },
    mostImprovedStudent: {
        name: "Alice Johnson",
        score: 90,
        change: 5,
        grade: "A",
    },
    mostUnimprovedStudent: {
        name: "Bob Williams",
        score: 55,
        change: -10,
        grade: "C",
    },
    scatterData: [
        { name: "John Doe", score: 70 },
        { name: "Jane Smith", score: 85 },
        { name: "Alice Johnson", score: 90 },
        { name: "Bob Williams", score: 55 },
    ],
    areaData: [
        { topic: "Topic 1", score: 80 },
        { topic: "Topic 2", score: 70 },
        { topic: "Topic 3", score: 90 },
        { topic: "Topic 4", score: 85 },
        { topic: "Topic 5", score: 75 },
    ],
};

const testData = {
    highestStudent: { name: "Alice Johnson", score: 92, change: 15, grade: "A" },
    lowestStudent: { name: "Bob Williams", score: 60, change: -8, grade: "C" },
    mostImprovedStudent: {
        name: "Alice Johnson",
        score: 92,
        change: 15,
        grade: "A",
    },
    mostUnimprovedStudent: {
        name: "Bob Williams",
        score: 60,
        change: -8,
        grade: "C",
    },
    scatterData: [
        { name: "John Doe", score: 85 },
        { name: "Jane Smith", score: 75 },
        { name: "Alice Johnson", score: 92 },
        { name: "Bob Williams", score: 60 },
    ],
    areaData: [
        { topic: "Topic 1", score: 80 },
        { topic: "Topic 2", score: 70 },
        { topic: "Topic 3", score: 90 },
        { topic: "Topic 4", score: 85 },
        { topic: "Topic 5", score: 75 },
    ],
};

const overallData = {
    highestStudent: { name: "Alice Johnson", score: 95, change: 8, grade: "A" },
    lowestStudent: { name: "Bob Williams", score: 65, change: -3, grade: "C" },
    mostImprovedStudent: { name: "John Doe", score: 80, change: 5, grade: "B" },
    mostUnimprovedStudent: {
        name: "Jane Smith",
        score: 80,
        change: 10,
        grade: "B",
    },
    scatterData: [
        { name: "John Doe", score: 80 },
        { name: "Jane Smith", score: 80 },
        { name: "Alice Johnson", score: 95 },
        { name: "Bob Williams", score: 65 },
    ],
    areaData: [
        { topic: "Topic 1", score: 80 },
        { topic: "Topic 2", score: 70 },
        { topic: "Topic 3", score: 90 },
        { topic: "Topic 4", score: 85 },
        { topic: "Topic 5", score: 75 },
    ],
};

const SubjectAnalysis = () => {
    const [isOnTrack, setIsOnTrack] = useState(true);

    // Optional: if you need to fetch data on client-side useEffect is the right place
    useEffect(() => {
        // Fetch data or perform actions that should only run on client
    }, []);

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-4 text-cyan-800 dark:text-cyan-200">Subject Analysis</h1>
            <div className="flex flex-col lg:flex-row lg:space-x-8 mb-8 items-stretch">
                <div className="w-full lg:w-1/3 mb-8 lg:mb-0 flex-grow">
                    <div className="combination borders shadow-md p-6 rounded-md h-full flex flex-col justify-between">
                        <div className="">
                            <h2 className="text-xl font-semibold mb-2">Class Information</h2>
                            <p className="mb-1">
                                <span className="font-bold">Class Name:</span> Algebra 101
                            </p>
                            <p className="mb-1">
                                <span className="font-bold">Grade:</span> 10
                            </p>
                            <div className="flex items-center mb-1">
                                <img
                                    src="https://via.placeholder.com/40"
                                    alt="Current Teacher"
                                    className="w-10 h-10 rounded-full mr-2"
                                />
                                <p>
                                    <span className="font-bold">Current Teacher:</span> Mr. Smith
                                </p>
                            </div>
                            <div className="flex items-center mb-1">
                                <img
                                    src="https://via.placeholder.com/40"
                                    alt="Previous Teacher"
                                    className="w-10 h-10 rounded-full mr-2"
                                />
                                <p>
                                    <span className="font-bold">Previous Teacher:</span> Mrs.
                                    Johnson
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="  w-full lg:w-1/3 mb-8 lg:mb-0 flex-grow">
                    <div className="combination borders shadow-md p-6 rounded-md h-full flex flex-col justify-between">
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Status</h2>
                            <p className="text-lg">
                                Status:{" "}
                                <span
                                    className={`font-bold ${isOnTrack ? "text-green-600" : "text-red-600"
                                        }`}
                                >
                                    {isOnTrack ? "On Track" : "Not On Track"}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6 w-full">
                <DataComponent data={assignmentData} title="Assignment Performance" />
                <DataComponent data={testData} title="Test Performance" />
                <DataComponent data={overallData} title="Overall Performance" />
            </div>
        </div>
    );
};

export default SubjectAnalysis;
