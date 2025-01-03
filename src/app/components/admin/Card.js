import React from "react";
import { FaArrowUp, FaArrowDown, FaUserCircle } from "react-icons/fa";

const Card = ({
  icon,
  name,
  score,
  improvement,
  imageUrl,
  title,
  student,
  type,
}) => {
  console.log(student);

  const renderIcon = () => {
    switch (icon) {
      case "highest-test":
        return <FaArrowUp className="text-green-500 text-3xl" />;
      case "lowest-test":
        return <FaArrowDown className="text-red-500 text-3xl" />;
      case "highest-assignment":
        return <FaArrowUp className="text-green-500 text-3xl" />;
      case "lowest-assignment":
        return <FaArrowDown className="text-red-500 text-3xl" />;
      case "most-improved":
        return <FaArrowUp className="text-green-500 text-3xl" />;
      case "most-unimproved":
        return <FaArrowDown className="text-red-500 text-3xl" />;
      default:
        return null;
    }
  };

  return (
    <div className="dark:bg-slate-700 bg-slate-300 dark:text-slate-50 text-cyan-950 rounded-lg shadow-md p-4 flex flex-col items-start justify-start">
      <div className="flex items-center justify-between w-full">
        <div className="">{title}</div>
        <div className="flex-shrink-0">
          {student.imageUrl ? (
            <img
              className="h-16 w-16 rounded-full object-cover"
              src={student.imageUrl}
              alt={name}
            />
          ) : (
            <FaUserCircle className="text-gray-400 h-16 w-16" />
          )}
        </div>
      </div>

      <div className="">{renderIcon()}</div>
      <div className="">
        <p className="text-lg">
          <span className="font-semibold">Name:</span> {student.name}
        </p>
        <p className="text-lg">
          <span className="font-semibold">Score:</span>{" "}
          {type === "test" ? student.test : student.assignment}
        </p>
        <p className="text-lg">
          <span className="font-semibold">Improvement:</span>{" "}
          {parseInt(improvement) > 0 ? (
            <span className="text-green-500">
              <FaArrowUp className="inline-block text-lg" />
              {improvement}
            </span>
          ) : parseInt(improvement) < 0 ? (
            <span className="text-red-500">
              <FaArrowDown className="inline-block text-lg" />
              {improvement}
            </span>
          ) : (
            <span className="text-gray-400">No change</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default Card;
