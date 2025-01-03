import React from "react";
import { BsFillFileEarmarkTextFill } from "react-icons/bs";

function AssignmentCard() {
  return (
    <div className="h-30 my-7 dark:bg-slate-950 px-2 py-5 rounded-xl shadow-md flex flex-col mx-3 justify-between w-4/5 sm:w-1/3 lg:w-2/5 xl:w-1/5 ">
      <div className="flex text-xl font-sbold text-white justify-between mb-3">
        <div className="text-md  dark:text-cyan-500 text-cyan-900">
          Average Mark
        </div>
        <div className="text-cyan-900">
          <BsFillFileEarmarkTextFill />
        </div>
      </div>
      <div className="text-2xl dark:text-cyan-500 text-cyan-900 ">86.89%</div>
      <div className="text-sm dark:text-cyan-200 text-cyan-900">
        +5% from last Month
      </div>
    </div>
  );
}

export default AssignmentCard;
