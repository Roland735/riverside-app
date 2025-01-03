import mongoose from "mongoose";
import { Subject } from "./subjects";
import Attendance from "@/app/components/teacher/Attendance/AttendanceHome";

const { Schema } = mongoose;

// Define the Teacher schema
const teacherSchema = new Schema({
    name: {
        type: String,
    }
});

// Define the Exam schema
const examSchema = new Schema({
    period: {
        type: String,
        required: true,
        enum: [
            "Mid-First term",
            "End-First term",
            "Mid-Second term",
            "End-Second term",
            "Mid-Third term",
            "End-Third term"
        ]
    },
    rollout: {
        type: Boolean,
        default: false
    },

    teacher: [
        {
            name: {
                type: String,
                required: true,
            },
            regNumber: {
                type: String,
                required: true,
            }
        }
    ],
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
    },
    papers: [{
        paperNumber: {
            type: String,
        },
        paperUrl: {
            type: String,
        },
        duration: {
            hours: {
                type: Number,
            },
            minutes: {
                type: Number,
            }
        },
        invigilator: {
            type: [{
                name: { type: String },
                regNumber: { type: String },
            }],
            default: []
        },
        uploadedExam: {
            type: String
        },
        markerAssigned: {
            type: Boolean,
            default: false
        },
        invigilatorAssigned: {
            type: Boolean,
            default: false
        },
        examApproved: {
            type: Boolean,
            default: false
        },
        attendanceMarked: { type: Boolean, default: false },
        marksUploaded: { type: Boolean, default: false },
        confirmed: {
            type: Boolean,
            default: false
        },
        marker: {
            type: [{
                name: { type: String },
                regNumber: { type: String }
            }],
            default: []
        },
        attendance: [{
            date: { type: Date },
            present: { type: Number },
            late: { type: Number },
            excused: { type: Number },
            sick: { type: Number },
            absent: { type: Number },
        }],
        presentPercentage: { type: Number, default: 0 },
        latePercentage: { type: Number, default: 0 },
        excusedPercentage: { type: Number, default: 0 },
        sickPercentage: { type: Number, default: 0 },
        absentPercentage: { type: Number, default: 0 }
    }],
    presentPercentage: { type: Number, default: 0 },
    latePercentage: { type: Number, default: 0 },
    excusedPercentage: { type: Number, default: 0 },
    sickPercentage: { type: Number, default: 0 },
    absentPercentage: { type: Number, default: 0 },
    examApproved: {
        type: Boolean,
        default: false
    },
    marksConfirmed: {
        type: Boolean,
        default: false
    },

    marksUploaded: {
        type: Boolean,
        default: false
    },
    attendanceMarked: {
        type: Boolean,
        default: false
    },
    comments: {
        type: String
    },
    classComment: {
        type: Boolean,
        default: false
    },
    SubjectComment: {
        type: Boolean,
        default: false
    }


});
const studentExamsAndPapers = new Schema({
    period: {
        type: String,
        required: true,
        enum: [
            "Mid-First term",
            "End-First term",
            "Mid-Second term",
            "End-Second term",
            "Mid-Third term",
            "End-Third term"
        ]
    },
    teacher: [
        {
            name: {
                type: String,
                required: true,
            },
            regNumber: {
                type: String,
                required: true,
            }
        }
    ],
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
    },
    papers: [{
        paperNumber: {
            type: String,
        },
        paperUrl: {
            type: String,
        },
        duration: {
            hours: {
                type: Number,
            },
            minutes: {
                type: Number,
            }
        },
        invigilator: {
            type: [{
                name: { type: String },
                regNumber: { type: String },
            }],
            default: []
        },
        uploadedExam: {
            type: String
        },
        confirmed: {
            type: Boolean,
            default: false
        },
        mark: {
            type: Number,
        },
        total: {
            type: Number
        },
        percentage: {
            type: Number
        },
        comment: {
            type: String
        },
        marker: {
            type: [{
                name: { type: String },
                regNumber: { type: String }
            }],
            default: []
        },
        attendance: {
            type: String,
            enum: ["Present", "Absent", "Disqualified", "Late", "Excused"],
        }
    }],
    presentPercentage: { type: Number, default: 0 },
    latePercentage: { type: Number, default: 0 },
    excusedPercentage: { type: Number, default: 0 },
    sickPercentage: { type: Number, default: 0 },
    absentPercentage: { type: Number, default: 0 },
    disqualifiedPercentage: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    position: { type: Number, default: 0 },
    examApproved: {
        type: Boolean,
        default: false
    },
    marksConfirmed: {
        type: Boolean,
        default: false
    },
    TeacherComments: {
        type: String
    },
    behaviorGrade: {
        type: String,
        enum: ["A", "B", "C", "D", "E", "F"],
        default: "F"
    },
    classAverage: {
        type: Number,
        default: 0
    },
    AIComment: {
        type: String
    }

});

const StudentExamMarks = new Schema({
    period: {
        type: String,
        required: true,
        enum: [
            "Mid-First term",
            "End-First term",
            "Mid-Second term",
            "End-Second term",
            "Mid-Third term",
            "End-Third term"
        ]
    },
    subjects: [{
        name: { type: String },
        exams: {
            type: [studentExamsAndPapers], default: []
        }
    }],
    finalMark: {
        type: Number,
    },
    totalMarks: {
        type: Number,
    },
    totalPercentage: {
        type: Number,
    },
    AIComment: {
        type: String
    },
    adminComments: {
        type: String
    },
    classTeachersComments: {
        type: String
    },
    AttendanceMark: {
        type: Number,
        default: 0
    },
    AttendanceTotal: {
        type: Number,
        default: 0
    },
    attendance: [{
        date: { type: Date },
        present: { type: Number },
        late: { type: Number },
        excused: { type: Number },
        sick: { type: Number },
        absent: { type: Number },
    }],
    presentPercentage: { type: Number, default: 0 },
    latePercentage: { type: Number, default: 0 },
    excusedPercentage: { type: Number, default: 0 },
    sickPercentage: { type: Number, default: 0 },
    absentPercentage: { type: Number, default: 0 }

})

// Define the Student schema for marks and comments
const studentMarksSchema = new Schema({
    studentId: {
        name: { type: String },
        regNumber: { type: String }
    },
    exams: {
        type: [
            StudentExamMarks
        ],
        default: []
    },

});

// Define the Class schema
const examClassSchema = new Schema({
    className: {
        type: String,
    },
    classTeachers: { type: [teacherSchema], default: [] },
    years: {
        type: [{
            year: {
                type: Number,
            },
            termDays: {
                type: [{
                    examPeriod: {
                        type: String,
                        enum: [
                            "Mid-First term",
                            "End-First term",
                            "Mid-Second term",
                            "End-Second term",
                            "Mid-Third term",
                            "End-Third term"
                        ]
                    },
                    termDaysTotal: {
                        type: Number,
                        default: 0
                    }
                }],
                default: []
            },
            subjects: [{
                name: { type: String },
                exams: [examSchema]
            }],
            students: [{ type: [studentMarksSchema], default: [] }],
            attendance: [{
                date: { type: Date },
                present: { type: Number },
                late: { type: Number },
                excused: { type: Number },
                sick: { type: Number },
                absent: { type: Number },
            }],
            presentPercentage: { type: Number, default: 0 },
            latePercentage: { type: Number, default: 0 },
            excusedPercentage: { type: Number, default: 0 },
            sickPercentage: { type: Number, default: 0 },
            absentPercentage: { type: Number, default: 0 }
        }],
        default: []
    },
    progress: {
        type: Number,
        default: 0
    }
});

// Define other required schemas for detailed    student records, assignments, etc.
const Exam = mongoose.models.ExamClasses || mongoose.model("ExamClasses", examClassSchema);

export default Exam;
