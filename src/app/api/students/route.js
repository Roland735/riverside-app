// import connectDB from '../../utils/db'; // Assuming connectDB function is defined elsewhere


// export default async function handler(req, res) {
//     if (req.method === 'POST') {
//         const {
//             name,
//             lastName,
//             nationalIdNumber,
//             email,
//             contact1,
//             contact2,
//             address,
//             // ... other student information
//             doctorName,
//             doctorEmail,
//             doctorContact1,
//             doctorContact2,
//             allergies,
//             doctorPlaceOfWork,
//             dietRestrictions,
//             guardian1,
//             guardian2,
//         } = req.body;

//         try {
//             await connectDB();

//             const newStudent = new Student({
//                 name,
//                 lastName,
//                 nationalIdNumber,
//                 email,
//                 contact1,
//                 contact2,
//                 address,
//                 // ... other student information
//                 doctorName,
//                 doctorEmail,
//                 doctorContact1,
//                 doctorContact2,
//                 allergies,
//                 doctorPlaceOfWork,
//                 dietRestrictions,
//                 guardian1,
//                 guardian2,
//             });

//             const savedStudent = await newStudent.save();
//             res.status(201).json({ message: 'Student created successfully!', student: savedStudent });
//         } catch (error) {
//             console.error('Error creating student:', error);
//             res.status(500).json({ message: 'Error creating student' });
//         }
//     } else {
//         res.status(405).json({ message: 'Method not allowed' });
//     }
// }
