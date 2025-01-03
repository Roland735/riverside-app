import mongoose from "mongoose";
import { Duru_Sans } from "next/font/google";

const { Schema } = mongoose;



// Define the Class schema
const classSchema = new Schema({
    className: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    subjects: [String], // Assuming subjects are represented by their names
    averageMark: {
        type: Number,
        default: 0
    }
});

// Define the Teacher schema
const teacherSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    registrationNumber: {
        type: String,
    },
    active: {
        type: Boolean,
        default: true
    },
    activeClasses: [{
        className: String,
        subjects: [String],

    }], // Array of active classes with their subjects
    classesTaught: [{
        class: classSchema,
        yearTaught: Number,
        averageMark: Number
    }]
});

// Check if the model is already defined, if not, define it
export const Teacher = mongoose.models.Teacher || mongoose.model("Teacher", teacherSchema);
