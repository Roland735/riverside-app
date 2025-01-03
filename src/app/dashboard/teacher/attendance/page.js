"use client";
import { getSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import MobileNavbar from "@/app/components/Universal/MobileNavbar";
import Attendance from "@/app/components/teacher/Attendance/AttendanceHome";
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

  useEffect(() => {
    if (session) {
    }
  }, [session]);

  if (!session) {
    return <Loading />;
  } else if (session.user.role === "teacher") {
    return (
      <>
        <MobileNavbar />
        <div className="md:flex justify-between  py-3 w-full items-center  shadow-2xl light-border">
          <Attendance
            name={`${session.user.firstname} ${session.user.lastname}`}
          />
        </div>
      </>
    );
  } else {
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
}

export default Dashboard;
