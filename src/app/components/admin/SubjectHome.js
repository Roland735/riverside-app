import React, { useState, useEffect } from "react";
import SubjectCard from "./SubjectCard";
import ClassesTableCard from "./ClassesTableCard";
import PerformanceChart from "./PerformanceChart";
import OverallAverageAreaChart from "./OverallAverageAreaChart";
import AnomalyClassesCard from "./AnomalyClassesCard";

const SubjectPage = ({ subjectParam }) => {
    const [subjectData, setSubjectData] = useState(null);
    const [classesData, setClassesData] = useState([]);
    const [anomalyClasses, setAnomalyClasses] = useState([]);

    useEffect(() => {
        // Fetch data from the route
        const fetchData = async () => {
            try {
                const response = await fetch("/api/getSubjectData", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ subjectName: subjectParam }), // Replace "Maths" with the actual subject if needed
                });

                console.log(response);

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);

                    setSubjectData(data.subjectData);
                    setClassesData(data.classesData);

                    // Identify anomaly classes (where averageMark < 70)
                    const anomalies = data.classesData.filter(classData => classData.averageMark < 70);
                    setAnomalyClasses(anomalies);
                } else {
                    console.error("Failed to fetch subject data");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    if (!subjectData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-4 flex flex-col space-y-4 w-full">
            <SubjectCard subjectData={subjectData} />
            <div className="flex flex-col lg:flex-row lg:space-x-4">
                <div className="flex-1">
                    <PerformanceChart data={classesData} />
                </div>
                <div className="flex-1">
                    <OverallAverageAreaChart data={classesData} />
                </div>
            </div>
            <ClassesTableCard classesData={classesData} />
            <AnomalyClassesCard anomalyClasses={anomalyClasses} />
        </div>
    );
};

export default SubjectPage;
