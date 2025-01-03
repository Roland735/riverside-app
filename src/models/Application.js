// models/Application.js

import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    guardianName: { type: String, required: true },
    gradeLevel: { type: String, required: true },
    interests: { type: String },
    profilePicUrl: { type: String }, // Path or URL for profile picture
    birthCertUrl: { type: String },  // Path or URL for birth certificate
    createdAt: { type: Date, default: Date.now }
});

// Export the model or create it if it doesn’t exist
export default mongoose.models.Application || mongoose.model('Application', ApplicationSchema);
