import React, { useState } from 'react';
import { RiDownloadCloudFill } from 'react-icons/ri'; // Import library for PDF generation

const AssignmentTable = () => {
    const assignmentsData = [
        {
            name: 'Midterm Project',
            description: 'Analyze the market trends for a specific industry.',
            dueDate: '2024-05-10',
            teacher: 'Ms. Johnson',
            subject: 'Marketing',
        },
        {
            name: 'Research Paper',
            description: 'Write a research paper on the impact of AI in healthcare.',
            dueDate: '2024-06-01',
            teacher: 'Dr. Lee',
            subject: 'Computer Science',
        },
        // ... more assignments
    ];

    const columns = [
        { key: 'name', name: 'Assignment Name' },
        { key: 'description', name: 'Description' },
        { key: 'dueDate', name: 'Due Date' },
        { key: 'teacher', name: 'Teacher' },
        { key: 'subject', name: 'Subject' },
    ];

    const [downloadLink, setDownloadLink] = useState(null);

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text('Assignment List', 14, 10); // Add title

        // Generate table content
        let tableY = 20; // Starting position for the table
        doc.setFontSize(10); // Set font size for table data
        assignmentsData.forEach((row) => {
            columns.forEach((column, index) => {
                const value = row[column.key];
                doc.text(`${column.name}: ${value}`, 10, tableY);
                tableY += 5; // Adjust table row spacing
            });
            tableY += 10; // Add spacing between assignments
        });

        const pdfBlob = doc.output('blob'); // Convert doc to blob
        const url = URL.createObjectURL(pdfBlob); // Create a temporary URL
        setDownloadLink(url);
    };

    return (
        <div className="overflow-x-auto sm:mx-auto w-full">
            <table className="table-auto w-full sm:shadow-md md:shadow-lg">
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className={`px-4 py-2 text-left text-gray-700 bg-gray-200 border-b border-gray-400 sm:text-sm ${column.key === 'description' ? `hidden md:block` : ``} `}
                            >
                                {column.name}
                            </th>
                        ))}
                        <th
                            key="download"
                            className="px-4 py-2 text-left text-gray-700 bg-gray-200 border-b border-gray-400 sm:text-sm"
                        >
                            Download
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {assignmentsData.map((row, index) => (
                        <tr key={index} className="border-b border-gray-400">
                            {columns.map((column) => {
                                const value = row[column.key];
                                return (
                                    <td key={column.key} className={`px-4 py-2 text-left sm:text-sm ${column.key === 'description' ? `hidden md:block ` : ``}`} >
                                        {value}
                                    </td>
                                );
                            })}
                            <td className="px-4 py-2 text-left sm:text-sm">
                                {downloadLink ? (
                                    <a href={downloadLink} download="assignments.pdf">
                                        Download
                                    </a>
                                ) : (
                                    <button onClick={generatePDF} className="btn-sm btn-blue">
                                        Download
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AssignmentTable;
