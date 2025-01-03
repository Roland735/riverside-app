"use client";
import { getSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import TeacherLayout from "@/app/components/Universal/TeacherLayout";
import MobileNavbar from "@/app/components/Universal/MobileNavbar";
import { useRouter } from "next/navigation";
import SubjectAnalysis from "./SubjectComponent";


// Existing imports...

function TopicPage({ params }) {
    const router = useRouter();
    const topicName = params.topicName;

    const [session, setSession] = useState(null);
    const [topicData, setTopicData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getSessionData() {
            const session = await getSession();
            setSession(session);
        }
        getSessionData();

        if (topicName) {
            fetchTopicData(topicName);
        }
    }, [topicName]);

    const fetchTopicData = async (name) => {
        try {
            const response = await fetch("/api/getTeacherTopicData", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    subjectName: "Geo",
                    year: 2025,
                    className: "Form 1",
                }),
            });

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
    } else if (session.user.role === "teacher") {
        return (
            <

                >
                <MobileNavbar />
                {/* {loading ? (
                    <p>Loading...</p>
                ) : ( */}
                <SubjectAnalysis />

                {/* // ) : (
                    //     <p>
                    //         No topic found with the name {topicName}. Please go back and try
                    //         again.
                    //     </p>
                    // )} */}
                < button
                    onClick={() =>
                        signOut({ redirect: true, callbackUrl: "/auth/login" })
                    }
                >
                    Logout
                </button>
            </ >
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
