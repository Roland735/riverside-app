import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Loading from "../../Universal/loader";

export default function Example() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/stackedBarChartData"); // Replace '12345' with the actual student ID
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const { data } = await response.json();

        console.log("data", data);

        if (typeof data === "object" && !Array.isArray(data)) {
          const dataArray = Object.entries(data).map(([key, value]) => ({
            name: key,
            average: value,
          }));
          setChartData(dataArray);
          console.log("Fetched data:", dataArray);
        } else {
          console.error("Invalid data format:", data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // if (chartData.length === 0) {
  //   return (
  //     <div className=" flex justify-center items-center h-screen text-cyan-500">
  //       <span>No Data yet</span>
  //     </div>
  //   );
  // }
  console.log(chartData);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
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
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="average" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}
