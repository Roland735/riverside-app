import { connectDB } from "@/configs/dbConfig";
import { userModel } from "@/models/userModel";
import { Teacher } from "@/models/Teacher";
import { studentsModel } from "@/models/Demographic";
import { NextResponse } from "next/server";

connectDB();

// Function to generate registration number
const generateRegNumber = async () => {
  const lastUser = await userModel.findOne().sort({ regNumber: -1 });
  let lastRegNumber = 0;
  if (lastUser) {
    lastRegNumber = parseInt(lastUser.regNumber.substring(3, 9));
  }

  const nextRegNumber = lastRegNumber + 1;
  const yearLastDigit = new Date().getFullYear() % 100;
  return `S${yearLastDigit.toString().padStart(2, "0")}${nextRegNumber.toString().padStart(6, "0")}A`;
};

export const POST = async (req) => {
  const {
    firstname, lastname, role, email, password,
    studentData // This should contain all student-related fields
  } = await req.json();

  console.log("hi");
  await connectDB();

  console.log("hi");
  // Check if the email is already registered
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    return NextResponse.json(
      { message: "Email is already registered" },
      { status: 400 }
    );
  }

  // Generate registration number for user
  const userRegNumber = await generateRegNumber();

  // Create a new teacher if the role is "teacher"
  if (role === "teacher") {
    const newTeacher = await Teacher.create({
      name: `${firstname} ${lastname}`,
      email: email
    });
  }

  // Create the user
  const newUser = await userModel.create({
    firstname, lastname, role, regNumber: userRegNumber, email, password
  });

  // If student data exists, create a new student record
  if (role === "student") {
    console.log("hi");

    const studentRegNumber = newUser.regNumber; // Separate reg number for the student
    console.log(studentRegNumber);

    const newStudent = await studentsModel.create({
      name: studentData.name || firstname, // Use student's name or fallback to user's first name
      lastName: lastname,
      regNumber: studentRegNumber, // Separate regNumber for student
      emailAddress: email,
    });

    if (!newStudent) {
      return NextResponse.json(
        { message: "Failed to create student record" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { message: "User and student registered successfully" },
    { status: 201 }
  );
};
