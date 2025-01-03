"use client";
import { useState } from "react";
import UploadUsers from "./UploadUsers";
import Form from "./Form";

const Tabs = () => {
  const [activeTab, setActiveTab] = useState("single");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="w-full min-h-screen  ">
      <div className="flex justify-center mt-8 w-full ">
        <button
          onClick={() => handleTabChange("single")}
          className={`px-4 py-2 mx-2 w-1/3  ${activeTab === "single" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
        >
          Single User
        </button>
        <button
          onClick={() => handleTabChange("multiple")}
          className={`px-4 py-2 mx-2 w-1/3  ${activeTab === "multiple" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
        >
          Multiple Users
        </button>
      </div>
      <div className="mt-8">
        {activeTab === "single" ? <Form /> : <UploadUsers />}
      </div>
    </div>
  );
};

export default Tabs;
