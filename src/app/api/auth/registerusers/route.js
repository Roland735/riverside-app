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
    const password = `${lastname.charAt(0).toUpperCase() + lastname.slice(1)}@${year}`;
    console.log("Generated Password:", password); // Log password
    return password;
};

export const POST = async (req) => {
    const excelData = await req.json();
    console.log("Received Excel Data:", excelData); // Log received data

    await connectDB();

    const createdUsers = [];
    const errors = [];

    for (const user of excelData) {
        const { firstname, lastname, role, email, studentData } = user;

        console.log(`Processing User: ${email}`); // Log user being processed

        // Check if the email is already registered
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            console.log(`Email ${email} is already registered`); // Log if email exists
            errors.push({ email, message: "Email is already registered" });
            continue;
        }

        // Generate registration number
        let regNumber = await generateRegNumber();
        console.log(`Generated Registration Number for ${firstname} ${lastname}: ${regNumber}`); // Log registration number


        // Generate password
        const password = generatePassword(lastname);

        // Create a new teacher if the role is "teacher"
        if (role === "teacher") {
            console.log(`Creating Teacher: ${firstname} ${lastname}`);
            await Teacher.create({
                name: `${firstname} ${lastname}`,
                email: email
            });
        }

        // Create the user
        try {
            console.log(`Creating User: ${firstname} ${lastname}`);
            const newUser = await userModel.create({
                firstname,
                lastname,
                role,
                regNumber,
                email,
                password
            });
            createdUsers.push(newUser);
            console.log(`User Created: ${newUser.email}`); // Log user creation

            // If role is "student", create a student record
            if (role === "student") {
                console.log("Creating Student Record for:", email);

                // await studentsModel.create({
                //     name: studentData?.name || firstname,
                //     lastName: lastname,
                //     regNumber: newUser.regNumber,
                //     emailAddress: email,
                //     contact1: studentData?.contact1,
                //     address: studentData?.address,
                //     guardian1: studentData?.guardian1,
                //     class: studentData?.class,
                //     section: studentData?.section,
                //     dateOfAdmission: studentData?.dateOfAdmission,
                //     gender: studentData?.gender,
                //     bloodGroup: studentData?.bloodGroup
                //     // Additional fields from studentData...
                // });
                console.log(`Student Record Created for ${email}`); // Log student creation
            }
        } catch (error) {
            console.log(`Error creating user for ${email}:`, error.message); // Log error
            errors.push({ email, message: error.message });
        }
    }

    if (errors.length > 0) {
        console.log("Errors encountered:", errors); // Log any errors
        return NextResponse.json(
            { message: "Some users were not registered successfully", errors },
            { status: 400 }
        );
    }

    console.log("Users successfully registered:", createdUsers); // Log successfully created users
    return NextResponse.json(
        { message: "Users registered successfully", createdUsers },
        { status: 201 }
    );
};
