"use client";
import { getSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import MobileNavbar from "@/app/components/Universal/MobileNavbar";
import { toast } from "react-toastify";
import MyClassHome from "@/app/components/teacher/myclass/SingleClass";
import ExamAttendance from "@/app/components/teacher/InvigilationHome";
import CommentsPage from "@/app/components/teacher/teacherCommentsHome";
import StudentMarksAndComments from "@/app/components/teacher/StudentMarksAndComments";
import StudentsSlide from "@/app/components/admin/HeadComments";


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
        return <p>Loading...</p>;
    } else if (session.user.role === "admin") {
        return (
            <
                >
                <MobileNavbar />
                <div className="md:flex justify-between  py-3 w-full items-center  shadow-2xl light-border">
                    <StudentsSlide period={period} year={year} />

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
