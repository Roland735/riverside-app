// src/models/userModel.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Schema for student information with user details
const studentSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "Please enter the student's first name"],
  },
  lastname: {
    type: String,
    required: [true, "Please enter the student's last name"],
  },
  regNumber: {
    type: String,
    required: [true, "Please enter the student's registration number"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please enter the student's email"],
    unique: true,
  },
  profilePicture: {
    type: String, // URL of the student's profile picture
    default: ''
  },
  class: {
    type: String,
    required: [true, "Please enter the student's class"],
  },
});

const userSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "Please enter a first name"],
    },
    lastname: {
      type: String,
      required: [true, "Please enter a last name"],
    },
    regNumber: {
      type: String,
      required: [true, "Please enter a registration number"],
      unique: true,
    },
    role: {
      type: String,
      enum: ['teacher', 'admin', 'student', 'parent', 'superadmin'],
      default: 'user', // Default role is 'user'
    },
    active: {
      type: Boolean,
      default: true,
    },
    email: {
      type: String,
      required: [true, "Please enter an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      type: String, // URL of the profile picture
      default: ''
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExp: Date,
    verifyToken: String,
    verifyTokenExp: Date,
    // Array of students for a parent, defaults to an empty array
    students: {
      type: [studentSchema],
      default: []
    },
  }
);

// This method will be called before saving the user to the database
userSchema.pre("save", async function (next) {
  // If the password is not modified, then call the next middleware
  if (!this.isModified("password")) {
    next();
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// This method will be called when comparing the password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const userModel = mongoose.models.User || mongoose.model("User", userSchema);
