import mongoose from "mongoose";

const { Schema } = mongoose;

// Define anomaly schema
const anomalySchema = new Schema({
    student_id: { type: String },
    mark: { type: Number },
    type: { type: String, enum: ["good", "bad"] },
    deviation: { type: Number }
});

// Define anomaly schema for exams
const anomalySchemaExam = new Schema({
    student_id: { type: String },
    mark: { type: Number },
    paperNumber: { type: Number },
    type: { type: String, enum: ["good", "bad"] },
    deviation: { type: Number }
});

// Define paper schema for exams, assignments, and quizzes
const paperSchema = new Schema({
    paper_id: { type: String },
    paper_number: { type: String },
    paper_mark: { type: Number },
    paper_percentage: { type: Number },
    paper_position: { type: Number },
    highest: { type: Boolean, default: false },
    absent: { type: Boolean, default: false },
    assigned_by: { type: String },
});

// Define exam schema
const examSchema = new Schema({
    exam_id: { type: String },
    highest_mark: { type: Number },
    lowest_mark: { type: Number },
    highest_student: { type: String },
    term: { type: String },
    exam_date: { type: Date },
    subject: { type: String },
    class: { type: String },
    average_mark: { type: Number },
    exam_median: { type: Number },
    exam_invigilator: { type: String },
    standard_deviation: { type: Number },
    papers: [paperSchema],
    anomalies: [anomalySchema],
    assigned_by: { type: String },
});

// Define assignment schema
const assignmentSchema = new Schema({
    assignment_id: { type: String },
    assignmentName: { type: String },
    assignment_average_percentage: { type: Number },
    assigned_date: { type: Date },
    absents: { type: Number, default: 0 },
    median: { type: Number },
    range: { type: Number },
    highest_percentage: { type: Number },
    highest_students: [{ type: String }],
    lowest_percentage: { type: Number },
    lowest_students: [{ type: String }],
    standard_deviation: { type: Number },
    term: { type: String },
    grade_class: { type: String },
    subject: { type: String },
    total_assignments: { type: Number },
    anomalies: [anomalySchema],
    assigned_by: { type: String },
});
// Define assignment schema
const testSchema = new Schema({
    test_id: { type: String },
    testName: { type: String },
    test_average_percentage: { type: Number },
    assigned_date: { type: Date },
    absents: { type: Number, default: 0 },
    median: { type: Number },
    range: { type: Number },
    highest_percentage: { type: Number },
    highest_students: [{ type: String }],
    lowest_percentage: { type: Number },
    lowest_students: [{ type: String }],
    standard_deviation: { type: Number },
    term: { type: String },
    grade_class: { type: String },
    subject: { type: String },
    total_tests: { type: Number },
    anomalies: [anomalySchema],
    assigned_by: { type: String },
});

// Define quiz schema
const quizSchema = new Schema({
    quiz_id: { type: String },
    quizName: { type: String },
    quiz_average_percentage: { type: Number },
    assigned_date: { type: Date },
    absents: { type: Number, default: 0 },
    median: { type: Number },
    range: { type: Number },
    highest_percentage: { type: Number },
    highest_students: [{ type: String }],
    lowest_percentage: { type: Number },
    lowest_students: [{ type: String }],
    standard_deviation: { type: Number },
    term: { type: String },
    grade_class: { type: String },
    subject: { type: String },
    total_quiz: { type: Number },
    anomalies: [anomalySchema],
    assigned_by: { type: String },
});

// Define test schema


// Create models for exam, assignment, quiz, and test
export const examModel = mongoose.models.Exam || mongoose.model("Exam", examSchema);
export const assignmentModel = mongoose.models.Assignment || mongoose.model("Assignment", assignmentSchema);
export const quizModel = mongoose.models.Quiz || mongoose.model("Quiz", quizSchema);
export const testModel = mongoose.models.Test || mongoose.model("Test", testSchema);