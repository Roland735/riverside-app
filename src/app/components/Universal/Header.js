import Image from "next/image";
import { FaBell, FaMoon } from "react-icons/fa";
import { FiUser } from "react-icons/fi"; // Import the user icon from react-icons
import React from "react";
import ThemeToogle from "./ThemeToogle";
import { getSession, signOut } from "next-auth/react";

// Default user icon (replace with your own default user icon URL)
const defaultUserIcon = "/default-user-icon.png";

function Header(props) {
  console.log(props);

  return (
    <div className="md:flex justify-between px-5 py-3 hidden w-full border-2 border-rose-800 rounded-md items-center dark:bg-slate-700 shadow-2xl light-border">
      <div className="text-rose-800 dark:text-slate-200">
        <span>{props.name} {props.lastname}</span>, <span className="capitalize">{props.role}</span>
        {props.role === "parent" && (
          <span>
            <br />
            <span> Student:{" "}</span>
            <span>{" "}{props.students[0].firstname}</span>
            <span>{" "}{props.students[0].lastname}</span>
          </span>
        )}
        {/* <span> Grade 3</span> */}
      </div>
      <div className="flex items-center space-x-6">
        <button
          onClick={() =>
            signOut({ redirect: true, callbackUrl: "/auth/login" })
          }
          className="bg-slate-500 text-white px-4 py-2 rounded-md"
        >
          Logout
        </button>
        <div className="text-2xl text-slate-500 space-x-2 flex">
          <ThemeToogle />
          <div className="text-slate-500 dark:text-slate-500">
            <FaBell />
          </div>
        </div>
        <div className="relative h-14 w-14  flex items-center justify-center rounded-full">
          {/* Conditionally render Image or default user icon */}
          {props.image ? (
            <Image
              src={props.image}
              alt="Profile Picture"
              className="rounded-full"
              fill
            />
          ) : (
            <div className="flex items-center justify-center rounded-full bg-slate-200 p-2">
              <FiUser className="text-gray-500 text-3xl" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
