import { useState, useEffect } from "react";
import Card from "./AssessmentAverage";
import OverallAverageCard from "./OverallAverageCard";
import SubjectLineChart from "./SubjectLineChart";
import SubmissionRateCard from "./SubmissionRateCard";
import AttendanceRateCard from "./AttendanceRateCard";
import DetentionCard from "./DetentionCard";
import RadarChartComponent from "./RadarChartComponent";

export default function Home({ session, userRole, selectedStudent }) {
  console.log(session);

  const [subjectData, setSubjectData] = useState([]);
  const [radarData, setRadarData] = useState([]);
  const [submissionRate, setSubmissionRate] = useState(0);
  const [attendanceRate, setAttendanceRate] = useState(0);
  const [detentionCount, setDetentionCount] = useState(0);
  const [averages, setAverages] = useState({
    assignment: { average: 0, change: 0 },
    test: { average: 0, change: 0 },
    quiz: { average: 0, change: 0 },
  });

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("Fetching data...", userRole);

        const response = await fetch("/api/studenthome", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            regNumber:
              userRole === "parent"
                ? session[0].regNumber
                : session.user.regNumber,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        console.log(data);

        setSubjectData(data.subjectData || []);
        setRadarData(data.radarData || []);
        setSubmissionRate(data.submissionRate || 0);
        setAttendanceRate(data.attendanceRate || 0);
        setDetentionCount(data.detentionCount || 0);
        setAverages(
          data.averages || {
            assignment: { average: 0, change: 0 },
            test: { average: 0, change: 0 },
            quiz: { average: 0, change: 0 },
          }
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [selectedStudent, session, userRole]); // Now it refreshes when selectedStudent, session, or userRole changes

  // Overall average data (mocked for demonstration)
  const overallAverage = 85;
  const overallChange = -5;
  const overallGrade = "A";

  // Submission rate change (mocked for demonstration)
  const submissionRateChange = +2;

  // Attendance rate change (mocked for demonstration)
  const attendanceRateChange = +1;

  // Detention change (mocked for demonstration)
  const detentionChange = -1;

  return (
    <div className="bg-slate-100 dark:bg-slate-700 w-full min-h-screen dark:text-white">
      <main className="max-w-7xl mx-auto p-8">
        <h1 className="text-3xl font-semibold mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <SubmissionRateCard
            rate={submissionRate}
            change={submissionRateChange}
          />
          <AttendanceRateCard
            rate={attendanceRate}
            change={attendanceRateChange}
          />
          <DetentionCard count={detentionCount} change={detentionChange} />
          <Card
            title="Assignment"
            average={Math.round(averages.assignment.average)}
            change={averages.assignment.change}
          />
          <Card
            title="Test"
            average={Math.round(averages.test.average)}
            change={averages.test.change}
          />
          <Card
            title="Quiz"
            average={Math.round(averages.quiz.average)}
            change={averages.quiz.change}
          />
          <div className="md:col-span-3">
            <OverallAverageCard
              average={overallAverage}
              change={overallChange}
              grade={overallGrade}
            />
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Subject Average Marks</h2>
          <SubjectLineChart data={subjectData} />
        </div>
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-1">
          <div className="min-w-[70vh]">
            <RadarChartComponent
              title="Assignments"
              data={radarData}
              dataKey="A"
            />
          </div>
          <div className="min-w-[70vh]">
            <RadarChartComponent title="Tests" data={radarData} dataKey="B" />
          </div>
          <div className="min-w-[70vh]">
            <RadarChartComponent
              title="Exams"
              data={radarData}
              dataKey="fullMark"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
