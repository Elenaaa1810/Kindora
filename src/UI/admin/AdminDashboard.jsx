import React, { useEffect, useState } from "react";
import {
  Users,
  Megaphone,
  CalendarDays,
  MapPin,
  Clock,
  RefreshCw,
  ArrowUpRight,
  HeartHandshake,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000/api";

// Get admin authentication token
const getAdminHeaders = () => {
  const token = localStorage.getItem("adminToken");

  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// Handle API response
const readResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
};

// Get array from different possible API response formats
const getArrayData = (data, key) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.[key])) {
    return data[key];
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
};

// Format campaign date
const formatDate = (date) => {
  if (!date) return "Date not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date not available";
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const AdminDashboard = () => {
  const [members, setMembers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");

    try {
      const headers = getAdminHeaders();

      // Fetch members and campaigns from Laravel
      const [memberResponse, campaignResponse] = await Promise.all([
        fetch(`${API_URL}/admin/members`, {
          method: "GET",
          headers,
        }),

        fetch(`${API_URL}/campaigns`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
      ]);

      const memberData = await readResponse(memberResponse);
      const campaignData = await readResponse(campaignResponse);

      const memberList = getArrayData(memberData, "members");
      const campaignList = getArrayData(campaignData, "campaigns");

      setMembers(memberList);
      setCampaigns(campaignList);
    } catch (err) {
      console.error("Dashboard loading error:", err);
      setError(err.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Filter upcoming campaigns
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingCampaigns = campaigns
    .filter((campaign) => {
      if (!campaign.date) return false;

      const campaignDate = new Date(campaign.date);

      if (Number.isNaN(campaignDate.getTime())) {
        return false;
      }

      campaignDate.setHours(0, 0, 0, 0);

      const status = String(campaign.status || "").toLowerCase();

      return (
        campaignDate >= today &&
        status !== "completed" &&
        status !== "cancelled"
      );
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Dashboard statistics
  const stats = [
    {
      title: "Total Members",
      value: members.length,
      icon: Users,
      description: "Registered members",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Campaigns",
      value: campaigns.length,
      icon: Megaphone,
      description: "All campaigns",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7FAFD] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#438FC4] to-[#75B5E0] p-6 text-white shadow-sm sm:p-8">
          <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <HeartHandshake size={25} />
                <span className="text-sm font-semibold tracking-wide">
                  KINDORA ADMIN
                </span>
              </div>

              <h1 className="text-2xl font-bold sm:text-3xl">
                Welcome Back, Admin!
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-relaxed text-blue-50 sm:text-base">
                Manage your community, monitor members, and keep track of
                upcoming volunteer campaigns.
              </p>
            </div>

            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="flex w-fit items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#438FC4] shadow-sm transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <RefreshCw
                size={17}
                className={loading ? "animate-spin" : ""}
              />
              Refresh Dashboard
            </button>
          </div>

          <div className="absolute -right-10 -top-16 h-64 w-64 rounded-full bg-white/10" />
          <div className="absolute -bottom-24 right-40 h-56 w-56 rounded-full bg-white/10" />
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 sm:flex-row sm:items-center sm:justify-between">
            <p>{error}</p>

            <button
              onClick={fetchDashboardData}
              className="font-semibold underline"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Statistics */}
        <section>
          <div className="mb-5">
            <h2 className="text-xl font-bold text-[#24364B]">
              Dashboard Overview
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              A quick overview of your Kindora community.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {stats.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {stat.title}
                      </p>

                      <h3 className="mt-3 text-3xl font-bold text-[#24364B]">
                        {loading ? "..." : stat.value}
                      </h3>

                      <p className="mt-2 text-xs text-gray-400">
                        {stat.description}
                      </p>
                    </div>

                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl ${stat.iconBg}`}
                    >
                      <Icon size={26} className={stat.iconColor} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Upcoming Campaigns */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#24364B]">
                Upcoming Campaigns
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Campaigns scheduled for the coming days.
              </p>
            </div>

            <a
              href="/admin/campaigns"
              className="flex w-fit items-center gap-2 text-sm font-semibold text-[#438FC4] transition hover:text-[#24364B]"
            >
              Manage Campaigns
              <ArrowUpRight size={17} />
            </a>
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <RefreshCw
                size={25}
                className="mx-auto animate-spin text-[#438FC4]"
              />
              <p className="mt-3 text-sm text-gray-500">
                Loading campaigns...
              </p>
            </div>
          ) : upcomingCampaigns.length === 0 ? (
            <div className="rounded-xl bg-[#F7FAFD] px-4 py-12 text-center">
              <CalendarDays
                size={35}
                className="mx-auto text-gray-300"
              />

              <h3 className="mt-3 font-semibold text-[#24364B]">
                No Upcoming Campaigns
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                There are currently no upcoming campaigns.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingCampaigns.slice(0, 5).map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex flex-col gap-4 rounded-xl border border-gray-100 p-4 transition hover:border-blue-200 hover:bg-[#F7FAFD] sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#DDF0FC]">
                      <Megaphone
                        size={23}
                        className="text-[#438FC4]"
                      />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-[#24364B]">
                        {campaign.title ||
                          campaign.name ||
                          "Untitled Campaign"}
                      </h3>

                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <CalendarDays size={14} />
                          {formatDate(campaign.date)}
                        </span>

                        {campaign.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            {campaign.location}
                          </span>
                        )}

                        {campaign.category && (
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {campaign.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:justify-end">
                    {campaign.capacity != null && (
                      <span className="text-xs text-gray-500">
                        Capacity: {campaign.capacity}
                      </span>
                    )}

                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-[#438FC4]">
                      {campaign.status || "Upcoming"}
                    </span>
                  </div>
                </div>
              ))}

              {upcomingCampaigns.length > 5 && (
                <p className="pt-2 text-center text-xs text-gray-400">
                  Showing 5 of {upcomingCampaigns.length} upcoming campaigns.
                </p>
              )}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default AdminDashboard;
