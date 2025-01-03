import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import {
    FaRegChartBar,
    FaClipboardList,
    FaBook,
    FaUsers,
    FaTasks,
    FaCheckCircle,
} from "react-icons/fa";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import CreateClassForm from "./CreateClassForm";
import AssignStudents from "@/app/dashboard/teacher/course/AssignClass";

const CourseHome = ({ mysubjectTeachers, subjects, classTeachers }) => {
    // console.log(myClassTeachers);
    // console.log(mysubjectTeachers);
    // console.log(subjects);

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
        <div className="w-full section-bg ">
            <CreateClassForm optionSubjectTeachers={mysubjectTeachers} myClassTeachers={classTeachers} mySubjects={subjects} />

        </div>
    );
};

export default CourseHome;
