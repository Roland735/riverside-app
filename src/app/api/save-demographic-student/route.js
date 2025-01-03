import { NextResponse } from 'next/server';
import { connectDB } from "@/configs/dbConfig";
import { studentsModel } from '@/models/Demographic';
import { userModel } from "@/models/userModel"; // Import user model for guardian account creation

// Function to generate a new registration number for users
const generateRegNumber = async () => {
    const lastUser = await userModel.findOne().sort({ regNumber: -1 });
    let lastRegNumber = 0;
    if (lastUser) {
        lastRegNumber = parseInt(lastUser.regNumber.substring(3, 9));
    }

    const nextRegNumber = lastRegNumber + 1;
    const yearLastDigit = new Date().getFullYear() % 100;
    return `S${yearLastDigit.toString().padStart(2, "0")}${nextRegNumber.toString().padStart(6, "0")}G`; // G for guardian
};

// Function to generate a password for new users
const generatePassword = (lastname) => {
    const year = new Date().getFullYear();
    return `${lastname.charAt(0).toUpperCase() + lastname.slice(1)}@${year}`;
};

export async function POST(req) {
    // Ensure the database is connected
    await connectDB();

    try {
        const { studentData, studRegNumber } = await req.json(); // Parse request data
        console.log(studentData);

        // Check if a student with the same Registration Number exists
        const existingStudent = await studentsModel.findOne({
            regNumber: studRegNumber
        });

        if (existingStudent) {
            // Existing student update logic...
            console.log("Updating student record...");

            // Basic Student Details
            existingStudent.regNumber = studentData.regNumber;
            existingStudent.name = studentData.name;
            existingStudent.lastName = studentData.lastName;
            existingStudent.emailAddress = studentData.emailAddress;
            existingStudent.contact1 = studentData.contact1;
            existingStudent.contact2 = studentData.contact2;
            existingStudent.addressLine1 = studentData.addressLine1;
            existingStudent.addressLine2 = studentData.addressLine2;
            existingStudent.cityTown = studentData.cityTown;
            existingStudent.state = studentData.state;
            existingStudent.pinCode = studentData.pinCode;
            existingStudent.country = studentData.country;
            existingStudent.gender = studentData.gender;
            existingStudent.bloodGroup = studentData.bloodGroup;
            existingStudent.dateOfAdmission = studentData.dateOfAdmission;
            existingStudent.classRollNumber = studentData.classRollNumber;
            existingStudent.admissionCategory = studentData.admissionCategory;
            existingStudent.pickUpPoint = studentData.pickUpPoint;
            existingStudent.sportsHouse = studentData.sportsHouse;
            existingStudent.birthPlace = studentData.birthPlace;

            // Previous School Details
            existingStudent.previousSchool = {
                schoolName: studentData.previousSchool.schoolName,
                schoolAddress: studentData.previousSchool.schoolAddress,
                board: studentData.previousSchool.board,
                mediumOfInstruction: studentData.previousSchool.mediumOfInstruction,
                tcNumber: studentData.previousSchool.tcNumber,
                lastClassPassed: studentData.previousSchool.lastClassPassed,
                percentageGrade: studentData.previousSchool.percentageGrade,
                lastYearOfPassing: studentData.previousSchool.lastYearOfPassing,
            };

            // Medical Report Data (Removed medical details)
            existingStudent.allergies = studentData.allergies;
            existingStudent.dietRestrictions = studentData.dietRestrictions;
            existingStudent.medicalConditions = studentData.medicalConditions;
            existingStudent.medications = studentData.medications;
            existingStudent.insuaranceProvider = studentData.insuaranceProvider;
            existingStudent.policyNumber = studentData.policyNumber;
            existingStudent.weightKg = studentData.weightKg;
            existingStudent.heightCm = studentData.heightCm;
            existingStudent.bmi = studentData.bmi;
            existingStudent.pulseRate = studentData.pulseRate;
            existingStudent.haemoglobin = studentData.haemoglobin;
            existingStudent.immunisation = studentData.immunisation;
            existingStudent.immunisationRemarks = studentData.immunisationRemarks;



            // Update the guardian with the student details
            const prevGuardian1 = existingStudent.guardian1 || {};
            const newGuardian1 = studentData.guardian1;
            const prevGuardian2 = existingStudent.guardian2 || {};
            const newGuardian2 = studentData.guardian2;
            const prevGuardian3 = existingStudent.guardian3 || {};
            const newGuardian3 = studentData.guardian3;

            console.log(newGuardian1.account);
            console.log(!prevGuardian1.account);



            // Check if guardian account creation status changed from false to true
            if (!prevGuardian1.account && newGuardian1?.account === true) {
                await createGuardianAccount(newGuardian1);

            }
            if (!prevGuardian2.account && newGuardian2?.account === true) {
                await createGuardianAccount(newGuardian2);
            }

            if (!prevGuardian3.account && newGuardian3?.account === true) {
                await createGuardianAccount(newGuardian3);
            }

            // Update basic student data and other fields as required
            await existingStudent.save();

            // Update the student's details in the guardian's account
            if (newGuardian1?.email) {
                const guardian = await userModel.findOne({ email: newGuardian1.email });
                console.log("hi");

                if (guardian) {
                    // Check if the student is already in the guardian's students list
                    console.log("hi");

                    const studentExistsInGuardian = guardian.students.some(student => student.regNumber === studRegNumber);
                    console.log("hi");

                    if (!studentExistsInGuardian) {
                        // Add the student to the guardian's students array
                        console.log("lol", existingStudent);

                        guardian.students.push({
                            firstname: existingStudent.name,
                            lastname: existingStudent.lastName,
                            regNumber: studRegNumber,
                            email: "sl@hmdod.com",
                            profilePicture: "",
                            class: "6 blue",
                        });

                        console.log("hiugfggchbvcgfxdfxszwzrfxzfxftyhdtrydyrtrddrydrcfhg lorem", guardian);


                        await guardian.save();

                        existingStudent.guardian1 = newGuardian1;
                        console.log("hi");
                        // Update basic student data and other fields as required
                        await existingStudent.save();

                    }
                }
            }

            if (newGuardian2?.email) {
                const guardian = await userModel.findOne({ email: newGuardian2.email });
                console.log("hi");

                if (guardian) {
                    // Check if the student is already in the guardian's students list
                    console.log("hi");

                    const studentExistsInGuardian = guardian.students.some(student => student.regNumber === studRegNumber);
                    console.log("hi");

                    if (!studentExistsInGuardian) {
                        // Add the student to the guardian's students array
                        console.log("lol", existingStudent);

                        guardian.students.push({
                            firstname: existingStudent.name,
                            lastname: existingStudent.lastName,
                            regNumber: studRegNumber,
                            email: "sl@hmdod.com",
                            profilePicture: "",
                            class: "6 blue",
                        });

                        console.log("hiugfggchbvcgfxdfxszwzrfxzfxftyhdtrydyrtrddrydrcfhg lorem", guardian);


                        await guardian.save();

                        existingStudent.guardian3 = newGuardian2;
                        console.log("hi");
                        // Update basic student data and other fields as required
                        await existingStudent.save();

                    }
                }
            }
            if (newGuardian3?.email) {
                const guardian = await userModel.findOne({ email: newGuardian3.email });
                console.log("hi");

                if (guardian) {
                    // Check if the student is already in the guardian's students list
                    console.log("hi");

                    const studentExistsInGuardian = guardian.students.some(student => student.regNumber === studRegNumber);
                    console.log("hi");

                    if (!studentExistsInGuardian) {
                        // Add the student to the guardian's students array
                        console.log("lol", existingStudent);

                        guardian.students.push({
                            firstname: existingStudent.name,
                            lastname: existingStudent.lastName,
                            regNumber: studRegNumber,
                            email: "sl@hmdod.com",
                            profilePicture: "",
                            class: "6 blue",
                        });

                        console.log("hiugfggchbvcgfxdfxszwzrfxzfxftyhdtrydyrtrddrydrcfhg lorem", guardian);


                        await guardian.save();

                        existingStudent.guardian3 = newGuardian3;
                        console.log("hi");
                        // Update basic student data and other fields as required
                        await existingStudent.save();

                    }
                }
            }



            return NextResponse.json(
                { message: 'Student data updated successfully', student: existingStudent },
                { status: 200 }
            );
        } else {


            // Create a new student document if no existing student found
            const newStudent = new studentsModel({
                name: studentData.firstname,
                lastName: studentData.lastname,
                regNumber: studRegNumber,
                // Map other student details...
                guardian1: studentData.guardians[0],
                guardian2: studentData.guardians[1],
            });
            console.log("hi");


            // Save the new student document
            await newStudent.save();

            // **Guardian Account Creation**
            const guardian1 = studentData.guardians[0];
            if (guardian1?.account) {
                await createGuardianAccount(guardian1);
            }

            return NextResponse.json(
                { message: 'Student and guardian data saved successfully', student: newStudent },
                { status: 201 }
            );
        }
    } catch (error) {
        console.error('Error saving student or guardian data:', error);
        return NextResponse.json(
            { message: 'Server error. Please try again later.' },
            { status: 500 }
        );
    }
}

// Function to handle guardian account creation
const createGuardianAccount = async (guardian) => {
    if (guardian.email) {
        console.log("Hi");

        // Check if the guardian's email is already registered
        const existingGuardian = await userModel.findOne({ email: guardian.email });

        if (!existingGuardian) {
            // Generate registration number and password for the guardian
            const guardianRegNumber = await generateRegNumber();
            const guardianPassword = generatePassword(guardian.lastname);

            // Create the guardian user account
            const newGuardian = await userModel.create({
                firstname: guardian.name,
                lastname: guardian.lastname,
                email: guardian.email,
                role: 'parent',
                regNumber: guardianRegNumber,
                password: guardianPassword
            });

            console.log('New guardian account created:', newGuardian);
        } else {
            console.log('Guardian email is already registered.');
        }
    } else {
        console.log('Guardian email is required to create an account.');
    }
};
