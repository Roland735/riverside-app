import React, { useState, useEffect } from "react";
import Select from "react-select";
import { BsUpload } from "react-icons/bs";
import { motion } from "framer-motion";

const UploadResourcesPage = ({ name }) => {
    const [subjects, setSubjects] = useState([]);
    const [topics, setTopics] = useState({});
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [resource, setResource] = useState(null);
    const [activeTab, setActiveTab] = useState("subject");
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [validationError, setValidationError] = useState(null);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await fetch("/api/getSubjectAndTopics", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ teacherName: name }),
                });

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const data = await response.json();

                setSubjects(data.subjects.map(subject => ({
                    value: subject.name,
                    label: `${subject.name} - ${subject.className}`
                })));

                const topicMapping = {};
                data.subjects.forEach(subject => {
                    topicMapping[subject.name] = subject.topicsTaught.map(topic => ({
                        value: topic.title,
                        label: topic.title
                    }));
                });

                setTopics(topicMapping);
            } catch (error) {
                setError("Error fetching subjects. Please try again.");
                console.error("Error fetching subjects:", error);
            }
        };

        fetchSubjects();
    }, [name]);

    const handleSubjectChange = (selectedOption) => {
        setSelectedSubject(selectedOption);
        setSelectedTopic(null); // Reset topic when subject changes
    };

    const handleTopicChange = (selectedOption) => {
        setSelectedTopic(selectedOption);
    };

    const handleFileChange = (event) => {
        setResource(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedSubject || !resource) {
            setValidationError("Please select a subject and upload a resource before submitting.");
            return;
        }

        setValidationError(null);

        const formData = new FormData();
        formData.append("subject", selectedSubject.value);
        formData.append("topic", selectedTopic?.value || "");
        formData.append("resource", resource);

        try {
            setUploading(true); // Start the loading animation
            const response = await fetch("/api/postResources", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();

            if (data.message) {
                alert(data.message);
            }
        } catch (error) {
            setError("Error uploading resource. Please try again.");
            console.error("Error uploading resource:", error);
        } finally {
            setUploading(false); // Stop the loading animation
        }

        // Clear the form
        setSelectedSubject(null);
        setSelectedTopic(null);
        setResource(null);
    };

    return (
        <div className="container mx-auto p-6 section-bg">
            {uploading && (
                <motion.div
                    className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-24 w-24"></div>
                </motion.div>
            )}
            <h1 className="text-3xl font-bold text-center text-cyan-700 mb-8">
                Upload Resources
            </h1>
            {error && (
                <div className="text-center text-red-500 mb-4">{error}</div>
            )}
            {validationError && (
                <div className="text-center text-red-500 mb-4">{validationError}</div>
            )}
            <div className="flex justify-center mb-6">
                <button
                    className={`px-4 py-2 rounded-t-lg ${activeTab === "subject" ? "w-1/2 bg-cyan-700 text-white" : "bg-cyan-200 text-cyan-700"}`}
                    onClick={() => setActiveTab("subject")}
                >
                    Upload for Subject
                </button>
                <button
                    className={`px-4 py-2 rounded-t-lg ${activeTab === "topic" ? "w-1/2 bg-cyan-700 text-white" : "bg-cyan-200 text-cyan-700"}`}
                    onClick={() => setActiveTab("topic")}
                >
                    Upload for Topic
                </button>
            </div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-cyan-50 p-8 rounded-lg shadow-md max-w-2xl mx-auto"
            >
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="subject" className="block text-cyan-700 font-medium mb-2">
                            Select Subject
                        </label>
                        <Select
                            id="subject"
                            options={subjects}
                            value={selectedSubject}
                            onChange={handleSubjectChange}
                            placeholder="Select a subject..."
                            className="mb-4"
                        />
                    </div>
                    {activeTab === "topic" && selectedSubject && (
                        <div className="mb-6">
                            <label htmlFor="topic" className="block text-cyan-700 font-medium mb-2">
                                Select Topic
                            </label>
                            <Select
                                id="topic"
                                options={topics[selectedSubject.value]}
                                value={selectedTopic}
                                onChange={handleTopicChange}
                                placeholder="Select a topic..."
                                className="mb-4"
                            />
                        </div>
                    )}
                    <div className="mb-6">
                        <label htmlFor="resource" className="block text-cyan-700 font-medium mb-2">
                            Upload Resource
                        </label>
                        <input
                            type="file"
                            id="resource"
                            onChange={handleFileChange}
                            className="block w-full text-cyan-700 border border-cyan-300 rounded-lg p-2"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-cyan-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center"
                    >
                        <BsUpload className="mr-2" />
                        Upload
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default UploadResourcesPage;
