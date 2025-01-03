"use client";
import { createContext, useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaHome,
  FaUser,
  FaCalendar,
  FaChartBar,
  FaClipboardList,
  FaBook,
  FaUpload,
  FaCogs,
  FaChalkboardTeacher,
  FaImages,
  FaAddressBook,
  FaCaretRight,
  FaCaretSquareLeft,
} from "react-icons/fa";
import Header from "./Header";
import Loading from "./loader";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

export const LoginContext = createContext({});

const TeacherLayout = ({ children }) => {
  const [mySession, setMySession] = useState(null);
  const [login, setLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(true);
  const router = useRouter();
  console.log("Hi");

  useEffect(() => {
    const fetchSession = async () => {
      console.log("hi");

      const session = await getSession();
      setMySession(session);
      console.log(session);

      setLoading(false);
    };

    console.log(mySession);
    fetchSession();
  }, [router]);
  console.log(router.pathname);

  if (loading) {
    return <Loading />;
  }

  const Menus = [
    // Teacher Menus
    {
      title: "Home",
      src: "FaHome",
      DashboardLink: "/dashboard/teacher/",
      roles: ["teacher"],
    },
    {
      title: "Upload Marks",
      src: "FaUser",
      gap: false,
      DashboardLink: "/dashboard/teacher/course",
      roles: ["teacher"],
    },
    {
      title: "My Classes",
      src: "FaChalkboardTeacher",
      gap: false,
      DashboardLink: "/dashboard/teacher/myclasses",
      roles: ["teacher"],
    },
    {
      title: "Subjects",
      src: "FaBook",
      gap: false,
      DashboardLink: "/dashboard/teacher/subjects",
      roles: ["teacher"],
    },
    {
      title: "Analysis",
      src: "FaChartBar",
      DashboardLink: "/dashboard/teacher/analysis",
      roles: ["teacher"],
    },
    {
      title: "Attendance",
      src: "FaClipboardList",
      DashboardLink: "/dashboard/teacher/attendance",
      roles: ["teacher"],
    },
    {
      title: "Upload Resources",
      src: "FaUpload",
      DashboardLink: "/dashboard/teacher/resource",
      roles: ["teacher"],
    },
    {
      title: "Resources",
      src: "FaClipboardList",
      DashboardLink: "/dashboard/teacher/resources",
      roles: ["teacher"],
    },
    {
      title: "Update Profile",
      src: "FaCogs",
      gap: false,
      DashboardLink: "/dashboard/admin/updateImage",
      roles: ["teacher"],
    },
    {
      title: "Update Topics",
      src: "FaChalkboardTeacher",
      gap: false,
      DashboardLink: "/dashboard/teacher/updateTopics",
      roles: ["teacher"],
    },
    {
      title: "Track Exams",
      src: "FaBook",
      gap: false,
      DashboardLink: "/dashboard/teacher/trackExams",
      roles: ["teacher"],
    },

    // Student Menus
    {
      title: "Home",
      src: "FaHome",
      DashboardLink: "/dashboard/student",
      roles: ["student"],
    },
    {
      title: "Subjects",
      src: "FaBook",
      gap: false,
      DashboardLink: "/dashboard/student/subjects",
      roles: ["student"],
    },

    // Admin Menus
    {
      title: "Home",
      src: "FaHome",
      DashboardLink: "/dashboard/admin",
      roles: ["admin"],
    },
    {
      title: "Create Class",
      src: "FaUser",
      gap: false,
      DashboardLink: "/dashboard/admin/course",
      roles: ["admin"],
    },
    // {
    //   title: "Grades & Classes",
    //   src: "FaAddressBook",
    //   gap: false,
    //   DashboardLink: "/dashboard/admin/gradesAndClasses",
    //   roles: ["admin"],
    // },
    {
      title: "Subjects",
      src: "FaBook",
      gap: false,
      DashboardLink: "/dashboard/admin/subjects",
      roles: ["admin"],
    },
    {
      title: "Assign Classes",
      src: "FaChalkboardTeacher",
      gap: false,
      DashboardLink: "/dashboard/admin/assignClasses",
      roles: ["admin"],
    },
    {
      title: "User Images",
      src: "FaImages",
      gap: false,
      DashboardLink: "/dashboard/admin/multipleImage",
      roles: ["admin"],
    },
    {
      title: "Update Profile",
      src: "FaCogs",
      gap: false,
      DashboardLink: "/dashboard/admin/updateImage",
      roles: ["admin"],
    },
    {
      title: "Create Department",
      src: "FaBook",
      gap: false,
      DashboardLink: "/dashboard/admin/createDepartment",
      roles: ["admin"],
    },
    {
      title: "Create Subject",
      src: "FaBook",
      gap: false,
      DashboardLink: "/dashboard/admin/createSubject",
      roles: ["admin"],
    },
    {
      title: "Student Information",
      src: "FaBook",
      gap: false,
      DashboardLink: "/dashboard/admin/student-list",
      roles: ["admin"],
    },
    {
      title: "Create Exam Period",
      src: "FaBook",
      gap: false,
      DashboardLink: "/dashboard/admin/periodExam",
      roles: ["admin"],
    },
    {
      title: "Track Exams",
      src: "FaBook",
      gap: false,
      DashboardLink: "/dashboard/admin/trackExams",
      roles: ["admin"],
    },
    // {
    //   title: "Calendar",
    //   src: "FaBook",
    //   gap: false,
    //   DashboardLink: "/dashboard/admin/updateCalendar",
    //   roles: ["admin"],
    // },

    // Parent
    {
      title: "Home",
      src: "FaHome",
      DashboardLink: "/dashboard/parent",
      roles: ["parent"],
    },
    {
      title: "Student Information",
      src: "FaBook",
      gap: false,
      DashboardLink: "/dashboard/parent/subjects",
      roles: ["parent"],
    },
  ];

  const iconMapping = {
    FaHome: <FaHome />,
    FaUser: <FaUser />,
    FaCalendar: <FaCalendar />,
    FaChartBar: <FaChartBar />,
    FaClipboardList: <FaClipboardList />,
    FaBook: <FaBook />,
    FaUpload: <FaUpload />,
    FaCogs: <FaCogs />,
    FaChalkboardTeacher: <FaChalkboardTeacher />,
    FaImages: <FaImages />,
    FaAddressBook: <FaAddressBook />,
  };

  const filteredMenus = Menus.filter(
    (menu) => !menu.roles || menu.roles.includes(mySession?.user.role)
  );

  return (
    <div
      className={`flex bg-slate-50 dark:bg-gradient-to-tr dark:from-slate-950 from-10% dark:via-slate-900 via-80% dark:to-slate-950 to-90%`}
    >
      {filteredMenus.length > 0 ? (
        <div className="flex w-full">
          <div
            className={`${open ? "w-72" : "w-20"
              } visuals min-h-screen p-5 pt-8 relative duration-300 border-none dark:bg-transparent shadow-slate-700 shadow-2xl hidden md:block`}
          >
            <div

              className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple border-2 rounded-full text-red-800 ${!open && "rotate-180"
                }`}
              onClick={() => setOpen(!open)}
            >
              <FaCaretSquareLeft />
            </div>
            <div className="flex gap-x-4 items-center ">
              <img
                src="/assets/logo.png"
                height={100}
                width={100}
                className={`cursor-pointer duration-500 ${open && "rotate-[360deg]"
                  }`}
              />
              <h1
                className={`text-red-800 dark:text-red-100 origin-left text-xl duration-200 tracking-widest font-light ${!open && "scale-0"
                  }`}
              >
                Riverside <br />
                <span className="text-rose-700">School</span>
              </h1>
            </div>
            <ul className="pt-10 ">
              {filteredMenus.length > 0 &&
                filteredMenus.map((menu, index) => (
                  <Link href={menu.DashboardLink} key={index}>
                    <li
                      className={`flex rounded-md p-2 cursor-pointer hover:bg-red-600 hover:text-red-50 transition-all duration-300 text-red-800 dark:text-slate-100 text-sm items-center gap-x-4 ${menu.gap ? "mt-9" : "mt-2"
                        } ${index === 0 && "bg-light-white"}`}
                    >
                      <div className="w-5 h-5">{iconMapping[menu.src]}</div>
                      <span
                        className={`${!open && "hidden"
                          } origin-left duration-200 text-inherit`}
                      >
                        {menu.title}
                      </span>
                    </li>
                  </Link>
                ))}
            </ul>
          </div>
          <div className="min-h-screen w-full px-0 sm:px-8 py-20 flex flex-col items-center  md:space-y-7">
            {mySession && (
              <Header
                name={mySession.user.firstname}
                lastname={mySession.user.lastname}
                role={mySession.user.role}
                image={mySession.user.profileUrl}
                students={mySession.user.students}
              />
            )}
            {children}
          </div>
        </div>
      ) : (
        <div className="min-h-screen w-full">
          <LoginContext.Provider value={login}>
            {children}
          </LoginContext.Provider>
        </div>
      )}
    </div>
  );
};

export default TeacherLayout;
