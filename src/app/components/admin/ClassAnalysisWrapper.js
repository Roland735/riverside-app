// src/components/ClassAnalysisWrapper.js

import { useEffect, useState } from "react";
import ClassAnalysis from "./ClassHome";

const ClassAnalysisWrapper = ({ grade }) => {
  const [classData, setClassData] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [category, setCategory] = useState("Form 3");

  console.log(grade);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/getAdminClasses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ className: grade }),
        });
        const result = await response.json();
        console.log(result.category);

        setClassData(result.classes[0]); // Assuming you want to display the first class
        setStudentData(result.students); // Assuming you want to display the first student
        setCategory(result.category); // Assuming you want to display the first student
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (!classData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full">
      <h2 className=" text-xl text-center font-bold">{grade}</h2>
      <ClassAnalysis
        classData={classData}
        studentData={studentData}
        category={category}
      />
    </div>
  );
};

export default ClassAnalysisWrapper;
