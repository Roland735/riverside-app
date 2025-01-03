import React, { useEffect, useState } from "react";
import SubjectList from "./StudentsSubjectsList";

function SubjectHome({ session, userRole }) {
    const [student, setStudent] = useState({
        studentName: "",
        subjects: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                console.log(session);

                const response = await fetch("/api/studentSubjects", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        regNumber:
                            userRole === "parent"
                                ? session.user.students[0].regNumber
                                : session.user.regNumber,
                    }), // Replace with actual registration number
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }

                const data = await response.json();
                console.log(data);

                setStudent(data);
                setLoading(false); // Set loading to false once data is fetched
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false); // Set loading to false in case of an error
            }
        }

        fetchData();
    }, []); // Empty dependency array ensures this effect runs only once on mount

    if (loading) {
        return <div>Loading...</div>; // Render a loading indicator while fetching data
    }

    return (
        <div className="w-full">
            <SubjectList student={student} userRole={userRole} />
        </div>
    );
}

export default SubjectHome;
