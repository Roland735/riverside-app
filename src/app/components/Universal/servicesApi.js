// services/api.js
import axios from "axios";

export const getTeacherSubjects = async () => {
    const response = await axios.get("/api/teacher/subjects");
    return response.data;
};

export const getExamPeriods = async (name) => {
    console.log(name);

    const response = await fetch("/api/getExamPeriods", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(name)
    });
    const data = await response.json();
    return data;
};


export const createExam = async (examData) => {
    await axios.post("/api/exam/create", examData);
};

export const getClassesWithExams = async () => {
    const response = await axios.get("/api/admin/classes-exams");
    return response.data;
};

export const confirmExams = async (classesData) => {
    await axios.post("/api/admin/confirm-exams", classesData);
};
