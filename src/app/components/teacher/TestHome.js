import React from "react";
import UploadTests from "../parent/Settings/SubmitTest";

function TestHome({ subjectsTaught }) {
  console.log(subjectsTaught);

  return (
    <div className="w-full">
      <UploadTests subjectsTaught={subjectsTaught} />
    </div>
  );
}

export default TestHome;
