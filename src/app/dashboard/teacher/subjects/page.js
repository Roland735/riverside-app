"use client";
import { getSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import TeacherLayout from "@/app/components/Universal/TeacherLayout";
import MobileNavbar from "@/app/components/Universal/MobileNavbar";
import { useRouter } from "next/navigation";
import TopicComponent from "@/app/components/teacher/topics/TopicComponent";
import SubjectHome from "@/app/components/teacher/Subject/SubjectHome";

// Existing imports...

function TopicPage({ params }) {
    const router = useRouter();
    const topicName = params.topicName;

    const [session, setSession] = useState(null);
    const [topicData, setTopicData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function getSessionData() {
            const session = await getSession();
            setSession(session);
        }
        getSessionData();

        // if (topicName) {
        //     fetchTopicData(topicName);
        // }
    }, [topicName]);



    // const fetchTopicData = async (name) => {
    //     try {
    //         const response = await fetch("/api/getTeacherTopicData", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({
    //                 topicName: name,
    //                 subjectName: "Chemistry",
    //                 year: 2025,
    //                 className: "Form 1",
    //             }),
    //         });

    //         const result = await response.json();
    //         console.log(result);
    //         if (result.message && result.topics) {
    //             setTopicData(result);
    //             console.log("Hi");
    //         }
    //     } catch (error) {
    //         console.error("Error fetching topic data:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    if (!session) {
        return <p>Loading...</p>;
    } else if (session.user.role === "teacher") {
        return (
            <>
                <MobileNavbar />
                <SubjectHome name={`${session.user.firstname} ${session.user.lastname}`} />

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
