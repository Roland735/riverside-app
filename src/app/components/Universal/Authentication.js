"use client";
import React, { useState } from "react";

const Authentication = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // Set default role

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add validation here (e.g., check for empty fields, valid email format)

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (data.message === "User created successfully") {
        console.log(data);
        console.log("User registered successfully!");
        // Redirect to login page (or display success message)
      } else {
        console.error(data.message);
        console.log(data);
        // Display error message to user
      }
    } catch (error) {
      console.error(error);
      // Handle network errors
    }

    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="register-form flex">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="flex-col flex space-y-5 ">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="light-border"
        />
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label htmlFor="role">Role:</label>
        <select
          id="role"
          name="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="parent">Parent</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="bg-emerald-700">
          Register
        </button>
      </form>
    </div>
  );
};

export default Authentication;
