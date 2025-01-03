import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const AssignmentForm = ({ session }) => {
  // const router = useRouter();
  const [title, setTitle] = useState("");
  const [grade, setGrade] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [instructions, setInstructions] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(session);

    try {
      const response = await fetch(`/api/assignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: session.user.id,
          grade,
          title,
          description,
          due_date: dueDate,
          instructions,
          created_by: session.user.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Error creating assignment");
      }

      const data = await response.json();
      console.log("Assignment created:", data);
      // router.push(`/courses/${courseId}`); // Redirect after successful creation
    } catch (error) {
      console.error("Error creating assignment:", error);
      alert("Error creating assignment. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="assignment-form flex flex-col space-y-5 bg-slate-950 rounded-md p-4"
    >
      <h2 className="text-xl font-semibold my-4 text-center">
        Create Assignment
      </h2>
      <div className="flex flex-col items-center justify-center space-x-4 mx-4">
        <label className="w-full text-start my-2" htmlFor="title">
          Title:
        </label>
        <input
          type="text"
          className="border-2 border-emerald-600 rounded p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full" // Full width
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col items-center justify-center space-x-4 mx-4 ">
        <label htmlFor="numberSelect">Select a number:</label>
        <select
          id="numberSelect"
          onChange={(e) => setGrade(e.target.value)}
          className="border-2 border-emerald-600 rounded p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
        >
          <option className="hover:bg-gray-100" value="Form 1">
            Form 1
          </option>
          <option className="hover:bg-gray-100" value="Form 2">
            Form 2
          </option>
          <option className="hover:bg-gray-100" value="Form 3">
            Form 3
          </option>
          <option className="hover:bg-gray-100" value="Form 4">
            Form 4
          </option>
          <option className="hover:bg-gray-100" value="Form 5">
            Form 5
          </option>
          <option className="hover:bg-gray-100" value="Form 6">
            Form 6
          </option>
        </select>
      </div>
      <div className="flex flex-col items-center justify-center space-x-4 mx-4">
        <label className="w-full text-start my-2" htmlFor="description">
          Description:
        </label>
        <textarea
          id="description"
          className="border-2 border-emerald-600 rounded p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full" // Full width
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col items-center justify-center space-x-4 mx-4">
        <label className="w-full text-start my-2" htmlFor="due-date">
          Due Date:
        </label>
        <input
          type="date"
          className="border-2 border-emerald-600 rounded p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full" // Full width
          id="due-date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col items-center justify-center space-x-4 mx-4 ">
        <label className="w-full text-start my-2" htmlFor="instructions">
          Instructions:
        </label>
        <textarea
          id="instructions"
          value={instructions}
          className="border-2 border-emerald-600 rounded p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full" // Full width
          onChange={(e) => setInstructions(e.target.value)}
        />
      </div>
      <div className="flex flex-col items-center justify-center space-x-4 mx-4">
        <label htmlFor="file-upload" className="w-full text-start my-2">
          Upload File:
        </label>
        <div className="relative w-full">
          <input
            type="file"
            id="file-upload"
            className="w-full rounded-md border border-gray-300 p-2 text-gray-700 bg-white shadow-sm hover:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          />
          <p className="text-xs text-gray-500 my-2">
            Accepted file types: .pdf, .docx, .jpg, .png
          </p>
          <span className="absolute top-0 right-0 px-3 py-2 text-xs font-medium text-gray-500 cursor-pointer hover:text-emerald-500">
            Browse
          </span>
        </div>
      </div>

      <button
        type="submit"
        className="bg-cyan-600 w-full text-white rounded p-2 mt-4" // Full width and margin top
      >
        Create Assignment
      </button>
    </form>
  );
};

export default AssignmentForm;
