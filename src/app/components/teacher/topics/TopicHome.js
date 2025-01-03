import React, { useState, useEffect } from "react";
import Calendar from "./Calendar";
import Loading from "../../Universal/loader";

function TopicHome({ classTeachers, subjectTeachers, subjectsTaught }) {
  const [syllabusTopics, setSyllabusTopics] = useState([]);

  const getTeachersData = async (className, subject) => {
    const year = 2025;
    try {
      const response = await fetch(
        `/api/getTopics/${className}/${subject}/${year}`
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error("Failed to fetch teacher dashboard data");
      }
      return data;
    } catch (error) {
      console.error("Error fetching teacher dashboard data:", error);
      // Handle error
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (subjectsTaught && subjectsTaught.data) {
        const newData = [];
        for (const subjectData of subjectsTaught.data) {
          const { className, subjects } = subjectData;
          for (const subject of subjects) {
            const data = await getTeachersData(className, subject);
            if (data) {
              newData.push(data);
            }
          }
        }
        setSyllabusTopics(newData);
      }
    };
    fetchData();
  }, [subjectsTaught]);

  return (
    <div className="w-full">
      {syllabusTopics.length === 0 ? (
        <div>
          <Loading />
        </div>
      ) : (
        <div className="">
          <div className="bg-slate-300 dark:bg-slate-700 rounded-md p-5">
            <h1 className=" border-b-2 border-cyan-800 text-xl font-bold text-cyan-950 dark:text-cyan-50 my-4">
              Your Classes
            </h1>
            <Calendar data={syllabusTopics} />
          </div>
        </div>
      )}
    </div>
  );
}

export default TopicHome;
