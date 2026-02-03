import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as authLogin } from "../store/authSlice";
import { Button, Input, Logo } from "./index";
import { useDispatch, useSelector } from "react-redux";
import authService from "../appwrite/auth";
import { useForm } from "react-hook-form";

function Login() {
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

  const login = async (data) => {
    setError("");
    setLoading(true);

    try {
      const session = await authService.login(data);

      if (session) {
        const userData = await authService.getCurrentUser();
        if (userData) dispatch(authLogin(userData));
        navigate("/");
      }
    } catch (err) {
      if (err.code === 401) {
        setError("Invalid email or password");
      } else {
        setError(err.message);
      }

      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex items-center justify-center w-full min-h-screen transition-all
        ${isDark ? "bg-gray-900" : "bg-gray-100"}
      `}
    >
      <div
        className={`mx-auto w-full max-w-lg rounded-xl p-10 border transition-all
          ${isDark
            ? "bg-gray-800 text-gray-100 border-gray-700"
            : "bg-white text-black border-gray-200"}
        `}
      >
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            <Logo width="100%" />
          </span>
        </div>

        <h2 className="text-center text-2xl font-bold leading-tight">
          Sign in to your Account
        </h2>

        <p
          className={`mt-2 text-center text-base ${
            isDark ? "text-gray-300" : "text-black/60"
          }`}
        >
          Don&apos;t have any account?&nbsp;
          <Link
            to="/signup"
            className="font-medium cursor-pointer text-primary transition-all duration-200 hover:underline"
          >
            Sign Up
          </Link>
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mt-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(login)} className="mt-8">
          <div className="space-y-5">
            <Input
              label="Email"
              placeholder="Enter your email"
              type="email"
              isDark={isDark}
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
              isDark={isDark}
              {...register("password", {
                required: "Password is required",
              })}
            />

            {errors.password && (
              <p className="text-red-600 text-sm">
                {errors.password.message}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default Login;
