"use client";
import { getSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import TeacherLayout from "../../../components/Universal/TeacherLayout";
import AssignmentPage from "@/app/components/teacher/AssignmentPage";
import { useContext } from "react";
import MobileNavbar from "@/app/components/Universal/MobileNavbar";
import Analysis from "@/app/components/teacher/analysis/Analysis";
import Loading from "@/app/components/Universal/loader";

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
        return <p><Loading /></p>;
    } else if (session.user.role === "teacher") {
        return (
            <
                >
                <MobileNavbar />
                <div className="md:flex justify-between  w-full items-center  shadow-2xl light-border">
                    <Analysis />
                </div>


            </>
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
