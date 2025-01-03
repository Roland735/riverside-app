import React, { useEffect, useState } from 'react';
import YearlyGrades from './YearlyGrades';

export default function GradesAndClassesHome() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/gradesAndClasses'); // Replace with your actual API endpoint
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const result = await response.json();
                console.log(result);

                setData(result);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 text-cyan-950 dark:text-cyan-300">
            <h1 className="text-3xl font-bold mb-8 border-b-2 w-full border-b-cyan-600">Yearly Grades</h1>
            <YearlyGrades data={data} />
        </div>
    );
}
