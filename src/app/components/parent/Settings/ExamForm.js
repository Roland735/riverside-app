import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // For potential form submission route

// Import StudentSlide component (see below)
import StudentSlide from './StudentSlide';

const ExamForm = ({ examData, onSubmit }) => {
    const router = useRouter();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [students, setStudents] = useState([]); // Array to store student data

    // Load initial data from props (if provided)
    useEffect(() => {
        if (examData) {
            // Process exam data and populate students array
            const processedStudents = processExamData(examData); // Implement processing logic
            setStudents(processedStudents);
        }
    }, [examData]); // Re-run on examData change

    const handleMarkChange = (index, mark) => {
        setStudents((prevStudents) =>
            prevStudents.map((student, i) => (i === index ? { ...student, mark } : student))
        );
    };

    const handleSlideChange = (direction) => {
        if (direction === 'next' && currentSlide < students.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else if (direction === 'prev' && currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        }
    };

    const handleSubmit = async () => {
        // Prepare data for submission
        const preparedData = prepareDataForSubmission(students); // Implement data preparation

        // Submit data to backend (replace placeholder)
        try {
            const response = await fetch('/api/submit-exam', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(preparedData),
            });

            if (response.ok) {
                // Handle successful submission (e.g., redirect)
                router.push('/success'); // Replace with your success route
            } else {
                console.error('Error submitting exam:', await response.text());
                // Handle submission error (e.g., display error message)
            }
        } catch (error) {
            console.error('Error submitting exam:', error);
            // Handle network or other errors
        }

        // Call onSubmit prop function if provided
        onSubmit && onSubmit(students); // Optional callback
    };

    return (
        <div className="exam-form">
            <h2 className="exam-form-title">Exam Information</h2>
            {/* Display student slides */}
            <StudentSlide
                student={students[currentSlide]}
                onMarkChange={(mark) => handleMarkChange(currentSlide, mark)}
            />
            <div className="slide-navigation">
                <button disabled={currentSlide === 0} onClick={() => handleSlideChange('prev')}>
                    Previous
                </button>
                <button
                    disabled={currentSlide === students.length - 1}
                    onClick={() => handleSlideChange('next')}
                >
                    Next
                </button>
            </div>
            <div className="card">
                <p>Completed Slides: {currentSlide + 1} / {students.length}</p>
            </div>
            <button className="submit-button" onClick={handleSubmit}>
                Submit Exam
            </button>
        </div>
    );
};

export default ExamForm;
