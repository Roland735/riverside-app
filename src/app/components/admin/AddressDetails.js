import { FaAddressCard } from 'react-icons/fa';

const AddressDetails = ({ studentData, handleInputChange, handleSave }) => {
    console.log(studentData.addressLine1);
    return (
        <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center text-sky-600 dark:text-sky-400">
                <FaAddressCard className="mr-3" /> Address Details
            </h2>
            <div className="mb-6 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                        type="text"
                        placeholder="Address Line 1"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.addressLine1 || ''}
                        onChange={(e) => handleInputChange(e, 'address', null, 'addressLine1')}
                    />
                    <input
                        type="text"
                        placeholder="Address Line 2"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.addressLine2 || ''}
                        onChange={(e) => handleInputChange(e, 'address', null, 'addressLine2')}
                    />
                    <input
                        type="text"
                        placeholder="City/Town"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.cityTown || ''}
                        onChange={(e) => handleInputChange(e, 'address', null, 'cityTown')}
                    />
                    <input
                        type="text"
                        placeholder="State"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.state || ''}
                        onChange={(e) => handleInputChange(e, 'address', null, 'state')}
                    />
                    <input
                        type="text"
                        placeholder="Pin Code"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.pinCode || ''}
                        onChange={(e) => handleInputChange(e, 'address', null, 'pinCode')}
                    />
                    <input
                        type="text"
                        placeholder="Country"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.country || ''}
                        onChange={(e) => handleInputChange(e, 'address', null, 'country')}
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

export default AddressDetails;
