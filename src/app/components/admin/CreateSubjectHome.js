import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function CreateSubject({ name }) {
    const [departments, setDepartments] = useState([]);
    const [subjectData, setSubjectData] = useState({
        name: '',
        code: '',
        description: '',
        department: '',
        status: 'active',
        createdBy: name,
    });

    useEffect(() => {
        console.log("Component mounted or updated");
        fetchDepartments();
        console.log("Departments fetched:", departments);
    }, []);

    const fetchDepartments = async () => {
        console.log("Fetching departments...");
        const res = await fetch('/api/getDepartments');
        console.log("Departments fetched:", res);
        const data = await res.json();
        console.log("Departments data:", data);
        setDepartments(data.departments);
        console.log("Departments set:", departments);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setSubjectData(prevState => ({
            ...prevState,
            [name]: value.replace(/^\s+/, ''), // Trim leading spaces
        }));

    };

    const handleDescriptionChange = (e) => {
        const { name, value } = e.target;

        setSubjectData(prevState => ({
            ...prevState,
            [name]: value, // Trim leading spaces
        }));

    };

    const handleDepartmentChange = (e) => {
        const selectedDepartment = e.target.value;
        setSubjectData(prevState => ({
            ...prevState,
            department: selectedDepartment,
        }));

        generateSubjectCode(selectedDepartment);
    };

    const generateSubjectCode = async (departmentName) => {
        const department = departments.find(dep => dep.name === departmentName);
        if (department) {
            try {
                const res = await fetch(`/api/getDepartmentSubjectsCount?department=${departmentName}`);
                const data = await res.json();

                const subjectCount = data.count + 1;
                const code = `${departmentName.charAt(0).toUpperCase()}${String(subjectCount).padStart(4, '0')}`;
                setSubjectData(prevState => ({
                    ...prevState,
                    code: code,
                }));
            } catch (error) {
                console.error("Error fetching subject count for code generation:", error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('/api/createSubject', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(subjectData),
        });

        const data = await response.json();

        if (response.ok) {
            toast.success('Subject created successfully!');
            // Clear the form
            setSubjectData({
                name: '',
                code: '',
                description: '',
                department: '',
                status: 'active',
                createdBy: name,
            });
            // Re-fetch departments to update counts
            fetchDepartments();
        } else {
            toast.error(data.message || 'Failed to create subject');
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col items-center justify-center w-full p-4">
            <Toaster />
            <h1 className="text-5xl font-bold mb-8 text-rose-600 dark:text-rose-400">Create Subject</h1>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-10 rounded-lg shadow-lg w-full ">
                <div className="mb-8">
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={subjectData.name}
                        onChange={handleChange}
                        className="w-full p-4 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition ease-in-out duration-150"
                        placeholder="Enter subject name"
                        required
                    />

                </div>

                <div className="mb-8">
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Department</label>
                    <select
                        name="department"
                        value={subjectData.department}
                        onChange={handleDepartmentChange}
                        className="w-full p-4 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition ease-in-out duration-150"
                        required
                    >
                        <option value="" className="dark:bg-gray-700 dark:text-white">Select a Department</option>
                        {departments.map(department => (
                            <option key={department._id} value={department.name} className="dark:bg-gray-700 dark:text-white">
                                {department.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-8">
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Code</label>
                    <input
                        type="text"
                        name="code"
                        value={subjectData.code}
                        readOnly
                        className="w-full p-4 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none"
                        required
                    />
                </div>

                <div className="mb-8">
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Description</label>
                    <textarea
                        name="description"
                        value={subjectData.description}
                        onChange={handleDescriptionChange}
                        className="w-full p-4 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition ease-in-out duration-150"
                        placeholder="Enter a brief description"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-4 bg-rose-600 text-white font-semibold rounded-lg shadow-md hover:bg-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-300 dark:focus:ring-rose-500 transition ease-in-out duration-200"
                >
                    Create Subject
                </button>
            </form>
        </div>
    );
}
