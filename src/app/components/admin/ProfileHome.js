"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function ProfilePage(regNumber, name, lastname) {
    console.log(name, lastname, regNumber);

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await axios.post("/api/user", { userId: regNumber, name, lastname });
                setUser(response.data);
                setPreview(response.data.profilePicture || "");
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }

        fetchUser();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("profilePicture", file);
        formData.append("userId", user.regNumber);

        try {
            const response = await axios.post("/api/updatePicture", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log(response);

            alert("Profile picture updated successfully!");
        } catch (error) {
            console.error("Error updating profile picture:", error);
            alert("Failed to update profile picture.");
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="w-full section-bg mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-slate-50">Update Profile Picture</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Profile Picture</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {preview && (
                        <img src={preview} alt="Profile Preview" className="mt-4 w-32 h-32 rounded-full object-cover" />
                    )}
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Update Picture
                </button>
            </form>
        </div>
    );
}
