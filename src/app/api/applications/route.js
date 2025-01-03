// // pages/api/applications.js

// import { connectDB } from "@/configs/dbConfig";
// import { Application } from "@/models/Application";
// import { storage } from "@/configs/firebase";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { NextResponse } from "next/server";

// connectDB();

// export async function POST(req) {
//     try {
//         const formData = await req.formData();

//         // Extract fields from form data
//         const fullName = formData.get('fullName');
//         const dateOfBirth = formData.get('dateOfBirth');
//         const email = formData.get('email');
//         const phone = formData.get('phone');
//         const address = formData.get('address');
//         const guardianName = formData.get('guardianName');
//         const gradeLevel = formData.get('gradeLevel');
//         const interests = formData.get('interests');

//         // Get files from form data
//         const profilePic = formData.get('profilePic');
//         const birthCert = formData.get('birthCert');

//         // Validate required fields
//         if (!fullName || !dateOfBirth || !email || !phone || !guardianName) {
//             return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
//         }

//         // Firebase upload helper function
//         async function uploadFile(file, filename) {
//             const storageRef = ref(storage, `applications/${filename}`);
//             await uploadBytes(storageRef, file);
//             return await getDownloadURL(storageRef);
//         }

//         // Upload files and get URLs
//         const profilePicUrl = profilePic ? await uploadFile(profilePic, `profile-${Date.now()}-${profilePic.name}`) : '';
//         const birthCertUrl = birthCert ? await uploadFile(birthCert, `birthCert-${Date.now()}-${birthCert.name}`) : '';

//         // Create new application document
//         const applicationData = {
//             fullName,
//             dateOfBirth,
//             email,
//             phone,
//             address,
//             guardianName,
//             gradeLevel,
//             interests,
//             profilePicUrl,
//             birthCertUrl,
//         };

//         await Application.create(applicationData);

//         return NextResponse.json({ message: "Application submitted successfully" }, { status: 201 });
//     } catch (error) {
//         console.error("Error submitting application:", error);
//         return NextResponse.json({ message: "Error submitting application", error: error.message }, { status: 500 });
//     }
// }
