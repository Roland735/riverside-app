import { useEffect, useState } from 'react';
import ClassAccordion from './ClassAccordion';

export default function CommentsPage({ regNumber, year, period }) {
    // State to store the classes data fetched from the backend
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true); // To manage loading state
    const [error, setError] = useState(null); // To manage error state

    useEffect(() => {
        // Fetch data from the backend
        const fetchClasses = async () => {
            try {
                const response = await fetch('/api/exam-classes', {
                    method: 'POST', // Assuming you're using a POST request
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ regNumber, year, period }), // Pass the regNumber as a parameter
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch classes');
                }

                const data = await response.json();
                console.log("data", data);
                setClasses(data); // Update the state with the fetched data
                setLoading(false); // Set loading to false once data is fetched
            } catch (err) {
                console.error(err);
                setError(err.message); // Set error message if there's an error
                setLoading(false); // Set loading to false even if there's an error
            }
        };

        fetchClasses();
    }, []);

    // Show loading indicator while data is being fetched
    if (loading) {
        return (
            <div className="p-4 dark:bg-gray-900 w-full">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Loading...</h1>
            </div>
        );
    }

    // Show error message if fetching data failed
    if (error) {
        return (
            <div className="p-4 dark:bg-gray-900 w-full">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Error: {error}</h1>
            </div>
        );
    }

    // Render the class data if fetching is successful
    return (
        <div className="p-4 dark:bg-gray-900 w-full">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Enter Comments for Students
            </h1>
            {classes.map((classData, index) => (
                <ClassAccordion key={index} classData={classData} />
            ))}
        </div>
    );
}
