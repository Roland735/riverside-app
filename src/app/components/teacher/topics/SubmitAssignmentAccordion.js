import { useState } from 'react';
import { motion } from 'framer-motion';
import UploadAssignments from '../../parent/Settings/SubmitAssignment';

const Accordion = ({ subject, title, gradeProp, type }) => {
    console.log(title);

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-200 my-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between px-5 bg-cyan-600 rounded-xl  items-center py-4 text-left"
            >
                <span className="text-lg font-semibold">Submit {type}</span>
                <span className="text-xl">{isOpen ? '-' : '+'}</span>
            </button>
            <motion.div
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
            >
                <UploadAssignments title={title} gradeProp={gradeProp} subject={subject} type={type} />
            </motion.div>
        </div>
    );
};

export default Accordion;
