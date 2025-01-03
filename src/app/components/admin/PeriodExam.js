import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateExamPeriod = () => {
    const [period, setPeriod] = useState('');
    const [startDate, setStartDate] = useState('');
    const [schoolDays, setSchoolDays] = useState(''); // New state for School Days
    const [isSubmitting, setIsSubmitting] = useState(false); // State to track submission
    const router = useRouter();

    const handlePeriodChange = (e) => {
        setPeriod(e.target.value);
    };

    const handleDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleSchoolDaysChange = (e) => {
        setSchoolDays(e.target.value); // Update state for School Days
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!period || !startDate || !schoolDays) {
            toast.error('Please fill all the fields');
            return;
        }

        setIsSubmitting(true); // Disable the button on submit

        const response = await fetch('/api/insertPeriod', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ period, startDate, schoolDays }), // Include schoolDays in the request body
        });

        if (response.ok) {
            toast.success('Exam period created successfully');
            router.push('/dashboard/admin/trackExams'); // Redirect after success
        } else {
            toast.error('Failed to create exam period');
        }

        setIsSubmitting(false); // Re-enable the button after submission
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-10 rounded-lg shadow-lg w-full">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">
                Create Exam Period
            </h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label htmlFor="period" className="block text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">
                        Select Exam Period:
                    </label>
                    <select
                        id="period"
                        value={period}
                        onChange={handlePeriodChange}
                        className="block appearance-none w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:border-gray-400 px-4 py-3 rounded-lg shadow-sm leading-tight focus:outline-none focus:ring-2 focus:ring-rose-400 dark:focus:ring-rose-500 transition-all"
                    >
                        <option value="" disabled>Select a period</option>
                        <option value="Mid-First term">Mid-First term</option>
                        <option value="End-First term">End-First term</option>
                        <option value="Mid-Second term">Mid-Second term</option>
                        <option value="End-Second term">End-Second term</option>
                        <option value="Mid-Third term">Mid-Third term</option>
                        <option value="End-Third term">End-Third term</option>
                    </select>
                </div>
                <div className="mb-6">
                    <label htmlFor="startDate" className="block text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">
                        Select Start Date:
                    </label>
                    <input
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={handleDateChange}
                        className="block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:border-gray-400 px-4 py-3 rounded-lg shadow-sm leading-tight focus:outline-none focus:ring-2 focus:ring-rose-400 dark:focus:ring-rose-500 transition-all"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="schoolDays" className="block text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">
                        Enter School Days:
                    </label>
                    <input
                        type="number"
                        id="schoolDays"
                        value={schoolDays}
                        onChange={handleSchoolDaysChange}
                        className="block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:border-gray-400 px-4 py-3 rounded-lg shadow-sm leading-tight focus:outline-none focus:ring-2 focus:ring-rose-400 dark:focus:ring-rose-500 transition-all"
                        placeholder="Enter the number of school days"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-rose-500 dark:bg-rose-600 hover:bg-rose-600 dark:hover:bg-rose-700 text-white font-bold py-3 px-6 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-rose-400 dark:focus:ring-rose-500 transition-all"
                    disabled={isSubmitting} // Disable button while submitting
                >
                    {isSubmitting ? 'Creating...' : 'Create Exam Period'}
                </button>
            </form>
        </div>
    );
};

export default CreateExamPeriod;
