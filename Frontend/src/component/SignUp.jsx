import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input, Logo } from "./index";
import authService from "../appwrite/auth";
import { login } from "../store/authSlice";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const mode = useSelector((state)=>state.theme.mode);
  const isDark = mode ==="dark"
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const create = async (data) => {
    setError("");
    setLoading(true);

    try {
      const account = await authService.createAccount(data);

      if (account) {
        const user = await authService.getCurrentUser();
        if (user) dispatch(login(user));
        navigate("/");
      }
    } catch (err) {
      if (err.code === 409) {
        setError("User already exists");
      } else {
        setError(err.message);
      }

      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex items-center justify-center w-full min-h-screen transition-all
        ${isDark ? "bg-gray-900" : "bg-gray-100"}
      `}
    >
      <div
        className={`mx-auto w-full max-w-lg rounded-xl p-10 border transition-all
          ${isDark
            ? "bg-gray-800 text-gray-100 border-gray-700"
            : "bg-white text-black border-gray-200"}
        `}>

        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-100px">
            <Logo width="100%" />
          </span>
        </div>

        <h2 className="text-center text-2xl font-bold leading-tight">
          Sign up to create account
        </h2>

        <p className="mt-2 text-center text-base text-black/60">
          Already have an account?&nbsp;
          <Link
            to="/login"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Sign In
          </Link>
        </p>

        {/* Backend error */}
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mt-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(create)} className="mt-6">
          <div className="space-y-5">

            <Input
              label="Full Name"
              placeholder="Enter your full name"
              {...register("name", { required: "Name is required" })}
            />

            {errors.name && (
              <p className="text-red-600 text-sm">{errors.name.message}</p>
            )}

            <Input
              label="Email"
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value:
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: "Email address must be valid",
                },
              })}
            />

            {errors.email && (
              <p className="text-red-600 text-sm">{errors.email.message}</p>
            )}

            <Input
              label="Password"
              placeholder="Enter your password"
              type="password"
              {...register("password", {
                required: "Password is required",
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message:
                    "Password must have 8 chars, upper, lower, number & symbol",
                },
              })}
            />

            {errors.password && (
              <p className="text-red-600 text-sm">
                {errors.password.message}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>

          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
