import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  FaChalkboardTeacher,
  FaGraduationCap,
  FaUser,
  FaUserShield,
} from "react-icons/fa";
import { MdSchool } from "react-icons/md";

export default async function Login() {
  const session = await getServerSession();
  if (session) {
    redirect("/dashboard");
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen dark:bg-gray-900 bg-gray-100 w-full ">
      <div className="text-lg font-bold">
        Welcome to <span className="text-red-500">Riverside Portal</span>
      </div>
      <div className="">Please select your role</div>
      <div className="flex flex-row space-x-4 my-3 ">
        <Link
          href={"student"}
          className="flex flex-col  items-center justify-center border-2 border-red-500 rounded-md px-4 py-2 hover:bg-red-300 transition-colors duration-1000 "
        >
          <span className="">Student</span>
          <span className="text-3xl text-red-500">
            <MdSchool />
          </span>
        </Link>
        <Link
          className="flex flex-col items-center justify-center border-2 border-red-500 rounded-md px-4 py-2 hover:bg-red-300 transition-colors duration-1000"
          href={"admin"}
        >
          <span className="">Admin</span>
          <span className="text-3xl text-red-500">
            <FaUserShield />
          </span>
        </Link>
        <Link
          className="flex flex-col items-center justify-center border-2 border-red-500 rounded-md px-4 py-2 hover:bg-red-300 transition-colors duration-1000"
          href={"teacher"}
        >
          <span className="">Teacher</span>
          <span className="text-3xl text-red-500">
            <FaChalkboardTeacher />
          </span>
        </Link>
        <Link
          className="flex flex-col items-center justify-center border-2 border-red-500 rounded-md px-4 py-2 hover:bg-red-300 transition-colors duration-1000"
          href={"parent"}
        >
          <span className="">Parent</span>
          <span className="text-3xl text-red-500">
            <FaUser />
          </span>
        </Link>
      </div>
    </div>
  );
}
