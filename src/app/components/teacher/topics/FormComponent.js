import React, { useState } from 'react';

const FormComponent = ({ onSubmitToBackend }) => {
    const [topic, setTopic] = useState('');
    const [scheduleNumber, setScheduleNumber] = useState(1);
    const [duration, setDuration] = useState(1);
    const [topicList, setTopicList] = useState([]);
    const [editIndex, setEditIndex] = useState(null); // Track the index of the topic being edited
    const [errorMessage, setErrorMessage] = useState('');

    const handleAddToPreview = () => {
        // Check if topic, schedule number, and duration are provided
        if (!topic || !scheduleNumber || !duration) {
            setErrorMessage('Please provide a topic, schedule number, and duration.');
            return;
        }

        // If editIndex is not null, it means we're editing a topic
        if (editIndex !== null) {
            const newList = [...topicList];
            newList[editIndex] = { topic, scheduleNumber, duration };
            setTopicList(newList);
            setEditIndex(null); // Reset editIndex
        } else {
            // Check if the schedule number already exists in the preview
            if (topicList.some(item => item.scheduleNumber === scheduleNumber)) {
                setErrorMessage('Schedule number must be unique.');
                return;
            }
            // Add topic to the preview list
            setTopicList([...topicList, { topic, scheduleNumber, duration }]);
            // Increment scheduleNumber for the next topic
            setScheduleNumber(scheduleNumber + 1);
        }
        // Clear form fields
        setTopic('');
        setDuration(1);
        // Clear error message
        setErrorMessage('');
    };

    const handleEditTopic = (index) => {
        // Set the form fields with the topic data for editing
        setTopic(topicList[index].topic);
        setScheduleNumber(topicList[index].scheduleNumber);
        setDuration(topicList[index].duration);
        setEditIndex(index);
    };

    const handleDeleteTopic = (index) => {
        // Remove topic from the preview list
        const newList = [...topicList];
        newList.splice(index, 1);
        setTopicList(newList);
    };

    const handleSubmitToBackend = () => {
        // Submit topic data to the backend
        if (topicList.length === 0) {
            setErrorMessage('Please add topics before submitting.');
            return;
        }
        onSubmitToBackend(topicList);
        // Clear preview list
        setTopicList([]);
        // Clear error message
        setErrorMessage('');
    };

    return (
        <div className="flex flex-col space-y-4 my-8">
            {errorMessage && <div className="text-red-600">{errorMessage}</div>}
            <h3 className=" text-xl my-8 font-semibold border-b-2 border-cyan-700 text-cyan-900 dark:text-cyan-50">
                Add Topics
            </h3>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col space-y-4">
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter topic"
                    className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
                />
                <input
                    type="number"
                    value={scheduleNumber}
                    onChange={(e) => setScheduleNumber(parseInt(e.target.value))}
                    placeholder="Enter schedule number"
                    className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
                />
                <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    placeholder="Enter duration (in weeks)"
                    className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
                />
                <div className="flex space-x-4">
                    <button
                        type="button"
                        onClick={handleAddToPreview}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:bg-blue-600"
                    >
                        {editIndex !== null ? 'Update' : 'Add to Preview'}
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmitToBackend}
                        disabled={topicList.length === 0} // Disable button if preview is empty
                        className={`bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors focus:outline-none focus:bg-green-600 ${topicList.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Submit to Backend
                    </button>
                </div>
            </form>
            <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Preview</h3>
                <ul className="border border-gray-300 rounded-md p-4">
                    {topicList.map((topicItem, index) => (
                        <li key={index} className="flex items-center justify-between py-2">
                            <div>
                                <span className="font-semibold">Schedule {topicItem.scheduleNumber}:</span> {topicItem.topic} (Duration: {topicItem.duration} weeks)
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handleEditTopic(index)}
                                    className="text-blue-500 hover:text-blue-700 focus:outline-none"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteTopic(index)}
                                    className="text-red-500 hover:text-red-700 focus:outline-none"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default FormComponent;
