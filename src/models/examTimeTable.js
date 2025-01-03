import mongoose from 'mongoose';

const ExamTimetableSchema = new mongoose.Schema({
    period: {
        type: String,
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
    timetable: [{
        className: {
            type: String,
            required: true,
        },
        subjectName: {
            type: String,
            required: true,
        },
        examIndex: {
            type: Number,
            required: true,
        },
        paperNumber: {
            type: Number,
            required: true,
        },
        startTime: {
            type: Date,
            required: true,
        },
        endTime: {
            type: Date,
            required: true,
        },
    }],
}, { timestamps: true });

export default mongoose.models.ExamTimetable || mongoose.model('ExamTimetable', ExamTimetableSchema);
