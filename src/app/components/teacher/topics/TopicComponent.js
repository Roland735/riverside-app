// "use client";
// import React, { useEffect, useState, useMemo } from "react";
// import { useTable, useSortBy, useFilters, useGlobalFilter } from "react-table";
// import {
//   ResponsiveContainer,
//   ScatterChart,
//   Scatter,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   RadialBarChart,
//   RadialBar,
// } from "recharts";
// import {
//   BsFillInfoCircleFill,
//   BsClockFill,
//   BsCalendarFill,
//   BsPersonFill,
// } from "react-icons/bs";
// import { FaUserAlt } from "react-icons/fa";
// import { motion } from "framer-motion";
// import Image from "next/image";

// const TopicComponent = (topicData) => {
//   console.log(topicData);
//   const [isClient, setIsClient] = useState(false);

//   const data = topicData.topicData.topics[0].data.map((item) => ({
//     ...item,
//     uv: parseFloat(item.uv.toFixed(2)),
//   }));

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const day = String(date.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   };

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   const columns = useMemo(
//     () => [
//       {
//         Header: "Student",
//         accessor: "student",
//       },
//       {
//         Header: "Assignment Average",
//         accessor: "assignmentAverage",
//       },
//       {
//         Header: "Test Average",
//         accessor: "testAverage",
//       },
//       {
//         Header: "Overall Average",
//         accessor: "overallAverage",
//       },
//     ],
//     []
//   );

//   const tableData = useMemo(
//     () =>
//       topicData.topicData.topics[0].studentMarks.overallAverage.map(
//         (student) => ({
//           student: student.student,
//           assignmentAverage:
//             topicData.topicData.topics[0].studentMarks.assignmentAverage.find(
//               (item) => item.student === student.student
//             )?.average,
//           testAverage:
//             topicData.topicData.topics[0].studentMarks.testAverage.find(
//               (item) => item.student === student.student
//             )?.average,
//           overallAverage: student.average,
//         })
//       ),
//     [topicData]
//   );

//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     rows,
//     prepareRow,
//     state,
//     setGlobalFilter,
//   } = useTable(
//     {
//       columns,
//       data: tableData,
//     },
//     useFilters,
//     useGlobalFilter,
//     useSortBy
//   );

//   const { globalFilter } = state;

//   if (topicData) {
//     return (
//       <div className="container mx-auto my-7">
//         {/* Existing component code... */}
//         <div className="flex flex-col lg:flex-row justify-between items-stretch mb-8">
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.5 }}
//             className="flex-1 bg-slate-800 p-6 rounded-lg shadow-md"
//             style={{ minHeight: "fit-content" }}
//           >
//             <div className="flex my-2 items-start mb-4">
//               <BsFillInfoCircleFill className="text-cyan-100 mr-2" size={24} />
//               <h2 className="text-xl font-semibold text-cyan-50">
//                 Topic Status: In Progress
//               </h2>
//             </div>
//             <div className="flex my-2 items-start mb-4">
//               <BsClockFill className="text-cyan-100 mr-2" size={24} />
//               <h3 className="text-xl text-cyan-100 ">
//                 Title: {topicData.topicData.topics[0].title}
//               </h3>
//             </div>
//             <div className="flex my-2 items-start mb-4">
//               <BsCalendarFill className="text-cyan-100 mr-2" size={24} />
//               <p className="text-lg text-cyan-100">
//                 Schedule: {topicData.topicData.topics[0].scheduleNumber}
//               </p>
//             </div>
//             <div className="flex my-2 items-start mb-4">
//               <FaUserAlt className="text-cyan-100 mr-2" size={24} />
//               <p className="text-lg text-cyan-100">
//                 Start Date:{" "}
//                 {formatDate(topicData.topicData.topics[0].startDate)}
//               </p>
//             </div>
//             <div className="flex my-2 items-start">
//               <BsFillInfoCircleFill className="text-cyan-100 mr-2" size={24} />
//               <p className="text-lg text-cyan-100">
//                 End Date: {formatDate(topicData.topicData.topics[0].endDate)}
//               </p>
//             </div>
//           </motion.div>
//           <div className="min-h-80 bg-slate-800 p-6 rounded-lg shadow-md flex-1 my-2 lg:flex-2 flex flex-col justify-between items-center lg:mx-4">
//             <h3 className="text-xl font-medium text-cyan-100 ">
//               {" "}
//               Class Averages
//             </h3>
//             <ResponsiveContainer width="100%" height={400}>
//               <RadialBarChart
//                 cx="50%"
//                 cy="50%"
//                 innerRadius="10%"
//                 outerRadius="80%"
//                 barSize={10}
//                 data={data}
//               >
//                 <RadialBar
//                   minAngle={15}
//                   label={{ position: " insideTopRight", fill: "#fff" }}
//                   background
//                   clockWise
//                   dataKey="uv"
//                 />
//                 <Legend
//                   iconSize={10}
//                   layout="vertical"
//                   verticalAlign="top"
//                   align="top"
//                   margin={(0, 200, 0, 0)}
//                 // wrapperStyle={style}
//                 />
//               </RadialBarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 1 }}
//           className="flex-1 grid grid-cols-1  md:grid-cols-2 gap-x-5 mb-8 "
//         >
//           <div className="p-6 rounded-lg shadow-md bg-slate-800 border-2 border-cyan-100 my-3">
//             <h3 className="text-xl font-semibold mb-4 text-cyan-50">
//               Top Test Mark
//             </h3>
//             {topicData.topicData.topics[0].highestTestMark ? (
//               <div className="">
//                 {" "}
//                 {topicData.topicData.topics[0].highestTestMark.student && (
//                   <>
//                     <div className="w-full flex justify-center items-center">
//                       {topicData.topicData.topics[0].highestTestMark
//                         .profilePicture ? (
//                         <div className="relative h-20 w-20 rounded-full border-emerald-600 border-2 my-2 ">
//                           <Image
//                             src={
//                               topicData.topicData.topics[0].highestTestMark
//                                 .profilePicture
//                             }
//                             fill
//                             className="rounded-full"
//                             alt="student"
//                           />
//                         </div>
//                       ) : (
//                         <BsPersonFill
//                           className="text-cyan-100 h-20 w-20 rounded-full border-emerald-600 border-2 my-2"
//                           size={80}
//                         />
//                       )}
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <p className="text-lg text-gray-200">
//                         Student:{" "}
//                         {topicData.topicData.topics[0].highestTestMark.student}
//                       </p>
//                       <p className="text-lg text-gray-200">
//                         {topicData.topicData.topics[0].highestTestMark.mark.toFixed(
//                           2
//                         )}
//                       </p>
//                     </div>
//                   </>
//                 )}
//               </div>
//             ) : (
//               <></>
//             )}
//           </div>
//           <div className="p-6 rounded-lg shadow-md bg-slate-800 border-2 border-cyan-100 my-3">
//             <h3 className="text-xl font-semibold mb-4 text-cyan-50">
//               Lowest Test Mark
//             </h3>
//             {topicData.topicData.topics[0].lowestTestMark ? (
//               <div className="">
//                 {topicData.topicData.topics[0].lowestTestMark.student && (
//                   <>
//                     <div className="w-full flex justify-center items-center">
//                       {topicData.topicData.topics[0].lowestTestMark
//                         .profilePicture ? (
//                         <div className="relative h-20 w-20 rounded-full border-emerald-600 border-2 my-2 ">
//                           <Image
//                             src={
//                               topicData.topicData.topics[0].lowestTestMark
//                                 .profilePicture
//                             }
//                             fill
//                             className="rounded-full"
//                             alt="student"
//                           />
//                         </div>
//                       ) : (
//                         <BsPersonFill
//                           className="text-cyan-100 h-20 w-20 rounded-full border-emerald-600 border-2 my-2"
//                           size={80}
//                         />
//                       )}
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <p className="text-lg text-gray-200">
//                         Student:{" "}
//                         {topicData.topicData.topics[0].lowestTestMark.student}
//                       </p>
//                       <p className="text-lg text-gray-200">
//                         {topicData.topicData.topics[0].lowestTestMark.mark.toFixed(
//                           2
//                         )}
//                       </p>
//                     </div>
//                   </>
//                 )}{" "}
//               </div>
//             ) : (
//               <></>
//             )}
//           </div>
//           <div className="p-6 rounded-lg shadow-md bg-slate-800 border-2 border-cyan-100 my-3">
//             <h3 className="text-xl font-semibold mb-4 text-cyan-50">
//               Top Assignment Mark
//             </h3>
//             {topicData.topicData.topics[0].topAssignmentMark ? (
//               <div className="">
//                 {topicData.topicData.topics[0].topAssignmentMark.student && (
//                   <>
//                     <div className="w-full flex justify-center items-center">
//                       {topicData.topicData.topics[0].topAssignmentMark
//                         .profilePicture ? (
//                         <div className="relative h-20 w-20 rounded-full border-emerald-600 border-2 my-2 ">
//                           <Image
//                             src={
//                               topicData.topicData.topics[0].topAssignmentMark
//                                 .profilePicture
//                             }
//                             fill
//                             className="rounded-full"
//                             alt="student"
//                           />
//                         </div>
//                       ) : (
//                         <BsPersonFill
//                           className="text-cyan-100 h-20 w-20 rounded-full border-emerald-600 border-2 my-2"
//                           size={80}
//                         />
//                       )}
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <p className="text-lg text-gray-200">
//                         Student:{" "}
//                         {
//                           topicData.topicData.topics[0].topAssignmentMark
//                             .student
//                         }
//                       </p>
//                       <p className="text-lg text-gray-200">
//                         {topicData.topicData.topics[0].topAssignmentMark.mark.toFixed(
//                           2
//                         )}
//                       </p>
//                     </div>
//                   </>
//                 )}{" "}
//               </div>
//             ) : (
//               <></>
//             )}
//           </div>
//           <div className="p-6 rounded-lg shadow-md bg-slate-800 border-2 border-cyan-100 my-3">
//             <h3 className="text-xl font-semibold mb-4 text-cyan-50">
//               Lowest Assignment Mark
//             </h3>
//             <div className="w-full flex justify-center items-center">
//               {topicData.topicData.topics[0].lowestAssignmentMark
//                 .profilePicture ? (
//                 <div className="relative h-20 w-20 rounded-full border-emerald-600 border-2 my-2 ">
//                   <Image
//                     src={
//                       topicData.topicData.topics[0].lowestAssignmentMark
//                         .profilePicture
//                     }
//                     fill
//                     className="rounded-full"
//                     alt="student"
//                   />
//                 </div>
//               ) : (
//                 <BsPersonFill
//                   className="text-cyan-100 h-20 w-20 rounded-full border-emerald-600 border-2 my-2"
//                   size={80}
//                 />
//               )}
//             </div>
//             <div className="flex items-center justify-between">
//               <p className="text-lg text-gray-200">
//                 Student:{" "}
//                 {topicData.topicData.topics[0].lowestAssignmentMark.student}
//               </p>
//               <p className="text-lg text-gray-200">
//                 {topicData.topicData.topics[0].lowestAssignmentMark.mark.toFixed(
//                   2
//                 )}
//               </p>
//             </div>
//           </div>
//         </motion.div>

//         <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8 bg-slate-800 border-2 border-cyan-100 rounded-lg shadow-md p-6">
//           {isClient && (
//             <>
//               <motion.div
//                 initial={{ x: -100, opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 transition={{ delay: 0.2 }}
//                 className="bg-cyan-950 p-6 rounded-lg shadow-md flex-1"
//               >
//                 <h3 className="text-xl font-semibold text-cyan-50 text-center mb-4">
//                   Assignments
//                 </h3>
//                 <div className="flex items-center justify-center ">
//                   <ScatterChart width={500} height={350}>
//                     <CartesianGrid />
//                     <XAxis
//                       type="number"
//                       dataKey="average"
//                       name="Assignment Average"
//                       stroke="#ffffff"
//                     />
//                     <YAxis
//                       type="category"
//                       dataKey="student"
//                       width={100}
//                       name="Student"
//                       stroke="#ffffff"
//                     />
//                     <Tooltip cursor={{ strokeDasharray: "3 3" }} />
//                     <Legend />
//                     <Scatter
//                       name="Average"
//                       data={
//                         topicData.topicData.topics[0].studentMarks
//                           .assignmentAverage
//                       }
//                       fill="#8884d8"
//                     />
//                   </ScatterChart>
//                 </div>
//               </motion.div>

//               <motion.div
//                 initial={{ x: 100, opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 transition={{ delay: 0.2 }}
//                 className="bg-cyan-950 p-6 rounded-lg shadow-md flex-1"
//               >
//                 <h3 className="text-xl font-semibold text-cyan-50 text-center mb-4">
//                   Tests
//                 </h3>
//                 <div className="flex items-center justify-center ">
//                   <ScatterChart width={500} height={350}>
//                     <CartesianGrid />
//                     <XAxis
//                       type="number"
//                       dataKey="average"
//                       name="Test Average"
//                       stroke="#ffffff"
//                     />
//                     <YAxis
//                       type="category"
//                       dataKey="student"
//                       width={100}
//                       name="Student"
//                       stroke="#ffffff"
//                     />
//                     <Tooltip cursor={{ strokeDasharray: "3 3" }} />
//                     <Legend />
//                     <Scatter
//                       name="Average"
//                       data={
//                         topicData.topicData.topics[0].studentMarks.testAverage
//                       }
//                       fill="#82ca9d"
//                     />
//                   </ScatterChart>
//                 </div>
//               </motion.div>
//             </>
//           )}
//         </div>

//         {/* Existing component code... */}

//         <div className="bg-slate-800 border-2 border-cyan-100 rounded-lg shadow-md p-6 mb-8">
//           <h2 className="text-xl font-semibold text-cyan-50 mb-4">
//             Student Marks
//           </h2>
//           <input
//             value={globalFilter || ""}
//             onChange={(e) => setGlobalFilter(e.target.value)}
//             placeholder="Search students"
//             className="p-2 mb-4 border rounded w-full"
//           />
//           <table
//             {...getTableProps()}
//             className="min-w-full bg-cyan-950 text-cyan-50"
//           >
//             <thead>
//               {/* {headerGroups.map((headerGroup) => (
//                 <tr {...headerGroup.getHeaderGroupProps()}>
//                   {headerGroup.headers.map((column) => (
//                     <th
//                       {...column.getHeaderProps(column.getSortByToggleProps())}
//                       className="p-2 border-b border-cyan-100"
//                     >
//                       {column.render("Header")}
//                       <span>
//                         {column.isSorted
//                           ? column.isSortedDesc
//                             ? " 🔽"
//                             : " 🔼"
//                           : ""}
//                       </span>
//                     </th>
//                   ))}
//                 </tr>
//               ))} */}
//             </thead>
//             <tbody {...getTableBodyProps()}>
//               {rows.map((row) => {
//                 prepareRow(row);
//                 return (
//                   <tr {...row.getRowProps()}>
//                     {row.cells.map((cell) => (
//                       <td
//                         {...cell.getCellProps()}
//                         className="p-2 border-b border-cyan-100 text-center"
//                       >
//                         {cell.render("Cell")}
//                       </td>
//                     ))}
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>

//         {/* Existing component code... */}
//       </div>
//     );
//   } else {
//     return <div>Loading...</div>;
//   }
// };

// export default TopicComponent;
