import React, { useState } from 'react';
import { FaUser, FaAddressCard, FaBriefcaseMedical, FaSchool } from 'react-icons/fa';

const StudentDetailForm = (studentData) => {


    const handleInputChange = (e, section, index, field) => {
        const value = e.target.value;
        setStudentData((prevData) => {
            if (section === 'guardians') {
                const updatedGuardians = [...prevData.guardians];
                updatedGuardians[index][field] = value;
                return { ...prevData, guardians: updatedGuardians };
            }
            return { ...prevData, [section]: { ...prevData[section], [field]: value } };
        });
    };

    return (
        <div className="container mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            {/* Basic Details */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-6 flex items-center text-sky-600 dark:text-sky-400">
                    <FaUser className="mr-3" /> Basic Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                        type="text"
                        placeholder="First Name"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-300 ease-in-out bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.name}
                        onChange={(e) => setStudentData({ ...studentData, name: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-300 ease-in-out bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.lastName}
                        onChange={(e) => setStudentData({ ...studentData, lastName: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="National ID Number"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-300 ease-in-out bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.nationalIdNumber}
                        onChange={(e) => setStudentData({ ...studentData, nationalIdNumber: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Class Roll Number"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-300 ease-in-out bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.classRollNumber}
                        onChange={(e) => setStudentData({ ...studentData, classRollNumber: e.target.value })}
                    />
                    <input
                        type="date"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-300 ease-in-out bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.dateOfAdmission}
                        onChange={(e) => setStudentData({ ...studentData, dateOfAdmission: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Gender"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-300 ease-in-out bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.gender}
                        onChange={(e) => setStudentData({ ...studentData, gender: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Birth Place"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-300 ease-in-out bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.birthPlace}
                        onChange={(e) => setStudentData({ ...studentData, birthPlace: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Blood Group"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-300 ease-in-out bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.bloodGroup}
                        onChange={(e) => setStudentData({ ...studentData, bloodGroup: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Admission Category"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-300 ease-in-out bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.admissionCategory}
                        onChange={(e) => setStudentData({ ...studentData, admissionCategory: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Admission No"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-300 ease-in-out bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.admissionNo}
                        onChange={(e) => setStudentData({ ...studentData, admissionNo: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Class"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-300 ease-in-out bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.class}
                        onChange={(e) => setStudentData({ ...studentData, class: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Section"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-300 ease-in-out bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.section}
                        onChange={(e) => setStudentData({ ...studentData, section: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Pick-up Point"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-300 ease-in-out bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.pickUpPoint}
                        onChange={(e) => setStudentData({ ...studentData, pickUpPoint: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Sports House"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-300 ease-in-out bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                        value={studentData.sportsHouse}
                        onChange={(e) => setStudentData({ ...studentData, sportsHouse: e.target.value })}
                    />
                </div>
            </div>

            {/* Address Details */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-6 flex items-center text-sky-600 dark:text-sky-400">
                    <FaAddressCard className="mr-3" /> Address Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                        type="text"
                        placeholder="Address Line 1"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-300 ease-in-out bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"


                        value={studentData.address.addressLine1}
                        onChange={(e) => handleInputChange(e, 'address', null, 'addressLine1')}
                    />
                    <input
                        type="text"
                        placeholder="Address Line 2"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-300 ease-in-out bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"


                        value={studentData.address.addressLine2}
                        onChange={(e) => handleInputChange(e, 'address', null, 'addressLine2')}
                    />
                    <input
                        type="text"
                        placeholder="City/Town"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-300 ease-in-out bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"


                        value={studentData.address.cityTown}
                        onChange={(e) => handleInputChange(e, 'address', null, 'cityTown')}
                    />
                    <input
                        type="text"
                        placeholder="State"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-300 ease-in-out bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"


                        value={studentData.address.state}
                        onChange={(e) => handleInputChange(e, 'address', null, 'state')}
                    />
                    <input
                        type="text"
                        placeholder="Pin Code"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-300 ease-in-out bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"


                        value={studentData.address.pinCode}
                        onChange={(e) => handleInputChange(e, 'address', null, 'pinCode')}
                    />
                    <input
                        type="text"
                        placeholder="Country"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-300 ease-in-out bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"


                        value={studentData.address.country}
                        onChange={(e) => handleInputChange(e, 'address', null, 'country')}
                    />
                </div>
            </div>

            {/* Guardians Details */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-6 flex items-center text-sky-600 dark:text-sky-400">
                    <FaUser className="mr-3" /> Guardians Details
                </h2>
                {studentData.guardians.map((guardian, index) => (
                    <div key={index} className="mb-6 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4 text-sky-600 dark:text-sky-400">Guardian {index + 1}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input
                                type="text"
                                placeholder="Name"
                                className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-300 ease-in-out bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"


                                value={guardian.name}
                                onChange={(e) => handleInputChange(e, 'guardians', index, 'name')}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-300 ease-in-out bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"


                                value={guardian.email}
                                onChange={(e) => handleInputChange(e, 'guardians', index, 'email')}
                            />
                            <input
                                type="text"
                                placeholder="Contact 1"
                                className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-300 ease-in-out bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"


                                value={guardian.contact1}
                                onChange={(e) => handleInputChange(e, 'guardians', index, 'contact1')}
                            />
                            <input
                                type="text"
                                placeholder="Contact 2"
                                className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-300 ease-in-out bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"


                                value={guardian.contact2}
                                onChange={(e) => handleInputChange(e, 'guardians', index, 'contact2')}
                            />
                            <input
                                type="text"
                                placeholder="Emergency Contact"
                                className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-300 ease-in-out bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"


                                value={guardian.emergencyContact}
                                onChange={(e) => handleInputChange(e, 'guardians', index, 'emergencyContact')}
                            />
                            <input
                                type="text"
                                placeholder="Occupation"
                                className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-300 ease-in-out bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"


                                value={guardian.occupation}
                                onChange={(e) => handleInputChange(e, 'guardians', index, 'occupation')}
                            />
                            <input
                                type="text"
                                placeholder="Educational Qualification"
                                className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-300 ease-in-out bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"


                                value={guardian.educationalQualification}
                                onChange={(e) => handleInputChange(e, 'guardians', index, 'educationalQualification')}
                            />
                            <input
                                type="text"
                                placeholder="Annual Income"
                                className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-300 ease-in-out bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"


                                value={guardian.annualIncome}
                                onChange={(e) => handleInputChange(e, 'guardians', index, 'annualIncome')}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Medical Details */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-6 flex items-center text-sky-600 dark:text-sky-400">
                    <FaBriefcaseMedical className="mr-3" /> Medical Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                        type="text"
                        placeholder="Medical Condition"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-300 ease-in-out bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"


                        value={studentData.medicalReport.medicalCondition}
                        onChange={(e) => handleInputChange(e, 'medicalReport', null, 'medicalCondition')}
                    />
                    <input
                        type="text"
                        placeholder="Allergies"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-300 ease-in-out bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"


                        value={studentData.medicalReport.allergies}
                        onChange={(e) => handleInputChange(e, 'medicalReport', null, 'allergies')}
                    />
                    <input
                        type="text"
                        placeholder="Medications"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-300 ease-in-out bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"


                        value={studentData.medicalReport.medications}
                        onChange={(e) => handleInputChange(e, 'medicalReport', null, 'medications')}
                    />
                    <input
                        type="text"
                        placeholder="Blood Group"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-300 ease-in-out bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"


                        value={studentData.medicalReport.bloodGroup}
                        onChange={(e) => handleInputChange(e, 'medicalReport', null, 'bloodGroup')}
                    />
                </div>
            </div>

            {/* Previous School Details */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-6 flex items-center text-sky-600 dark:text-sky-400">
                    <FaSchool className="mr-3" /> Previous School Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                        type="text"
                        placeholder="School Name"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-300 ease-in-out bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"


                        value={studentData.previousSchoolDetails.schoolName}
                        onChange={(e) => handleInputChange(e, 'previousSchoolDetails', null, 'schoolName')}
                    />
                    <input
                        type="text"
                        placeholder="Address"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-300 ease-in-out bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"


                        value={studentData.previousSchoolDetails.address}
                        onChange={(e) => handleInputChange(e, 'previousSchoolDetails', null, 'address')}
                    />
                    <input
                        type="text"
                        placeholder="Class Completed"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-300 ease-in-out bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"


                        value={studentData.previousSchoolDetails.classCompleted}
                        onChange={(e) => handleInputChange(e, 'previousSchoolDetails', null, 'classCompleted')}
                    />
                    <input
                        type="text"
                        placeholder="Academic Year"
                        className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-300 ease-in-out bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"


                        value={studentData.previousSchoolDetails.academicYear}
                        onChange={(e) => handleInputChange(e, 'previousSchoolDetails', null, 'academicYear')}
                    />
                </div>
            </div>

            {/* Submit Button */}
            <button className="btn bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 w-full rounded-lg transition-all duration-300">
                Submit
            </button>
        </div>

    );
};

export default StudentDetailForm;
