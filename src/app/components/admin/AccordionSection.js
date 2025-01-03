import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const AccordionSection = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="mb-4">
            <div className="flex justify-between items-center cursor-pointer bg-sky-500 dark:bg-sky-700 p-4 rounded-lg" onClick={toggleAccordion}>
                <h3 className="text-white font-semibold">{title}</h3>
                {isOpen ? <FaChevronUp className="text-white" /> : <FaChevronDown className="text-white" />}
            </div>
            {isOpen && <div className="p-4 border-t dark:border-gray-600">{children}</div>}
        </div>
    );
};

export default AccordionSection;
