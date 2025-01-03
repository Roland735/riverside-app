import { motion } from "framer-motion";
import {
    FaChalkboardTeacher,
    FaExclamationTriangle,
    FaCheckCircle,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { AiOutlineUser } from "react-icons/ai";

const COLORS = ["#00C49F", "#FFBB28"];

const getGradeColor = (averageMark) => {
    if (averageMark >= 90) return { grade: "A+", color: "bg-blue-500" };
    if (averageMark >= 80) return { grade: "A", color: "bg-green-900" };
    if (averageMark >= 70) return { grade: "B", color: "bg-green-600" };
    if (averageMark >= 60) return { grade: "C", color: "bg-yellow-500" };
    if (averageMark >= 50) return { grade: "D", color: "bg-orange-500" };
    if (averageMark >= 40) return { grade: "E", color: "bg-red-500" };
    if (averageMark >= 36) return { grade: "F", color: "bg-red-700" };
    return { grade: "U", color: "bg-red-900" };
};

const gettColor = (averageMark) => {
    if (averageMark >= 90) return { Tgrade: "A+", tcolor: "bg-blue-500" };
    if (averageMark >= 80) return { Tgrade: "A", tcolor: "bg-green-900" };
    if (averageMark >= 70) return { Tgrade: "B", tcolor: "bg-green-500" };
    if (averageMark >= 60) return { Tgrade: "C", tcolor: "bg-yellow-500" };
    if (averageMark >= 50) return { Tgrade: "D", tcolor: "bg-orange-500" };
    if (averageMark >= 40) return { Tgrade: "E", tcolor: "bg-red-500" };
    if (averageMark >= 36) return { Tgrade: "F", tcolor: "bg-red-700" };
    return { grade: "U", color: "bg-red-900" };
};

const getacolor = (averageMark) => {
    if (averageMark >= 90) return { Agrade: "A+", acolor: "bg-blue-500" };
    if (averageMark >= 80) return { Agrade: "A", acolor: "bg-green-900" };
    if (averageMark >= 70) return { Agrade: "B", acolor: "bg-green-500" };
    if (averageMark >= 60) return { Agrade: "C", acolor: "bg-yellow-500" };
    if (averageMark >= 50) return { Agrade: "D", acolor: "bg-orange-500" };
    if (averageMark >= 40) return { Agrade: "E", acolor: "bg-red-500" };
    if (averageMark >= 36) return { Agrade: "F", acolor: "bg-red-700" };
    return { grade: "U", color: "bg-red-900" };
};

const SubjectList = ({ student, userRole }) => {
    const router = useRouter();

    const handleCardClick = (subjectName, grade) => {

        router.push(`/dashboard/${userRole}/subjects/${subjectName}/${grade}/${2025}`);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-xl my-8 font-semibold border-b-2 border-rose-700 text-rose-900 dark:text-rose-50">
                My Subjects
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
                {student.subjects.map((subject, index) => {
                    const completedTopics = subject.topics.filter(
                        (topic) => topic.completed
                    ).length;
                    const totalTopics = subject.topics.length;
                    const completedPercentage = (
                        (completedTopics / totalTopics) *
                        100
                    ).toFixed(2);

                    const pieData = [
                        { name: "Completed", value: completedTopics },
                        { name: "Not Completed", value: totalTopics - completedTopics },
                    ];

                    const onTrack = completedPercentage >= 70; // Example threshold for "on track"

                    // Calculate average mark, grade, and color
                    const averageMark =
                        (subject.testAverageMark + subject.assignmentAverageMark) / 2;
                    const { grade, color } = getGradeColor(averageMark);
                    const { Agrade, acolor } = getacolor(subject.assignmentAverageMark);
                    const { Tgrade, tcolor } = gettColor(subject.testAverageMark);

                    return (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCardClick(subject.name, subject.className)}
                            className="border-2  border-rose-400 dark:bg-slate-700 rounded-lg shadow-lg p-6 cursor-pointer transform transition-transform duration-200 hover:shadow-xl"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-semibold text-gray-800 dark:text-rose-50">
                                    {subject.name}
                                </h2>
                                <span className="text-sm text-gray-400 dark:text-slate-300">
                                    {subject.className}
                                </span>
                            </div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="">
                                    <div className="ml-4">
                                        <FaChalkboardTeacher className="mr-2 text-blue-500 inline-block" />
                                        <span className="font-medium text-gray-600 dark:text-slate-300">
                                            Teachers:
                                        </span>
                                    </div>{" "}
                                    <ul className="list-disc list-inside pl-6 mb-4 text-gray-600 dark:text-slate-300">
                                        {subject.teachers.map((teacher, teacherIndex) => (
                                            <li key={teacherIndex}>{teacher}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div
                                    className={`p-4 rounded-full flex flex-col items-center justify-center ${color} `}
                                >
                                    <span className="text-white  font-bold">
                                        {averageMark.toFixed(2)}
                                    </span>
                                    <span className="text-white font-bold">{grade}</span>
                                </div>
                            </div>
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-rose-50">
                                    Completed Topics
                                </h3>
                                {pieData.length > 0 ? <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>


                                        <Pie
                                            data={pieData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            fill="#8884d8"
                                            label
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={COLORS[index % COLORS.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer> : <p className="text-gray-600">No completed topics</p>}

                                <p className="text-center text-gray-600">
                                    {completedPercentage > 0 ? completedPercentage : 0}% completed
                                </p>
                            </div>
                            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div
                                    className={`flex items-center justify-between  p-2 rounded-lg w-full ${acolor}`}
                                >
                                    <p className="text-gray-900 text-lg text-start">
                                        <strong>Assignment Mark</strong>
                                        <br /> {subject.assignmentAverageMark}
                                    </p>
                                    <span className="ml-2 text-2xl h-10 w-10 rounded-full bg-white flex items-center justify-center text-gray-900">
                                        {Agrade}
                                    </span>
                                </div>
                                <div
                                    className={`flex items-center justify-between  p-2 rounded-lg w-full ${tcolor}`}
                                >
                                    <p className="text-gray-900 text-lg text-start">
                                        <strong>Test Mark</strong>
                                        <br /> {subject.testAverageMark}
                                    </p>
                                    <span className="ml-2 text-2xl h-10 w-10 rounded-full bg-white flex items-center justify-center text-gray-900">
                                        {Tgrade}
                                    </span>
                                </div>

                                <div className="flex items-center bg-gray-200 p-2 rounded-lg w-full">
                                    <AiOutlineUser className="mr-2 text-gray-900" />
                                    <p className="text-gray-900">
                                        <strong>Number of Students:</strong>
                                        <br /> {subject.studentsCount}
                                    </p>
                                </div>
                            </div>
                            {subject.anomalies?.length > 0 && ( // Conditionally render anomalies
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold mb-2 text-gray-800">
                                        Anomalies
                                    </h3>
                                    <ul className="list-disc list-inside pl-6 text-gray-600">
                                        {subject.anomalies.map((anomaly, anomalyIndex) => (
                                            <li key={anomalyIndex}>
                                                <FaExclamationTriangle className="inline-block mr-2 text-yellow-500" />
                                                {anomaly}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <div className="flex items-center">
                                {onTrack ? (
                                    <FaCheckCircle className="text-green-500 mr-2" />
                                ) : (
                                    <FaExclamationTriangle className="text-red-500 mr-2" />
                                )}
                                <span className="text-gray-400">
                                    {onTrack ? "On Track" : "Not On Track"}
                                </span>
                            </div>
                            {/* <button
  className=" bg-green-500 p-3 my-4 rounded-md"
  onClick={handleCardClick(subjectName, grade)}
>
  {" "}
  More Info
</button> */}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};


export default SubjectList;
