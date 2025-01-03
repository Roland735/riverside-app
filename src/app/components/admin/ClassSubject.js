import React, { useEffect, useState } from "react";
import ClassCard from "./ClassCard";
import PerformanceCard from "./PerformanceCard";
import StudentCard from "./StudentCard";
import ScatterGraphs from "./ScatterGraphs";
import TopicsTableCard from "./TopicsTableCard";
import StudentsTableCard from "./StudentsTableCard";

const SubjectPage = ({ className, subject, year }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/getClassSubjectMarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          className: className, // Replace with actual class name
          year: year,
          subjectName: subject, // Replace with actual subject name
        }),
      });

      const result = await response.json();
      console.log(result);

      setData(result);
    };

    fetchData();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Section */}
        <div className="col-span-1 md:col-span-2 space-y-4">
          <ClassCard classData={data.classData} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PerformanceCard
              title="Most Improved"
              data={data.mostImprovedData}
            />
            <PerformanceCard
              title="Least Improved"
              data={data.leastImprovedData}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StudentCard title="Best Student" data={data.bestStudentData} />
            <StudentCard title="Lowest Student" data={data.lowestStudentData} />
          </div>
        </div>
        {/* Right Section */}
        <div className="col-span-1 md:col-span-2">
          <ScatterGraphs studentsData={data.studentsData} />
        </div>
      </div>
      <div className="mt-4">
        <TopicsTableCard
          topicsData={data.topicsData}
          classData={data.classData}
        />
      </div>
      <div className="mt-4">
        <StudentsTableCard studentsData={data.studentsData} />
      </div>
    </div>
  );
};

export default SubjectPage;
