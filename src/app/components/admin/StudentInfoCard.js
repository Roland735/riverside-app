import React from "react";
import Image from "next/image";

const StudentInfoCard = ({ studentData }) => {
  return (
    <div className="bg-slate-300 dark:bg-slate-700 text-cyan-950 dark:text-slate-300 p-4 rounded-lg shadow-md flex flex-col items-center">
      {studentData.profilePicture ? (
        <div className="relative rounded-full w-24 h-24">
          <Image
            src={studentData.profilePicture}
            alt={`${studentData.studentName}'s Picture`}
            fill
            className="rounded-full"
          />
        </div>
      ) : (
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-gray-400">No Image</span>
        </div>
      )}
      <h2 className="text-xl font-bold mt-4">{studentData.studentName}</h2>
      <p className=" text-cyan-950 dark:text-slate-300">
        Registration: {studentData.registrationNumber}
      </p>
      <p className=" text-cyan-950 dark:text-slate-300">
        Class: {studentData.className}
      </p>
      <div className="mt-4 w-full">
        <div className="flex justify-between mb-2">
          <span className=" text-cyan-950 dark:text-slate-300">Age:</span>
          <span>{studentData.age}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className=" text-cyan-950 dark:text-slate-300">Gender:</span>
          <span>{studentData.gender}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className=" text-cyan-950 dark:text-slate-300">Email:</span>
          <span>{studentData.email}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className=" text-cyan-950 dark:text-slate-300">Phone:</span>
          <span>{studentData.phone}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className=" text-cyan-950 dark:text-slate-300">Address:</span>
          <span>{studentData.address}</span>
        </div>
      </div>
    </div>
  );
};

export default StudentInfoCard;
