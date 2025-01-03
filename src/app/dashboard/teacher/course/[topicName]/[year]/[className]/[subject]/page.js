"use client";
import { getSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import MobileNavbar from "@/app/components/Universal/MobileNavbar";
import TopicComponent from "@/app/components/teacher/topics/TopicComponent";

function TopicPage({ params }) {
  const router = useRouter();
  const topicName = decodeURI(params.topicName);
  const year = decodeURI(params.year);
  const className = decodeURI(params.className);
  const subject = decodeURI(params.subject);

  const [session, setSession] = useState(null);
  const [topicData, setTopicData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getSessionData() {
      try {
        const session = await getSession();
        setSession(session);
      } catch (error) {
        console.error("Error fetching session data:", error);
      }
    }

    getSessionData();
  }, []);

  useEffect(() => {
    if (topicName && session) {
      fetchTopicData(topicName);
    }
  }, [topicName, session]);

  const fetchTopicData = async (name) => {
    try {
      console.log(name, year, className, subject);

      const response = await fetch("/api/getTeacherTopicData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topicName: name,
          subjectName: subject,
          year: parseInt(year, 10),
          className: className,
        }),
      });
      console.log(response);

      const result = await response.json();
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
    return <p>Loading...</p>;
  } else if (session.user.role === "teacher" || session.user.role === "admin") {
    return (
      <>
        <MobileNavbar />
        {loading ? (
          <p>Loading...</p>
        ) : topicData ? (
          <TopicComponent topicData={topicData} />
        ) : (
          <p>
            No topic found with the name {topicName}. Please go back and try
            again.
          </p>
        )}

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
