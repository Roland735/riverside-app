import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    assignment_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Assignment' // Reference to Assignment model (create later)
    },
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Student' // Reference to Student model (create if needed)
    },
    submitted_at: {
        type: Date,
        default: Date.now
    },
    content: {
        type: String,
        or: [
            { type: mongoose.Schema.Types.Object } // Allow object for complex content
        ]
    },
    grade: {
        type: Number,
        default: null
    },
    feedback: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model('Submission', submissionSchema);
