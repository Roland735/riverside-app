import React, { PureComponent } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

class CustomBarChart extends PureComponent {
  render() {
    const { data } = this.props;
    console.log("data", data);

    // Group data by class
    const classes = data.reduce((acc, subject) => {
      const className = subject.className;
      acc[className] = acc[className] || [];
      acc[className].push(subject);
      return acc;
    }, {});

    const classesWithGraphs = [];
    const classesWithTable = [];

    // Separate data for graphs and table
    Object.keys(classes).forEach((className) => {
      const classData = classes[className];
      if (classData.some((subject) => subject.topics.length > 0)) {
        classesWithGraphs.push(classData);
      } else {
        classesWithTable.push(className);
      }
    });

    return (
      <div>
        <section className="my-5">
          <h2 className="text-cyan-950 dark:text-cyan-50 text-xl border-b-2 border-sky-400 w-full my-3">
            Subject Averages
          </h2>
          <div className="flex flex-col xl:flex-row justify-between">
            {classesWithGraphs.map((classData) => (
              <div
                key={classData[0].className}
                className="dark:bg-cyan-950 bg-slate-200 shadow-2xl my-3 xl:w-5/12 rounded-md px-3 py-2 relative"
              >
                <h2 className="dark:text-cyan-200 text-cyan-950 text-xl my-3">
                  {classData[0].className}
                </h2>
                {classData.map((subject) => {
                  const averageMarks = subject.topics
                    .filter(
                      (topic) =>
                        topic.assignmentAverage !== undefined &&
                        topic.testAverage !== undefined
                    )
                    .map((topic) => ({
                      title: topic.title,
                      averageMark:
                        (topic.assignmentAverage + topic.testAverage) / 2,
                    }))
                    .filter((topic) => topic.averageMark !== 0);

                  const overallAverage =
                    averageMarks.reduce(
                      (acc, curr) => acc + curr.averageMark,
                      0
                    ) / averageMarks.length || 0;

                  return averageMarks.length > 0 ? (
                    <div key={subject.subjectName} className="relative">
                      <h3 className="dark:text-cyan-200 text-cyan-950 text-lg my-2">
                        {subject.subjectName}
                      </h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart
                          data={averageMarks}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="title" />
                          <YAxis />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="averageMark"
                            stroke="#8884d8"
                            fill="#8884d8"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                      <div className=" bottom-0 right-0 text-cyan-50 m-2 p-2 bg-cyan-700 rounded">
                        Average: {overallAverage.toFixed(2)}%
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            ))}
          </div>
        </section>

        <section className="my-5">
          {classesWithGraphs.length > 0 && (
            <h2 className="text-cyan-950 dark:text-cyan-50 text-xl border-b-2 border-sky-400 my-3">
              Topic Test and Assignment Averages
            </h2>
          )}
          <div className="flex flex-col xl:flex-row justify-between">
            {classesWithGraphs.map((classData) => {
              const filteredData = classData.flatMap((subject) =>
                subject.topics
                  .filter(
                    (topic) =>
                      topic.assignmentAverage !== 0 && topic.testAverage !== 0
                  )
                  .map((topic) => ({
                    subject: subject.subjectName,
                    title: topic.title,
                    assignmentAverage: topic.assignmentAverage,
                    testAverage: topic.testAverage,
                  }))
              );

              const testAverage =
                filteredData.reduce((acc, item) => acc + item.testAverage, 0) /
                  filteredData.length || 0;

              const assignmentAverage =
                filteredData.reduce(
                  (acc, item) => acc + item.assignmentAverage,
                  0
                ) / filteredData.length || 0;

              return (
                <div
                  key={classData[0].className}
                  className=" bg-slate-200 shadow-2xl my-3 xl:w-5/12 rounded-md px-3 py-2 relative"
                >
                  <h2 className="text-cyan-950 dark:text-cyan-50 text-xl my-3">
                    {classData[0].className}
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={filteredData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="title" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="assignmentAverage"
                        name={`Assignments ${assignmentAverage.toFixed(2)}%`}
                        fill="#8884d8"
                        stroke="#4c4c9d"
                        strokeWidth={2}
                        radius={[10, 10, 0, 0]}
                      />
                      <Bar
                        dataKey="testAverage"
                        name={`Test ${testAverage.toFixed(2)}%`}
                        fill="#82ca9d"
                        stroke="#3c8b5d"
                        strokeWidth={2}
                        radius={[10, 10, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              );
            })}
          </div>
        </section>

        <section className="my-5">
          {classesWithTable.length > 0 && (
            <h2 className="text-cyan-950 dark:text-cyan-50 text-xl border-b-2 border-cyan-700 my-3">
              Classes with No Data (Displayed in Table)
            </h2>
          )}
          {classesWithTable.length > 0 && (
            <table className="table-auto w-1/4 text-cyan-950 dark:text-cyan-50 border-4 rounded-xl bg-cyan-600 my-3 border-cyan-900">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b border-gray-200 text-left font-medium text-gray-900 dark:text-gray-300 rounded-t-xl">
                    Class Name
                  </th>
                </tr>
              </thead>
              <tbody>
                {classesWithTable.map((className, index) => (
                  <tr key={className}>
                    <td
                      className={`px-6 py-4 border-b border-gray-200 ${
                        index === classesWithTable.length - 1
                          ? "rounded-b-xl"
                          : ""
                      }`}
                    >
                      {className}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    );
  }
}

export default CustomBarChart;
