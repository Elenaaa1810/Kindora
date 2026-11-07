
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Lock, Eye, EyeOff, HeartHandshake } from "lucide-react";

const API_URL = "http://127.0.0.1:8000/api";

export default function AdminLogin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
        const response = await fetch(`${API_URL}/admin/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Login failed.");
        }

        // Save admin authentication token
        localStorage.setItem("adminToken", data.token);

        // Save admin information
        localStorage.setItem("adminInfo", JSON.stringify(data.admin));

        // Go to admin dashboard
        navigate("/admin", { replace: true });

    } catch (err) {
        setError(err.message || "Unable to connect to the server.");
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="min-h-screen bg-[#F3F8FC] flex items-center justify-center px-4 py-10">

            <div className="w-full max-w-md">

                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#DDF0FC] text-[#438FC4] mb-4">
                        <HeartHandshake size={34} />
                    </div>

                    <h1 className="text-3xl font-bold text-[#24364B]">
                        Kindora<span className="text-[#438FC4]">.</span>
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Administrator Portal
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#E4EFF7]">

                    <div className="text-center mb-7">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#EAF5FC] text-[#438FC4] mb-3">
                            <ShieldCheck size={25} />
                        </div>

                        <h2 className="text-2xl font-bold text-[#24364B]">
                            Admin Login
                        </h2>

                        <p className="text-gray-500 text-sm mt-2">
                            Sign in to manage your Kindora platform.
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-[#24364B] mb-2">
                                Email Address
                            </label>

                            <div className="relative">
                                <Mail
                                    size={19}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter admin email"
                                    required
                                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#8EC5E9] focus:border-[#438FC4]"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-[#24364B] mb-2">
                                Password
                            </label>

                            <div className="relative">
                                <Lock
                                    size={19}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#8EC5E9] focus:border-[#438FC4]"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#438FC4]"
                                >
                                    {showPassword ? (
                                        <EyeOff size={19} />
                                    ) : (
                                        <Eye size={19} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#438FC4] hover:bg-[#347EAF] disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition duration-200"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>

                    </form>

                </div>

                <p className="text-center text-sm text-gray-400 mt-6">
                    © 2026 Kindora. Admin Access Only.
                </p>

            </div>
        </div>
    );
}
