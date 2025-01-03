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

    console.log("Generated Unique Registration Number:", regNumber); // Log the unique registration number
    return regNumber;
};


// Function to generate password
const generatePassword = (lastname) => {
    const year = new Date().getFullYear();
    return `${lastname.charAt(0).toUpperCase() + lastname.slice(1)}@${year}`;
};

export const POST = async (req) => {
    const excelData = await req.json();

    await connectDB();

    const createdUsers = [];
    const errors = [];

    for (const user of excelData) {
        const { firstname, lastname, role, email, studentData } = user;

        // Check if the email is already registered
        const existingUser = await userModel.findOne({ email });
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

            // If role is "student", create a student record
            if (role === "student") {
                await studentsModel.create({
                    name: studentData?.name || firstname,
                    lastName: lastname,
                    regNumber: newUser.regNumber,
                    emailAddress: email,
                    contact1: studentData?.contact1,
                    address: studentData?.address,
                    guardian1: studentData?.guardian1,
                    class: studentData?.class,
                    section: studentData?.section,
                    dateOfAdmission: studentData?.dateOfAdmission,
                    gender: studentData?.gender,
                    bloodGroup: studentData?.bloodGroup,
                    // Additional fields from studentData...
                });
            }
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
