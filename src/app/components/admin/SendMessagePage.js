import { useState } from "react";
import { FaUserPlus, FaUserTimes } from "react-icons/fa";

const usersList = [
    { id: 1, name: "John Doe", role: "Teacher" },
    { id: 2, name: "Jane Smith", role: "Parent" },
    { id: 3, name: "Alice Johnson", role: "Student" },
    { id: 4, name: "Bob Williams", role: "Admin" },
];

const SendMessagePage = () => {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [message, setMessage] = useState("");

    const handleSelectUser = (user) => {
        if (selectedUsers.find((u) => u.id === user.id)) {
            setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
        } else {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    const handleSendMessage = () => {
        if (selectedUsers.length === 0 || !message.trim()) {
            alert("Please select at least one user and enter a message.");
            return;
        }
        // Process to send the message (call API or handle form submission)
        console.log("Sending message to:", selectedUsers);
        console.log("Message:", message);
        // Clear the fields after sending
        setSelectedUsers([]);
        setMessage("");
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 py-8 px-4 flex flex-col items-center">
            <div className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4 text-center">
                    Send a Message
                </h1>

                {/* User List Section */}
                <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">Select Users</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {usersList.map((user) => (
                            <div
                                key={user.id}
                                className={`p-4 border rounded-lg flex items-center justify-between transition-all cursor-pointer ${selectedUsers.find((u) => u.id === user.id)
                                    ? "bg-sky-500 text-white"
                                    : "bg-gray-100 dark:bg-gray-700"
                                    }`}
                                onClick={() => handleSelectUser(user)}
                            >
                                <div>
                                    <p className="font-semibold">{user.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-300">
                                        {user.role}
                                    </p>
                                </div>
                                {selectedUsers.find((u) => u.id === user.id) ? (
                                    <FaUserTimes className="text-white" />
                                ) : (
                                    <FaUserPlus className="text-sky-500 dark:text-gray-100" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Selected Users */}
                <div className="mb-4">
                    <h3 className="text-lg font-semibold">Selected Users</h3>
                    <div className="flex flex-wrap mt-2">
                        {selectedUsers.length > 0 ? (
                            selectedUsers.map((user) => (
                                <span
                                    key={user.id}
                                    className="inline-block bg-sky-500 text-white px-3 py-1 rounded-full mr-2 mb-2"
                                >
                                    {user.name}
                                </span>
                            ))
                        ) : (
                            <p className="text-gray-500 dark:text-gray-300">
                                No users selected
                            </p>
                        )}
                    </div>
                </div>

                {/* Message Input Section */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Enter Message</h2>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                        rows="5"
                        placeholder="Type your message here..."
                    ></textarea>
                </div>

                {/* Send Button */}
                <div className="flex justify-center">
                    <button
                        onClick={handleSendMessage}
                        className="px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-all font-semibold"
                    >
                        Send Message
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SendMessagePage;
