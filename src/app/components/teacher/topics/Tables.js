// import React from "react";

// const TopicTable = ({ topics, role, subjectName, year, className }) => {
//   console.log(topics);

//   function getGrade(assignment, test, quiz) {
//     const average = (assignment + test + quiz) / 3;
//     if (average >= 90) {
//       return "A*";
//     } else if (average >= 80) {
//       return "A";
//     } else if (average >= 70) {
//       return "B";
//     } else if (average >= 60) {
//       return "C";
//     } else if (average >= 50) {
//       return "D";
//     } else {
//       return "F";
//     }
//   }

//   return (
//     <div class="overflow-x-auto combination  my-5 rounded-md p-3">
//       <table class="table w-full bg-slate-400  rounded-md">
//         <thead className="rounded-t-md">
//           <tr class="bg-slate-300 rounded-t-md">
//             <th class="lg:px-3 text-center py-3 text-lg font-bold text-cyan-950 ">
//               Name
//             </th>
//             <th class="lg:px-3 text-center py-3 text-lg font-bold text-cyan-950 ">
//               Progress
//             </th>
//             <th class="lg:px-3 text-center py-3 text-lg font-bold text-cyan-950 ">
//               Status
//             </th>
//             <th class="lg:px-3 text-center py-3 text-lg font-bold text-cyan-950 ">
//               Average Assignment
//             </th>
//             <th class="lg:px-3 text-center py-3 text-lg font-bold text-cyan-950 ">
//               Average Test
//             </th>
//             <th class="lg:px-3 text-center py-3 text-lg font-bold text-cyan-950 ">
//               Average Quiz
//             </th>
//             <th class="lg:px-3 text-center py-3 text-lg font-bold text-cyan-950 ">
//               Grade
//             </th>
//             <th class="lg:px-3 text-center py-3 text-lg font-bold text-cyan-950 ">
//               Link
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {topics.map((topic, index) => {
//             const grade = getGrade(
//               topic.averageAssignment,
//               topic.averageTest,
//               topic.averageQuiz
//             );
//             return (
//               <tr class="border-b border-gray-200 text-cyan-950 ">
//                 <td class="lg:px-3 text-center py-4 text-lg">{topic.name}</td>
//                 <td class="lg:px-3 text-center py-4 text-lg">
//                   {topic.progress}
//                 </td>
//                 <td class="lg:px-3 text-center py-4 text-lg">{topic.status}</td>
//                 <td class="lg:px-3 text-center py-4 text-lg">
//                   {Math.round(topic.averageAssignment)}
//                 </td>
//                 <td class="lg:px-3 text-center py-4 text-lg">
//                   {Math.round(topic.averageTest)}
//                 </td>
//                 <td class="lg:px-3 text-center py-4 text-lg">
//                   {Math.round(topic.averageQuiz)}
//                 </td>
//                 <td class="lg:px-3 text-center py-4 text-lg">{grade}</td>
//                 <td class="lg:px-3 text-center py-4 text-lg">
//                   <a
//                     href={`${
//                       role === "admin"
//                         ? `/dashboard/admin/topics/${topic.name}`
//                         : `/dashboard/teacher/course/${topic.name}/${year}/${className}/${subjectName}`
//                     }`}
//                   >
//                     View Topic
//                   </a>
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default TopicTable;
