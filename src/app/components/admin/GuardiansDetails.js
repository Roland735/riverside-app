import { FaUser } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const GuardiansDetails = ({ studentData, handleInputChange, handleSave }) => {
    const [createAccount, setCreateAccount] = useState({
        guardian1: studentData.guardian1?.account || false,
        guardian2: studentData.guardian2?.account || false,
        guardian3: studentData.guardian3?.account || false,
    });
    console.log("hi");

    console.log(studentData);

    useEffect(() => {
        // Update state if studentData changes
        setCreateAccount({
            guardian1: studentData.guardian1?.account || false,
            guardian2: studentData.guardian2?.account || false,
            guardian3: studentData.guardian3?.account || false,
        });
    }, [studentData]);

    const isEmailValid = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };


    const handleAccountChange = (guardian, value) => {
        console.log(guardian, value);

        setCreateAccount(prevState => ({
            ...prevState,
            [guardian]: value
        }));
        // Update the account status in studentData
        handleInputChange({ target: { value } }, guardian, null, 'account');
    };

    return (
        <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center text-sky-600 dark:text-sky-400">
                <FaUser className="mr-3" /> Guardians Details
            </h2>

            {/* Guardian 1 */}
            <div className="mb-6 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-sky-600 dark:text-sky-400">Guardian 1</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                        type="text"
                        placeholder="Name"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.guardian1?.name || ''}
                        onChange={(e) => handleInputChange(e, 'guardian1', null, 'name')}
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.guardian1?.lastname || ''}
                        onChange={(e) => handleInputChange(e, 'guardian1', null, 'lastname')}
                    />
                    <div className="">
                        <input
                            type="email"
                            placeholder="Email"
                            className={`input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg ${!isEmailValid(studentData.guardian1?.email) && studentData.guardian1?.email
                                ? 'border-red-500'
                                : 'border-gray-300 dark:border-gray-600'
                                } bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100`}
                            value={studentData.guardian1?.email || ''}
                            onChange={(e) => handleInputChange(e, 'guardian1', null, 'email')}
                        />
                        {studentData.guardian1?.email && !isEmailValid(studentData.guardian1?.email) && (
                            <p className="text-xs text-red-500 mt-1">Please enter a valid email address.</p>
                        )}
                    </div>

                    <input
                        type="tel"
                        placeholder="Contact 1"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.guardian1?.contact1 || ''}
                        onChange={(e) => handleInputChange(e, 'guardian1', null, 'contact1')}
                    />
                    <input
                        type="tel"
                        placeholder="Contact 2"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.guardian1?.contact2 || ''}
                        onChange={(e) => handleInputChange(e, 'guardian1', null, 'contact2')}
                    />
                    <input
                        type="tel"
                        placeholder="Emergency Contact"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.guardian1?.emergencyContact || ''}
                        onChange={(e) => handleInputChange(e, 'guardian1', null, 'emergencyContact')}
                    />
                    <input
                        type="text"
                        placeholder="Educational Qualification"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.guardian1?.educationalQualification || ''}
                        onChange={(e) => handleInputChange(e, 'guardian1', null, 'educationalQualification')}
                    />
                    <input
                        type="text"
                        placeholder="Occupation"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.guardian1?.occupation || ''}
                        onChange={(e) => handleInputChange(e, 'guardian1', null, 'occupation')}
                    />
                    <input
                        type="text"
                        placeholder="Work Organization Name"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.guardian1?.workOrganizationName || ''}
                        onChange={(e) => handleInputChange(e, 'guardian1', null, 'workOrganizationName')}
                    />
                    <input
                        type="text"
                        placeholder="Designation"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.guardian1?.designation || ''}
                        onChange={(e) => handleInputChange(e, 'guardian1', null, 'designation')}
                    />
                    <input
                        type="number"
                        placeholder="Annual Income"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.guardian1?.annualIncome || ''}
                        onChange={(e) => handleInputChange(e, 'guardian1', null, 'annualIncome')}
                    />
                    <input
                        type="tel"
                        placeholder="Office Contact Number"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.guardian1?.officeContactNumber || ''}
                        onChange={(e) => handleInputChange(e, 'guardian1', null, 'officeContactNumber')}
                    />
                    <input
                        type="text"
                        placeholder="Bank Name"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.guardian1?.bankName || ''}
                        onChange={(e) => handleInputChange(e, 'guardian1', null, 'bankName')}
                    />
                    <input
                        type="text"
                        placeholder="Bank Account Number"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.guardian1?.bankAccountNumber || ''}
                        onChange={(e) => handleInputChange(e, 'guardian1', null, 'bankAccountNumber')}
                    />
                    <input
                        type="text"
                        placeholder="IFSC Code"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.guardian1?.ifscCode || ''}
                        onChange={(e) => handleInputChange(e, 'guardian1', null, 'ifscCode')}
                    />
                    <input
                        type="text"
                        placeholder="Account Holder Name"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.guardian1?.accountHolderName || ''}
                        onChange={(e) => handleInputChange(e, 'guardian1', null, 'accountHolderName')}
                    />
                    <div className="col-span-2 flex items-center space-x-3">
                        <label className={`flex items-center space-x-3 ${!studentData.guardian1.email ? 'text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}>
                            <span className="text-sm font-medium">Create Account for Guardian 1</span>
                            <input
                                type="checkbox"
                                checked={createAccount.guardian1}
                                onChange={() => handleAccountChange('guardian1', !createAccount.guardian1)}
                                className="sr-only"
                                disabled={!studentData.guardian1.email}  // Disable if no email is entered
                            />
                            <div className="relative">
                                <div
                                    className={`block w-10 h-6 rounded-full cursor-pointer ${createAccount.guardian1
                                        ? `${studentData.guardian1.email ? 'bg-sky-600 dark:bg-sky-400' : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'}`
                                        : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                ></div>
                                <div
                                    className={`absolute left-1 top-1 bg-white dark:bg-gray-800 w-4 h-4 rounded-full transition-transform transform ${createAccount.guardian1 ? 'translate-x-4' : ''
                                        } ${!studentData.guardian1.email ? 'cursor-not-allowed opacity-50' : ''}`}
                                ></div>
                            </div>
                        </label>
                    </div>



                </div>
            </div>

            {/* Guardian 2 */}
            <div className="mb-6 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-sky-600 dark:text-sky-400">Guardian </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                    <input
                        type="text"
                        placeholder="Name"
                        className="input  placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.guardian2?.name || ''}
                        onChange={(e) => handleInputChange(e, 'guardian2', null, 'name')}
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.guardian2?.lastname || ''}
                        onChange={(e) => handleInputChange(e, 'guardian2', null, 'lastname')}
                    />

                    <div className="">
                        <input
                            type="email"
                            placeholder="Email"
                            className={`input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg ${!isEmailValid(studentData.guardian2?.email) && studentData.guardian2?.email
                                ? 'border-red-500'
                                : 'border-gray-300 dark:border-gray-600'
                                } bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100`}
                            value={studentData.guardian2?.email || ''}
                            onChange={(e) => handleInputChange(e, 'guardian2', null, 'email')}
                        />
                        {studentData.guardian2?.email && !isEmailValid(studentData.guardian2?.email) && (
                            <p className="text-xs text-red-500 mt-1">Please enter a valid email address.</p>
                        )}
                    </div>
                    <input
                        type="tel"
                        placeholder="Contact 1"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.guardian2?.contact1 || ''}
                        onChange={(e) => handleInputChange(e, 'guardian2', null, 'contact1')}
                    />
                    <input
                        type="tel"
                        placeholder="Contact 2"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.guardian2?.contact2 || ''}
                        onChange={(e) => handleInputChange(e, 'guardian2', null, 'contact2')}
                    />
                    <input
                        type="tel"
                        placeholder="Emergency Contact"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.guardian2?.emergencyContact || ''}
                        onChange={(e) => handleInputChange(e, 'guardian2', null, 'emergencyContact')}
                    />
                    <input
                        type="text"
                        placeholder="Educational Qualification"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.guardian2?.educationalQualification || ''}
                        onChange={(e) => handleInputChange(e, 'guardian2', null, 'educationalQualification')}
                    />
                    <input
                        type="text"
                        placeholder="Occupation"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.guardian2?.occupation || ''}
                        onChange={(e) => handleInputChange(e, 'guardian2', null, 'occupation')}
                    />
                    <input
                        type="text"
                        placeholder="Work Organization Name"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.guardian2?.workOrganizationName || ''}
                        onChange={(e) => handleInputChange(e, 'guardian2', null, 'workOrganizationName')}
                    />
                    <input
                        type="text"
                        placeholder="Designation"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.guardian2?.designation || ''}
                        onChange={(e) => handleInputChange(e, 'guardian2', null, 'designation')}
                    />
                    <input
                        type="number"
                        placeholder="Annual Income"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.guardian2?.annualIncome || ''}
                        onChange={(e) => handleInputChange(e, 'guardian2', null, 'annualIncome')}
                    />
                    <input
                        type="tel"
                        placeholder="Office Contact Number"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.guardian2?.officeContactNumber || ''}
                        onChange={(e) => handleInputChange(e, 'guardian2', null, 'officeContactNumber')}
                    />
                    <input
                        type="text"
                        placeholder="Bank Name"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.guardian2?.bankName || ''}
                        onChange={(e) => handleInputChange(e, 'guardian2', null, 'bankName')}
                    />
                    <input
                        type="text"
                        placeholder="Bank Account Number"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.guardian2?.bankAccountNumber || ''}
                        onChange={(e) => handleInputChange(e, 'guardian2', null, 'bankAccountNumber')}
                    />
                    <input
                        type="text"
                        placeholder="IFSC Code"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.guardian2?.ifscCode || ''}
                        onChange={(e) => handleInputChange(e, 'guardian2', null, 'ifscCode')}
                    />
                    <input
                        type="text"
                        placeholder="Account Holder Name"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.guardian2?.accountHolderName || ''}
                        onChange={(e) => handleInputChange(e, 'guardian2', null, 'accountHolderName')}
                    />
                    <div className="col-span-2 flex items-center space-x-3">
                        <label className={`flex items-center space-x-3 ${!studentData.guardian2.email ? 'text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}>
                            <span className="text-sm font-medium">Create Account for Guardian 2</span>
                            <input
                                type="checkbox"
                                checked={createAccount.guardian2}
                                onChange={() => handleAccountChange('guardian2', !createAccount.guardian2)}
                                className="sr-only"
                                disabled={!studentData.guardian2.email}  // Disable if no email is entered
                            />
                            <div className="relative">
                                <div
                                    className={`block w-10 h-6 rounded-full cursor-pointer ${createAccount.guardian2
                                        ? `${studentData.guardian2.email ? 'bg-sky-600 dark:bg-sky-400' : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'}`
                                        : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                ></div>
                                <div
                                    className={`absolute left-1 top-1 bg-white dark:bg-gray-800 w-4 h-4 rounded-full transition-transform transform ${createAccount.guardian2 ? 'translate-x-4' : ''
                                        } ${!studentData.guardian2.email ? 'cursor-not-allowed opacity-50' : ''}`}
                                ></div>
                            </div>
                        </label>
                    </div>

                </div>
            </div>

            {/* Guardian 2 */}
            <div className="mb-6 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-sky-600 dark:text-sky-400">Guardian 3</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                    <input
                        type="text"
                        placeholder="Name"
                        className="input  placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.guardian3?.name || ''}
                        onChange={(e) => handleInputChange(e, 'guardian3', null, 'name')}
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.guardian3?.lastname || ''}
                        onChange={(e) => handleInputChange(e, 'guardian3', null, 'lastname')}
                    />

                    <div className="">
                        <input
                            type="email"
                            placeholder="Email"
                            className={`input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg ${!isEmailValid(studentData.guardian3?.email) && studentData.guardian3?.email
                                ? 'border-red-500'
                                : 'border-gray-300 dark:border-gray-600'
                                } bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100`}
                            value={studentData.guardian3?.email || ''}
                            onChange={(e) => handleInputChange(e, 'guardian3', null, 'email')}
                        />
                        {studentData.guardian3?.email && !isEmailValid(studentData.guardian3?.email) && (
                            <p className="text-xs text-red-500 mt-1">Please enter a valid email address.</p>
                        )}
                    </div>
                    <input
                        type="tel"
                        placeholder="Contact 1"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.guardian3?.contact1 || ''}
                        onChange={(e) => handleInputChange(e, 'guardian3', null, 'contact1')}
                    />
                    <input
                        type="tel"
                        placeholder="Contact 2"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.guardian3?.contact2 || ''}
                        onChange={(e) => handleInputChange(e, 'guardian3', null, 'contact2')}
                    />
                    <input
                        type="tel"
                        placeholder="Emergency Contact"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.guardian3?.emergencyContact || ''}
                        onChange={(e) => handleInputChange(e, 'guardian3', null, 'emergencyContact')}
                    />
                    <input
                        type="text"
                        placeholder="Educational Qualification"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.guardian3?.educationalQualification || ''}
                        onChange={(e) => handleInputChange(e, 'guardian3', null, 'educationalQualification')}
                    />
                    <input
                        type="text"
                        placeholder="Occupation"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.guardian3?.occupation || ''}
                        onChange={(e) => handleInputChange(e, 'guardian3', null, 'occupation')}
                    />
                    <input
                        type="text"
                        placeholder="Work Organization Name"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.guardian3?.workOrganizationName || ''}
                        onChange={(e) => handleInputChange(e, 'guardian3', null, 'workOrganizationName')}
                    />
                    <input
                        type="text"
                        placeholder="Designation"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.guardian3?.designation || ''}
                        onChange={(e) => handleInputChange(e, 'guardian3', null, 'designation')}
                    />
                    <input
                        type="number"
                        placeholder="Annual Income"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.guardian3?.annualIncome || ''}
                        onChange={(e) => handleInputChange(e, 'guardian3', null, 'annualIncome')}
                    />
                    <input
                        type="tel"
                        placeholder="Office Contact Number"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.guardian3?.officeContactNumber || ''}
                        onChange={(e) => handleInputChange(e, 'guardian3', null, 'officeContactNumber')}
                    />
                    <input
                        type="text"
                        placeholder="Bank Name"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.guardian3?.bankName || ''}
                        onChange={(e) => handleInputChange(e, 'guardian3', null, 'bankName')}
                    />
                    <input
                        type="text"
                        placeholder="Bank Account Number"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.guardian3?.bankAccountNumber || ''}
                        onChange={(e) => handleInputChange(e, 'guardian3', null, 'bankAccountNumber')}
                    />
                    <input
                        type="text"
                        placeholder="IFSC Code"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.guardian3?.ifscCode || ''}
                        onChange={(e) => handleInputChange(e, 'guardian3', null, 'ifscCode')}
                    />
                    <input
                        type="text"
                        placeholder="Account Holder Name"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.guardian3?.accountHolderName || ''}
                        onChange={(e) => handleInputChange(e, 'guardian3', null, 'accountHolderName')}
                    />
                    <label className={`flex items-center space-x-3 ${!studentData.guardian3.email ? 'text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}>
                        <span className="text-sm font-medium">Create Account for Guardian 3</span>
                        <input
                            type="checkbox"
                            checked={createAccount.guardian3}
                            onChange={() => handleAccountChange('guardian3', !createAccount.guardian3)}
                            className="sr-only"
                            disabled={!studentData.guardian3.email}  // Disable if no email is entered
                        />
                        <div className="relative">
                            <div
                                className={`block w-10 h-6 rounded-full cursor-pointer ${createAccount.guardian3
                                    ? `${studentData.guardian3.email ? 'bg-sky-600 dark:bg-sky-400' : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'}`
                                    : 'bg-gray-300 dark:bg-gray-600'
                                    }`}
                            ></div>
                            <div
                                className={`absolute left-1 top-1 bg-white dark:bg-gray-800 w-4 h-4 rounded-full transition-transform transform ${createAccount.guardian3 ? 'translate-x-4' : ''} ${!studentData.guardian3.email ? 'cursor-not-allowed opacity-50' : ''}`}
                            ></div>
                        </div>
                    </label>


                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
                >
                    Save
                </button>
            </div>
        </div>
    );
};

export default GuardiansDetails;
