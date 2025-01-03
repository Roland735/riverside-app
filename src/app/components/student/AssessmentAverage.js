// components/Card.js
import { useState } from 'react';
import { BsFillCaretUpFill, BsFillCaretDownFill } from 'react-icons/bs';

const Card = ({ title, average, change }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md ${isDarkMode ? 'text-white' : ''}`}>
            <h2 className="text-lg font-semibold">{title}</h2>
            <div className="flex justify-between items-center mt-2">
                <div>
                    <p className="text-gray-600 dark:text-gray-400">Average Mark</p>
                    <p className="text-3xl font-bold">{average}</p>
                </div>
                <div className="flex items-center">
                    <p className="text-gray-600 dark:text-gray-400">Change</p>
                    <p className={`ml-2 ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {change >= 0 ? <BsFillCaretUpFill /> : <BsFillCaretDownFill />}
                        {Math.abs(change)}
                    </p>
                </div>
            </div>

        </div>
    );
};

export default Card;
