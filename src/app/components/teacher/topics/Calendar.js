import React, { useState } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import Accordion from "./SubmitAssignmentAccordion";

const TopicCard = ({
  topic,
  startDate,
  endDate,
  assignmentAverage,
  testAverage,
  completed,
  subject,
  assignmentNameP,
  gradeProp,
}) => {
  console.log("topic", topic);
  console.log("UploadAssignments", gradeProp, subject, assignmentNameP);
  const currentDate = new Date();
  let status = "";

  if (completed) {
    status = "Completed";
  } else if (new Date(startDate) > currentDate) {
    status = "Not Started";
  } else if (
    new Date(startDate) <= currentDate &&
    new Date(endDate) >= currentDate
  ) {
    status = "In Progress";
  } else {
    status = "Expired";
  }

  return (
    <div className={`bg-white shadow-md rounded-lg mb-4 px-5 py-3`}>
      <div className="flex justify-between items-center p-4">
        <h5 className="text-lg font-bold">{topic}</h5>

        <p className="text-sm text-gray-600">
          {new Date(startDate).toLocaleDateString()} -{" "}
          {new Date(endDate).toLocaleDateString()}
        </p>
      </div>
      <div className="flex items-center justify-between p-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Assignment Average: {Math.round(assignmentAverage)}%
        </p>
        <p className="text-sm text-gray-600">
          Test Average: {Math.round(testAverage)}%
        </p>
        {completed ? (
          <FaCheckCircle className="text-green-500" />
        ) : (
          <FaTimesCircle className="text-red-500" />
        )}
        <p className="text-sm text-gray-600">{status}</p>
      </div>
      <Accordion
        title={topic}
        gradeProp={gradeProp}
        subject={subject}
        type="assignment"
      ></Accordion>
      <Accordion
        title={topic}
        gradeProp={gradeProp}
        subject={subject}
        type="test"
      ></Accordion>
      <Accordion
        title={topic}
        gradeProp={gradeProp}
        subject={subject}
        type="quiz"
      ></Accordion>
    </div>
  );
};

const Calendar = ({ data }) => {
  console.log(data);
  const [isOpen, setIsOpen] = useState({});

  const handleAccordion = (index) => {
    setIsOpen((prevIsOpen) => ({ ...prevIsOpen, [index]: !prevIsOpen[index] }));
  };

  const currentDate = new Date();

  const calculateProgress = (topics) => {
    const totalTopics = topics.length;
    const completedTopics = topics.filter((topic) => topic.completed).length;
    return totalTopics === 0
      ? 0
      : Math.round((completedTopics / totalTopics) * 100);
  };

  const getStatusClass = (topics) => {
    if (
      topics.some(
        (topic) => !topic.completed && new Date(topic.startDate) > currentDate
      )
    ) {
      return "text-red-500"; // Not on Track
    }
    if (
      topics.some(
        (topic) =>
          !topic.completed &&
          new Date(topic.startDate) <= currentDate &&
          new Date(topic.endDate) >= currentDate
      )
    ) {
      return "text-yellow-500"; // Currently being completed
    }
    return "text-green-500"; // On Track
  };

  return (
    <div className="container  ">
      {data.map((item, index) => {
        const progress = calculateProgress(item.data);
        const statusClass = getStatusClass(item.data);

        return (
          <div key={index} className="bg-white shadow-md rounded-lg mb-4 ">
            {console.log(item)}

            <div
              className={`flex justify-between items-center p-4 transition duration-300 ease-in-out  ${
                item.data.some(
                  (topic) =>
                    !topic.completed && new Date(topic.startDate) > currentDate
                )
                  ? "not-in-track"
                  : ""
              }`}
              onClick={() => handleAccordion(index)}
            >
              <h5 className="text-lg font-bold">
                {item.subject} - {item.class}
                {item.data.length === 0
                  ? " (No topics yet)"
                  : item.data.some(
                      (topic) =>
                        !topic.completed &&
                        new Date(topic.startDate) > currentDate
                    )
                  ? " (Not on Track)"
                  : ""}
                <span className={`text-sm ml-2 ${statusClass}`}>
                  ({progress}%)
                </span>
              </h5>
              {isOpen[index] ? (
                <FaChevronUp className="text-lg text-gray-500" />
              ) : (
                <FaChevronDown className="text-lg text-gray-500" />
              )}
            </div>
            {isOpen[index] && (
              <div
                className="p-4 dark:bg-slate-700 overflow-hidden transition duration-300 ease-in-out"
                style={{ maxHeight: isOpen[index] ? "100000vh" : "0" }}
              >
                {item.data.length === 0 ? (
                  <p className="text-sm text-gray-600">No topics yet.</p>
                ) : (
                  item.data.map((topic) => (
                    <TopicCard
                      key={topic._id}
                      topic={topic.title}
                      startDate={topic.startDate}
                      endDate={topic.endDate}
                      assignmentAverage={topic.assignmentAverage}
                      testAverage={topic.testAverage}
                      completed={topic.completed}
                      subject={item.subject}
                      gradeProp={item.class}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Calendar;
