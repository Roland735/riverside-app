import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import StudentDetails from './StudentDetails';

const StudentSlide = ({ students, subjectName, className }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [comments, setComments] = useState(
        students.reduce((acc, student) => {
            acc[student.regNumber] = student.comment || '';
            return acc;
        }, {})
    );

    const prevStudent = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? students.length - 1 : prevIndex - 1));
    };

    const nextStudent = () => {
        setCurrentIndex((prevIndex) => (prevIndex === students.length - 1 ? 0 : prevIndex + 1));
    };

    const handleSaveComment = (regNumber, comment) => {
        setComments((prevComments) => ({
            ...prevComments,
            [regNumber]: comment, // Update comment for the current student
        }));
        console.log(`Comment saved for ${regNumber}: ${comment}`);
    };

    return (
        <div className="flex items-center justify-between">
            <button onClick={prevStudent}>
                <FiChevronLeft size={24} className="text-gray-600 dark:text-gray-300" />
            </button>
            <StudentDetails
                student={students[currentIndex]}
                subjectName={subjectName}
                onSaveComment={handleSaveComment}
                className={className}
                comment={comments[students[currentIndex].regNumber]} // Pass the correct comment for the current student
            />
            <button onClick={nextStudent}>
                <FiChevronRight size={24} className="text-gray-600 dark:text-gray-300" />
            </button>
        </div>
    );
};

export default StudentSlide;
