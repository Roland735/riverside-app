"use client";
import { getSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import MobileNavbar from "@/app/components/Universal/MobileNavbar";
import { toast } from "react-toastify";
import CourseHome from "@/app/components/admin/CourseHome";
import AssignClasses from "@/app/components/admin/AssignClassesHome";


function Dashboard() {
    const [session, setSession] = useState(null);
    const [classData, setClassData] = useState(); // Initialize with null or empty array
    const [classTeachers, setClassTeachers] = useState([]);
    const [subjectTeacherData, setSubjectTeacherData] = useState([]);

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
                <div className="md:flex justify-between w-full items-center  shadow-2xl light-border">
                    <AssignClasses
                        classTeachers={classTeachers}
                        subjectTeachers={subjectTeacherData}

                    />

                </div>

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
