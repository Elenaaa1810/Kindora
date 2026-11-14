import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./UI/member/homepage.jsx";
import Campaigns from "./UI/member/campaigns.jsx";
import Community from "./UI/member/community.jsx";
import AboutUs from "./UI/member/aboutus.jsx";
import Register from "./UI/member/register.jsx";
import Login from "./UI/member/login.jsx";
import UserProfile from "./UI/member/userprofile.jsx";

import ProtectedAdminRoute from "./UI/admin/ProtectedAdminRoute.jsx";
import AdminLogin from "./UI/admin/AdminLogin.jsx";
import AdminLayout from "./UI/admin/AdminLayout.jsx";
import AdminDashboard from "./UI/admin/AdminDashboard.jsx";
import CampaignManagement from "./UI/admin/CampaignManagement.jsx";
import AttendanceManagement from "./UI/admin/AttendanceManagement.jsx";
import ManageUsers from "./UI/admin/ManageUsers.jsx";
import AdminApprovals from "./UI/admin/AdminApprovals.jsx";
import CommunityPostManagement from "./UI/admin/CommunityPostManagement.jsx";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>

                {/* Member pages */}
                <Route path="/" element={<Home />} />
                <Route path="/campaigns" element={<Campaigns />} />
                <Route path="/community" element={<Community />} />
                <Route path="/aboutus" element={<AboutUs />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/userprofile" element={<UserProfile />} />

                {/* Admin login */}
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Protected admin pages */}
                <Route element={<ProtectedAdminRoute />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="campaigns" element={<CampaignManagement />} />
                        <Route path="attendance" element={<AttendanceManagement />} />
                        <Route path="users" element={<ManageUsers />} />
                        <Route path="approvals" element={<AdminApprovals />} />
                        <Route path="community-posts" element={<CommunityPostManagement />} />
                    </Route>
                </Route>

            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);