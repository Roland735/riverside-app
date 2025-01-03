import React from 'react';
import { IoMdArrowDropup, IoMdArrowDropdown } from 'react-icons/io';
import { motion } from 'framer-motion';

const StudentCard = ({ student }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white text-cyan-950 p-4 rounded-lg shadow-md"
        >
            <h2 className="text-lg font-semibold mb-2">{student.name}</h2>
            <div className="flex items-center justify-between mb-2">
                <p>Score: {student.score}</p>
                {student.change > 0 ? (
                    <div className="flex items-center text-green-500">
                        <IoMdArrowDropup className="mr-1" />
                        <p>{student.change}%</p>
                    </div>
                ) : (
                    <div className="flex items-center text-red-500">
                        <IoMdArrowDropdown className="mr-1" />
                        <p>{student.change}%</p>
                    </div>
                )}
            </div>
            <p className="text-sm text-gray-500">Grade: {student.grade}</p>
        </motion.div>
    );
};

export default StudentCard;
