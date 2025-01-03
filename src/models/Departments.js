import mongoose from 'mongoose';

const { Schema } = mongoose;

const departmentSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    subjects: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Subject', // Reference to the Subject model
        },
    ],
    staffMembers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Teacher', // Reference to the Teacher model
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Check if the model is already compiled
const Department = mongoose.models.Department || mongoose.model('Department', departmentSchema);

export default Department;
