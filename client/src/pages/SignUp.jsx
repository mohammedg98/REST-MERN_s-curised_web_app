import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    // Clear the error message when the user starts typing
    setErrors({ ...errors, [e.target.id]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateFormData(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setErrors({ general: data.message });
        return;
      }
      setLoading(false);
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      setErrors({ general: error.message });
    }
  };

  // Function to validate form data
  const validateFormData = (data) => {
    const errors = {};
    if (!data.username) {
      errors.username = "Username is required";
    }
    if (!data.email) {
      errors.email = "Email is required";
    } else if (!isValidEmail(data.email)) {
      errors.email = "Invalid email format";
    }
    if (!data.password) {
      errors.password = "Password is required";
    } else if (data.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }
    return errors;
  };
  // Function to validate email format
  const isValidEmail = (email) => {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="username"
          className={`border p-3 rounded-lg ${
            errors.username ? "border-red-500" : ""
          }`}
          id="username"
          onChange={handleChange}
        />
        {errors.username && <p className="text-red-500">{errors.username}</p>}
        <input
          type="email"
          placeholder="email"
          className={`border p-3 rounded-lg ${
            errors.email ? "border-red-500" : ""
          }`}
          id="email"
          onChange={handleChange}
        />
        {errors.email && <p className="text-red-500">{errors.email}</p>}
        <input
          type="password"
          placeholder="password"
          className={`border p-3 rounded-lg ${
            errors.password ? "border-red-500" : ""
          }`}
          id="password"
          onChange={handleChange}
        />
        {errors.password && <p className="text-red-500">{errors.password}</p>}
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
      {errors.general && <p className="text-red-500 mt-5">{errors.general}</p>}
    </div>
  );
}
