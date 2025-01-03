import mongoose from "mongoose";

const { Schema } = mongoose;

// Define the Teacher schema
const teacherSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

// Define the Topic schema
const topicSchema = new Schema({
    scheduleNumber: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    assignmentAverage: {
        type: Number,
        default: 0
    },
    testAverage: {
        type: Number,
        default: 0
    },
    passed: {
        type: Boolean,
        default: false
    },
    confirmation: {
        type: Boolean,
        default: false
    },
    teachers: [teacherSchema],
    resources: [{
        name: { type: String, required: true },
        link: { type: String, required: true }
    }]
});

// Define other required schemas for detailed student records
const examSchema = new Schema({
    exam_id: { type: String },
    papers: [{
        paper_id: { type: String },
        paper_number: { type: String },
        paper_mark: { type: Number },
        paper_percentage: { type: Number },
        paper_position: { type: Number },
        highest: { type: Boolean, default: false },
        absent: { type: Boolean, default: false }
    }],
    term: { type: String },
    exam_mark: { type: Number },
    exam_percentage: { type: Number },
    exam_position: { type: Number }
});

const assignmentSchema = new Schema({
    assignment_id: { type: String },
    assignment_mark: { type: Number },
    assignment_name: { type: String },
    assignment_percentage: { type: Number },
    assignment_position: { type: Number },
    absent: { type: Boolean, default: false },
    assigned_date: { type: Date }
});

const teacherDetailSchema = new Schema({
    teacher_name: { type: String },
    exams_average: { type: Number },
    assignments_average: { type: Number }
});

const detentionSchema = new Schema({
    date_issued: { type: Date, required: true },
    status: { type: String, required: true }
});

const subjectDetailSchema = new Schema({
    name: { type: String },
    current_teacher: { type: String },
    previous_teachers: [teacherDetailSchema],
    exams: [examSchema],
    subjectAttendance: [{
        date: { type: Date },
        status: { type: String }
    }],
    subjectAverage: { type: Number, default: 0 },
    assignmentAverage: { type: Number, default: 0 },
    changeAssignment: { type: Number, default: 0 },
    testAverage: { type: Number, default: 0 },
    changeTest: { type: Number, default: 0 },
    quizzesAverage: { type: Number, default: 0 },
    changeQuizz: { type: Number, default: 0 },
    assignments: [assignmentSchema],
    tests: [{
        test_id: { type: String },
        test_number: { type: String },
        test_name: { type: String },
        test_mark: { type: Number },
        test_percentage: { type: Number },
        test_position: { type: Number },
        highest: { type: Boolean, default: false },
        absent: { type: Boolean, default: false },
        assigned_date: { type: Date }
    }],
    quizzes: [{
        quiz_id: { type: String },
        quiz_name: { type: String },
        quiz_mark: { type: Number },
        quiz_percentage: { type: Number },
        quiz_position: { type: Number },
        highest: { type: Boolean, default: false },
        absent: { type: Boolean, default: false },
        assigned_date: { type: Date }
    }]
});

const gradeSchema = new Schema({
    grade: { type: String },
    subjects: [subjectDetailSchema],
    attendance: [{
        date: { type: Date },
        status: { type: String, enum: ['Present', 'Absent', 'Late', 'Excused', 'Sick'] }
    }],
    presentPercentage: { type: Number, default: 0 },
    latePercentage: { type: Number, default: 0 },
    excusedPercentage: { type: Number, default: 0 },
    sickPercentage: { type: Number, default: 0 },
    absentPercentage: { type: Number, default: 0 },
    behavior_status: { type: String, default: 'Good' },
    detention_status: { type: String, default: 'Good' },
    detentions: [detentionSchema],
});

const studentDetailSchema = new Schema({
    reg_number: { type: String, required: true },
    name: { type: String },
    grades: { type: [gradeSchema], default: [] },
    attendance: [{
        date: { type: Date },
        status: { type: String, enum: ['Present', 'Absent', 'Late', 'Excused', 'Sick'] }
    }]
});
const studentDetalCard = new Schema({
    regNumber: { type: String },
    change: { type: Number },
});

// Define the Subject schema
const subjectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    testaverageMark: {
        type: Number,
        default: 0
    },
    OveralAverageMark: {
        type: Number,
        default: 0
    },
    assignmentAverageMark: {
        type: Number,
        default: 0
    },
    quizAverageMark: {
        type: Number,
        default: 0
    },
    highestAssignmentMark: {
        type: [studentDetailSchema],
        default: []
    },
    highestTestMark: {
        type: [studentDetailSchema],
        default: []
    },
    highestQuizMark: {
        type: [studentDetailSchema],
        default: []
    },
    highestExamMark: {
        type: [studentDetailSchema],
        default: []
    },
    highestOveralMark: {
        type: [studentDetailSchema],
        default: []
    },
    lowestAssignmentMark: {
        type: [studentDetailSchema],
        default: []
    },
    lowestTestMark: {
        type: [studentDetailSchema],
        default: []
    },
    lowestQuizMark: {
        type: [studentDetailSchema],
        default: []
    },
    lowestExamMark: {
        type: [studentDetailSchema],
        default: []
    },
    lowestOveralMark: {
        type: [studentDetailSchema],
        default: []
    },
    mostImprovedAssignmentStudent: {
        type: [studentDetalCard],
        default: []
    },
    mostImprovedTestStudent: {
        type: [studentDetalCard],
        default: []
    },
    mostImprovedQuizStudent: {
        type: [studentDetalCard],
        default: []
    },
    mostImprovedOveralStudent: {
        type: [studentDetalCard],
        default: []
    },
    mostImprovedExamStudent: {
        type: [studentDetalCard],
        default: []
    },
    leastImprovedAssignmentStudent: {
        type: [studentDetalCard],
        default: []
    },
    leastImprovedTestStudent: {
        type: [studentDetalCard],
        default: []
    },
    leastImprovedQuizStudent: {
        type: [studentDetalCard],
        default: []
    },
    leastImprovedOveralStudent: {
        type: [studentDetalCard],
        default: []
    },
    leastImprovedExamStudent: {
        type: [studentDetalCard],
        default: []
    },
    topicsTaught: {
        type: [topicSchema],
        default: []
    },
    currentTeachers: [teacherSchema],
    previousTeachers: [teacherSchema],
    subjectAttendance: [{
        date: { type: Date },
        status: { type: String, enum: ['Present', 'Absent', 'Late', 'Excused', 'Sick'], required: true }
    }],
    resources: [{
        name: { type: String, required: true },
        link: { type: String, required: true }
    }]
});

// Define the Year schema
const yearSchema = new Schema({
    year: {
        type: Number,
        required: true
    },
    subjects: [subjectSchema],
    students: { type: [studentDetailSchema], default: [] },
    attendance: [{
        date: { type: Date },
        present: { type: Number },
        late: { type: Number },
        excused: { type: Number },
        sick: { type: Number },
        absent: { type: Number },
    }], presentPercentage: { type: Number, default: 0 },
    latePercentage: { type: Number, default: 0 },
    excusedPercentage: { type: Number, default: 0 },
    sickPercentage: { type: Number, default: 0 },
    absentPercentage: { type: Number, default: 0 },
    behavior_status: { type: String, default: 'Good' },
    classAverage: { type: Number, default: 0 },
});

// Define the Class schema
const classSchema = new Schema({
    level: {
        type: Number,
        required: true
    },
    term: {
        type: Number,
        required: true
    },
    className: {
        type: String,
        required: true
    },
    classTeachers: [teacherSchema],
    years: [yearSchema]
});

// Check if the model is already defined, if not, define it
export const SchoolClass = mongoose.models.Classes || mongoose.model("Classes", classSchema);
