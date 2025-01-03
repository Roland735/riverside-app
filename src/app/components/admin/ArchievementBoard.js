"use client";
import React, { useState, useEffect } from "react";
import { FaStar, FaTrophy, FaChartLine } from "react-icons/fa";
import StudentBoardCard from "./StudentBoardCard";

const studentData = [
  {
    name: "Alice Williams",
    picture: "/../Roland.jpg", // Replace with actual image URL
    averageMark: 98,
    improvement: 15,
    sports: true,
    disciplinaryPoints: 0,
  },
  {
    name: "Bob Johnson",
    picture: "https://example.com/bob.jpg", // Replace with actual image URL
    averageMark: 87,
    improvement: 8,
    sports: false,
    disciplinaryPoints: 3,
  },
  {
    name: "Charlie Miller",
    picture: "https://example.com/charlie.jpg", // Replace with actual image URL
    averageMark: 92,
    improvement: 12,
    sports: true,
    disciplinaryPoints: 1,
  },
  {
    name: "Diana Smith",
    picture: "./Roland.jpg", // Replace with actual image URL
    averageMark: 85,
    improvement: 7,
    sports: false,
    disciplinaryPoints: 2,
  },
  {
    name: "Ethan Lee",
    picture: "https://example.com/ethan.jpg", // Replace with actual image URL
    averageMark: 90,
    improvement: 10,
    sports: true,
    disciplinaryPoints: 5,
  },
];

function ArchievementBoard() {
  const [bestStudent, setBestStudent] = useState(null);
  const [mostImproved, setMostImproved] = useState(null);
  const [bestSports, setBestSports] = useState(null);
  const [mostDisciplined, setMostDisciplined] = useState(null);

  useEffect(() => {
    // Replace this with your actual logic to calculate and determine the best students
    const sortedByAverage = studentData.sort(
      (a, b) => b.averageMark - a.averageMark
    );
    const sortedByImprovement = studentData.sort(
      (a, b) => b.improvement - a.improvement
    );

    setBestStudent(sortedByAverage[0]);
    setMostImproved(sortedByImprovement[0]);

    // Find the best student in sports based on your criteria (e.g., most points, awards)
    setBestSports(studentData.find((student) => student.sports));

    // Find the most disciplined student based on your criteria (e.g., least disciplinary points)
    setMostDisciplined(
      studentData.sort((a, b) => a.disciplinaryPoints - b.disciplinaryPoints)[0]
    );
  }, []);

  return (
    <div className="min-h-28 w-full  dark:bg-slate-950 md:my-4 my-1 py-2 visuals border-emerald-600 rounded-md flex flex-wrap items-center justify-center ">
      <StudentBoardCard
        title="Best Student"
        name={bestStudent?.name}
        picture={bestStudent?.picture}
        value={bestStudent?.averageMark}
        icon={<FaStar />}
      />
      <StudentBoardCard
        title="Most Improved"
        name={mostImproved?.name}
        picture={mostImproved?.picture}
        value={mostImproved?.improvement}
        icon={<FaChartLine />}
        isPercentage
      />
      <StudentBoardCard
        title="Best in Sports"
        name={bestSports?.name}
        picture={bestSports?.picture}
        value={bestSports?.averageMark}
        icon={<FaTrophy />}
      />
      <StudentBoardCard
        title="Most Disciplined"
        name={mostDisciplined?.name}
        picture={mostDisciplined?.picture}
        value={mostDisciplined?.disciplinaryPoints}
        icon={<FaStar />}
      />
    </div>
  );
}

export default ArchievementBoard;
