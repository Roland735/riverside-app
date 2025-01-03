import React from "react";
import AssignmentCard from "./AssignmentCard";

import UploadAssignments from "../parent/Settings/SubmitAssignment";

function AssignmentPage({ session }) {
  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row flex-wrap py-3 justify-between items-center w-full">
        <AssignmentCard />
        <AssignmentCard />
        <AssignmentCard />
        <AssignmentCard />
      </div>
      <div className="">
        <UploadAssignments />
      </div>
    </div>
  );
}

export default AssignmentPage;
