// Import necessary modules
import React from 'react';
import axios from 'axios';

// Define the component
const ExcelTemplateDownload = ({ className, subjectName, templateType, title }) => {
    // Function to handle download button click
    const handleDownload = async () => {
        try {


            // Make a POST request to the backend route to download the Excel template
            const response = await axios.post('/api/generate-excel-template', { className, subjectName, templateType, title }, {
                responseType: 'blob' // Set responseType to 'blob' to handle binary data
            });

            // Create a blob URL from the response data
            const url = window.URL.createObjectURL(new Blob([response.data]));

            // Create a temporary link element
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${className}-${title}-${templateType}-Template.xlsx`);

            // Simulate a click on the link to trigger the download
            document.body.appendChild(link);
            link.click();

            // Cleanup
            URL.revokeObjectURL(url);
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading Excel template:', error);
        }
    };

    return (
        <button onClick={handleDownload} className='my-10 bg-emerald-500 p-4 rounded-md text-cyan-950 font-bold'>Download Excel Template</button>
    );
};

export default ExcelTemplateDownload;
