import React, { useState, useEffect } from "react";

import SubjectList from "./SubjectList";

function SubjectHome({ name }) {
    const [subject, setSubject] = useState([]);
    const [newData, setNewData] = useState([]);


    const getTeachersData = async () => {

        const teacherName = name;



        try {
            const response = await fetch('/api/getClassesByTeacher', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ teacherName }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            console.log(data.subjects);
            setSubject(data.subjects);

            return data.activeClasses;
        } catch (error) {
            console.error('Error fetching classes:', error);
            throw error;
        }
    };

    useEffect(() => {
        const fetchData = async () => {

            const data = await getTeachersData();

            newData.push(data);


        }

        fetchData();
    }, []);
    // const subjects = [
    //     {
    //         name: 'Mathematics',
    //         className: 'Form 1',
    //         teachers: [
    //             { name: 'Mr. Smith' },
    //             { name: 'Ms. Johnson' }
    //         ],
    //         topics: [
    //             { title: 'Algebra', completed: true },
    //             { title: 'Geometry', completed: false },
    //             { title: 'Calculus', completed: true },
    //         ],
    //         assignmentAverageMark: 75,
    //         testAverageMark: 80,
    //         studentsCount: 30,
    //         anomalies: ['Low assignment submission rate', 'High absenteeism']
    //     },
    //     {
    //         name: 'Science',
    //         className: 'Form 1',
    //         teachers: [
    //             { name: 'Dr. Brown' },
    //             { name: 'Ms. Davis' }
    //         ],
    //         topics: [
    //             { title: 'Physics', completed: true },
    //             { title: 'Chemistry', completed: true },
    //             { title: 'Biology', completed: false },
    //         ],
    //         assignmentAverageMark: 70,
    //         testAverageMark: 78,
    //         studentsCount: 28,
    //         anomalies: ['Poor test performance']
    //     },
    //     {
    //         name: 'History',
    //         className: 'Form 1',
    //         teachers: [
    //             { name: 'Mr. Wilson' },
    //             { name: 'Ms. Clark' }
    //         ],
    //         topics: [
    //             { title: 'Ancient History', completed: false },
    //             { title: 'Modern History', completed: true },
    //             { title: 'Medieval History', completed: true },
    //         ],
    //         assignmentAverageMark: 68,
    //         testAverageMark: 74,
    //         studentsCount: 25,
    //         anomalies: ['Incomplete topics coverage']
    //     }
    // ];
    return (
        <div className="w-full section-bg">
            <SubjectList subjects={subject} teacherName={name} />
        </div>
    );
}

export default SubjectHome;
