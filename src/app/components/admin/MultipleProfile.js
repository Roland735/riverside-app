import { useState } from 'react';
import Select from 'react-select';
import axios from 'axios';

export default function UploadProfilePictures({ users }) {
    const [files, setFiles] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState({});
    const [error, setError] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleFileChange = (event) => {
        setFiles(Array.from(event.target.files));
    };

    const handleUserChange = (selectedOption, index) => {
        const updatedUsers = { ...selectedUsers, [index]: selectedOption.value };
        const userIds = Object.values(updatedUsers);

        // Check for duplicate user IDs
        if (new Set(userIds).size !== userIds.length) {
            setError("Cannot select the same user for multiple pictures.");
            return;
        }

        setSelectedUsers(updatedUsers);
        setError(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Basic validation
        if (files.length === 0) {
            setError("Please select at least one picture.");
            return;
        }
        if (Object.keys(selectedUsers).length !== files.length) {
            setError("Please select a user for each picture.");
            return;
        }

        setIsUploading(true);
        setProgress(0);

        const formData = new FormData();
        files.forEach((file, index) => {
            formData.append(`picture_${index}`, file);
            formData.append(`userId_${index}`, selectedUsers[index]);
        });

        try {
            const response = await axios.post('/api/uploadPictures', formData, {
                onUploadProgress: (event) => {
                    const percentCompleted = Math.round((event.loaded * 100) / event.total);
                    setProgress(percentCompleted);
                }
            });

            if (response.status === 200) {
                alert('Pictures uploaded successfully!');
                setFiles([]);
                setSelectedUsers({});
                setError(null);
            } else {
                setError(response.data.message || 'Failed to upload pictures.');
            }
        } catch (error) {
            console.error('Error uploading pictures:', error);
            setError('An unexpected error occurred.');
        } finally {
            setIsUploading(false);
        }
    };

    const userOptions = users.map((user) => ({
        value: user.regNumber,
        label: `${user.firstname} ${user.lastname}`,
    }));

    return (
        <div className="relative min-h-screen flex flex-col justify-center items-center section-bg py-2 w-full">
            {isUploading && (
                <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg z-60">
                        <p className="mb-4">Uploading... {progress}%</p>
                        <div className="w-full bg-gray-200 h-4 rounded-full">
                            <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                </div>
            )}
            <form onSubmit={handleSubmit} className={`w-full max-w-2xl p-4 bg-white rounded-lg shadow-md transition-all ${isUploading ? 'blur-md' : ''}`}>
                <h1 className="text-2xl font-bold mb-4">Upload Profile Pictures</h1>
                {error && (
                    <div className="mb-4 text-red-500">
                        {error}
                    </div>
                )}
                <div className="mb-4">
                    <label className="block text-cyan-500 font-bold mb-2" htmlFor="pictures">Select Pictures</label>
                    <input
                        type="file"
                        id="pictures"
                        multiple
                        onChange={handleFileChange}
                        className="w-full py-2 px-3 border border-cyan-300 rounded-lg"
                    />
                </div>

                {files.length > 0 && (
                    <div className="space-y-4">
                        {files.map((file, index) => (
                            <div key={index} className="flex items-center space-x-4">
                                <img src={URL.createObjectURL(file)} alt={`Preview ${index}`} className="w-20 h-20 object-cover rounded-lg" />
                                <Select
                                    options={userOptions}
                                    onChange={(selectedOption) => handleUserChange(selectedOption, index)}
                                    placeholder="Search user..."
                                    className="w-full"
                                />
                            </div>
                        ))}
                    </div>
                )}

                <button
                    type="submit"
                    className="mt-4 w-full bg-cyan-500 text-white py-2 px-4 rounded-lg hover:bg-cyan-600 transition-colors"
                >
                    Save Pictures
                </button>
            </form>
        </div>
    );
}
