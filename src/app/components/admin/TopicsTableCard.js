import React, { useState } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import Select from "react-select";
import Link from "next/link";

const TopicsTableCard = ({ topicsData, classData }) => {
  const { subjectName, className } = classData;
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const toggleSortIcon = (column) => {
    if (sortBy === column) {
      return sortOrder === "asc" ? (
        <FaArrowUp className="ml-1" />
      ) : (
        <FaArrowDown className="ml-1" />
      );
    }
    return null;
  };

  const filteredTopics = topicsData
    .filter((topic) => {
      if (
        searchQuery &&
        !(
          topic.topicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          topic.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      let aValue, bValue;

      if (sortBy === "topicName") {
        aValue = a.topicName;
        bValue = b.topicName;
      } else if (sortBy === "title") {
        aValue = a.title;
        bValue = b.title;
      } else if (sortBy === "scheduleNumber") {
        aValue = a.scheduleNumber;
        bValue = b.scheduleNumber;
      } else if (sortBy === "averageMark") {
        aValue = a.averageMark ?? -1;
        bValue = b.averageMark ?? -1;
      } else {
        return 0;
      }

      if (aValue < bValue) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    });

  return (
    <div className="flex-1 bg-slate-300 dark:bg-slate-700 dark:text-slate-50 text-cyan-950  rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-6">Topics List</h3>
      <div className="mb-6">
        <label className="block text-sm font-medium dark:text-slate-50 text-cyan-950  mb-2">
          Search by Topic or Title
        </label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 focus:border-cyan-500 focus:ring-cyan-500"
          placeholder="Search..."
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("topicName")}
              >
                Topic Name
                {toggleSortIcon("topicName")}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("title")}
              >
                Title
                {toggleSortIcon("title")}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("scheduleNumber")}
              >
                Schedule Number
                {toggleSortIcon("scheduleNumber")}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("averageMark")}
              >
                Average Mark
                {toggleSortIcon("averageMark")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                Link
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTopics.map((topic, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {topic.topicName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{topic.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {topic.scheduleNumber}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {topic.averageMark ?? "-"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <Link
                      href={`/dashboard/teacher/course/${topic.title}/2025//${className}/${subjectName}`}
                    >
                      more info
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopicsTableCard;
