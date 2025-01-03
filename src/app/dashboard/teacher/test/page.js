"use client";
import { getSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import TeacherLayout from "../../../components/Universal/TeacherLayout";
import MobileNavbar from "@/app/components/Universal/MobileNavbar";
import TopicHome from "@/app/components/teacher/topics/TopicHome";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import TestHome from "@/app/components/teacher/TestHome";

function Dashboard() {
    const [session, setSession] = useState(null);
    const [classData, setClassData] = useState(); // Initialize with null or empty array


    useEffect(() => {
        async function getSessionData() {
            const session = await getSession();
            setSession(session);
        }
        getSessionData();


    }, []);

    useEffect(() => {
        if (session) {
            getTeachersData(session);
        }
    }, [session]);

    const getTeachersData = async (session) => {
        console.log('called')
        if (session) {
            try {
                const teacherName = `${session.user.firstname} ${session.user.lastname}`;
                if (!teacherName) {
                    throw new Error('Teacher name not found in session');
                }
                console.log(teacherName)
                const response = await fetch(`/api/teacherClasses/${teacherName}`);
                const data = await response.json();
                console.log('Fetched info:', data);
                if (!response.ok) {
                    throw new Error('Failed to fetch teacher dashboard data');
                }
                setClassData(data);
                console.log('Fetched teacher dashboards data:', classData);
                console.log('Updated classTeacherData:', classData); // Log updated data
            } catch (error) {
                console.error('Error fetching teacher dashboard data:', error);
                // Handle error
            }
        }
    };

    if (!session) {
        return <p>Loading...</p>;
    } else if (session.user.role === "teacher") {
        return (
            <TeacherLayout
                name={session.user.firstname}
                lastname={session.user.lastname}
                role={session.user.role}
            >
                <MobileNavbar />
                <div className="md:flex justify-between px-5 py-3 w-9/12 items-center shadow-2xl light-border ">
                    <TestHome
                        subjectsTaught={classData} />
                </div>
                <button onClick={() => signOut({ redirect: true, callbackUrl: "/auth/login" })}>
                    Logout
                </button>
            </TeacherLayout>
        );
    } else {
        return (
            <p>
                You are not authorized to view this page. You&apos;re a {session.user.role}.
                <button onClick={() => signOut({ redirect: true, callbackUrl: "/auth/login" })}>
                    Log Out
                </button>
            </p>
        );
    }
}

export default Dashboard;
