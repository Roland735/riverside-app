import { useEffect, useState } from "react";
import Select from "react-select";
// import toast
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminConfirmExamsPage = ({ period, year }) => {
  const [classes, setClasses] = useState([]);
  const [invigilators, setInvigilators] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassesAndStaff = async () => {
      try {
        const response = await fetch("/api/getClassesForConfirmation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            period: period,
            year: year,

          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("classes", data.classes);
          console.log("invigilators", data.invigilators);
          console.log("markers", data.markers);

          // Directly set the data from the backend response
          setClasses(data.classes);
          setInvigilators(data.invigilators);
          setMarkers(data.markers);
        } else {
          console.error("Error fetching data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClassesAndStaff();
  }, []);

  const parseStaffString = (staffString) => {
    const regex = /^(.*) \((.*)\)$/;
    const match = staffString.match(regex);
    if (match) {
      const [, name, regNumber] = match;
      return { name, regNumber };
    }
    return null;
  };

  const handleStaffChange = (
    classId,
    subjectName,
    examIndex,
    paperIndex,
    selectedStaff,
    type
  ) => {
    const updatedClasses = [...classes];
    const classItem = updatedClasses.find((c) => c._id === classId);
    if (!classItem) return;

    const subject = classItem.years[0].subjects.find(
      (s) => s.name === subjectName
    );
    if (!subject) return;

    const exam = subject.exams[examIndex];
    if (!exam) return;

    const paper = exam.papers[paperIndex];
    if (!paper) return;

    if (type === "invigilator") {
      paper.invigilator = selectedStaff || [];
    } else if (type === "marker") {
      paper.marker = selectedStaff || [];
    }

    setClasses(updatedClasses);
  };

  const handleConfirmPaper = async (
    classId,
    subjectName,
    examIndex,
    paperIndex
  ) => {
    try {
      const updatedClasses = [...classes];
      const classItem = updatedClasses.find((c) => c._id === classId);
      if (!classItem) return;

      const subject = classItem.years[0].subjects.find(
        (s) => s.name === subjectName
      );
      if (!subject) return;

      const exam = subject.exams[examIndex];
      if (!exam) return;

      const paper = exam.papers[paperIndex];
      if (!paper) return;

      paper.confirmed = !paper.confirmed; // Toggle confirmation
      setClasses(updatedClasses);

      const response = await fetch("/api/confirmExams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ classes: updatedClasses }),
      });

      if (response.ok) {
        console.log("Paper confirmed successfully");
        toast.success('Paper Saved')
      } else {
        const errorData = await response.json();
        console.error("Error confirming paper:", errorData);
      }
    } catch (error) {
      console.error("Error confirming paper:", error);
    }
  };

  const handleSave = async () => {
    try {
      console.log("Saving exams with the following dat=a:", classes);

      const dataToSend = classes.map((classItem) => {
        console.log("Mapping classItem:", classItem);
        return {
          _id: classItem._id,
          years: classItem.years.map((year) => {
            console.log("Mapping year:", year);
            return {
              ...year,
              subjects: year.subjects.map((subject) => {
                console.log("Mapping subject:", subject);
                return {
                  ...subject,
                  exams: subject.exams.map((exam) => {
                    console.log("Mapping exam:", exam);
                    return {
                      ...exam,
                      papers: exam.papers.map((paper) => {
                        console.log("Mapping paper:", paper);
                        return {
                          paperNumber: paper.paperNumber,
                          duration: paper.duration,
                          confirmed: paper.confirmed,
                          invigilators: paper.invigilator,
                          markers: paper.marker,
                        };
                      }),
                    };
                  }),
                };
              }),
            };
          }),
        };
      });

      console.log(dataToSend);

      const response = await fetch("/api/confirmExams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ classes: dataToSend }),
      });

      if (response.ok) {
        console.log("Exams confirmed successfully");
        // Handle success, e.g., show a success message
        toast.success("Exams saved successfully!");
      } else {
        const errorData = await response.json();
        console.error("Error confirming exams:", errorData);
      }
    } catch (error) {
      console.error("Error confirming exams:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-4 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-4 w-full bg-white dark:bg-gray-800">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Confirm Exams
      </h1>
      {classes.length === 0 ? (
        <p>No classes available for confirmation.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {classes.map((classItem) => (
            <div
              key={classItem._id}
              className="col-span-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 shadow-md"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 border-b-2 border-gray-200 dark:border-gray-600">
                {classItem.className}
              </h2>
              {classItem.years[0].subjects.length === 0 ? (
                <p>No subjects available.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {classItem.years[0].subjects.map(
                    (subject) =>
                      subject.exams.some((exam) => exam.papers.length > 0) && (
                        <div
                          key={subject.name}
                          className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-2"
                        >
                          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                            {subject.name}
                          </h3>
                          {subject.exams.map((exam, examIndex) => (
                            <div key={exam._id}>
                              <h4 className="text-md font-bold text-gray-700 dark:text-gray-300">
                                {exam.period}
                              </h4>
                              {exam.papers.map((paper, paperIndex) => (
                                <div key={paper._id} className="mb-4">
                                  <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      Paper {paper.paperNumber}
                                    </p>
                                    <button
                                      className={`${paper.confirmed
                                        ? "bg-green-500"
                                        : "bg-red-500"
                                        } text-white py-1 px-2 rounded-md`}
                                      onClick={() =>
                                        handleConfirmPaper(
                                          classItem._id,
                                          subject.name,
                                          examIndex,
                                          paperIndex
                                        )
                                      }
                                    >
                                      {paper.confirmed
                                        ? "Unconfirm"
                                        : "Confirm"}
                                    </button>
                                  </div>
                                  <div className="mt-2">
                                    <div className="text-md font-bold text-gray-700 dark:text-gray-300">
                                      Invigilators:
                                    </div>
                                    <Select
                                      options={invigilators.map((inv) => ({
                                        value: inv.regNumber,
                                        label: inv.name,
                                      }))}
                                      isMulti
                                      placeholder="Select Invigilators"
                                      value={paper.invigilator.map((inv) => ({
                                        value: inv.regNumber,
                                        label: inv.name,
                                      }))}
                                      onChange={(selectedOptions) =>
                                        handleStaffChange(
                                          classItem._id,
                                          subject.name,
                                          examIndex,
                                          paperIndex,
                                          selectedOptions.map((option) => ({
                                            regNumber: option.value,
                                            name: option.label,
                                          })),
                                          "invigilator"
                                        )
                                      }
                                    />
                                  </div>
                                  <div className="mt-2">
                                    <div className="text-md font-bold text-gray-700 dark:text-gray-300">
                                      Markers:
                                    </div>
                                    <Select
                                      options={markers.map((marker) => ({
                                        value: marker.regNumber,
                                        label: marker.name,
                                      }))}
                                      isMulti
                                      placeholder="Select Markers"
                                      value={paper.marker.map((marker) => ({
                                        value: marker.regNumber,
                                        label: marker.name,
                                      }))}
                                      onChange={(selectedOptions) =>
                                        handleStaffChange(
                                          classItem._id,
                                          subject.name,
                                          examIndex,
                                          paperIndex,
                                          selectedOptions.map((option) => ({
                                            regNumber: option.value,
                                            name: option.label,
                                          })),
                                          "marker"
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      )
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="mt-4">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminConfirmExamsPage;
