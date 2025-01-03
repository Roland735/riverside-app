import React, { useState, useEffect } from "react";
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

export default function ExamPerformanceGraph() {
  const [subjectAverages, setSubjectAverages] = useState([]);
  const [mean, setMean] = useState(null);
  const [range, setRange] = useState(null);
  const [median, setMedian] = useState(null);
  const [standardDeviation, setStandardDeviation] = useState(null);

  useEffect(() => {
    const fetchSubjectAverages = async () => {
      try {
        const response = await fetch("/api/examgraphs");
        if (!response.ok) {
          throw new Error("Failed to fetch subject averages");
        }
        const { subjectAverages } = await response.json();
        console.log("Fetched subject averages:", subjectAverages);
        setSubjectAverages(subjectAverages);

        // Calculate statistics
        calculateMean(subjectAverages);
        calculateRange(subjectAverages);
        calculateMedian(subjectAverages);
        calculateStandardDeviation(subjectAverages);
      } catch (error) {
        console.error("Error fetching subject averages:", error);
      }
    };
    fetchSubjectAverages();
  }, []);

  const calculateMean = (data) => {
    const sum = data.reduce((acc, subject) => acc + subject.average, 0);
    setMean(sum / data.length);
  };

  const calculateRange = (data) => {
    const min = Math.min(...data.map(subject => subject.average));
    const max = Math.max(...data.map(subject => subject.average));
    setRange(max - min);
  };

  const calculateMedian = (data) => {
    const sortedData = data.map(subject => subject.average).sort((a, b) => a - b);
    const midIndex = Math.floor(sortedData.length / 2);
    if (sortedData.length % 2 === 0) {
      setMedian((sortedData[midIndex - 1] + sortedData[midIndex]) / 2);
    } else {
      setMedian(sortedData[midIndex]);
    }
  };

  const calculateStandardDeviation = (data) => {
    const mean = mean; // Use the calculated mean
    const squaredDifferences = data.map(subject => Math.pow(subject.average - mean, 2));
    const variance = squaredDifferences.reduce((acc, value) => acc + value, 0) / data.length;
    setStandardDeviation(Math.sqrt(variance));
  };

  return (
    <ResponsiveContainer width="90%" height="100%" className={"text-color"}>
      <LineChart
        width={500}
        height={300}
        data={subjectAverages}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="_id" className="text-color" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="highestMark" stroke="#82ca9d" />
        <Line type="monotone" dataKey="average" stroke="#8884d8" />
        <Line type="monotone" dataKey="LowestMark" stroke="#FF9900" dot={false} />
      </LineChart>

      {/* Display calculated statistics */}


      <div className="flex justify-center space-x-4 text-[#333] dark:text-[#fff]">
        <p>Mean: {mean !== null ? mean.toFixed(1) : null}</p>
        <p>Range: {range !== null ? range.toFixed(1) : null}</p>
        <p>Median: {median !== null ? median.toFixed(1) : null}</p>
        <p>Standard Deviation: {standardDeviation !== null ? standardDeviation.toFixed(1) : null}</p>
      </div>
    </ResponsiveContainer>
  );
}
