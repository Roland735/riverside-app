import React, { useEffect, useState } from "react";
import SubjectDetailPage from "./Subject";

function SpecificSubjectHome({ regNumber, subjectName, className }) {
    console.log(regNumber, subjectName, className);

    const [student, setStudent] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch("/api/studentSubject", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ regNumber, subjectName, className }),
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }

                const data = await response.json();
                console.log(data);

                setStudent(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, [regNumber, subjectName, className]);

    return (
        <div className="w-full">
            {student ? (
                <SubjectDetailPage subjectData={student} />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default SpecificSubjectHome;
