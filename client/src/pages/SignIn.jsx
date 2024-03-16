import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateFormData(formData);
    if (Object.keys(validationErrors).length > 0) {
      dispatch(signInFailure("Please fill in all required fields"));
      return;
    }
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  const validateFormData = (data) => {
    const errors = {};
    if (!data.email) {
      errors.email = "Email is required";
    }
    if (!data.password) {
      errors.password = "Password is required";
    }
    return errors;
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="email"
          className={`border p-3 rounded-lg ${
            error && error.includes("Email") ? "border-red-500" : ""
          }`}
          id="email"
          onChange={handleChange}
        />
        {error && error.includes("Email") && (
          <p className="text-red-500">{error}</p>
        )}
        <input
          type="password"
          placeholder="password"
          className={`border p-3 rounded-lg ${
            error && error.includes("Password") ? "border-red-500" : ""
          }`}
          id="password"
          onChange={handleChange}
        />
        {error && error.includes("Password") && (
          <p className="text-red-500">{error}</p>
        )}

        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p> don't have an account?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-700">Sign up</span>
        </Link>
      </div>
      {error && !error.includes("Email") && !error.includes("Password") && (
        <p className="text-red-500 mt-5">{error}</p>
      )}
    </div>
  );
}
