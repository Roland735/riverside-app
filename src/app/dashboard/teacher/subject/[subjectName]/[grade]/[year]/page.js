"use client";
import { getSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import TeacherLayout from "@/app/components/Universal/TeacherLayout";
import MobileNavbar from "@/app/components/Universal/MobileNavbar";
import { useRouter } from "next/navigation";

import SpecificSubjectAnalysis from "@/app/components/teacher/Subject/SpecificSubject";
import SubjectAnalysis from "../../../SubjectComponent";
import Loading from "@/app/components/Universal/loader";

// Existing imports...

function TopicPage({ params }) {
  const router = useRouter();
  const subjectName = decodeURIComponent(params.subjectName);
  const className = decodeURIComponent(params.grade);

  const [session, setSession] = useState(null);
  const [topicData, setTopicData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getSessionData() {
      const session = await getSession();
      setSession(session);
    }
    getSessionData();

    if (subjectName) {
      fetchTopicData(subjectName, className);
    }
  }, [subjectName, className]);

  const fetchTopicData = async (name, className) => {
    try {
      console.log("hi");
      console.log(name, className);

      const response = await fetch("/api/getSubjectInfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subjectName: name,
          year: 2025,
          grade: className,
        }),
      });

      const result = await response.json();
      console.log(result);

      console.log(result);
      if (result.message && result.topics) {
        setTopicData(result);
        console.log("Hi");
      }
    } catch (error) {
      console.error("Error fetching topic data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return <Loading />;
  } else if (session.user.role === "teacher") {
    return (
      <>
        <MobileNavbar />
        <SpecificSubjectAnalysis
          subjectName={subjectName}
          className={className}
          year={2025}
          role={session.user.role}
        />
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

export default TopicPage;
