"use client";
import { getSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import MobileNavbar from "@/app/components/Universal/MobileNavbar";
import AdminConfirmExams from "@/app/components/admin/Admin-confirm-exams";

function Dashboard({ params }) {
    const [session, setSession] = useState(null);
    const period = decodeURI(params.period);
    const year = decodeURI(params.year);
    console.log(period);

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
                <div className="md:flex justify-between px-5 py-3 w-full items-center  shadow-2xl light-border">
                    <AdminConfirmExams regNumber={`${session.user.regNumber}`} period={period} year={year} />
                </div>

                <button
                    onClick={() =>
                        signOut({ redirect: true, callbackUrl: "/auth/login" })
                    }
                >
                    Logout
                </button>
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
