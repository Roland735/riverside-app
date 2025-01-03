// // SubjectTopicsTable.js


// import React from 'react';

// const SubjectTopicsTable = ({ studentSubjectPerformanceData }) => {
//     console.log(studentSubjectPerformanceData);

//     return (
//         <div className="bg-slate-300 dark:bg-slate-700 text-cyan-950 dark:text-slate-300  p-4 rounded-lg shadow-md">
//             <h2 className="text-xl font-bold mb-4">Subject Topics Overview</h2>
//             <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                         <tr>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                 Topic Name
//                             </th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                 Schedule Number
//                             </th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                 Test Score
//                             </th>
//                             {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                 Quiz Score
//                             </th> */}
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                 Assignment Score
//                             </th>
//                             {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                 Overall Average Mark
//                             </th> */}
//                         </tr>
//                     </thead>
//                     <tbody className="bg-slate-100 dark:bg-slate-700 text-cyan-950 dark:text-slate-300 divide-y divide-gray-200">
//                         {studentSubjectPerformanceData.map((topic, index) => (
//                             <tr key={index}>
//                                 <td className="px-6 py-4 whitespace-nowrap">
//                                     <div className="text-sm font-medium text-gray-900">{topic.title}</div>
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap">
//                                     <div className="text-sm text-gray-900">{topic.scheduleNumber}</div>
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap">
//                                     {
//                                         topic.tests.map((test, testIndex) => {
//                                             if (test && test.score !== null) {
//                                                 return (
//                                                     <td className="px-6 py-4 whitespace-nowrap">
//                                                         <div key={testIndex} className="text-sm text-gray-900">{test.score}</div>
//                                                     </td>
//                                                 );
//                                             }
//                                         }

//                                         )
//                                     }
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap">
//                                     {
//                                         topic.assignments.map((assignments, assignmentsIndex) => {
//                                             if (assignments && assignments.score !== null) {
//                                                 return (
//                                                     <td className="px-6 py-4 whitespace-nowrap">
//                                                         <div key={assignmentsIndex} className="text-sm text-gray-900">{assignments.score}</div>
//                                                     </td>
//                                                 );
//                                             }
//                                         }

//                                         )
//                                     }
//                                 </td>

//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// // Helper function to calculate average
// const calculateAverage = (items) => {
//     console.log(items);

//     if (items.score) {
//         const totalScore = items.reduce((acc, item) => acc + item.score, 0);
//         return (totalScore / items.length).toFixed(2);
//     }

// };

// // Helper function to calculate overall average for a topic
// const calculateOverallAverage = (topic) => {
//     const totalTests = calculateAverage(topic.tests);
//     const totalQuizzes = calculateAverage(topic.assignments);
//     const overallAverage = (parseFloat(totalTests) + parseFloat(totalQuizzes)) / 2;
//     return overallAverage.toFixed(2);
// };

// export default SubjectTopicsTable;
