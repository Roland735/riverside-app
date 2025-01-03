// import { useState } from "react";
// import { FaChevronDown, FaChevronUp } from "react-icons/fa";
// import { toast } from "react-toastify";

// const SyllabusAccordion = ({ data }) => {
//   console.log("data", data);
//   const [title, setTopic] = useState("");
//   const [scheduleNumber, setScheduleNumber] = useState(1);
//   const [duration, setDuration] = useState(1);
//   const [topicList, setTopicList] = useState([]);
//   const [editIndex, setEditIndex] = useState(null); // Track the index of the topic being edited
//   const [errorMessage, setErrorMessage] = useState("");
//   const [selectedClassName, setSelectedClassName] = useState(""); // Track the selected class name
//   const [selectedSubjectName, setSelectedSubjectName] = useState(""); // Track the selected subject name

//   // Track open state for each accordion item
//   const [openAccordionIndex, setOpenAccordionIndex] = useState(-1);

//   const handleAddToPreview = () => {
//     // Validation checks
//     if (!title || !scheduleNumber || !duration) {
//       setErrorMessage("Please provide a topic, schedule number, and duration.");
//       return;
//     }

//     // If editing, update the topic
//     if (editIndex !== null) {
//       const newList = [...topicList];
//       newList[editIndex] = { title, scheduleNumber, duration };
//       setTopicList(newList);
//       setEditIndex(null);
//     } else {
//       // Check for unique schedule number
//       if (topicList.some((item) => item.scheduleNumber === scheduleNumber)) {
//         setErrorMessage("Schedule number must be unique.");
//         return;
//       }
//       // Add new topic to the list
//       setTopicList([...topicList, { title, scheduleNumber, duration }]);
//       // Increment scheduleNumber for the next topic
//       setScheduleNumber(scheduleNumber + 1);
//     }
//     // Clear input fields and error message
//     setTopic("");
//     setDuration(1);
//     setErrorMessage("");
//   };

//   const handleEditTopic = (index) => {
//     // Set input fields with the topic data for editing
//     setTopic(topicList[index].title);
//     setScheduleNumber(topicList[index].scheduleNumber);
//     setDuration(topicList[index].duration);
//     setEditIndex(index);
//   };

//   const handleDeleteTopic = (index) => {
//     // Remove the topic from the list
//     const newList = [...topicList];
//     newList.splice(index, 1);
//     setTopicList(newList);
//   };

//   const handleSubmitToBackend = async () => {
//     // Validation check for empty topic list
//     if (topicList.length === 0) {
//       setErrorMessage("Please add topics before submitting.");
//       return;
//     }

//     try {
//       // Submit topics to backend
//       console.log(selectedClassName, selectedSubjectName);
//       const res = await fetch("/api/updateTopics", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           className: selectedClassName,
//           year: 2025, // Assuming you have a way to get the year
//           subjectName: selectedSubjectName,
//           title: topicList,
//         }),
//       });
//       if (res.ok) {
//         // Clear topic list on successful submission
//         setTopicList([]);
//         toast.success("Topics submitted successfully");
//       } else {
//         toast.error("Failed to submit topics");
//       }
//     } catch (error) {
//       console.error("Error submitting topics:", error);
//       toast.error("Failed to submit topics");
//     }
//   };

//   return (
//     <div className="w-full">
//       {data.map((item, index) =>
//         item.syllabusUpdated ? (
//           <div className=""></div>
//         ) : (
//           <div key={index} className="bg-white shadow-md rounded-lg mb-4">
//             <div
//               className="flex justify-between items-center p-4 transition duration-300 ease-in-out"
//               onClick={() => {
//                 setOpenAccordionIndex(
//                   openAccordionIndex === index ? -1 : index
//                 );
//                 setSelectedClassName(item.className);
//                 setSelectedSubjectName(item.subjects[0]);
//               }}
//             >
//               <h5 className="text-lg font-bold">
//                 {item.className} - {item.subjects[0]}
//               </h5>
//               {openAccordionIndex === index ? (
//                 <FaChevronUp className="text-lg text-gray-500" />
//               ) : (
//                 <FaChevronDown className="text-lg text-gray-500" />
//               )}
//             </div>
//             {openAccordionIndex === index && ( // Render content if accordion is open
//               <div
//                 className="p-4 rounded-none section-bg overflow-hidden transition duration-300 ease-in-out"
//                 style={{
//                   maxHeight: "1000px",
//                 }}
//               >
//                 <div className="flex flex-col space-y-4 my-8">
//                   {errorMessage && (
//                     <div className="text-red-600">{errorMessage}</div>
//                   )}
//                   <h3 className=" text-xl my-8 font-semibold border-b-2 border-cyan-700 text-cyan-900 dark:text-cyan-50">
//                     Add Topics
//                   </h3>
//                   <form
//                     onSubmit={(e) => e.preventDefault()}
//                     className="flex flex-col space-y-4"
//                   >
//                     <label
//                       htmlFor=""
//                       className="text-md font-semibold text-cyan-500 tracking-wider"
//                     >
//                       Topic:
//                     </label>
//                     <input
//                       type="text"
//                       value={title}
//                       onChange={(e) => setTopic(e.target.value)}
//                       placeholder="Enter topic"
//                       className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
//                     />
//                     <label
//                       htmlFor=""
//                       className="text-md font-semibold text-cyan-500 tracking-wider"
//                     >
//                       Schedule Number:
//                     </label>
//                     <input
//                       type="number"
//                       value={scheduleNumber}
//                       onChange={(e) =>
//                         setScheduleNumber(parseInt(e.target.value))
//                       }
//                       placeholder="Enter schedule number"
//                       className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
//                     />
//                     <label
//                       htmlFor=""
//                       className="text-md font-semibold text-cyan-500 tracking-wider"
//                     >
//                       Number of weeks:
//                     </label>
//                     <input
//                       type="number"
//                       value={duration}
//                       onChange={(e) => setDuration(parseInt(e.target.value))}
//                       placeholder="Enter duration (in weeks)"
//                       className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
//                     />
//                     <div className="flex space-x-4">
//                       <button
//                         type="button"
//                         onClick={handleAddToPreview}
//                         className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:bg-blue-600"
//                       >
//                         {editIndex !== null ? "Update" : "Add to Preview"}
//                       </button>
//                     </div>
//                   </form>
//                   <div className="mt-4">
//                     <h3 className="text-lg font-semibold mb-2 dark:text-slate-100 text-cyan-900">
//                       Preview
//                     </h3>
//                     <p className="dark:text-slate-300 text-cyan-700">
//                       Syllabus content will go here
//                     </p>
//                     <ul className="border border-gray-300 rounded-md p-4">
//                       {topicList.map((topicItem, index) => (
//                         <li
//                           key={index}
//                           className="flex items-center justify-between py-2 bg-slate-50 rounded-md px-3 my-3"
//                         >
//                           <div>
//                             <span className="font-semibold">
//                               Schedule {topicItem.scheduleNumber}:
//                             </span>{" "}
//                             <span className="capitalize">
//                               {topicItem.title}
//                             </span>{" "}
//                             (Duration: {topicItem.duration} weeks)
//                           </div>
//                           <div className="flex items-center space-x-2">
//                             <button
//                               onClick={() => handleEditTopic(index)}
//                               className="text-blue-500 hover:text-blue-700 focus:outline-none"
//                             >
//                               Edit
//                             </button>
//                             <button
//                               onClick={() => handleDeleteTopic(index)}
//                               className="text-red-500 hover:text-red-700 focus:outline-none"
//                             >
//                               Delete
//                             </button>
//                           </div>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>

//                 <button
//                   type="button"
//                   onClick={handleSubmitToBackend}
//                   disabled={topicList.length === 0}
//                   className={`bg-green-500 text-white px-4 py-2 my-3 rounded-md hover:bg-green-600 transition-colors focus:outline-none focus:bg-green-600 ${
//                     topicList.length === 0
//                       ? "opacity-50 cursor-not-allowed"
//                       : ""
//                   }`}
//                 >
//                   Update Topics
//                 </button>
//               </div>
//             )}
//           </div>
//         )
//       )}
//     </div>
//   );
// };

// const App = ({ data }) => {
//   return (
//     <div className="container mx-auto p-4">
//       <SyllabusAccordion data={data} />
//     </div>
//   );
// };

// export default App;
