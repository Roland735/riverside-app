// /pages/marks/submit.js
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';

export default function SubmitMarks() {
    const [exams, setExams] = useState([]);
    const [examId, setExamId] = useState('');
    const [marks, setMarks] = useState([]);
    const router = useRouter();

    useEffect(() => {
        // Fetch exams
        fetch('/api/exam/list')
            .then(response => response.json())
            .then(data => setExams(data.exams));
    }, []);

    const handleMarksChange = (studentId, value) => {
        setMarks(prevMarks => {
            const newMarks = [...prevMarks];
            const index = newMarks.findIndex(mark => mark.student === studentId);
            if (index === -1) {
                newMarks.push({ student: studentId, marks: value });
            } else {
                newMarks[index].marks = value;
            }
            return newMarks;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('/api/marks/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ examId, marks }),
        });

        const result = await response.json();

        if (response.ok) {
            toast.success(result.message);
            router.push('/dashboard');
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Submit Marks</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300">Exam</label>
                    <select
                        value={examId}
                        onChange={(e) => setExamId(e.target.value)}
                        className="mt-1 p-2 block w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md"
                    >
                        {exams.map(exam => (
                            <option key={exam._id} value={exam._id}>
                                {exam.subject} - Paper {exam.paperNumber}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300">Marks</label>
                    {students.map(student => (
                        <div key={student._id} className="flex items-center mb-2">
                            <span className="w-1/3">{student.name}</span>
                            <input
                                type="number"
                                className="mt-1 p-2 block w-2/3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md"
                                onChange={(e) => handleMarksChange(student._id, e.target.value)}
                            />
                        </div>
                    ))}
                </div>
                <button type="submit" className="px-4 py-2 bg-cyan-500 text-white rounded-md">Submit</button>
            </form>
        </div>
    );
}
