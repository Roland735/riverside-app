import React from "react";
import ExamPerformanceTable from "./ExamPerformanceTable";
import ExamPerformanceGraph from "./ExamPerformanceGraph";
import Subject from "./Subject";
import UploadExam from "../../parent/Settings/SubmitExam";

function Exam() {
  return (
    <div className="w-full">
      <h3 className=" text-xl my-8 font-semibold border-b-2 border-cyan-700 text-cyan-900 dark:text-cyan-50">
        Graphical Analysis
      </h3>
      <div className="h-96 shadows light-border py-10 text-colors bg-cyan-[#fff]  my-10 ">
        <ExamPerformanceGraph />
      </div>
      <h3 className=" text-xl my-8 font-semibold border-b-2 border-cyan-700 text-cyan-900 dark:text-cyan-50">
        Exam List
      </h3>
      <ExamPerformanceTable />
      <div className="">
        <UploadExam />
      </div>

      <div className="flex flex-col space-y-5">
        <Subject subject="Mathematics" />
        <Subject subject="English" />
        <Subject subject="Shona" />
        <Subject subject="Science" />
        <Subject subject="Agriculture" />
        <Subject subject="Food" />
        <Subject subject="Information Technology" />
      </div>
    </div>
  );
}

export default Exam;
