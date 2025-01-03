import { FaBriefcaseMedical } from 'react-icons/fa';

const MedicalDetails = ({ studentData, handleInputChange, handleSave }) => {
    return (
        <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center text-sky-600 dark:text-sky-400">
                <FaBriefcaseMedical className="mr-3" /> Medical Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                    type="text"
                    placeholder="Doctor's Name"
                    className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                    value={studentData.doctorName}
                    onChange={(e) => handleInputChange(e, 'medicalReport', null, 'doctorName')}
                />
                <input
                    type="text"
                    placeholder="Doctor's Email"
                    className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                    value={studentData.doctorEmail}
                    onChange={(e) => handleInputChange(e, 'medicalReport', null, 'doctorEmail')}
                />
                <input
                    type="text"
                    placeholder="Doctor's Contact 1"
                    className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                    value={studentData.doctorContact1}
                    onChange={(e) => handleInputChange(e, 'medicalReport', null, 'doctorContact1')}
                />
                <input
                    type="text"
                    placeholder="Doctor's Contact 2"
                    className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                    value={studentData.doctorContact2}
                    onChange={(e) => handleInputChange(e, 'medicalReport', null, 'doctorContact2')}
                />
                <input
                    type="text"
                    placeholder="Allergies"
                    className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                    value={studentData.allergies}
                    onChange={(e) => handleInputChange(e, 'medicalReport', null, 'allergies')}
                />
                <input
                    type="text"
                    placeholder="Doctor's Place of Work"
                    className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                    value={studentData.doctorPlaceOfWork}
                    onChange={(e) => handleInputChange(e, 'medicalReport', null, 'doctorPlaceOfWork')}
                />
                <input
                    type="text"
                    placeholder="Diet Restrictions"
                    className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                    value={studentData.dietRestrictions}
                    onChange={(e) => handleInputChange(e, 'medicalReport', null, 'dietRestrictions')}
                />
                <input
                    type="text"
                    placeholder="Medical Conditions"
                    className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                    value={studentData.medicalConditions}
                    onChange={(e) => handleInputChange(e, 'medicalReport', null, 'medicalConditions')}
                />
                <input
                    type="text"
                    placeholder="Blood Group"
                    className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                    value={studentData.bloodGroup}
                    onChange={(e) => handleInputChange(e, 'medicalReport', null, 'bloodGroup')}
                />
                <input
                    type="text"
                    placeholder="Medications"
                    className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                    value={studentData.medications}
                    onChange={(e) => handleInputChange(e, 'medicalReport', null, 'medications')}
                />
                <input
                    type="text"
                    placeholder="Insurance Provider"
                    className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                    value={studentData.insuaranceProvider}
                    onChange={(e) => handleInputChange(e, 'medicalReport', null, 'insuaranceProvider')}
                />
                <input
                    type="text"
                    placeholder="Policy Number"
                    className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                    value={studentData.policyNumber}
                    onChange={(e) => handleInputChange(e, 'medicalReport', null, 'policyNumber')}
                />
                <input
                    type="checkbox"
                    checked={studentData.pwd}
                    onChange={(e) => handleInputChange(e, 'medicalReport', null, 'pwd')}
                />
                <label className="dark:text-gray-800">PWD</label>
                <input
                    type="text"
                    placeholder="Disability Type"
                    className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                    value={studentData.disabilityType}
                    onChange={(e) => handleInputChange(e, 'medicalReport', null, 'disabilityType')}
                />
                <input
                    type="text"
                    placeholder="Identification Mark"
                    className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                    value={studentData.identificationMark}
                    onChange={(e) => handleInputChange(e, 'medicalReport', null, 'identificationMark')}
                />
                <input
                    type="number"
                    placeholder="Weight (Kg)"
                    className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                    value={studentData.weightKg}
                    onChange={(e) => handleInputChange(e, 'medicalReport', null, 'weightKg')}
                />
                <input
                    type="number"
                    placeholder="Height (cm)"
                    className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                    value={studentData.heightCm}
                    onChange={(e) => handleInputChange(e, 'medicalReport', null, 'heightCm')}
                />
                <input
                    type="number"
                    placeholder="BMI"
                    className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                    value={studentData.bmi}
                    onChange={(e) => handleInputChange(e, 'medicalReport', null, 'bmi')}
                />
                <input
                    type="number"
                    placeholder="Pulse Rate"
                    className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                    value={studentData.pulseRate}
                    onChange={(e) => handleInputChange(e, 'medicalReport', null, 'pulseRate')}
                />

                <input
                    type="number"
                    placeholder="Blood Pressure (mm Hg)"
                    className="input placeholder:text-gray-100 dark:placeholder:text-gray-900 input-bordered w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-50 dark:text-gray-800 text-gray-100"
                    value={studentData.bloodPressure}
                    onChange={(e) => handleInputChange(e, 'medicalReport', null, 'bloodPressure')}
                />
            </div>
            <button
                onClick={handleSave}
                className="btn btn-primary mt-6 px-6 py-3 rounded-lg bg-sky-600 dark:bg-sky-500 text-white hover:bg-sky-700 dark:hover:bg-sky-600 transition-all"
            >
                Save Medical Report
            </button>
        </div>
    );
};

export default MedicalDetails;
