import { FaSchool } from 'react-icons/fa';

const PreviousSchoolDetails = ({ studentData, handleInputChange, handleSave }) => {
    return (
        <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center text-sky-600 dark:text-sky-400">
                <FaSchool className="mr-3" /> Previous School Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                    type="text"
                    placeholder="School Name"
                    className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                    value={studentData.previousSchool.schoolName || ''}
                    onChange={(e) => handleInputChange(e, 'previousSchool', null, 'schoolName')}
                />
                <input
                    type="text"
                    placeholder="School Address"
                    className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                    value={studentData.previousSchool.schoolAddress || ''}
                    onChange={(e) => handleInputChange(e, 'previousSchool', null, 'schoolAddress')}
                />
                <input
                    type="text"
                    placeholder="Board"
                    className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                    value={studentData.previousSchool.board || ''}
                    onChange={(e) => handleInputChange(e, 'previousSchool', null, 'board')}
                />
                <input
                    type="text"
                    placeholder="Medium of Instruction"
                    className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                    value={studentData.previousSchool.mediumOfInstruction || ''}
                    onChange={(e) => handleInputChange(e, 'previousSchool', null, 'mediumOfInstruction')}
                />
                <input
                    type="text"
                    placeholder="TC Number"
                    className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                    value={studentData.previousSchool.tcNumber || ''}
                    onChange={(e) => handleInputChange(e, 'previousSchool', null, 'tcNumber')}
                />
                <input
                    type="text"
                    placeholder="Last Class Passed"
                    className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                    value={studentData.previousSchool.lastClassPassed || ''}
                    onChange={(e) => handleInputChange(e, 'previousSchool', null, 'lastClassPassed')}
                />
                <input
                    type="text"
                    placeholder="Percentage/Grade"
                    className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                    value={studentData.previousSchool.percentageGrade || ''}
                    onChange={(e) => handleInputChange(e, 'previousSchool', null, 'percentageGrade')}
                />
                <input
                    type="text"
                    placeholder="Last Year of Passing"
                    className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                    value={studentData.previousSchool.lastYearOfPassing || ''}
                    onChange={(e) => handleInputChange(e, 'previousSchool', null, 'lastYearOfPassing')}
                />
            </div>
            <div className="flex justify-end mt-6">
                <button
                    onClick={handleSave}
                    className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg"
                >
                    Save
                </button>
            </div>
        </div>
    );
};

export default PreviousSchoolDetails;
