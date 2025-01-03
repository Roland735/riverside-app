import React from "react";
import Image from "next/image";

function StudentBoardCard({ title, name, picture, value, icon, isPercentage }) {
  return (
    <div className="bg-cyan-950 mx-3 lg:mx-6 my-5 rounded-sm w-10/12 sm:w-1/6">
      <div className="flex justify-between px-4 py-2 ">
        <div className=" max-w-1/3 text-[#fff]">{title}</div>
        <div className="text-emerald-400">{icon}</div>
      </div>
      <div className="flex items-center justify-center">
        <img
          src={picture}
          className="h-20 w-20 rounded-full"
          alt="profilePic"
        ></img>
      </div>
      <div className="flex-col flex items-center my-5">
        <div className=" text-lg font-light text-emerald-400">{name}</div>
        <div className=" text-lg font-bold text-emerald-400">{value}</div>
      </div>
    </div>
  );
}

export default StudentBoardCard;
