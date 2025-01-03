// components/Sidebar.js

import { useUserContext } from '@/app/context/UserContext';
import Link from 'next/link';



const Sidebar = ({ open, setOpen }) => {
    const { session } = useUserContext();

    if (!session) {
        return null; // or a loading state
    }

    const role = session.user.role;
    const Menus = {
        teacher: [
            { title: "Home", src: "Chat", DashoardLink: "/dashboard/teacher/" },
            { title: "Course Management", src: "User", DashoardLink: "/dashboard/teacher/course" },
            { title: "My Classes", src: "User", DashoardLink: "/dashboard/teacher/myclasses" },
            { title: "Subjects", src: "User", DashoardLink: "/dashboard/teacher/subjects" },
            { title: "Analysis", src: "Calendar", DashoardLink: "/dashboard/teacher/analysis" },
        ],
        student: [
            { title: "Home", src: "Chat", DashoardLink: "/dashboard/student/" },
            { title: "Subjects", src: "User", DashoardLink: "/dashboard/student/subjects" },
            // Add more student links here
        ],
    };

    return (
        <div className={` ${open ? "w-72" : "w-20"} visuals min-h-screen p-5 pt-8 relative duration-300 border-none dark:bg-transparent shadow-slate-700 shadow-2xl hidden md:block`}>
            <img
                src="/assets/control.png"
                className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple border-2 rounded-full ${!open && "rotate-180"}`}
                onClick={() => setOpen(!open)}
            />
            <div className="flex gap-x-4 items-center">
                <img
                    src="/assets/logo.png"
                    className={`cursor-pointer duration-500 ${open && "rotate-[360deg]"}`}
                />
                <h1 className={`text-cyan-800 dark:text-cyan-100 origin-left text-xl duration-200 tracking-widest font-light ${!open && "scale-0"}`}>
                    Nova<span className=" text-rose-700">App</span>
                </h1>
            </div>
            <ul className="pt-10">
                {Menus[role]?.map((Menu, index) => (
                    <Link href={Menu.DashoardLink} key={index}>
                        <li
                            className={`flex rounded-md p-2 cursor-pointer hover:bg-cyan-600 transition-all duration-300 text-cyan-800 dark:text-cyan-100 text-sm items-center gap-x-4 ${Menu.gap ? "mt-9" : "mt-2"} ${index === 0 && "bg-light-white"}`}
                        >
                            <img src={`/assets/${Menu.src}.png`} alt={Menu.title} className="w-5 h-5" />
                            <span className={`${!open && "hidden"} origin-left duration-200 text-inherit`}>
                                {Menu.title}
                            </span>
                        </li>
                    </Link>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
