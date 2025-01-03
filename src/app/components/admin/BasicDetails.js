import { FaIdCard } from 'react-icons/fa';

const BasicDetails = ({ studentData, handleInputChange, handleSave }) => {
    console.log(studentData);

    return (
        <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center text-sky-600 dark:text-sky-400">
                <FaIdCard className="mr-3" /> Basic Details
            </h2>
            <div className="mb-6 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                        type="text"
                        placeholder="First Name"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.name}
                        onChange={(e) => handleInputChange(e, 'basicDetails', null, 'firstName')}
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.lastName}
                        onChange={(e) => handleInputChange(e, 'basicDetails', null, 'lastName')}
                    />
                    <input
                        type="text"
                        placeholder="National ID Number"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.nationalIdNumber}
                        onChange={(e) => handleInputChange(e, 'basicDetails', null, 'nationalIdNumber')}
                    />
                    <input
                        type="text"
                        placeholder="Class Roll Number"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.classRollNumber}
                        onChange={(e) => handleInputChange(e, 'basicDetails', null, 'classRollNumber')}
                    />
                    <input
                        type="date"
                        placeholder="Date of Admission"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.dateOfAdmission}
                        onChange={(e) => handleInputChange(e, 'basicDetails', null, 'dateOfAdmission')}
                    />
                    <select
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.gender}
                        onChange={(e) => handleInputChange(e, 'basicDetails', null, 'gender')}
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Birth Place"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.birthPlace}
                        onChange={(e) => handleInputChange(e, 'basicDetails', null, 'birthPlace')}
                    />
                    <input
                        type="text"
                        placeholder="Blood Group"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.bloodGroup}
                        onChange={(e) => handleInputChange(e, 'basicDetails', null, 'bloodGroup')}
                    />
                    <input
                        type="text"
                        placeholder="Admission Category"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.admissionCategory}
                        onChange={(e) => handleInputChange(e, 'basicDetails', null, 'admissionCategory')}
                    />
                    <input
                        type="text"
                        placeholder="Admission Number"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.admissionNumber}
                        onChange={(e) => handleInputChange(e, 'basicDetails', null, 'admissionNumber')}
                    />
                </div>
            </div>
            <div className="flex justify-end">
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

export default BasicDetails;
