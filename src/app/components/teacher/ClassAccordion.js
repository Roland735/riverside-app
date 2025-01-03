import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import SubjectAccordion from './SubjectAccordion';

const ClassAccordion = ({ classData }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mb-4 border border-gray-300 dark:border-gray-700 rounded-md">
            <div
                className="p-3 flex justify-between items-center bg-rose-500 text-white cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{classData.className}</span>
                {isOpen ? <FiChevronUp /> : <FiChevronDown />}
            </div>
            {isOpen && (
                <div className="bg-white dark:bg-gray-800 p-4">
                    {classData.subjects.map((subject, index) => (
                        <SubjectAccordion key={index} subject={subject} className={classData.className} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ClassAccordion;
