import { connectDB } from "@/configs/dbConfig";
import { userModel } from "@/models/userModel";
import { Teacher } from "@/models/Teacher";
import { NextResponse } from "next/server";

connectDB();

// Function to generate unique registration number in the format "Sand####"
const generateRegNumber = async () => {
  // Find the last user with a registration number that matches the pattern "Sand####"
  const lastUser = await userModel.findOne({
    regNumber: { $regex: /^Sand\d{4}$/ }
  }).sort({ regNumber: -1 });

  let lastRegNumber = 0;
  if (lastUser) {
    // Extract the numeric portion after "Sand"
    lastRegNumber = parseInt(lastUser.regNumber.substring(4, 8));
    console.log("Last registration number:", lastRegNumber);
  }

  let nextRegNumber = lastRegNumber + 1;
  let regNumber;

  // Ensure uniqueness in the unlikely event of a duplicate
  while (true) {
    regNumber = `Sand${nextRegNumber.toString().padStart(4, "0")}`;
    const found = await userModel.findOne({ regNumber });
    if (!found) break;
    nextRegNumber += 1;
  }

  console.log("Generated unique registration number:", regNumber);
  return regNumber;
};

// Function to generate password
const generatePassword = (lastname) => {
  const year = new Date().getFullYear();
  return `${lastname.charAt(0).toUpperCase() + lastname.slice(1)}@${year}`;
};

export const POST = async (req) => {
  console.log("hi");
  const excelData = await req.json();
  console.log("hi");

  const createdUsers = [];
  const errors = [];
  console.log("hi");
  
  for (const user of excelData) {
    const { firstname, lastname, role, email } = user;
    console.log("Processing user:", firstname);

    // Check if the email is already registered
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      errors.push({
        user,
        message: "Email is already registered",
      });
      continue;
    }

    // Only generate a registration number if one is not already provided
    const regNumber = user.regNumber;
    console.log("New reg:", regNumber);

    // Generate password
    const password = generatePassword(lastname);

    try {
      // If role is "teacher", create a new teacher record
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
      console.log("Created", firstname, "with reg:", regNumber);
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
