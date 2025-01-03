"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import { BiHome, BiBook, BiChart, BiUser, BiUpload, BiUserCircle } from 'react-icons/bi';
import { getSession } from "next-auth/react";
import Loading from "./loader";
import ThemeToogle from './ThemeToogle';
import { FaBell } from 'react-icons/fa';

const MobileNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [mySession, setMySession] = useState(null);
    const [loading, setLoading] = useState(true);

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const fetchSession = async () => {
            const session = await getSession();
            setMySession(session);
            setLoading(false);
        };

        fetchSession();
    }, []);

    const Menus = [
        // Teacher Menus
        {
            title: "Home",
            DashboardLink: "/dashboard/teacher/",
            roles: ["teacher"],
            icon: <BiHome />
        },
        {
            title: "Upload Marks",
            DashboardLink: "/dashboard/teacher/course",
            roles: ["teacher"],
            icon: <BiUpload />
        },
        {
            title: "My Classes",
            DashboardLink: "/dashboard/teacher/myclasses",
            roles: ["teacher"],
            icon: <BiBook />
        },
        {
            title: "Subjects",
            DashboardLink: "/dashboard/teacher/subjects",
            roles: ["teacher"],
            icon: <BiBook />
        },
        {
            title: "Analysis",
            DashboardLink: "/dashboard/teacher/analysis",
            roles: ["teacher"],
            icon: <BiChart />
        },
        {
            title: "Attendance",
            DashboardLink: "/dashboard/teacher/attendance",
            roles: ["teacher"],
            icon: <BiUser />
        },
        {
            title: "Upload Resources",
            DashboardLink: "/dashboard/teacher/resource",
            roles: ["teacher"],
            icon: <BiUpload />
        },

        // Student Menus
        {
            title: "Home",
            DashboardLink: "/dashboard/student",
            roles: ["student"],
            icon: <BiHome />
        },
        {
            title: "Subjects",
            DashboardLink: "/dashboard/student/subjects",
            roles: ["student"],
            icon: <BiBook />
        },

        // Admin Menus
        {
            title: "Home",
            DashboardLink: "/dashboard/admin",
            roles: ["admin"],
            icon: <BiHome />
        },
        {
            title: "Create Class",
            DashboardLink: "/dashboard/admin/course",
            roles: ["admin"],
            icon: <BiBook />
        },
        {
            title: "Grades & Classes",
            DashboardLink: "/dashboard/admin/gradesAndClasses",
            roles: ["admin"],
            icon: <BiBook />
        },
        {
            title: "Subjects",
            DashboardLink: "/dashboard/admin/subjects",
            roles: ["admin"],
            icon: <BiBook />
        },

        // Parent Menus
        {
            title: "Home",
            DashboardLink: "/dashboard/parent",
            roles: ["parent"],
            icon: <BiHome />
        },
        {
            title: "Student Information",
            DashboardLink: "/dashboard/parent/subjects",
            roles: ["parent"],
            icon: <BiUser />
        },
    ];

    const filteredMenus = Menus.filter(
        (menu) => !menu.roles || menu.roles.includes(mySession?.user.role)
    );

    if (loading) {
        return <Loading />;
    }

    return (
        <nav className="fixed top-0 z-10 bg-gray-300 w-full text-cyan-950 dark:text-cyan-50 md:hidden dark:bg-slate-800 ">
            <div className="flex justify-between items-center p-4">
                <Link href="/dashboard">
                    <img
                        src="/assets/logo.png" // Replace with your logo path
                        alt="Logo"
                        className="h-10 w-auto" // Adjust height and width as needed
                    />
                </Link>
                <div className="md:hidden flex items-center space-x-2">
                    <div className="text-2xl text-slate-500 space-x-2 flex">
                        <ThemeToogle />
                        <div className="text-slate-500 dark:text-slate-500">
                            <FaBell />
                        </div>
                    </div>
                    {isOpen ? (
                        <RiCloseLine className="text-2xl " onClick={toggleNavbar} />
                    ) : (
                        <RiMenu3Line className="text-2xl" onClick={toggleNavbar} />
                    )}
                </div>
            </div>
            {/* User Profile Section */}
            <div className="flex items-center justify-end p-4 bg-gray-700 dark:bg-slate-300 text-cyan-950 ">
                <button
                    onClick={() =>
                        signOut({ redirect: true, callbackUrl: "/auth/login" })
                    }
                    className="bg-slate-500 text-white px-4 py-2 rounded-md mx-2"
                >
                    Logout
                </button>
                <div className="flex items-center">
                    {mySession?.user?.image ? (
                        <img
                            src={mySession.user.image}
                            alt="User Profile"
                            className="h-10 w-10 rounded-full"
                        />
                    ) : (
                        <BiUserCircle className="h-10 w-10 text-gray-300 dark:text-cyan-950" /> // Default icon when image is not available
                    )}
                    <span className="ml-2 text-gray-300 dark:text-cyan-950">{mySession?.user?.firstname}{" "} {mySession?.user?.lastname}</span>
                </div>
            </div>
            <div
                className={`md:flex md:items-center md:w-auto w-full ${isOpen ? '' : 'hidden'}`}
            >
                <div className="flex flex-col md:flex-row md:mx-6">
                    {filteredMenus.map((menu, index) => (
                        <Link href={menu.DashboardLink} key={index} className="flex items-center py-2 px-5 hover:bg-gray-700 rounded">
                            {menu.icon} {/* Icon */}
                            <span className="ml-2">{menu.title}</span> {/* Menu title */}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default MobileNavbar;
