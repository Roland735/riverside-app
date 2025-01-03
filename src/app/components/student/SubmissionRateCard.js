// components/SubmissionRateCard.js
import { BsFillCaretUpFill, BsFillCaretDownFill } from 'react-icons/bs';

const SubmissionRateCard = ({ rate, change }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
            <h2 className="text-lg font-semibold">Assignment Submission Rate</h2>
            <div className="flex justify-between items-center mt-2">
                <div>
                    <p className="text-gray-600 dark:text-gray-400">Submission Rate</p>
                    <p className="text-3xl font-bold">{rate}%</p>
                </div>
                <div className="flex items-center">
                    <p className="text-gray-600 dark:text-gray-400">Change</p>
                    <p className={`ml-2 ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {change >= 0 ? <BsFillCaretUpFill /> : <BsFillCaretDownFill />}
                        {Math.abs(change)}%
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SubmissionRateCard;
