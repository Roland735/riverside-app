"use client";
import { getSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import TeacherLayout from "../../../components/Universal/TeacherLayout";
import { useContext } from "react";
import MobileNavbar from "@/app/components/Universal/MobileNavbar";
import Exam from "@/app/components/teacher/exams/Exam";

function Dashboard() {
    const [session, setSession] = useState(null);
    useEffect(() => {
        async function getSessionData() {
            const session = await getSession();
            setSession(session);
        }
        getSessionData();
    }, []);

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
                <div className="md:flex justify-between px-5 py-3 w-full items-center  shadow-2xl light-border">
                    <Exam />
                </div>

                <button
                    onClick={() =>
                        signOut({ redirect: true, callbackUrl: "/auth/login" })
                    }
                >
                    Logout
                </button>
            </TeacherLayout>
        );
    } else
        return (
            <p>
                You are not authorized to view this page. You&apos;re a {session.user.role}.
                <button
                    onClick={() =>
                        signOut({ redirect: true, callbackUrl: "/auth/login" })
                    }
                >
                    Log Out
                </button>
            </p>
        );
}

export default Dashboard;
