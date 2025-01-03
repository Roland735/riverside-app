// import { Grade } from '@/models/GradeSyllabus';
// import { NextResponse } from 'next/server';

// export async function POST(req) {
//     try {
//         const { className, syllabusTitle, topics } = await req.json();

//         // Validate request body
//         if (!className || !syllabusTitle || !Array.isArray(topics)) {
//             return NextResponse.json({
//                 message: 'Invalid request body. Please provide className, syllabusTitle, and topics array.',
//             }, { status: 400 });
//         }

//         // Create new syllabus document
//         const grade = await Grade.findOneAndUpdate(
//             { className },
//             { $push: { syllabuses: { title: syllabusTitle, topics } } },
//             { new: true, upsert: true }
//         );

//         return NextResponse.json({
//             message: 'Syllabus created successfully',
//             data: grade.syllabuses.find(syllabus => syllabus.title === syllabusTitle),
//         });
//     } catch (error) {
//         console.error('Error creating syllabus:', error);
//         return NextResponse.json({
//             message: 'Error creating syllabus',
//         }, { status: 500 });
//     }
// }
