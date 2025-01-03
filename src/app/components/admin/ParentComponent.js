"use client";
import { useState, useEffect } from 'react';
import StudentForm from './StudentForm';
import BasicDetails from './BasicDetails'; // Import the BasicDetails component

const ParentComponent = ({ regNumber }) => {
    console.log('regNumber:', regNumber);

    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch student data based on regNumber
    const fetchStudentData = async () => {
        try {
            const response = await fetch('/api/get-student-demo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ regNumber }) // Sending regNumber from props
            });

            if (!response.ok) {
                throw new Error('Failed to fetch student data');
            }

            const data = await response.json();
            console.log(data);

            console.log('Fetched student data:', data);

            setStudentData(data.student); // Set the single student data
        } catch (error) {
            console.error('Error fetching student data:', error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudentData();
    }, [regNumber]); // Runs when regNumber changes

    // Handle form input changes
    const handleInputChange = (e, section, index, field) => {
        const value = e.target.value;

        if (studentData) {
            // Handle guardian1 and guardian2
            if (section === 'guardian1' || section === 'guardian2' || section === 'guardian3') {
                setStudentData(prevData => ({
                    ...prevData,
                    [section]: {
                        ...prevData[section],
                        [field]: value,
                    },
                }));
            }

            // Medical details
            if (section === 'medicalReport') {
                setStudentData(prevData => ({
                    ...prevData,
                    [field]: value,
                }));
            }

            // Previous school details
            if (section === 'previousSchool') {
                setStudentData(prevData => ({
                    ...prevData,
                    previousSchool: {
                        ...prevData.previousSchool,
                        [field]: value,
                    },
                }));
            }

            // Address
            if (section === 'address') {
                setStudentData(prevData => ({
                    ...prevData,
                    [field]: value,
                }));
            }

            // Basic details
            if (section === 'basicDetails') {
                setStudentData(prevData => ({
                    ...prevData,
                    [field]: value,
                }));
            }

            // Handle any other section
            if (!section) {
                setStudentData(prevData => ({
                    ...prevData,
                    [field]: value,
                }));
            }
        }
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitted data:', studentData);
        // Handle form submission here
    };

    const handleSave = async () => {
        console.log("Saving student data...", regNumber, studentData.previousSchool);

        try {
            const response = await fetch('/api/save-demographic-student', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ studentData, studRegNumber: regNumber }),  // studentData comes from your state
            });


            if (!response.ok) {
                throw new Error('Failed to save student data');
            }

            const data = await response.json();
            console.log(data);

            console.log('Student saved successfully:', data);
        } catch (error) {
            console.error('Error saving student data:', error.message);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-6 text-sky-600 dark:text-sky-400">
                Student Enrollment Form
            </h1>

            {/* Add BasicDetails component */}
            {studentData && (
                <BasicDetails
                    studentData={studentData}
                    handleInputChange={handleInputChange}
                    handleSave={handleSave}
                />
            )}

            {/* Rest of the form */}

            {studentData && (
                <StudentForm
                    studentData={studentData}
                    handleInputChange={handleInputChange}
                    handleSave={handleSave}
                />
            )}

            <button
                onClick={handleSave}
                className="mt-6 w-full btn bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 rounded-lg transition-all duration-300"
            >
                Submit Form
            </button>
        </div>
    );
};

export default ParentComponent;
