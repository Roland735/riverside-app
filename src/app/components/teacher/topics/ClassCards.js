import React from "react";
import ClassCard from "./ClassCard";

function ClassCards() {
  return (
    <div className="w-full">
      <div className="">Your Classes</div>
      <div className="flex justify-between items-center">
        <ClassCard className={"Mathematics"} progress={90} />
        <ClassCard className={"Mathematics"} progress={70} />
        <ClassCard className={"Mathematics"} progress={"90"} />
      </div>
    </div>
  );
}

export default ClassCards;
