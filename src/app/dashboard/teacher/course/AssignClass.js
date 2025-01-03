import { useState, useEffect } from "react";
import Select from "react-select";
import { toast } from "react-toastify";

function AssignStudents() {
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [classStudents, setClassStudents] = useState([]);

    useEffect(() => {
        // Fetch classes
        const fetchClasses = async () => {
            const response = await fetch("/api/getClasses");
            const data = await response.json();
            setClasses(data.classes);
        };

        // Fetch students
        const fetchStudents = async () => {
            const response = await fetch("/api/getStudents");
            const data = await response.json();
            console.log(data);

            setStudents(data.students.map(student => ({
                value: student.regNumber,
                label: `${student.firstname} ${student.lastname}`,
                regNumber: student.regNumber // Add regNumber property
            })));
        };

        fetchClasses();
        fetchStudents();
    }, []);

    useEffect(() => {
        if (selectedClass) {
            // Fetch existing students of the selected class
            const fetchClassStudents = async () => {
                const response = await fetch(`/api/getClassStudents/${selectedClass}/${selectedYear}`);
                const data = await response.json();
                setClassStudents(data.students || []);
                console.log(data.students);
            };

            fetchClassStudents();
        }
    }, [selectedClass, selectedYear]);

    const handleAssignStudents = async (event) => {
        event.preventDefault();

        const response = await fetch("/api/assignStudents", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                className: selectedClass,
                year: selectedYear, // Send year as an integer
                studentIds: selectedStudents.map(student => student.value)
            }),
        });

        if (!response.ok) {
            console.error("Error assigning students:", response.statusText);
            toast.error("Error assigning students. Please try again.");
            return;
        }

        toast.success("Students assigned successfully!");
        setSelectedStudents([]); // Clear selected students after assigning
        setClassStudents([]); // Clear class students after assigning
    };

    const getFilteredStudents = () => {
        const assignedStudentRegNumbers = classStudents.map(student => student.regNumber);
        return students.filter(student => !assignedStudentRegNumbers.includes(student.regNumber));
    };

    const getSortedStudents = () => {
        const allStudents = [...classStudents, ...selectedStudents];
        return allStudents.sort((a, b) => {
            const lastnameA = a.label ? a.label.split(" ")[1] : (a.name ? a.name.split(" ")[1] : ""); // Handle both label and name cases
            const lastnameB = b.label ? b.label.split(" ")[1] : (b.name ? b.name.split(" ")[1] : ""); // Handle both label and name cases
            return lastnameA.localeCompare(lastnameB);
        });
    };

    return (
        <div className="w-full p-4  text-rose-950  my-5 section-bg borders">
            <h3 className="text-xl my-8 font-semibold border-b-2 border-rose-700 text-rose-950 dark:text-slate-50">
                Assign Students to Classes
            </h3>

            <form onSubmit={handleAssignStudents} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium dark:bg-slate-700 text-rose-950 dark:text-slate-300">Class</label>
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md  dark:text-slate-900  text-rose-950 dark:text-slate-900"
                        required
                    >
                        <option value="">Select a class</option>
                        {classes.map((classItem) => (
                            <option key={classItem._id} value={classItem.className}>
                                {classItem.className}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-rose-950 dark:text-slate-300 ">Year</label>
                    <input
                        type="number"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-rose-950 dark:text-slate-900"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-rose-950 dark:text-slate-300">Students</label>
                    <Select
                        isMulti
                        value={selectedStudents}
                        onChange={setSelectedStudents}
                        options={getFilteredStudents()}
                        className="mt-1 block w-full text-rose-950 dark:text-slate-900"
                        placeholder="Select students..."
                    />
                </div>

                <button
                    type="submit"
                    className="block w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-700 hover:bg-rose-600"
                >
                    Assign Students
                </button>
            </form>

            <div className="my-8">
                <h4 className="text-lg font-semibold">Class Preview</h4>
                <div className="overflow-x-auto">
                    <table className="table-auto w-full">
                        <thead>
                            <tr className="bg-rose-950 text-slate-200 capitalize">
                                <th className="px-4 py-2">Number</th>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Registration Number</th>
                            </tr>
                        </thead>
                        <tbody className="text-rose-950">
                            {getSortedStudents().map((student, index) => (
                                <tr key={index} className={index % 2 === 0 ? `${student.label ? "bg-rose-800" : "bg-emerald-600"}` : `${student.label ? "bg-rose-900" : "bg-emerald-600"}`}>
                                    <td className="border px-4 py-2">{index + 1}</td>
                                    <td className="border px-4 py-2">{student.label ? student.label : student.name}</td>
                                    <td className="border px-4 py-2">{student.regNumber}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AssignStudents;
