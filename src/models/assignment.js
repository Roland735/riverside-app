import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({

    course_id: {
        type: String,
        required: true,
        //  ref: 'Course' // Reference to Course model (create if needed)
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    grade: {
        type: String,
        required: true
    },
    due_date: {
        type: Date,
        required: true
    },
    instructions: {
        type: String
    },
    created_by: {
        type: String,
        required: true,
        ref: 'Teacher' // Reference to Teacher model (create if needed)
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

export const assignmentModel =
    mongoose.models.Assignment || mongoose.model("Assignment", assignmentSchema);
