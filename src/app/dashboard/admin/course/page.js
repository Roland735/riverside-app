"use client";
import { getSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import TeacherLayout from "../../../components/Universal/TeacherLayout";
import MobileNavbar from "@/app/components/Universal/MobileNavbar";
import TopicHome from "@/app/components/teacher/topics/TopicHome";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import CourseHome from "@/app/components/admin/CourseHome";


function Dashboard() {
    const [session, setSession] = useState(null);
    const [classData, setClassData] = useState(); // Initialize with null or empty array
    const [classTeachers, setClassTeachers] = useState([]);
    const [subjectTeacherData, setSubjectTeacherData] = useState([]);
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        async function getSessionData() {
            const session = await getSession();
            setSession(session);
        }
        getSessionData();

        const fetchTeachers = async () => {
            try {
                const response = await fetch('/api/getTeachers'); // Adjust the API endpoint accordingly
                if (!response.ok) {
                    throw new Error('Failed to fetch teachers');
                }
                const data = await response.json();


                setClassTeachers(data.teachers);
                setSubjectTeacherData(data.teachers);
                setSubjects(data.subjects);
            } catch (error) {
                console.error('Error fetching teachers:', error);
                toast.error('Failed to fetch teachers');
            }
        };
        fetchTeachers();
    }, []);





    if (!session) {
        return <p>Loading...</p>;
    } else if (session.user.role === "admin") {
        return (
            <

                >
                <MobileNavbar />
                <div className="md:flex justify-between  py-3 w-full items-center  shadow-2xl light-border">
                    <CourseHome
                        classTeachers={classTeachers}
                        mysubjectTeachers={subjectTeacherData}
                        subjects={subjects}

                    />

                </div>
                <button onClick={() => signOut({ redirect: true, callbackUrl: "/auth/login" })}>
                    Logout
                </button>
            </>
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
