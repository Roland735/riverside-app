import mongoose from "mongoose";

const { Schema } = mongoose;

const examSchema = new Schema({
    exam_id: { type: String, },
    papers: [{
        paper_id: { type: String, },
        paper_number: { type: String, },
        paper_mark: { type: Number },
        paper_percentage: { type: Number },
        paper_position: { type: Number },
        highest: { type: Boolean, default: false },
        absent: { type: Boolean, default: false },
    }],
    term: { type: String },
    exam_mark: { type: Number },
    exam_percentage: { type: Number },
    exam_position: { type: Number },
});

const assignmentSchema = new Schema({
    assignment_id: { type: String, },
    assignment_mark: { type: Number },
    assignment_name: { type: String },
    assignment_percentage: { type: Number },
    assignment_position: { type: Number },
    absent: { type: Boolean, default: false },
    assigned_date: { type: Date },
});

const teacherSchema = new Schema({
    teacher_name: { type: String },
    exams_average: { type: Number },
    assignments_average: { type: Number },
});

const detentionSchema = new Schema({
    date_issued: { type: Date, required: true },
    status: { type: String, required: true },
});

const subjectSchema = new Schema({
    name: { type: String },
    current_teacher: { type: String },
    previous_teachers: [teacherSchema],
    exams: [examSchema],
    subjectAttendance: [{
        date: { type: Date },
        status: { type: String },
    }],
    subjectAverage: { type: Number, default: 0 },
    assignmentAverage: { type: Number, default: 0 },
    testAverage: { type: Number, default: 0 },
    quizzesAverage: { type: Number, default: 0 },
    assignments: [assignmentSchema],
    tests: [{
        test_id: { type: String, },
        test_number: { type: String },
        test_name: { type: String },
        test_mark: { type: Number },
        test_percentage: { type: Number },
        test_position: { type: Number },
        highest: { type: Boolean, default: false },
        absent: { type: Boolean, default: false },
        assigned_date: { type: Date },
    }],
    quizzes: [{
        quiz_id: { type: String, },
        quiz_name: { type: String },
        quiz_mark: { type: Number },
        quiz_percentage: { type: Number },
        quiz_position: { type: Number },
        highest: { type: Boolean, default: false },
        absent: { type: Boolean, default: false },
        assigned_date: { type: Date },
    }],
});

const gradeSchema = new Schema({
    grade: { type: String },
    subjects: [subjectSchema],
    attendance: {
        total_classes: { type: Number, default: 0 },
        attended_classes: { type: Number, default: 0 },
        percentage: { type: Number, default: 0 },
    },
    behavior_status: { type: String, default: 'Good' },
    detention_status: { type: String, default: 'Good' },
    detentions: [detentionSchema],
});

const studentSchema = new Schema({
    reg_number: { type: String, required: true, },
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    grades: [gradeSchema],
});

export const studentModel = mongoose.models.StudentMarks || mongoose.model("StudentMarks", studentSchema);
