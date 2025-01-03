import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Modal from 'react-modal';

const DepartmentForm = ({ departmentId, onCancel }) => {
    const [departmentName, setDepartmentName] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [selectedTeachers, setSelectedTeachers] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchSubject, setSearchSubject] = useState('');
    const [searchTeacher, setSearchTeacher] = useState('');
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (departmentId) {
                    const response = await fetch(`/api/departments/${departmentId}`);
                    if (response.ok) {
                        const data = await response.json();
                        setDepartmentName(data.name);
                        setSelectedSubjects(data.subjects);
                        setSelectedTeachers(data.staffMembers);
                    } else {
                        throw new Error('Failed to load department data');
                    }
                }

                const [subjectsResponse, teachersResponse] = await Promise.all([
                    fetch('/api/subjects'),
                    fetch('/api/teachers'),
                ]);
                const [subjectsData, teachersData] = await Promise.all([
                    subjectsResponse.json(),
                    teachersResponse.json(),
                ]);

                setSubjects(subjectsData);
                setTeachers(teachersData);
            } catch (error) {
                toast.error('Failed to load data');
            }
        };

        fetchData();
    }, [departmentId]);

    const handleSave = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetch(departmentId ? `/api/departments/${departmentId}` : '/api/departments', {
                method: departmentId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: departmentName,
                    subjects: selectedSubjects,
                    staffMembers: selectedTeachers,
                }),
            });

            if (!response.ok) throw new Error('Failed to save department');

            const result = await response.json();
            toast.success('Department saved successfully');

        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        onCancel();
    };

    const handlePreview = () => {
        setIsPreviewOpen(true);
    };

    const handlePreviewClose = () => {
        setIsPreviewOpen(false);
    };

    const filteredSubjects = subjects.filter(subject =>
        subject.name.toLowerCase().includes(searchSubject.toLowerCase())
    );

    const filteredTeachers = teachers.filter(teacher =>
        `${teacher.firstname} ${teacher.lastname}`.toLowerCase().includes(searchTeacher.toLowerCase())
    );

    const toggleSubject = (subjectId) => {
        setSelectedSubjects(prev =>
            prev.includes(subjectId) ? prev.filter(id => id !== subjectId) : [...prev, subjectId]
        );
    };

    const toggleTeacher = (teacherId) => {
        setSelectedTeachers(prev =>
            prev.includes(teacherId) ? prev.filter(id => id !== teacherId) : [...prev, teacherId]
        );
    };

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md w-full">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                {departmentId ? 'Edit Department' : 'Create Department'}
            </h2>

            <div className="mb-6">
                <label htmlFor="departmentName" className="block text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Department Name
                </label>
                <input
                    type="text"
                    id="departmentName"
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 transition-all"
                    required
                />
            </div>

            <div className="mb-6">
                <label htmlFor="subjects" className="block text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Select Subjects
                </label>
                <input
                    type="text"
                    placeholder="Search subjects..."
                    value={searchSubject}
                    onChange={(e) => setSearchSubject(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm mb-3 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 transition-all"
                />
                <div className="space-y-3">
                    {filteredSubjects.map(subject => (
                        <div key={subject._id} className="flex items-center">
                            <input
                                type="checkbox"
                                id={`subject-${subject._id}`}
                                checked={selectedSubjects.includes(subject._id)}
                                onChange={() => toggleSubject(subject._id)}
                                className="mr-3 h-5 w-5 text-red-600 dark:text-red-400 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded"
                            />
                            <label htmlFor={`subject-${subject._id}`} className="text-lg text-gray-800 dark:text-gray-100">
                                {subject.name}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mb-6">
                <label htmlFor="teachers" className="block text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Select Teachers
                </label>
                <input
                    type="text"
                    placeholder="Search teachers..."
                    value={searchTeacher}
                    onChange={(e) => setSearchTeacher(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm mb-3 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 transition-all"
                />
                <div className="space-y-3">
                    {filteredTeachers.map(teacher => (
                        <div key={teacher._id} className="flex items-center">
                            <input
                                type="checkbox"
                                id={`teacher-${teacher._id}`}
                                checked={selectedTeachers.includes(teacher._id)}
                                onChange={() => toggleTeacher(teacher._id)}
                                className="mr-3 h-5 w-5 text-red-600 dark:text-red-400 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded"
                            />
                            <label htmlFor={`teacher-${teacher._id}`} className="text-lg text-gray-800 dark:text-gray-100">
                                {teacher.firstname} {teacher.lastname}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 transition-all"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handlePreview}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 transition-all"
                >
                    Preview
                </button>
            </div>

            {/* Preview Modal */}
            <Modal
                isOpen={isPreviewOpen}
                onRequestClose={handlePreviewClose}
                contentLabel="Preview"
                className="fixed inset-0 flex items-center justify-center"
                overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
            >
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg mx-auto">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Preview Department</h2>
                    <div className="mb-4">
                        <strong className="block text-lg text-gray-800 dark:text-gray-100">Department Name:</strong>
                        <p className="text-gray-700 dark:text-gray-300">{departmentName}</p>
                    </div>
                    <div className="mb-4">
                        <strong className="block text-lg text-gray-800 dark:text-gray-100">Subjects:</strong>
                        <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                            {selectedSubjects.map(subjectId => {
                                const subject = subjects.find(s => s._id === subjectId);
                                return subject ? <li key={subject._id}>{subject.name}</li> : null;
                            })}
                        </ul>
                    </div>
                    <div className="mb-4">
                        <strong className="block text-lg text-gray-800 dark:text-gray-100">Teachers:</strong>
                        <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                            {selectedTeachers.map(teacherId => {
                                const teacher = teachers.find(t => t._id === teacherId);
                                return teacher ? <li key={teacher._id}>{teacher.firstname} {teacher.lastname}</li> : null;
                            })}
                        </ul>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={handlePreviewClose}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 transition-all"
                        >
                            Close
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={isSubmitting}
                            className={`px-4 py-2 bg-red-500 text-white rounded-lg shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 transition-all ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {departmentId ? 'Update' : 'Save'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>

    );
};

export default DepartmentForm;
