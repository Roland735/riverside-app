import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";

import "react-circular-progressbar/dist/styles.css";

import CreateClassForm from "./CreateClassForm";
import AssignStudents from "@/app/dashboard/teacher/course/AssignClass";

const AssignClasses = (subjectTeachers) => {
    console.log(subjectTeachers);

    const [mySession, setMySession] = useState(null);


    useEffect(() => {
        async function getSessionData() {
            const session = await getSession();
            setMySession(session);
        }
        getSessionData();
    }, []);


    useEffect(() => {

    },);

    if (!mySession || !mySession.user || !mySession.user.role) {
        return <div>Loading...</div>; // Show a loading state until mySession is set or if role is not defined
    }

    return (
        <div className="w-full">

            <div className="">
                <AssignStudents />
            </div>
        </div>
    );
};

export default AssignClasses;
