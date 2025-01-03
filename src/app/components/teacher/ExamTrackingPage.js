import React, { useState, useCallback, useEffect } from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiLink,
  FiCheckCircle,
  FiXCircle,
  FiCircle,
} from "react-icons/fi";

const ExamTrackingPage = ({ year, period, session }) => {
  const [activePeriod, setActivePeriod] = useState(null);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [sortedTableData, setSortedTableData] = useState({});
  const [periods, setPeriods] = useState([]); // Initialize state to store fetched periods
  // console.log(period, year);
  const myYear = parseInt(decodeURI(year), 10);
  const myPeriod = decodeURI(period);
  console.log(myYear, myPeriod);


  // Fetch data from the POST route
  useEffect(() => {
    const fetchPeriods = async () => {
      try {
        const response = await fetch("/api/exam-teacher-tracking", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            period: myPeriod,
            year: myYear,
            session
          }),
        });
        const data = await response.json();
        setPeriods(data.periods); // Assuming the response contains an array of periods
      } catch (error) {
        console.error("Error fetching periods data:", error);
      }
    };

    fetchPeriods();
  }, []);

  // Sorting logic extracted from the render method
  const sortData = useCallback((data, key, direction) => {
    if (!key) return data;
    return [...data].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });
  }, []);

  // Handle sort when a column header is clicked
  const handleSort = useCallback(
    (data, key) => {
      const direction =
        sortConfig.key === key && sortConfig.direction === "ascending"
          ? "descending"
          : "ascending";
      const sortedData = sortData(data, key, direction);
      setSortConfig({ key, direction });
      return sortedData;
    },
    [sortConfig, sortData]
  );

  // Filter data based on the filter text
  const filteredData = (data) => {
    return data.filter((item) =>
      Object.values(item).some((value) =>
        value.toString().toLowerCase().includes(filterText.toLowerCase())
      )
    );
  };

  // Update sorted data for a particular stage when the activeAccordion changes
  useEffect(() => {
    if (activeAccordion !== null) {
      const currentStage = periods
        .flatMap((period) => period.stages)
        .find((stage) => stage.id === activeAccordion);

      if (currentStage?.tableData) {
        const sorted = handleSort(currentStage.tableData, sortConfig.key);
        setSortedTableData((prevData) => ({
          ...prevData,
          [currentStage.id]: sorted,
        }));
      }
    }
  }, [activeAccordion, sortConfig, handleSort, periods]);

  const togglePeriod = (id) => {
    setActivePeriod((prevActivePeriod) =>
      prevActivePeriod === id ? null : id
    );
  };

  const toggleAccordion = (id) => {
    setActiveAccordion((prevActiveAccordion) =>
      prevActiveAccordion === id ? null : id
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold dark:text-gray-100">
        Exam Process Progress Tracker
      </h1>

      {periods?.map((period) => (
        <div
          key={period.id}
          className="border-b border-gray-200 dark:border-gray-700"
        >
          <button
            className="flex justify-between items-center w-full py-4 px-6 text-left text-gray-700 dark:text-gray-100 font-bold bg-gray-100 dark:bg-gray-800 rounded-t-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => togglePeriod(period.id)}
          >
            <span>
              {period.name} ({period.startDate} - {period.endDate})
            </span>
            {activePeriod === period.id ? <FiChevronUp /> : <FiChevronDown />}
          </button>

          {activePeriod === period.id && (
            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-b-lg">
              {period.stages.map((stage) => (
                <div
                  key={stage.id}
                  className="border-b border-gray-200 dark:border-gray-700"
                >
                  <button
                    className="flex justify-between items-center w-full py-4 px-6 text-left text-gray-700 dark:text-gray-100 font-bold bg-gray-100 dark:bg-gray-800 rounded-t-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                    onClick={() => toggleAccordion(stage.id)}
                  >
                    <span className="flex items-center space-x-2">
                      <span>{stage.name}</span>
                      {stage.progress === 100 && (
                        <FiCheckCircle className="text-green-500" />
                      )}
                      {stage.progress < 100 && stage.progress > 0 && (
                        <FiCircle className="text-yellow-500" />
                      )}
                      {stage.progress === 0 && (
                        <FiXCircle className="text-red-500" />
                      )}
                    </span>
                    <div className="flex space-x-2">
                      <span className="text-sm">{stage.progress}%</span>
                      <span>
                        {" "}
                        {activeAccordion === stage.id ? (
                          <FiChevronUp />
                        ) : (
                          <FiChevronDown />
                        )}
                      </span>
                    </div>
                  </button>

                  {activeAccordion === stage.id && (
                    <div className="px-6 pb-4 bg-white dark:bg-gray-900 rounded-b-lg">
                      <div className="mb-2 text-sm dark:text-gray-300">
                        Progress: {stage.progress}%
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
                        <div
                          className="bg-sky-500 h-4 rounded-full"
                          style={{ width: `${stage.progress}%` }}
                        ></div>
                      </div>

                      {stage.withLink && (<a
                        href={stage.link}
                        className="inline-flex items-center text-sky-500 hover:underline space-x-2 mt-4"
                      >
                        <FiLink />
                        <span>Go to {stage.name} page</span>
                      </a>)}

                      {sortedTableData[stage.id]?.length > 0 && (
                        <div>
                          <input
                            type="text"
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                            placeholder="Filter the table..."
                            className="w-full px-4 py-2 mb-4 border rounded-md dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                          />

                          <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg">
                            <thead>
                              <tr className="bg-gray-100 dark:bg-gray-700">
                                {Object.keys(
                                  sortedTableData[stage.id][0] || {}
                                ).map((key) => (
                                  <th
                                    key={key}
                                    className="py-2 px-4 text-left cursor-pointer"
                                    onClick={() =>
                                      handleSort(sortedTableData[stage.id], key)
                                    }
                                  >
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {filteredData(sortedTableData[stage.id]).map(
                                (row, index) => (
                                  <tr
                                    key={index}
                                    className="border-b dark:border-gray-700"
                                  >
                                    {Object.entries(row).map(
                                      ([key, value], idx) => (
                                        <td key={idx} className="py-2 px-4">
                                          {typeof value === "boolean" ? (
                                            value ? (
                                              <FiCheckCircle className="text-green-500" />
                                            ) : (
                                              <FiXCircle className="text-red-500" />
                                            )
                                          ) : (
                                            value.toString() || "-"
                                          )}
                                        </td>
                                      )
                                    )}
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ExamTrackingPage;
