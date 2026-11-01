
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
  ArrowLeft,
  ClipboardList,
} from "lucide-react";

const Register = () => {
  const [step, setStep] = useState(1);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",

    reason: "",
    motivation: "",
    interests: [],
    previousExperience: "",
    experienceDetails: "",
    availability: "",
  });

  const [error, setError] = useState("");

  // Input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  // Multiple volunteer interests
  const handleInterestChange = (e) => {
    const { value, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      interests: checked
        ? [...prev.interests, value]
        : prev.interests.filter((interest) => interest !== value),
    }));

    setError("");
  };

  // Validate personal information
  const handleNext = () => {
    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all personal information fields.");
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

    setError("");
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Submit application
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.reason.trim() ||
      !formData.motivation ||
      formData.interests.length === 0 ||
      !formData.previousExperience ||
      !formData.availability
    ) {
      setError("Please complete all required volunteer questions.");
      return;
    }

    if (
      formData.previousExperience === "yes" &&
      !formData.experienceDetails.trim()
    ) {
      setError("Please describe your previous volunteering experience.");
      return;
    }

    setError(
      "Your application is valid! Connect your Laravel backend to submit it for admin approval."
    );

    console.log("Registration Data:", formData);
  };

  // Reusable input styles
  const inputStyle =
    "w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none transition focus:border-[#67A9D7] focus:ring-4 focus:ring-[#DDF0FC]";

  const labelStyle =
    "mb-2 block text-sm font-semibold text-slate-700";

  const interests = [
    "Environment",
    "Education",
    "Charity",
    "Community Development",
    "Healthcare Support",
  ];

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

      {/* Registration Card */}
      <div className="mx-auto mt-8 max-w-2xl rounded-3xl border border-[#DDF0FC] bg-white p-7 shadow-xl shadow-blue-100/60 sm:mt-12 sm:p-10">

        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#DDF0FC] text-[#438FC4]">
            {step === 1 ? (
              <HeartHandshake size={34} />
            ) : (
              <ClipboardList size={34} />
            )}
          </div>

          <h1 className="mt-5 text-3xl font-extrabold text-slate-900">
            {step === 1 ? "Join Kindora" : "Volunteer Application"}
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {step === 1
              ? "Create your account and get started with Kindora."
              : "Tell us more about your interests and motivation."}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-semibold text-[#438FC4]">
              Step {step} of 2
            </span>

            <span className="text-slate-400">
              {step === 1 ? "Personal Information" : "Volunteer Questions"}
            </span>
          </div>

          <div className="flex gap-2">
            <div
              className={`h-2 flex-1 rounded-full ${
                step >= 1 ? "bg-[#438FC4]" : "bg-slate-200"
              }`}
            />

            <div
              className={`h-2 flex-1 rounded-full ${
                step >= 2 ? "bg-[#438FC4]" : "bg-slate-200"
              }`}
            />
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter" && step === 1) {
              e.preventDefault();
            }
          }}
          className="mt-8 space-y-6"
        >

          {/* ================================= */}
          {/* STEP 1: PERSONAL INFORMATION */}
          {/* ================================= */}

          {step === 1 && (
            <section className="space-y-5">

              <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-3">
                <User className="text-[#438FC4]" size={21} />

                <h2 className="text-lg font-bold text-slate-800">
                  Personal Information
                </h2>
              </div>

              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className={labelStyle}>
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
                    className={`${inputStyle} pl-11`}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className={labelStyle}>
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
                    className={`${inputStyle} pl-11`}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className={labelStyle}>
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
                    className={`${inputStyle} pl-11 pr-12`}
                    minLength={8}
                    required
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

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className={labelStyle}>
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
                    className={`${inputStyle} pl-11 pr-12`}
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

              {/* Continue Button */}
              <button
                type="button"
                onClick={handleNext}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#438FC4] px-5 py-3.5 font-semibold text-white shadow-md shadow-blue-100 transition hover:bg-[#347BAE]"
              >
                Continue to Volunteer Questions
                <ArrowRight size={19} />
              </button>
            </section>
          )}

          {/* ================================= */}
          {/* STEP 2: VOLUNTEER QUESTIONS */}
          {/* ================================= */}

          {step === 2 && (
            <section className="space-y-5">

              <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-3">
                <ClipboardList className="text-[#438FC4]" size={21} />

                <h2 className="text-lg font-bold text-slate-800">
                  Volunteer Application
                </h2>
              </div>

              <p className="text-sm leading-6 text-slate-500">
                Your answers will help our admin team understand your
                motivation and volunteer interests.
              </p>

              {/* Reason for Joining */}
              <div>
                <label htmlFor="reason" className={labelStyle}>
                  Why do you want to join Kindora?
                </label>

                <textarea
                  id="reason"
                  name="reason"
                  rows={4}
                  placeholder="Tell us why you want to become a volunteer..."
                  value={formData.reason}
                  onChange={handleChange}
                  className={inputStyle}
                  required
                />
              </div>

              {/* Motivation */}
              <div>
                <label htmlFor="motivation" className={labelStyle}>
                  What motivates you to volunteer?
                </label>

                <select
                  id="motivation"
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleChange}
                  className={`${inputStyle} bg-white`}
                  required
                >
                  <option value="">Select your motivation</option>
                  <option value="Helping people in need">
                    Helping people in need
                  </option>
                  <option value="Supporting my local community">
                    Supporting my local community
                  </option>
                  <option value="Protecting the environment">
                    Protecting the environment
                  </option>
                  <option value="Gaining new skills and experience">
                    Gaining new skills and experience
                  </option>
                  <option value="Meeting new people and teamwork">
                    Meeting new people and teamwork
                  </option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Volunteer Interests */}
              <div>
                <label className={labelStyle}>
                  Which areas are you interested in?
                </label>

                <p className="mb-3 text-xs text-slate-500">
                  You can select more than one.
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  {interests.map((interest) => (
                    <label
                      key={interest}
                      className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm text-slate-700 transition hover:border-[#67A9D7] hover:bg-[#F7FBFE]"
                    >
                      <input
                        type="checkbox"
                        value={interest}
                        checked={formData.interests.includes(interest)}
                        onChange={handleInterestChange}
                        className="h-4 w-4 accent-[#438FC4]"
                      />

                      {interest}
                    </label>
                  ))}
                </div>
              </div>

              {/* Previous Experience */}
              <div>
                <label htmlFor="previousExperience" className={labelStyle}>
                  Do you have previous volunteering experience?
                </label>

                <select
                  id="previousExperience"
                  name="previousExperience"
                  value={formData.previousExperience}
                  onChange={handleChange}
                  className={`${inputStyle} bg-white`}
                  required
                >
                  <option value="">Select an option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No, this will be my first time</option>
                </select>
              </div>

              {/* Experience Details */}
              {formData.previousExperience === "yes" && (
                <div>
                  <label htmlFor="experienceDetails" className={labelStyle}>
                    Please describe your previous experience
                  </label>

                  <textarea
                    id="experienceDetails"
                    name="experienceDetails"
                    rows={3}
                    placeholder="Tell us about your previous volunteering activities..."
                    value={formData.experienceDetails}
                    onChange={handleChange}
                    className={inputStyle}
                    required
                  />
                </div>
              )}

              {/* Availability */}
              <div>
                <label htmlFor="availability" className={labelStyle}>
                  How often are you available to volunteer?
                </label>

                <select
                  id="availability"
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  className={`${inputStyle} bg-white`}
                  required
                >
                  <option value="">Select your availability</option>
                  <option value="Weekdays">Weekdays</option>
                  <option value="Weekends">Weekends</option>
                  <option value="Both weekdays and weekends">
                    Both weekdays and weekends
                  </option>
                  <option value="Occasionally">Occasionally</option>
                </select>
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
                  <Link
                    to="/terms"
                    className="font-semibold text-[#438FC4]"
                  >
                    Terms and Conditions
                  </Link>
                  .
                </span>
              </label>

              {/* Back and Submit */}
              <div className="flex flex-col-reverse gap-3 sm:flex-row">

                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setStep(1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3.5 font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  <ArrowLeft size={19} />
                  Back
                </button>

                <button
                  type="submit"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#438FC4] px-5 py-3.5 font-semibold text-white shadow-md shadow-blue-100 transition hover:bg-[#347BAE]"
                >
                  Submit Application
                  <ArrowRight size={19} />
                </button>

              </div>

              <p className="text-center text-xs leading-5 text-slate-400">
                Your application will be reviewed by the Kindora admin team.
                You will become a member after your application is approved.
              </p>
            </section>
          )}

          {/* Error Message */}
          {error && (
            <p
              role="alert"
              className="rounded-xl bg-[#FFF1F2] p-3 text-sm text-rose-600"
            >
              {error}
            </p>
          )}
        </form>

        {/* Login Link */}
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

      {/* Footer */}
      <p className="mt-8 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Kindora. Together, we can make a difference.
      </p>
    </div>
  );
};

export default Register;
