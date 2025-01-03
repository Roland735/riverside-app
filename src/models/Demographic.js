const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    image: {
        type: String,
        default: null
    },
    lastName: {
        type: String,
        required: false
    },
    nationalIdNumber: {
        type: String,
        unique: true
    },
    regNumber: {
        type: String,
        unique: true
    },
    emailAddress: {
        type: String,
        unique: true
    },
    contact1: {
        type: String,
        default: null
    },
    contact2: {
        type: String,
        default: null
    },
    address: {
        type: String,
        default: null
    },
    doctorName: {
        type: String,
        default: null
    },
    doctorEmail: {
        type: String,
        default: null
    },
    doctorContact1: {
        type: String,
        default: null
    },
    doctorContact2: {
        type: String,
        default: null
    },
    allergies: {
        type: String,
        default: null
    },
    doctorPlaceOfWork: {
        type: String,
        default: null
    },
    dietRestrictions: {
        type: String,
        default: null
    },
    medicalConditions: {
        type: String,
        default: null
    },
    medications: {
        type: String,
        default: null
    },
    insuaranceProvider: {
        type: String,
        default: null
    },
    policyNumber: {
        type: String,
        default: null
    },
    guardian1: {
        name: {
            type: String,
            default: null
        },
        lastname: {
            type: String,
            default: null
        },
        email: {
            type: String,
            default: null
        },
        contact1: {
            type: String,
            default: null
        },
        contact2: {
            type: String,
            default: null
        },
        emergencyContact: {
            type: String,
            default: null
        },
        educationalQualification: {
            type: String,
            default: null
        },
        occupation: {
            type: String,
            default: null
        },
        workOrganizationName: {
            type: String,
            default: null
        },
        designation: {
            type: String,
            default: null
        },
        annualIncome: {
            type: Number,
            default: null
        },
        officeContactNumber: {
            type: String,
            default: null
        },
        bankName: {
            type: String,
            default: null
        },
        bankAccountNumber: {
            type: String,
            default: null
        },
        ifscCode: {
            type: String,
            default: null
        },
        accountHolderName: {
            type: String,
            default: null
        },
        account: {
            type: Boolean,
            default: false
        }
    },
    guardian2: {
        name: {
            type: String,
            default: null
        },
        lastname: {
            type: String,
            default: null
        },
        email: {
            type: String,
            default: null
        },
        contact1: {
            type: String,
            default: null
        },
        contact2: {
            type: String,
            default: null
        },
        emergencyContact: {
            type: String,
            default: null
        },
        educationalQualification: {
            type: String,
            default: null
        },
        occupation: {
            type: String,
            default: null
        },
        workOrganizationName: {
            type: String,
            default: null
        },
        designation: {
            type: String,
            default: null
        },
        annualIncome: {
            type: Number,
            default: null
        },
        officeContactNumber: {
            type: String,
            default: null
        },
        bankName: {
            type: String,
            default: null
        },
        bankAccountNumber: {
            type: String,
            default: null
        },
        ifscCode: {
            type: String,
            default: null
        },
        accountHolderName: {
            type: String,
            default: null
        },
        account: {
            type: Boolean,
            default: false
        }
    },
    guardian3: {
        name: {
            type: String,
            default: null
        },
        lastname: {
            type: String,
            default: null
        },
        email: {
            type: String,
            default: null
        },
        contact1: {
            type: String,
            default: null
        },
        contact2: {
            type: String,
            default: null
        },
        emergencyContact: {
            type: String,
            default: null
        },
        educationalQualification: {
            type: String,
            default: null
        },
        occupation: {
            type: String,
            default: null
        },
        workOrganizationName: {
            type: String,
            default: null
        },
        designation: {
            type: String,
            default: null
        },
        annualIncome: {
            type: Number,
            default: null
        },
        officeContactNumber: {
            type: String,
            default: null
        },
        bankName: {
            type: String,
            default: null
        },
        bankAccountNumber: {
            type: String,
            default: null
        },
        ifscCode: {
            type: String,
            default: null
        },
        accountHolderName: {
            type: String,
            default: null
        },
        account: {
            type: Boolean,
            default: false
        }
    },
    class: {
        type: String,
        default: null
    },
    section: {
        type: String,
        default: null
    },
    dateOfAdmission: {
        type: Date,
        default: null
    },
    classRollNumber: {
        type: String,
        default: null
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        default: 'Other'
    },
    bloodGroup: {
        type: String,
        default: null
    },
    pickUpPoint: {
        type: String,
        default: null
    },
    sportsHouse: {
        type: String,
        default: null
    },
    birthPlace: {
        type: String,
        default: null
    },
    admissionCategory: {
        type: String,
        default: null
    },
    admissionNo: {
        type: String,
        unique: true
    },
    addressLine1: {
        type: String,
        default: null
    },
    addressLine2: {
        type: String,
        default: null
    },
    cityTown: {
        type: String,
        default: null
    },
    state: {
        type: String,
        default: null
    },
    pinCode: {
        type: String,
        default: null
    },
    country: {
        type: String,
        default: null
    },
    religion: {
        type: String,
        default: null
    },
    category: {
        type: String,
        default: null
    },
    rte: { // Right To Education
        type: Boolean,
        default: false
    },
    nationality: {
        type: String,
        default: null
    },
    pwd: { // Person with Disability
        type: Boolean,
        default: false
    },
    disabilityType: {
        type: String,
        default: null
    },
    identificationMark: {
        type: String,
        default: null
    },
    motherTongue: {
        type: String,
        default: null
    },
    secondLanguage: {
        type: String,
        default: null
    },
    emergencyContactNumber: {
        type: String,
        default: null
    },
    weightKg: {
        type: Number,
        default: null
    },
    heightCm: {
        type: Number,
        default: null
    },
    bmi: { // Body Mass Index
        type: Number,
        default: null
    },
    pulseRate: {
        type: Number,
        default: null
    },
    haemoglobin: {
        type: Number,
        default: null
    },
    allergies: {
        type: String,
        default: null
    },
    immunisation: {
        type: String,
        default: null
    },
    immunisationRemarks: {
        type: String,
        default: null
    },
    previousSchool: {
        schoolName: {
            type: String,
            default: null
        },
        schoolAddress: {
            type: String,
            default: null
        },
        board: {
            type: String,
            default: null
        },
        mediumOfInstruction: {
            type: String,
            default: null
        },
        tcNumber: {
            type: String,
            default: null
        },
        lastClassPassed: {
            type: String,
            default: null
        },
        percentageGrade: {
            type: String,
            default: null
        },
        lastYearOfPassing: {
            type: String,
            default: null
        }
    }
});

export const studentsModel = mongoose.models.students || mongoose.model('students', studentSchema);
