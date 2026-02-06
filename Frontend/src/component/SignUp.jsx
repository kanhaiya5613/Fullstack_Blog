import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input, Logo } from "./index";
import authService from "../services/auth.js";
import { login } from "../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";

function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const mode = useSelector((state) => state.theme.mode);
  const isDark = mode === "dark";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const create = async (data) => {
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const account = await authService.createAccount({
        fullName: data.name, 
        email: data.email,
        password: data.password,
      });

      if (account) {
        const user = await authService.getCurrentUser();
        if (user) dispatch(login(user));
        navigate("/");
      }
    } catch (err) {
      if (err?.statusCode === 409 || err?.code === 409) {
        setError("User already exists");
      } else {
        setError(err.message || "Something went wrong");
      }

      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex items-center justify-center w-full min-h-screen transition-all
      ${isDark ? "bg-gray-900" : "bg-gray-100"}`}
    >
      <div
        className={`mx-auto w-full max-w-lg rounded-xl p-10 border transition-all
        ${
          isDark
            ? "bg-gray-800 text-gray-100 border-gray-700"
            : "bg-white text-black border-gray-200"
        }`}
      >
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-100px">
            <Logo width="100%" />
          </span>
        </div>

        <h2 className="text-center text-2xl font-bold">
          Sign up to create account
        </h2>

        <p className="mt-2 text-center text-base opacity-70">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            Sign In
          </Link>
        </p>

        {error && (
          <div
            className={`mt-6 px-4 py-2 rounded text-center
            ${
              isDark
                ? "bg-red-900 text-red-200"
                : "bg-red-100 text-red-700"
            }`}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(create)} className="mt-6">
          <div className="space-y-5">
            {/* Full Name */}
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              autoComplete="name"
              {...register("name", {
                required: "Name is required",
              })}
            />

            {errors.name && (
              <p className="text-red-600 text-sm">{errors.name.message}</p>
            )}

            {/* Email */}
            <Input
              label="Email"
              placeholder="Enter your email"
              type="email"
              autoComplete="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email",
                },
              })}
            />

            {errors.email && (
              <p className="text-red-600 text-sm">{errors.email.message}</p>
            )}

            {/* Password */}
            <Input
              label="Password"
              placeholder="Enter your password"
              type="password"
              autoComplete="new-password"
              {...register("password", {
                required: "Password is required",
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message:
                    "Min 8 chars + uppercase + lowercase + number + symbol",
                },
              })}
            />

            {errors.password && (
              <p className="text-red-600 text-sm">
                {errors.password.message}
              </p>
            )}

            <Button
              type="submit"
              className="w-full disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
