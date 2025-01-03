import mongoose from 'mongoose';

// Define the examPeriod schema
const examPeriodSchema = new mongoose.Schema({
    examPeriod: {
        type: String,
        required: true,
    },
    receiveReport: {
        type: Boolean,
        required: true,
        default: false, // Assume by default that the student is receiving the report
    },
    reason: {
        type: String,
        enum: ['Absent', 'Fee Balance', 'Other'],
        default: 'Other'
    },
});

// Define the year schema
const yearSchema = new mongoose.Schema({
    year: {
        type: Number,
        required: true,
    },
    examPeriods: [examPeriodSchema], // Array of exam periods
});

// Define the student report schema
const studentReportSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Change 'Student' to 'User'
        required: true,
    },

    years: [yearSchema], // Array of years with exam periods
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Create or retrieve the StudentReport model
const StudentReport = mongoose.models.StudentReport || mongoose.model('StudentReport', studentReportSchema);

// Export the model
export default StudentReport;
