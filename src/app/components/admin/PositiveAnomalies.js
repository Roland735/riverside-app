import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa"; // Import FaArrowUp icon

function PositiveAnomaliesTable() {
    const [data, setData] = useState([]);

    // Replace with your API call to fetch data
    useEffect(() => {
        const fetchData = async () => {
            // Replace with your actual API endpoint and logic
            const response = await fetch("/api/positiveAnomalies");
            const jsonData = await response.json();
            setData(jsonData);
        };
        fetchData();
    }, []);

    return (
        <div className="container mx-auto mt-4">
            <table className="table-auto w-full border border-gray-300">
                <thead>
                    <tr className="bg-gray-100 text-left text-sm">
                        <th className="p-2">Name</th>
                        <th className="p-2 text-right">Current Value</th>
                        <th className="p-2 text-right">Baseline</th>
                        <th className="p-2 text-right">Difference</th>
                        <th className="p-2 text-right">Percentage Increase</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr key={row.metric} className="border-b border-gray-300 hover:bg-gray-100">
                            <td className="p-2">{row.metric}</td>
                            <td className="p-2 text-right">{row.currentValue}</td>
                            <td className="p-2 text-right">{row.baseline}</td>
                            <td className="p-2 text-right">{row.difference}</td>
                            <td className="p-2 text-right">
                                {row.percentageIncrease}% {/* Percentage */}
                                {/* Add icon conditionally if percentage increase is positive */}
                                {row.percentageIncrease > 0 && <FaArrowUp size={18} className="text-green-500 ml-2" />}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default PositiveAnomaliesTable;
