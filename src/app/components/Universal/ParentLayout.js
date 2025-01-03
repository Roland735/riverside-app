"use client";
import { useContext, createContext, useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import Link from "next/link";
import Header from "./Header";
import Image from "next/image";
const SidebarContext = createContext();

const ParentLayout = ({ children, name, lastname, role }) => {
  const [open, setOpen] = useState(true);
  const Menus = [
    { title: "Home", src: "Chat", DashoardLink: "/parent" },
    {
      title: "Reports",
      src: "User",
      gap: true,
      DashoardLink: "../parent/report ",
    },
    {
      title: "Assignments",
      src: "Calendar",
      DashoardLink: "../parent/assignments",
    },
    {
      title: "Communicate",
      src: "Search",
      DashoardLink: "../parent/communications",
    },
    { title: "Settings", src: "Setting", DashoardLink: "../parent/settings" },
  ];

  const [session, setSession] = useState(null);
  useEffect(() => {
    async function getSessionData() {
      const session = await getSession();
      setSession(session);
    }
    getSessionData();
  }, []);

  return (
    <div
      className={`flex bg-gradient-to-tr from-cyan-50 via-cyan-100 to-gray-300  dark:bg-gradient-to-tr dark:from-slate-950 from-10% dark:via-cyan-950 via-80% dark:to-slate-950 to-90% `}
    >
      <div
        className={` ${open ? "w-72" : "w-20 "
          } visuals min-h-screen p-5  pt-8 relative duration-300 border-none dark:bg-transparent shadow-cyan-700 shadow-2xl `}
      >
        <img
          src="../assets/control.png"
          className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple
           border-2 rounded-full  ${!open && "rotate-180"}`}
          onClick={() => setOpen(!open)}
        />
        <div className="flex gap-x-4 items-center ">
          <img
            src="../assets/logo.png"
            className={`cursor-pointer duration-500 ${open && "rotate-[360deg]"
              }`}
          />
          <h1
            className={`text-cyan-800 dark:text-cyan-100 origin-left  text-xl duration-200 tracking-widest font-light ${!open && "scale-0"
              }`}
          >
            River
            <span className=" text-rose-700">Side</span>
          </h1>
        </div>

        <ul className="pt-10">
          {Menus.map((Menu, index) => (
            <Link href={Menu.DashoardLink} key={index}>
              <li
                key={index}
                className={`flex  rounded-md p-2 cursor-pointer hover:bg-cyan-600 transition-all duration-300  text-cyan-800 dark:text-cyan-100 text-sm items-center gap-x-4 
              ${Menu.gap ? "mt-9" : "mt-2"} ${index === 0 && "bg-light-white"
                  } `}
              >
                <img src={`../assets/${Menu.src}.png`} alt={Menu.title} className="w-5 h-5" />
                <span
                  className={`${!open && "hidden"
                    } origin-left duration-200 text-inherit`}
                >
                  {Menu.title}
                </span>
              </li>
            </Link>
          ))}
        </ul>
      </div>
      <div className="min-h-screen w-full px-8 py-5 flex flex-col space-y-7">
        <Header name={name} lastname={lastname} role={role} />
        {children}
      </div>
    </div>
  );
};

export default ParentLayout;
