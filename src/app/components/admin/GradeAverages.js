import React, { PureComponent, useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function GradeAverages() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Fetch data from your API route
    fetch("/api/gradeInfoForAdmin")
      .then((response) => response.json())
      .then((data) => {
        // Manipulate data to fit Recharts format
        const formattedData = [];
        Object.keys(data).forEach((grade) => {
          Object.keys(data[grade]).forEach((subject) => {
            formattedData.push({
              grade: grade,
              name: subject,
              exams: data[grade][subject].exams,
              assignments: data[grade][subject].assignments,
              tests: data[grade][subject].tests,
              quizzes: data[grade][subject].quizzes,
            });
          });
        });
        setChartData(formattedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  console.log("Fetched data:", chartData);
  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%" className={"text-color"}>
        <LineChart
          width={500}
          height={300}
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" className="text-color" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="exams" stroke="#82ca9d" />
          <Line type="monotone" dataKey="assignments" stroke="#8884d8" />
          <Line type="monotone" dataKey="quiz" stroke="#8584d8" />
          <Line type="monotone" dataKey="test" stroke="#8284d8" />
          <Line
            type="monotone"
            dataKey="LowestMark"
            stroke="#FF9900"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
