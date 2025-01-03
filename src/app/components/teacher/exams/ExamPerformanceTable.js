import React, { useState, useEffect } from "react";
import { AiOutlineDownload } from "react-icons/ai";

const ExamPerformanceTable = () => {
    const [exams, setExams] = useState([]);

    useEffect(() => {
        // Fetch exam data from the API
        const fetchExams = async () => {
            try {
                const response = await fetch("/api/examModel"); // Assuming the API endpoint is at /api/exams

                console.log("Fetched exams:", response);
                if (!response.ok) {
                    throw new Error("Failed to fetch exams");
                }
                const fetchedExams = await response.json();

                if (fetchedExams.exams) {
                    // Round the average mark to the nearest integer
                    const roundedExams = fetchedExams.exams.map(exam => ({
                        ...exam,
                        average_mark: Math.round(exam.average_mark)
                    }));
                    setExams(roundedExams);
                } else {
                    setExams([]);
                }

            } catch (error) {
                console.error("Error fetching exams:", error);
            }
        };
        fetchExams();
    }, []);

    return (
        <div className="w-full overflow-auto rounded-lg shadows colors light-border">
            <table className="w-full min-w-max table-auto">
                <thead>
                    <tr className="text-left text-xs font-medium bg-cyan-950 text-slate-200 capitalize">
                        <th className="p-3">Date</th>
                        <th className="p-3">Subject</th>
                        <th className="p-3">Average Mark</th>
                        <th className="p-3">Deviation from Class Average</th>
                        <th className="p-3" />
                    </tr>
                </thead>
                <tbody>
                    {exams.map((exam) => (
                        <tr key={exam.exam_id} className="border-b border-cyan-300 dark:bg-cyan-900 hover:bg-cyan-500 text-cyan-800 dark:text-cyan-50">
                            <td className="p-3 text-sm">{exam.term}</td>
                            <td className="p-3 text-sm">{exam.subject}</td>
                            <td className="p-3 text-sm text-center">{exam.average_mark}</td>
                            <td className="p-3 text-sm text-center">
                                {exam.standard_deviation > 0 ? (
                                    <span className="text-green-700">+{exam.standard_deviation}</span>
                                ) : (
                                    <span className="text-red-500">{exam.standard_deviation}</span>
                                )}
                            </td>
                            <td className="p-3 flex justify-end">
                                <button className="flex items-center text-sm text-blue-200 hover:text-blue-700">
                                    <AiOutlineDownload className="mr-1" />
                                    Download PDF
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ExamPerformanceTable;
