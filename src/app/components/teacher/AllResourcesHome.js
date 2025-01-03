import React, { useState, useEffect } from "react";

const ViewResourcesPage = ({ name }) => {
    const [resources, setResources] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await fetch("/api/getResources", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ teacherName: name }),
                });
                const data = await response.json();
                setResources(data.resources || {});
            } catch (error) {
                console.error("Error fetching resources:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResources();
    }, [name]);

    if (loading) {
        return <div className="flex items-center justify-center h-screen"><div>Loading...</div></div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center text-cyan-700 mb-8">
                View and Download Resources
            </h1>
            {Object.entries(resources).map(([subject, resourceObj]) => (
                <div key={subject} className="mb-8 p-4 bg-white shadow-md rounded-md">
                    <h2 className="text-2xl font-bold text-cyan-700 mb-4">{subject}</h2>
                    <table className="table-auto w-full mb-4 border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-cyan-700 text-white">
                                <th className="border border-gray-300 px-4 py-2">Resource Name</th>
                                <th className="border border-gray-300 px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resourceObj.subjectResources?.length > 0 ? (
                                resourceObj.subjectResources.map((resource, index) => (
                                    <tr key={index} className="hover:bg-gray-100">
                                        <td className="border border-gray-300 px-4 py-2">
                                            <a href={resource.link} target="_blank" rel="noopener noreferrer" className="text-cyan-700 hover:underline">
                                                {resource.name}
                                            </a>
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <a
                                                href={resource.link}
                                                download
                                                className="text-cyan-700 hover:underline"
                                            >
                                                Download
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" className="text-center border border-gray-300 px-4 py-2 text-gray-500">
                                        No resources available for {subject}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {Object.entries(resourceObj.topics || {}).map(([topic, topicResources]) => (
                        <div key={topic} className="mb-4 ml-4">
                            <h3 className="text-xl font-bold text-cyan-700 mb-2">{topic}</h3>
                            <table className="table-auto w-full mb-4 border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-cyan-700 text-white">
                                        <th className="border border-gray-300 px-4 py-2">Resource Name</th>
                                        <th className="border border-gray-300 px-4 py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topicResources?.length > 0 ? (
                                        topicResources.map((resource, index) => (
                                            <tr key={index} className="hover:bg-gray-100">
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <a href={resource.link} target="_blank" rel="noopener noreferrer" className="text-cyan-700 hover:underline">
                                                        {resource.name}
                                                    </a>
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <a
                                                        href={resource.link}
                                                        download
                                                        className="text-cyan-700 hover:underline"
                                                    >
                                                        Download
                                                    </a>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="2" className="text-center border border-gray-300 px-4 py-2 text-gray-500">
                                                No resources available for {topic}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default ViewResourcesPage;
