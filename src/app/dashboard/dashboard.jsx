"use client";
import { getSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Loading from "../components/Universal/loader";

function Dashboard() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    async function getSessionData() {
      const session = await getSession();
      setSession(session);

      if (session) {
        if (session.user.role === "admin") {
          window.location.href = "/dashboard/admin"; // Redirect to admin dashboard
        } else if (session.user.role === "teacher") {
          window.location.href = "/dashboard/teacher"; // Redirect to teacher dashboard
        } else if (session.user.role === "student") {
          window.location.href = "/dashboard/student"; // Redirect to student dashboard
        } else if (session.user.role === "parent") {
          window.location.href = "/dashboard/parent"; // Redirect to student dashboard
        } else {
          signOut({ redirect: true, callbackUrl: "/auth/login" }); // Redirect to unauthorized page
        }
      }
    }
    getSessionData();
  }, []);

  if (!session) {
    return (
      <p>
        <Loading />
      </p>
    );
  }

  return null; // Render nothing if session exists and redirection is happening
}

export default Dashboard;
