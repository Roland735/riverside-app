"use client";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const Form = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    role: "",
    email: "",
    password: "",
    cpassword: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    firstname: "",
    lastname: "",
    role: "",
    email: "",
    password: "",
    cpassword: "",
  });
  const router = useRouter();

  useEffect(() => {
    const validity =
      formData.firstname &&
      formData.lastname &&
      formData.role &&
      formData.email &&
      formData.password &&
      formData.cpassword &&
      formData.password === formData.cpassword &&
      validatePassword(formData.password);
    setIsFormValid(validity);
  }, [formData]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error("Please fill in all fields correctly");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post("/api/auth/register", formData);
      const data = res.data;
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("User created successfully");
        router.push("/admin");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    return passwordRegex.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password" || name === "cpassword") {
      if (formData.password !== value && name === "cpassword") {
        setErrors({ ...errors, cpassword: "Passwords do not match" });
      } else if (!validatePassword(value) && name === "password") {
        setErrors({
          ...errors,
          password:
            "Password must be at least 6 characters long, contain at least one uppercase letter, and one number",
        });
      } else {
        setErrors({ ...errors, [name]: "" });
      }
    } else {
      setErrors({ ...errors, [name]: "" });
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col space-y-2 justify-center items-center py-2 px-6 dark:bg-cyan-950">
      <h3 className="text-xl my-8 font-semibold border-b-2 border-cyan-700 text-cyan-900 dark:text-cyan-950">
        Add User
      </h3>
      <form className="w-full max-w-md" onSubmit={handleRegister}>
        {[
          "firstname",
          "lastname",
          "role",
          "email",
          "password",
          "cpassword",
        ].map((field, index) => (
          <div key={index} className="mb-4">
            <label
              htmlFor={field}
              className="block text-cyan-900 dark:text-cyan-950"
            >
              {field === `cpassword`
                ? "Confirm Password"
                : field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type={field.includes("password") ? "password" : "text"}
              name={field}
              id={field}
              value={formData[field]}
              onChange={handleChange}
              className="border-2 bg-cyan-700 border-emerald-600 rounded p-2 text-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
              disabled={isLoading}
            />
            {errors[field] && (
              <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
            )}
          </div>
        ))}
        <div className="flex flex-col items-center space-y-3">
          <button
            type="submit"
            className="border-2 bg-cyan-700 border-emerald-600 rounded p-2 text-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-36"
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? "Creating..." : "Submit"}
          </button>
          {isLoading && (
            <div className="text-center text-cyan-900 dark:text-cyan-950">
              Creating user...
            </div>
          )}
        </div>
      </form>
      <div className="relative w-80 h-80 mt-8">
        <Image src="/path/to/image.png" alt="Description" fill />
      </div>
    </div>
  );
};

export default Form;
