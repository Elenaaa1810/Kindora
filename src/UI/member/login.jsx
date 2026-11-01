import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HeartHandshake,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  HandHeart,
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: formData.email.trim(),
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed. Please try again."
        );
      }

      // Save authentication token
      const storage = formData.rememberMe
        ? localStorage
        : sessionStorage;

      const otherStorage = formData.rememberMe
        ? sessionStorage
        : localStorage;

      otherStorage.removeItem("memberToken");
      otherStorage.removeItem("member");

      storage.setItem("memberToken", data.token);
      storage.setItem("member", JSON.stringify(data.member));

      // Redirect after successful login
      navigate("/userprofile");

    } catch (err) {
      setError(
        err.message || "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EAF5FC] via-white to-[#F0FAFC] px-5 py-10">

      {/* Logo */}
      <div className="mx-auto max-w-6xl">
        <Link to="/" className="inline-flex items-center gap-2">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#DDF0FC] text-[#438FC4]">
            <HeartHandshake size={27} />
          </span>

          <span className="text-2xl font-extrabold text-slate-900">
            Kindora<span className="text-[#67A9D7]">.</span>
          </span>
        </Link>
      </div>

      {/* Login Card */}
      <div className="mx-auto mt-10 max-w-md rounded-3xl border border-[#DDF0FC] bg-white p-7 shadow-xl shadow-blue-100/60 sm:mt-16 sm:p-10">

        {/* Heading */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#DDF0FC] text-[#438FC4]">
            <HandHeart size={34} />
          </div>

          <h1 className="mt-5 text-3xl font-extrabold text-slate-900">
            Welcome Back!
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Sign in to continue your volunteering journey with Kindora.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Email Address
            </label>

            <div className="relative">
              <Mail
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-4 outline-none transition focus:border-[#67A9D7] focus:ring-4 focus:ring-[#DDF0FC]"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-700"
              >
                Password
              </label>

              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-[#438FC4] hover:text-[#183B55]"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative">
              <Lock
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-12 outline-none transition focus:border-[#67A9D7] focus:ring-4 focus:ring-[#DDF0FC]"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#438FC4]"
              >
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="h-4 w-4 rounded accent-[#438FC4]"
            />

            <label
              htmlFor="rememberMe"
              className="text-sm text-slate-600"
            >
              Remember me
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <p
              role="alert"
              className="rounded-xl bg-[#FFF1F2] p-3 text-sm text-rose-600"
            >
              {error}
            </p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#438FC4] px-5 py-3.5 font-semibold text-white shadow-md shadow-blue-100 transition hover:bg-[#347BAE] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Login to Account"}
            {!loading && <ArrowRight size={19} />}
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-7 text-center text-sm text-slate-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-bold text-[#438FC4] hover:text-[#183B55]"
          >
            Create Account
          </Link>
        </div>

        {/* Community Message */}
        <div className="mt-7 rounded-2xl bg-[#F5FAFE] p-4 text-center">
          <HeartHandshake
            size={23}
            className="mx-auto text-[#438FC4]"
          />

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Every small act of kindness brings us closer to a better community.
          </p>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-8 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Kindora. All rights reserved.
      </p>
    </div>
  );
};

export default Login;
