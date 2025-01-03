import { useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";

function UploadTests({ subjectsTaught }) {

    console.log('Subjects Taught:', subjectsTaught);
    const [excelFile, setExcelFile] = useState(null);
    const [typeError, setTypeError] = useState(null);
    const [grade, setGrade] = useState(null);
    const [subjectName, setSubjectName] = useState(null);
    const [term, setTerm] = useState(null);
    const [testName, setTestName] = useState("");
    const [testDate, setTestDate] = useState("");

    const [excelData, setExcelData] = useState(null);

    const handleFile = (e) => {
        let fileTypes = [
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "text/csv",
        ];
        let selectedFile = e.target.files[0];

        if (selectedFile) {
            if (selectedFile && fileTypes.includes(selectedFile.type)) {
                setTypeError(null);
                let reader = new FileReader();
                reader.readAsArrayBuffer(selectedFile);
                reader.onload = (e) => {
                    setExcelFile(e.target.result);
                };
            } else {
                setTypeError("Please select only excel file types");
                setExcelFile(null);
            }
        } else {
            console.log("Please select your file");
        }
    };

    const handleFileSubmit = (e) => {
        e.preventDefault();
        if (excelFile !== null) {
            const workbook = XLSX.read(excelFile, { type: "buffer" });
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];
            const data = XLSX.utils.sheet_to_json(worksheet);

            setExcelData(data);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!grade || !subjectName || !excelData || !term || !testDate || !testName) {
            toast.error("Please fill out all required fields and upload an Excel file.");
            return;
        }

        const response = await fetch("/api/testUpload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                grade,
                subjectName,
                excelData,
                term,
                testDate,
                testName
            }),
        });

        if (!response.ok) {
            console.error("Error adding test:", response.statusText);
            toast.error("Error adding test. Please try again or contact IT support.");
            return;
        }

        toast.success("Tests uploaded successfully!");
    };

    return (
        <div className="w-full">
            <h3 className="text-xl my-8 font-semibold border-b-2 border-cyan-700 text-cyan-900 dark:text-cyan-50">Upload Test Marks</h3>

            <form className="w-full" onSubmit={handleFileSubmit}>
                <input
                    type="file"
                    className="border-2 bg-cyan-700 border-emerald-600 rounded p-2 text-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
                    required
                    onChange={handleFile}
                />
                <button
                    type="submit"
                    className="my-5 border-2 bg-cyan-700 border-emerald-600 rounded p-2 text-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-36"
                >
                    UPLOAD
                </button>
                {typeError && (
                    <div className="alert alert-danger" role="alert">
                        {typeError}
                    </div>
                )}
            </form>
            <div className="viewer my-3">
                {excelData ? (
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full">
                            <thead>
                                <tr className="bg-cyan-950 text-slate-200 capitalize">
                                    {Object.keys(excelData[0]).map((key, index) => (
                                        <th key={index} className="px-4 py-2">
                                            {key}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="text-cyan-50">
                                {excelData.map((individualExcelData, index) => (
                                    <tr
                                        key={index}
                                        className={index % 2 === 0 ? "bg-cyan-800" : "bg-cyan-900"}
                                    >
                                        {Object.keys(individualExcelData).map((key, index) => (
                                            <td key={index} className="border px-4 py-2">
                                                {individualExcelData[key]}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-4 text-cyan-900 dark:text-cyan-50">No File is uploaded yet!</div>
                )}
            </div>
            <form
                action=""
                className="flex flex-col space-y-3"
                onSubmit={(event) => handleSubmit(event)}
            >
                <div className="flex flex-col space-y-3">
                    <label htmlFor="" className="text-cyan-900 dark:text-cyan-50">
                        Subject Name:
                    </label>
                    <select
                        onChange={(e) => setSubjectName(e.target.value)}
                        className="border-2 border-emerald-600 rounded p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
                    >
                        <option value="">Select Subject</option>
                        <option value="Math">Math</option>
                        <option value="Science">Science</option>
                        <option value="English">English</option>
                    </select>
                </div>
                <div className="flex flex-col space-y-3">
                    <label htmlFor="" className="text-cyan-900 dark:text-cyan-50">
                        Test Name:
                    </label>
                    <input
                        type="text"
                        onChange={(e) => setTestName(e.target.value)}
                        className="border-2 border-emerald-600 rounded p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
                    />
                </div>
                <div className="flex flex-col space-y-3">
                    <label htmlFor="" className="text-cyan-900 dark:text-cyan-50">
                        Date of Test:
                    </label>
                    <input
                        type="date"
                        onChange={(e) => setTestDate(e.target.value)}
                        className="border-2 border-emerald-600 rounded p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
                    />
                </div>
                <div className="flex flex-col space-y-3">
                    <label htmlFor="" className="text-cyan-900 dark:text-cyan-50">
                        Term:
                    </label>
                    <select
                        onChange={(e) => setTerm(e.target.value)}
                        className="border-2 border-emerald-600 rounded p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
                    >
                        <option value="">Select Period</option>
                        <option value="First Term">First Term</option>
                        <option value="Second Term">Second Term</option>
                        <option value="Third Term">Third Term</option>
                    </select>
                </div>
                <div className="flex flex-col space-y-3">
                    <label htmlFor="" className="text-cyan-900 dark:text-cyan-50">
                        Grade:
                    </label>
                    <select
                        onChange={(e) => setGrade(e.target.value)}
                        className="border-2 border-emerald-600 rounded p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
                    >
                        <option value="">Select Grade</option>
                        <option value="1">Grade 1</option>
                        <option value="2">Grade 2</option>
                        <option value="3">Grade 3</option>
                    </select>
                </div>
                <div className="flex flex-col space-y-3">
                    <input
                        type="submit"
                        className={`border-2 ${excelData ? "bg-cyan-700" : "bg-slate-400"
                            } border-emerald-600 rounded p-2 text-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-36`}
                        disabled={!excelFile}
                    />
                </div>
            </form>
        </div>
    );
}

export default UploadTests;
