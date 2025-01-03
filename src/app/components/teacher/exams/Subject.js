"use client";
import React from "react";
import { Disclosure } from "@headlessui/react";
import {
  FaArrowAltCircleDown,
  FaArrowAltCircleUp,
  FaUserCircle,
} from "react-icons/fa";
import SubjectCard from "./SubjectCard";
import Anomalies from "./Anomalies";

function Subject({ subject }) {
  return (
    <div className="w-full px-4 my-2">
      <div className=" w-full rounded-2xl dark:bg-white shadow-cyan-500 shadow-md  p-2">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full items-center justify-between rounded-lg bg-cyan-900 px-4 py-2 text-left text-sm font-medium text-stone-50 hover:bg-cyan-800 focus:outline-none focus-visible:ring focus-visible:ring-emerald-500/75">
                <div className="text-2xl">
                  <FaUserCircle />
                </div>
                <div className="text-2xl tracking-widest font-bold">
                  <span>{subject}</span>
                </div>
                <FaArrowAltCircleDown
                  className={`${open ? "rotate-180 transform" : ""
                    } h-5 w-5 text-emerald-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pb-2  pt-4 text-sm text-gray-500">
                <div className="flex space-x-3 items-center justify-between">
                  <SubjectCard averageMark={82} dataType={"Average Mark"} />
                  <SubjectCard averageMark={82} dataType={"Mean"} />
                  <SubjectCard averageMark={82} dataType={"Median"} />
                  <SubjectCard
                    averageMark={82}
                    dataType={"Standard Deviation"}
                  />
                </div>
                <Anomalies />
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
}

export default Subject;
