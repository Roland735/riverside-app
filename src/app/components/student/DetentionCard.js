// components/DetentionCard.js
import { BsFillCaretUpFill, BsFillCaretDownFill } from 'react-icons/bs';

const DetentionCard = ({ count, change }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
            <h2 className="text-lg font-semibold">Detentions</h2>
            <div className="flex justify-between items-center mt-2">
                <div>
                    <p className="text-gray-600 dark:text-gray-400">Number of Detentions</p>
                    <p className="text-3xl font-bold">{count}</p>
                </div>
                <div className="flex items-center">
                    <p className="text-gray-600 dark:text-gray-400">Change</p>
                    <p className={`ml-2 ${change >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {change >= 0 ? <BsFillCaretUpFill /> : <BsFillCaretDownFill />}
                        {Math.abs(change)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DetentionCard;
