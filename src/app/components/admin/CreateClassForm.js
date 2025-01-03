import React, { useState } from "react";
import { toast } from "react-toastify";

const CreateClassForm = ({
  optionSubjectTeachers,
  optionTeachers,
  myClassTeachers,
  mySubjects,
}) => {
  const [className, setClassName] = useState("");
  const [classTeachers, setClassTeachers] = useState([""]);
  const [subjects, setSubjects] = useState([]);
  const [subjectName, setSubjectName] = useState("");
  const [term, setTerm] = useState("");
  const [subjectTeachers, setSubjectTeachers] = useState([""]);
  const [editIndex, setEditIndex] = useState(null);
  const [year, setYear] = useState("");
  const [level, setLevel] = useState(""); // New state for level
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createClass = async (classData) => {
    console.log("classData:", classData);
    try {
      const response = await fetch("/api/createClass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(classData),
      });

      if (!response.ok) {
        throw new Error("Failed to create class");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating class:", error);
      throw new Error("Failed to create class");
    }
  };

  const handleAddSubject = () => {
    if (subjectName && subjectTeachers.every((teacher) => teacher !== "")) {
      const newSubject = { name: subjectName, teachers: subjectTeachers };
      if (editIndex !== null) {
        const newSubjects = [...subjects];
        newSubjects[editIndex] = newSubject;
        setSubjects(newSubjects);
        setEditIndex(null);
      } else {
        setSubjects([...subjects, newSubject]);
      }
      setSubjectName("");
      setSubjectTeachers([""]);
    }
  };

  const handleEditSubject = (index) => {
    const { name, teachers } = subjects[index];
    setSubjectName(name);
    setSubjectTeachers([...teachers]);
    setEditIndex(index);
  };

  const handleRemoveSubject = (index) => {
    const newSubjects = [...subjects];
    newSubjects.splice(index, 1);
    setSubjects(newSubjects);
  };

  const handleAddTeacher = () => {
    setClassTeachers([...classTeachers, ""]);
  };

  const handleRemoveTeacher = (index) => {
    const updatedTeachers = [...classTeachers];
    updatedTeachers.splice(index, 1);
    setClassTeachers(updatedTeachers);
  };

  const handleAddSubjectTeacher = () => {
    setSubjectTeachers([...subjectTeachers, ""]);
  };

  const handleRemoveSubjectTeacher = (index) => {
    const updatedTeachers = [...subjectTeachers];
    updatedTeachers.splice(index, 1);
    setSubjectTeachers(updatedTeachers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      className &&
      classTeachers.length > 0 &&
      subjects.length > 0 &&
      year &&
      level &&
      term
    ) {
      setIsSubmitting(true);
      try {
        await createClass({
          className,
          classTeachers,
          subjects,
          year,
          level,
          term,
        }); // Include level in submission
        setClassName("");
        setClassTeachers([""]);
        setSubjects([]);
        setYear("");
        setLevel(""); // Reset level
        toast.success("Class created successfully");
      } catch (error) {
        toast.error("Failed to create class");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full p-5 rounded-md">
      <div className="border-b-2 border-b-rose-800 text-xl font-bold my-8 text-rose-950 dark:text-rose-50">
        Create a New Class
      </div>
      <div className="mb-4">
        <label
          htmlFor="year"
          className="block mb-1 font-medium text-rose-950 dark:text-slate-300"
        >
          Year
        </label>
        <input
          type="text"
          id="year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Enter year"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-rose-500"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="className"
          className="block mb-1 font-medium text-rose-950 dark:text-slate-300"
        >
          Section
        </label>
        {/* <input
          type="text"
          id="className"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          placeholder="Enter class name"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-rose-500"
        /> */}
        <select
          id="className"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-rose-500"
        >
          <option value="">Select a section</option>
          <option value="Green">Green</option>
          <option value="rose">rose</option>
          <option value="Yellow">Yellow</option>
          <option value="Purple">Purple</option>
        </select>
      </div>
      <div className="mb-4">
        <label
          htmlFor="level"
          className="block mb-1 font-medium text-rose-950 dark:text-slate-300"
        >
          Level
        </label>
        <select
          id="level"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-rose-500"
        >
          <option value="">Select a level</option>
          {[...Array(7)].map((_, i) => (
            <option key={i + 1} value={` ${i + 1}`}>
              Form {i + 1}
            </option>
          ))}
        </select>
      </div>
      <div className="my-2">
        <label
          htmlFor="term"
          className="block mb-1 font-medium text-rose-950
        dark:text-slate-300"
        >
          Term
        </label>
        <select
          id="term"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-rose-500"
        >
          <option value="">Select a term</option>
          {[...Array(3)].map((_, i) => (
            <option key={i + 1} value={`${i + 1}`}>
              Term {i + 1}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label
          htmlFor="classTeachers"
          className="block mb-1 font-medium text-rose-950 dark:text-slate-300"
        >
          Class Teachers
        </label>
        {classTeachers.map((teacher, index) => (
          <div key={index} className="flex mb-2">
            <select
              value={teacher}
              onChange={(e) => {
                const newTeachers = [...classTeachers];
                newTeachers[index] = e.target.value;
                setClassTeachers(newTeachers);
              }}
              className="flex-1 px-4 py-2 mr-2 border rounded-md focus:outline-none focus:border-rose-500"
            >
              <option value="">Select a teacher</option>
              {myClassTeachers.map((teacherOption) => (
                <option key={teacherOption._id} value={teacherOption.name}>
                  {teacherOption.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => handleRemoveTeacher(index)}
              className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddTeacher}
          className="block w-full px-4 py-2 mt-2 text-white bg-rose-500 rounded-md hover:bg-rose-600 focus:outline-none focus:bg-rose-600"
        >
          Add Teacher
        </button>
      </div>

      <div className="mb-4">
        <label
          htmlFor="subjectName"
          className="block mb-1 font-medium text-rose-950 dark:text-slate-300"
        >
          Subject Name
        </label>
        {/* <input
          type="text"
          id="subjectName"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          placeholder="Enter subject name"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-rose-500"
        /> */}

        <div className="flex mb-2">
          <select
            onChange={(e) => {
              setSubjectName(e.target.value);
            }}
            className="flex-1 px-4 py-2 mr-2 border rounded-md focus:outline-none focus:border-rose-500"
          >
            <option value="">Select a subject</option>
            {mySubjects.map((subjectOption) => (
              <option key={subjectOption._id} value={subjectOption.name}>
                {subjectOption.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium text-rose-950 dark:text-slate-300">
          Subject Teachers
        </label>
        {subjectTeachers.map((teacher, index) => (
          <div key={index} className="flex mb-2">
            <select
              value={teacher}
              onChange={(e) => {
                const newTeachers = [...subjectTeachers];
                newTeachers[index] = e.target.value;
                setSubjectTeachers(newTeachers);
              }}
              className="flex-1 px-4 py-2 mr-2 border rounded-md focus:outline-none focus:border-rose-500"
            >
              <option value="">Select a teacher</option>
              {optionSubjectTeachers.map((teacherOption) => (
                <option key={teacherOption._id} value={teacherOption.name}>
                  {teacherOption.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => handleRemoveSubjectTeacher(index)}
              className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddSubjectTeacher}
          className="block w-full px-4 py-2 mt-2 text-white bg-rose-500 rounded-md hover:bg-rose-600 focus:outline-none focus:bg-rose-600"
        >
          Add Teacher
        </button>
      </div>
      <button
        type="button"
        onClick={handleAddSubject}
        className="block w-full px-4 py-2 mb-4 text-white bg-rose-500 rounded-md hover:bg-rose-600 focus:outline-none focus:bg-rose-600"
      >
        Add Subject
      </button>
      <div className="mb-4 text-rose-950 dark:text-slate-50">
        <h2 className="mb-2 font-medium text-lg">Preview</h2>
        <div className="border p-4 rounded-md">
          <p className="mb-2">
            <span className="font-medium">Class Name:</span> {className}
          </p>
          <p className="mb-2">
            <span className="font-medium">Level:</span> Level {level}
          </p>
          <p className="mb-2">
            <span className="font-medium">Term:</span> Term {term}
          </p>
          {/* year */}
          <p className="mb-2">
            <span className="font-medium">Year:</span> {year}
          </p>
          <p className="mb-2">
            <span className="font-medium">Class Teachers:</span>{" "}
            {classTeachers.join(", ")}
          </p>
          <p className="font-medium">Subjects:</p>
          <ul className="ml-4 list-disc">
            {subjects.map((subject, index) => (
              <li key={index} className="mb-2">
                <span className="font-medium">{subject.name}</span>
                <ul className="ml-4 list-disc">
                  {subject.teachers.map((teacher, i) => (
                    <li key={i}>{teacher}</li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="bg-green-700 py-1 px-3 my-2 rounded-2xl text-slate-50 mr-5"
                  onClick={() => handleEditSubject(index)}
                >
                  Edit Subject
                </button>
                <button
                  type="button"
                  className="bg-red-700 py-1 px-3 my-2 rounded-2xl text-slate-50"
                  onClick={() => handleRemoveSubject(index)}
                >
                  Remove Subject
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        type="submit"
        className={`block w-full px-4 py-2 mt-4 text-white rounded-md focus:outline-none ${isSubmitting
          ? "bg-gray-500 cursor-not-allowed"
          : "bg-green-500 hover:bg-green-600"
          }`}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Create Class"}
      </button>
    </form>
  );
};

export default CreateClassForm;
