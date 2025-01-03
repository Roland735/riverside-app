import { connectDB } from "@/configs/dbConfig";
import { userModel } from "@/models/userModel";
import { Teacher } from "@/models/Teacher";
import { studentsModel } from "@/models/Demographic";
import { NextResponse } from "next/server";

connectDB();

// Function to generate unique registration number
const generateRegNumber = async () => {
  const lastUser = await userModel.findOne().sort({ regNumber: -1 });

  let lastRegNumber = 0;

  if (lastUser) {
    lastRegNumber = parseInt(lastUser.regNumber.substring(3, 9));
    console.log("Registration Number:", lastRegNumber); // Log the unique registration number

  }

  let nextRegNumber = lastRegNumber + 1;
  const yearLastDigit = new Date().getFullYear() % 100;
  let regNumber;

  while (true) {
    regNumber = `S${yearLastDigit.toString().padStart(2, "0")}${nextRegNumber.toString().padStart(6, "0")}A`;

    // Check if the regNumber exists
    const found = await userModel.findOne({ regNumber });
    if (!found) {
      break; // Exit the loop if no user is found
    }

    // Increment the number to try the next one
    nextRegNumber += 1;
  }

  console.log("Generated Uniqu Registration Number:", regNumber); // Log the unique registration number
  return regNumber;
};


// Function to generate password
const generatePassword = (lastname) => {
  const year = new Date().getFullYear();
  return `${lastname.charAt(0).toUpperCase() + lastname.slice(1)}@${year}`;
};

export const POST = async (req) => {

  console.log("hi")
  const excelData = await req.json();

  console.log("hi")

  const createdUsers = [];
  const errors = [];
  console.log("hi")
  for (const user of excelData) {
    const { firstname, lastname, role, email, studentData } = user;
    console.log("hi")
    // Check if the email is already registered
    const existingUser = await userModel.findOne({ email });
    console.log("h es")
    if (existingUser) {
      errors.push({
        user,
        message: "Email is already registered",
      });
      continue;
    }


    // Generate registration number
    const regNumber = await generateRegNumber();
    console.log(regNumber);


    // Generate password
    const password = generatePassword(lastname);

    try {
      // Create a new teacher if the role is "teacher"
      console.log("Creating", firstname, "reg :", regNumber)
      if (role === "teacher") {
        await Teacher.create({
          name: `${firstname} ${lastname}`,
          email: email,
        });
      }


      // Create the user
      const newUser = await userModel.create({
        firstname,
        lastname,
        role,
        regNumber,
        email,
        password,
      });
      createdUsers.push(newUser);
      console.log("Created", firstname, "reg :", regNumber)

      // If role is "student", create a student record


    } catch (error) {
      console.log(error);

      errors.push({
        user,
        message: error.message,
      });
    }
  }

  if (errors.length > 0) {
    return NextResponse.json(
      {
        message: "Some users were not registered successfully",
        errors,
      },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      message: "Users registered successfully",
      createdUsers,
    },
    { status: 201 }
  );
};
