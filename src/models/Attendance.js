import mongoose from "mongoose";

const { Schema } = mongoose;

// Define the Teacher schema
const teacherSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

// Define the Student schema
const studentSchema = new Schema({
    reg_number: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
});

// Define the Attendance schema
const attendanceSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    classAttendance: [{
        className: {
            type: String,
            required: true
        },
        attendance: [{
            student: studentSchema,
            status: {
                type: String,
                enum: ['Present', 'Absent', 'Late', 'Excused', 'Sick'],
                required: true
            }
        }]
    }],
    teacherAttendance: [{
        teacher: teacherSchema,
        status: {
            type: String,
            enum: ['Present', 'Absent', 'Late', 'Excused', 'Sick', 'Holiday', 'Leave'],
            required: true
        }
    }]
});

// Check if the model is already defined, if not, define it
export const Attendance = mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema);
