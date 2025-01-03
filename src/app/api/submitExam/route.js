// // /pages/api/marks/submit.js
// import { connectDB } from "@/configs/dbConfig";
// import { Mark } from "@/models/Mark";
// import { NextResponse } from "next/server";

// connectDB();

// export async function POST(req) {
//     const { examId, marks } = await req.json();

//     marks.forEach(async (mark) => {
//         const newMark = new Mark({ exam: examId, student: mark.student, marks: mark.marks });
//         await newMark.save();
//     });

//     return NextResponse.json({ message: "Marks submitted successfully" });
// }
