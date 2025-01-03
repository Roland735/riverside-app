import React, { useEffect, useState } from "react";
import { FaClipboardList, FaBookOpen, FaQuestion } from "react-icons/fa";
import Card from "./TypeCard";
import SubjectList from "../Subject/ClassSubjects";
import SubjectBarChart from "./SubjectBarChart";
import StudentScatterChart from "./StudentScatterChart";
import SubjectAnomalies from "./SubjectAnomalies";
import StudentAnomalies from "./StudentAnomalies";
import Loading from "../../Universal/loader";

function MyClassHome({ name }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const year = 2025; // Example year

  useEffect(() => {
    async function fetchData() {
      if (name && year) {
        try {
          const response = await fetch("/api/myclasses", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ teacherName: name, year }),
          });

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const result = await response.json();
          setData(result);
          setLoading(false); // Set loading to false after data is fetched
        } catch (error) {
          console.error("Error fetching class data:", error);
          setLoading(false); // Set loading to false on error
        }
      }
    }

    fetchData();
  }, [name, year]); // Trigger effect on name or year change

  if (loading) {
    return <Loading />;
  }

  if (!data || data.length === 0) {
    return (
      <div className=" min-h-80 section-bg flex items-center justify-center w-full">
        <p className=" bg-slate-700 p-7 rounded border-2 border-sky-500 ">
          No classes Yet.
        </p>
      </div>
    );
  }
  console.log(data);

  return (
    <div className="min-h-screen py-10 px-4 bg-gray-100 dark:bg-slate-900">
      {data.map((classData, index) => (
        <div key={index} className="mb-8">
          <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
            {classData.classDetails.className} Averages
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <Card
              title="Assignment Average"
              icon={FaClipboardList}
              value={classData.classAverages.assignmentAverage}
            />
            <Card
              title="Test Average"
              icon={FaBookOpen}
              value={classData.classAverages.testAverage}
            />
            <Card
              title="Quiz Average"
              icon={FaQuestion}
              value={classData.classAverages.quizAverage}
            />
          </div>
          <SubjectList subjects={classData.subjects} />
          <SubjectBarChart data={classData.subjects} />
          <StudentScatterChart data={classData.students} />
          <SubjectAnomalies data={classData.subjects} />
          <StudentAnomalies data={classData.students} />
        </div>
      ))}
    </div>
  );
}

export default MyClassHome;
