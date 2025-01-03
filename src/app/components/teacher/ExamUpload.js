import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";

const TeacherUploadExamPage = ({ name }) => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        const fetchClasses = async () => {
            const session = await getSession();
            if (!session) {
                // Redirect to login or show error
                return;
            }

            try {
                const response = await fetch("/api/getTeacherClassesForUpload", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ teacherName: name })
                });
                const data = await response.json();
                console.log(data);

                setClasses(data.classes);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching classes:", error);
                setLoading(false);
            }
        };
        fetchClasses();
    }, [name]);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async (className, subjectName, examIndex, paperIndex) => {
        if (!selectedFile) {
            alert("Please select a file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("className", className);
        formData.append("subjectName", subjectName);
        formData.append("examIndex", examIndex);
        formData.append("paperIndex", paperIndex);

        try {
            const response = await fetch("/api/uploadExam", {
                method: "POST",
                body: formData
            });
            console.log(response);

            if (response.ok) {
                console.log("Exam uploaded successfully");
                // toast.success("Exam uploaded successfully");
            } else {
                const errorData = await response.json();
                console.error("Error uploading exam:", errorData);
                // toast.error("Error uploading exam");
            }
        } catch (error) {
            console.error("Error uploading exam:", error);
            // toast.error("Error uploading exam");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-4 w-full bg-white dark:bg-gray-800">
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Upload Exam Papers</h1>
            {classes.map((classItem) => (
                <div key={classItem.className} className="mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{classItem.className}</h2>
                    {classItem.subjects.map((subject) => (
                        <div key={subject.name} className="mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{subject.name}</h3>
                            {subject.exams.map((exam, examIndex) => (
                                <div key={exam._id} className="mb-2">
                                    <details className="border p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                                        <summary>{exam.period}</summary>
                                        {exam.papers.length > 0 ? (
                                            exam.papers.map((paper, paperIndex) => (
                                                <div key={paper._id} className="mb-2">
                                                    <p>Paper {paper.paperNumber}: {paper.duration.hours} hours {paper.duration.minutes} minutes</p>
                                                    <input type="file" onChange={handleFileChange} />
                                                    <button
                                                        onClick={() => handleUpload(classItem.className, subject.name, examIndex, paperIndex)}
                                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 mt-2"
                                                    >
                                                        Upload Paper
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <p>No papers available for this exam</p>
                                        )}
                                    </details>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default TeacherUploadExamPage;
