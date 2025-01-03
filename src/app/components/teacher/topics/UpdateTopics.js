import React, { useState, useEffect } from "react";
import SyllabusAccordion from "./ListOfTopicsToBeUpdated";


function UpdateTopic({ classTeachers, subjectTeachers, subjectsTaught }) {
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
            {/* <CreateClassForm optionSubjectTeachers={subjectTeachers} /> */}
            {subjectsTaught ? (
                <SyllabusAccordion data={subjectsTaught.data} />
            ) : (
                <div className=" flex justify-center items-center ">
                    No subjects taught yet.
                </div>
            )}

        </div>
    );
}

export default UpdateTopic;
