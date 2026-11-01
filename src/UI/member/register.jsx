
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  HeartHandshake,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(
      "The form is valid. Connect your backend to create an account."
    );
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

      {/* Register Form */}
      <div className="mx-auto mt-8 max-w-md rounded-3xl border border-[#DDF0FC] bg-white p-7 shadow-xl shadow-blue-100/60 sm:mt-12 sm:p-10">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#DDF0FC] text-[#438FC4]">
            <HeartHandshake size={34} />
          </div>

          <h1 className="mt-5 text-3xl font-extrabold text-slate-900">
            Join Kindora
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Create an account and start making a difference in your community.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Full Name
            </label>

            <div className="relative">
              <User
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-4 outline-none transition focus:border-[#67A9D7] focus:ring-4 focus:ring-[#DDF0FC]"
                required
              />
            </div>
          </div>

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
                className="w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-4 outline-none transition focus:border-[#67A9D7] focus:ring-4 focus:ring-[#DDF0FC]"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Password
            </label>

            <div className="relative">
              <Lock
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-12 outline-none transition focus:border-[#67A9D7] focus:ring-4 focus:ring-[#DDF0FC]"
                required
                minLength={8}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#438FC4]"
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Confirm Password
            </label>

            <div className="relative">
              <Lock
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Enter your password again"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-12 outline-none transition focus:border-[#67A9D7] focus:ring-4 focus:ring-[#DDF0FC]"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#438FC4]"
              >
                {showConfirmPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </div>

          {/* Terms */}
          <label className="flex items-start gap-3 text-sm leading-6 text-slate-600">
            <input
              type="checkbox"
              required
              className="mt-1 h-4 w-4 accent-[#438FC4]"
            />
            <span>
              I agree to the{" "}
              <Link to="/terms" className="font-semibold text-[#438FC4]">
                Terms and Conditions
              </Link>
              .
            </span>
          </label>

          {/* Error / Message */}
          {error && (
            <p
              role="alert"
              className="rounded-xl bg-[#FFF1F2] p-3 text-sm text-rose-600"
            >
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#438FC4] px-5 py-3.5 font-semibold text-white shadow-md shadow-blue-100 transition hover:bg-[#347BAE]"
          >
            Create Account
            <ArrowRight size={19} />
          </button>
        </form>

        <div className="mt-7 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-[#438FC4] hover:text-[#183B55]"
          >
            Login
          </Link>
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Kindora. Together, we can make a difference.
      </p>
    </div>
  );
};

export default Register;
