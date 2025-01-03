import React, { useState } from "react";
import { Disclosure } from "@headlessui/react";
import { FaArrowAltCircleDown, FaArrowAltCircleUp, FaUserCircle } from "react-icons/fa";
import { toast } from "react-toastify";

function Health({ session }) {
  const [formData, setFormData] = useState({
    doctorName: "",
    email: "",
    contact1: "",
    contact2: "",
    allergies: "",
    doctorAdress: "",
    dietRestrictions: "",
  });
  const regNumber = session.user.regNumber;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch("/api/health", {
      method: "PUT",
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
                  <span>Child Health</span>
                </div>
                <FaArrowAltCircleDown className={`${open ? "rotate-180 transform" : ""} h-5 w-5 text-emerald-500`} />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pb-2 pt-4 text-sm text-gray-500">
                <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
                  <div className="flex flex-col space-y-3">
                    <label htmlFor="doctorName">Doctor Name:</label>
                    <input
                      type="text"
                      id="doctorName"
                      name="doctorName"
                      placeholder="Doc Russel Munyuraika"
                      className="border-2 border-emerald-600 rounded p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
                      value={formData.doctorName}
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
                      Physical Adress:
                    </label>
                    <textarea
                      type="text"
                      name="doctorAdress"
                      onChange={handleChange}
                      placeholder="96 Newstead Marlborough Harare"
                      className="border-2 border-emerald-600 rounded p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
                    />
                  </div>
                  <div className="flex flex-col space-y-3">
                    <label htmlFor="" className="">
                      Allergies:
                    </label>
                    <input
                      type=""
                      name="allergies"
                      onChange={handleChange}
                      placeholder="jacaranda, sneezing"
                      className="border-2 border-emerald-600 rounded p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
                    />
                  </div>
                  <div className="flex flex-col space-y-3">
                    <label htmlFor="" className="">
                      Diet Restrictions:
                    </label>
                    <input
                      type="text"
                      name="dietRestrictions"
                      onChange={handleChange}
                      placeholder="Pork, "
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

export default Health;








