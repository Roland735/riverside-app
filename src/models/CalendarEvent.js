// models/CalendarEvent.js

import mongoose from 'mongoose';

const calendarEventSchema = new mongoose.Schema({
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => value > new Date(),
            message: 'Event date must be in the future',
        },
    },
    endDate: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => value >= this.startDate,
            message: 'End date must be on or after the start date',
        },
    },
    event: {
        type: String,
        required: true,
        maxlength: 255,
    },
    description: {
        type: String,
        maxlength: 500,
    },
    isFullDay: {
        type: String, // Change this to String to match Full, Half, or No Lessons
        required: true,
        enum: ['Full', 'Half', 'No Lessons'],
    },
    startTime: {
        type: String,
    },
    endTime: {
        type: String,
    },
    timeDuration: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Update the `updatedAt` field before saving the document
calendarEventSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const CalendarEvent = mongoose.models.CalendarEvent || mongoose.model('CalendarEvent', calendarEventSchema);

export default CalendarEvent;
