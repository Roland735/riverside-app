import mongoose from "mongoose";
const { Schema } = mongoose;


// Define the Subject schema
const subjectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: String,
        required: true
    },
    updatedBy: {
        type: String,

    },
    deletedBy: {
        type: String,

    },
    deletedAt: {
        type: Date,
        default: Date.now
    },
    deleted: {
        type: Boolean,
        default: false
    },



});

// Export the Subject model
export const Subject = mongoose.models.Subject || mongoose.model("Subject", subjectSchema);
