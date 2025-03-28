import React, { useState } from "react";
import { Disclosure } from "@headlessui/react";
import {
  FaArrowAltCircleDown,
  FaArrowAltCircleUp,
  FaUserCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";

function Guardian1({ session }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact1: "",
    contact2: "",
    emergencyContact: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch("/api/guardian1", {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        regNumber: session.user.regNumber, // Assuming `session.user.regNumber` contains the user's registration number
        ...formData,
      }),
    });

    if (response.ok) {
      // Handle successful submission
      console.log("Submission successful!");
      toast.success("Health details updated");
    } else {
      // Handle submission error
      console.error("Submission failed!");
      toast.error("Failed to update health details");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <div className="w-full px-4 my-2">
      <div className="w-full rounded-2xl dark:bg-white bg-cyan-500 p-2">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full items-center justify-between rounded-lg bg-cyan-700 px-4 py-2 text-left text-sm font-medium text-cyan-50 hover:bg-cyan-800 focus:outline-none focus-visible:ring focus-visible:ring-emerald-500/75">
                <div className="text-2xl">
                  <FaUserCircle />
                </div>
                <div className="text-2xl tracking-widest font-bold">
                  <span>Guardian One</span>
                </div>
                <FaArrowAltCircleDown
                  className={`${
                    open ? "rotate-180 transform" : ""
                  } h-5 w-5 text-emerald-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pb-2 pt-4 text-sm text-gray-500">
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col space-y-3"
                >
                  <div className="flex flex-col space-y-3">
                    <label htmlFor="name">Fullname:</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Doc Russel Munyuraika"
                      className="border-2 border-emerald-600 rounded p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex flex-col space-y-3">
                    <label htmlFor="" className="">
                      Email:
                    </label>
                    <input
                      type="email"
                      onChange={handleChange}
                      name="email"
                      placeholder="russelmunyaika@gmail.com"
                      className="border-2 border-emerald-600 rounded p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
                    />
                  </div>
                  <div className="flex flex-col space-y-3">
                    <label htmlFor="" className="">
                      Contact 1:
                    </label>
                    <input
                      type="tel"
                      name="contact1"
                      placeholder="+263776686885"
                      onChange={handleChange}
                      className="border-2 border-emerald-600 rounded p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
                    />
                  </div>
                  <div className="flex flex-col space-y-3">
                    <label htmlFor="" className="">
                      Contact 2:
                    </label>
                    <input
                      type="tel"
                      name="contact2"
                      placeholder="+263776686885"
                      onChange={handleChange}
                      className="border-2 border-emerald-600 rounded p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
                    />
                  </div>
                  <div className="flex flex-col space-y-3">
                    <label htmlFor="" className="">
                      Emergency Contact:
                    </label>
                    <textarea
                      type="text"
                      name="emergencyContact"
                      onChange={handleChange}
                      placeholder="96 Newstead Marlborough Harare"
                      className="border-2 border-emerald-600 rounded p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
                    />
                  </div>
                  <div className="flex flex-col space-y-3">
                    <input
                      type="submit"
                      value="Submit"
                      className="border-2 bg-cyan-700 border-emerald-600 rounded p-2 text-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-36"
                    />
                  </div>
                </form>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
}

export default Guardian1;
