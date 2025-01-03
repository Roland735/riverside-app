"use client";
import { getSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import MobileNavbar from "@/app/components/Universal/MobileNavbar";
import { toast } from "react-toastify";
import MyClassHome from "@/app/components/teacher/myclass/SingleClass";
import ExamAttendance from "@/app/components/teacher/InvigilationHome";
import CommentsPage from "@/app/components/teacher/teacherCommentsHome";
import Loading from "@/app/components/Universal/loader";


function Dashboard({ params }) {
    const [session, setSession] = useState(null);
    const period = decodeURI(params.period);
    const year = decodeURI(params.year);


    useEffect(() => {
        async function getSessionData() {
            const session = await getSession();
            setSession(session);
        }
        getSessionData();


    }, []);





    if (!session) {
        return <Loading />;
    } else if (session.user.role === "teacher") {
        return (
            <>
                <div className="md:hidden w-full"><MobileNavbar /></div>

                <div className="md:flex justify-between  py-3 w-full items-center  shadow-2xl light-border">
                    <CommentsPage regNumber={session.user.regNumber} year={year} period={period} />

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
