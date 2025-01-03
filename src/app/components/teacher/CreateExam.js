import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateExamPage = ({ name }) => {
    const [subjects, setSubjects] = useState([]);
    const [periods, setPeriods] = useState([]);
    const [selectedExams, setSelectedExams] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState("");
    const [selectedPeriod, setSelectedPeriod] = useState("");
    const [papers, setPapers] = useState([{ paperNumber: 1, hours: 0, minutes: 0 }]);
    const [selectedClass, setSelectedClass] = useState("");
    const [editingExamIndex, setEditingExamIndex] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/getExamPeriods", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ name })
                });
                const data = await response.json();
                setPeriods(data.returnPeriod);
                setSubjects(data.result);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, [name]);

    const handleAddPaper = () => {
        setPapers([...papers, { paperNumber: papers.length + 1, hours: 0, minutes: 0 }]);
    };

    const handleEditPaper = (index, field, value) => {
        const newPapers = [...papers];
        newPapers[index][field] = parseInt(value, 10);
        setPapers(newPapers);
    };

    const handleDeletePaper = (index) => {
        if (papers.length > 1) {
            const newPapers = papers.filter((_, i) => i !== index);
            setPapers(newPapers);
        }
    };

    const handleAddExam = () => {
        if (validateForm()) {
            const newExam = {
                subject: selectedSubject,
                period: selectedPeriod,
                className: selectedClass,
                papers: [...papers]
            };

            if (editingExamIndex !== null) {
                const updatedExams = [...selectedExams];
                updatedExams[editingExamIndex] = newExam;
                setSelectedExams(updatedExams);
                setEditingExamIndex(null);
            } else {
                setSelectedExams([...selectedExams, newExam]);
            }

            resetForm();
        }
    };

    const handleEditExam = (index) => {
        const exam = selectedExams[index];
        setSelectedSubject(exam.subject);
        setSelectedPeriod(exam.period);
        setSelectedClass(exam.className);
        setPapers(exam.papers);
        setEditingExamIndex(index);
    };

    const handleDeleteExam = (index) => {
        const updatedExams = selectedExams.filter((_, i) => i !== index);
        setSelectedExams(updatedExams);
        resetForm();
    };

    const resetForm = () => {
        setSelectedSubject("");
        setSelectedPeriod("");
        setSelectedClass("");
        setPapers([{ paperNumber: 1, hours: 0, minutes: 0 }]);
        setEditingExamIndex(null);
    };

    const validateForm = () => {
        if (!selectedSubject || !selectedPeriod || papers.some(paper => paper.hours === 0 && paper.minutes === 0)) {
            alert("Please ensure all fields are filled out correctly.");
            return false;
        }
        return true;
    };

    const handleCreateExam = async () => {
        if (selectedExams.length === 0) {
            alert("Please add at least one exam.");
            return;
        }

        try {
            const response = await fetch("/api/createExam", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ exams: selectedExams, teacherName: name })
            });

            if (response.ok) {
                toast.success("Exams created successfully");
                setSelectedExams([]); // Clear exams after successful creation
            } else {
                const errorData = await response.json();
                console.error("Error creating exams:", errorData);
                toast.error("Error creating exams");
            }
        } catch (error) {
            console.error("Error creating exams:", error);
            toast.error("Error creating exams");
        }
    };

    const getAvailableSubjects = () => {
        // Filter out subjects that have already been selected
        const selectedSubjectNames = selectedExams.map(exam => `${exam.subject} - ${exam.className}`);
        return subjects.filter(subject => !selectedSubjectNames.includes(`${subject.subjectName} - ${subject.className}`) || editingExamIndex !== null);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-4 w-full bg-white dark:bg-gray-800 text-rose-950">
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Create Exams</h1>
            <div className="mb-4">
                <label className="block mb-2 text-gray-900 dark:text-gray-100">Select Subject</label>
                <select
                    value={selectedSubject ? `${selectedSubject} - ${selectedClass}` : ""}
                    onChange={(e) => {
                        const selectedValue = e.target.value;
                        const [subjectName, className] = selectedValue.split(" - ");
                        setSelectedSubject(subjectName);
                        setSelectedClass(className);
                    }}
                    className="p-2 border rounded w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                    <option value="">Select subject</option>
                    {getAvailableSubjects().map((subject) => (
                        <option key={`${subject.subjectName} - ${subject.className}`} value={`${subject.subjectName} - ${subject.className}`}>
                            {`${subject.subjectName} - ${subject.className}`}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-gray-900 dark:text-gray-100">Select Exam Period</label>
                <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="p-2 border rounded w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                    <option value="">Select period</option>
                    {periods.map((period) => (
                        <option key={period} value={period}>
                            {period}
                        </option>
                    ))}
                </select>
            </div>
            {papers.map((paper, index) => (
                <div key={index} className="mb-4">
                    <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Paper {index + 1}</h2>
                    <div className="mb-2">
                        <label className="block mb-1 text-gray-900 dark:text-gray-100">Paper Number</label>
                        <input
                            type="number"
                            value={paper.paperNumber}
                            onChange={(e) => handleEditPaper(index, 'paperNumber', e.target.value)}
                            className="p-2 border rounded w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>
                    <div className="flex space-x-2 mb-2">
                        <div className="w-1/2">
                            <label className="block mb-1 text-gray-900 dark:text-gray-100">Hours</label>
                            <input
                                type="number"
                                value={paper.hours}
                                onChange={(e) => handleEditPaper(index, 'hours', e.target.value)}
                                className="p-2 border rounded w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block mb-1 text-gray-900 dark:text-gray-100">Minutes</label>
                            <input
                                type="number"
                                value={paper.minutes}
                                onChange={(e) => handleEditPaper(index, 'minutes', e.target.value)}
                                className="p-2 border rounded w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                        </div>
                    </div>
                    <button
                        onClick={() => handleDeletePaper(index)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800"
                    >
                        Delete Paper
                    </button>
                </div>
            ))}
            <button
                onClick={handleAddPaper}
                className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-rose-600 dark:bg-rose-700 dark:hover:bg-rose-800"
            >
                Add Paper
            </button>
            <button
                onClick={handleAddExam}
                className="bg-yellow-500 text-white px-4 py-2 rounded ml-4 hover:bg-yellow-600 dark:bg-yellow-700 dark:hover:bg-yellow-800"
            >
                {editingExamIndex !== null ? "Update Exam" : "Add Exam"}
            </button>

            <h2 className="text-xl font-bold mt-8 text-gray-900 dark:text-gray-100">Exams Preview</h2>
            {selectedExams.length > 0 ? (
                selectedExams.map((exam, index) => (
                    <div key={index} className="mb-4 p-4 border rounded bg-gray-100 dark:bg-gray-700">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{exam.subject} - {exam.className}</h3>
                        <p className="text-gray-900 dark:text-gray-100">Period: {exam.period}</p>
                        {exam.papers.map((paper, i) => (
                            <div key={i} className="text-gray-900 dark:text-gray-100">
                                <strong>Paper {i + 1}:</strong> {paper.hours} hours {paper.minutes} minutes
                            </div>
                        ))}
                        <button
                            onClick={() => handleEditExam(index)}
                            className="bg-emerald-500 text-white px-4 py-2 rounded mt-2 mr-2 hover:bg-emerald-600 dark:bg-emarald-700 dark:hover:bg-emerald-800"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDeleteExam(index)}
                            className="bg-red-500 text-white px-4 py-2 rounded mt-2 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800"
                        >
                            Delete
                        </button>
                    </div>
                ))
            ) : (
                <p className="text-gray-900 dark:text-gray-100">No exams added yet.</p>
            )}

            <button
                onClick={handleCreateExam}
                className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800"
            >
                Create All Exams
            </button>
        </div>
    );
};

export default CreateExamPage;
