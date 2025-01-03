"use client";
import { getSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import StudentLayout from "@/app/components/Universal/StudentLayout";
import StudentHome from "@/app/components/student/StudentHome";
import { useContext } from "react";
import MobileNavbar from "@/app/components/Universal/MobileNavbar";
import SubjectsHome from "@/app/components/student/subjects/SubjectHome";
import SpecificSubjectAnalysis from "@/app/components/teacher/Subject/SpecificSubject";
import SpecificSubjectHome from "@/app/components/student/subjects/SpecificSubjectHome";
import TeacherLayout from "@/app/components/Universal/TeacherLayout";

function Dashboard({ params }) {
  const subject = decodeURIComponent(params.subjectName);
  const className = decodeURIComponent(params.grade);
  const [session, setSession] = useState(null);
  const [redirectTime, setRedirectTime] = useState(5);

  console.log(className);

  useEffect(() => {
    async function getSessionData() {
      const session = await getSession();
      setSession(session);
    }
    getSessionData();
  }, []);

  const redirected = () => {
    signOut({ redirect: true, callbackUrl: "/auth/login" });
  };

  const handleRedirect = () => {
    const timer = setInterval(() => {
      if (redirectTime > 0) {
        setRedirectTime(redirectTime - 1);
      } else {
        clearInterval(timer);
        redirected(); // Redirect to login page after countdown
      }
    }, 1000);
    return () => clearInterval(timer); // Cleanup function for timer
  };

  if (!session) {
    return <p>Loading...</p>;
  } else if (session.user.role === "student") {
    return (
      <>
        <MobileNavbar />
        <div className="md:flex justify-between  py-3 w-full items-center  shadow-2xl light-border">
          <SpecificSubjectHome
            regNumber={session.user.regNumber}
            subjectName={subject}
            className={className}
          />
        </div>
      </>
    );
  } else {
    handleRedirect();
    return (
      <p className="flex items-center justify-center flex-col h-screen">
        <p className="text-lg font-bold mb-4">
          You are not authorized to view this page. You&apos;re a {session.user.role}
          .
        </p>
        <p>Redirecting to login in {redirectTime} seconds...</p>
        <button
          onClick={() =>
            signOut({ redirect: true, callbackUrl: "/auth/login" })
          }
          className="bg-red-500 text-white px-4 py-2 rounded-md mt-4"
        >
          Log Out
        </button>
      </p>
    );
  }
}

export default Dashboard;
