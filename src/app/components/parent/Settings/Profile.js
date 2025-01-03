"use client";

import React, { useState } from "react";
import { Disclosure } from "@headlessui/react";
import {
  FaArrowAltCircleDown,
  FaArrowAltCircleUp,
  FaUserCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";

function Profile({ session }) {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationalIdNumber, setNationalIdNumber] = useState("");

  const regNumber = session.user.regNumber
  const email = session.user.email


  const handleSubmit = async (event) => {


    event.preventDefault(); // Prevent default form submission

    const response = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, lastName, nationalIdNumber, regNumber, email }),
    });

    if (!response.ok) {
      console.error("Error saving student:", response.statusText);
      // Handle errors here (e.g., display an error message to the user)
      return;
    }
    toast.success("Profile updated successfully!");

    console.log("Student saved successfully!");
    // Handle success (e.g., clear the form, show a success message)
    setName("");
    setLastName("");
    setNationalIdNumber("");
  };
  return (
    <div className="w-full px-4 my-2">
      <div className=" w-full rounded-2xl dark:bg-white bg-cyan-500  p-2">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full items-center justify-between rounded-lg bg-cyan-700 px-4 py-2 text-left text-sm font-medium text-cyan-50 hover:bg-cyan-800 focus:outline-none focus-visible:ring focus-visible:ring-emerald-500/75">
                <div className="text-2xl">
                  <FaUserCircle />
                </div>
                <div className="text-2xl tracking-widest font-bold">
                  <span>Profile</span>
                </div>
                <FaArrowAltCircleDown
                  className={`${open ? "rotate-180 transform" : ""
                    } h-5 w-5 text-emerald-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pb-2 pt-4 text-sm text-gray-500">
                <form action="" className="flex flex-col space-y-3" onSubmit={(event) => handleSubmit(event)} >
                  <div className="flex flex-col space-y-3">
                    <label htmlFor="" className="">
                      Name:
                    </label>
                    <input
                      type="text"
                      placeholder="Roland"
                      onChange={(e) => setName(e.target.value)}
                      className="border-2 border-emerald-600 rounded p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
                    />
                  </div>
                  <div className="flex flex-col space-y-3">
                    <label htmlFor="" className="">
                      Lastname:
                    </label>
                    <input
                      type="text"
                      placeholder="Mungure"
                      onChange={(e) => setLastName(e.target.value)}
                      className="border-2 border-emerald-600 rounded p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
                    />
                  </div>
                  <div className="flex flex-col space-y-3">
                    <label htmlFor="" className="">
                      National Id:
                    </label>
                    <input
                      type="text"
                      placeholder="2013423442D"
                      onChange={(e) => setNationalIdNumber(e.target.value)}
                      className="border-2 border-emerald-600 rounded p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
                    />
                  </div>
                  <div className="flex flex-col space-y-3">

                    <input
                      type="submit"
                      placeholder="96 Newstead Marlborough Harare"
                      className="border-2 bg-cyan-700 border-emerald-600 rounded p-2 text-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-36"
                    />
                  </div>

                  <div className="flex flex-col space-y-3"></div>
                </form>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
}

export default Profile;
