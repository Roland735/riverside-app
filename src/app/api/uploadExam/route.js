import { connectDB } from "@/configs/dbConfig";
import Exam from "@/models/examModel";
import { NextResponse } from "next/server";
import { storage } from "@/configs/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

connectDB();

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");
        const className = formData.get("className");
        const subjectName = formData.get("subjectName");
        const examIndex = formData.get("examIndex");
        const paperIndex = formData.get("paperIndex");
        console.log(file, className, subjectName, examIndex, paperIndex);


        if (!file || !className || !subjectName || examIndex === null || paperIndex === null) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        // Find the class and exam
        const examClass = await Exam.findOne({ "className": className });
        console.log(examClass);

        if (!examClass) {
            return NextResponse.json({ message: "Class not found" }, { status: 404 });
        }

        const subject = examClass.years.find((yea) => yea.year === 2025).subjects.find((sub) => sub.name === subjectName);
        console.log(subject);

        if (!subject) {
            return NextResponse.json({ message: "Subject not found" }, { status: 404 });
        }


        const exam = subject.exams[examIndex];
        if (!exam) {
            return NextResponse.json({ message: "Exam not found" }, { status: 404 });
        }

        const paper = exam.papers[paperIndex];
        if (!paper) {
            return NextResponse.json({ message: "Paper not found" }, { status: 404 });
        }

        // Upload file to Firebase Storage
        const storageRef = ref(storage, `examPapers/${className}/${subjectName}/${exam.period}/paper_${paper.paperNumber}`);
        try {
            await uploadBytes(storageRef, file);
            const fileUrl = await getDownloadURL(storageRef);

            // Update the paper URL in the database
            paper.paperUrl = fileUrl;
            await examClass.save();

            return NextResponse.json({ message: "Exam paper uploaded successfully", fileUrl }, { status: 200 });
        } catch (uploadError) {
            console.error("Error uploading file to Firebase Storage:", uploadError);
            return NextResponse.json({ message: "Error uploading file to Firebase Storage", error: uploadError.message }, { status: 500 });
        }
    } catch (error) {
        console.error("Error uploading exam paper:", error);
        return NextResponse.json({ message: "Error uploading exam paper", error: error.message }, { status: 500 });
    }
}
