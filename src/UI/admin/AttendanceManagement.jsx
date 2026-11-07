import React, { useState, useEffect } from "react";
import {
  Search,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  CalendarDays,
  MapPin,
  ClipboardCheck,
  Download,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000/api";

// Get the logged-in admin token
const getAdminHeaders = () => {
  const token = localStorage.getItem("adminToken");

  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
};

// Read API responses and show useful Laravel errors
const readResponse = async (response) => {
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      result.message || `Request failed with status ${response.status}`
    );
  }

  return result;
};

const statusStyles = {
  Present: "bg-green-100 text-green-700",
  Absent: "bg-red-100 text-red-700",
  Pending: "bg-amber-100 text-amber-700",
};

export default function AttendanceManagement() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [campaignType, setCampaignType] = useState("completed");

  const [attendance, setAttendance] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  const [loadingCampaigns, setLoadingCampaigns] = useState(true);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  // 1. Retrieve campaigns from Laravel
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoadingCampaigns(true);
        setError("");

        const response = await fetch(`${API_URL}/campaigns`, {
          method: "GET",
          headers: getAdminHeaders(),
        });

        const result = await readResponse(response);

        const campaignData = Array.isArray(result)
          ? result
          : result.data || [];

        setCampaigns(campaignData);
      } catch (err) {
        setError(err.message);
        setCampaigns([]);
      } finally {
        setLoadingCampaigns(false);
      }
    };

    fetchCampaigns();
  }, []);

  // 2. Filter campaigns based on selected tab
  const filteredCampaigns = campaigns.filter(
    (campaign) =>
      campaign.status?.toLowerCase() === campaignType
  );

  // Get the currently selected campaign
  const currentCampaign = campaigns.find(
    (campaign) => String(campaign.id) === selectedCampaign
  );

  // 3. Automatically select the first campaign in the selected tab
  useEffect(() => {
    if (filteredCampaigns.length > 0) {
      setSelectedCampaign(String(filteredCampaigns[0].id));
    } else {
      setSelectedCampaign("");
      setAttendance([]);
    }

    setSearch("");
    setStatusFilter("All");
    setDateFilter("");
  }, [campaignType, campaigns]);

  // 4. Retrieve registrations and attendance
  useEffect(() => {
    if (!selectedCampaign) {
      setAttendance([]);
      return;
    }

    let cancelled = false;

    const fetchAttendance = async () => {
      try {
        setLoadingAttendance(true);
        setError("");

        const response = await fetch(
          `${API_URL}/campaigns/${selectedCampaign}/attendance`,
          {
            method: "GET",
            headers: getAdminHeaders(),
          }
        );

        const result = await readResponse(response);

        const registrations = Array.isArray(result)
          ? result
          : result.data || [];

        const attendanceData = registrations.map((registration) => {
          const member = registration.member || {};
          const attendanceRecord = registration.attendance;

          const rawStatus =
            typeof attendanceRecord === "object"
              ? attendanceRecord?.status
              : attendanceRecord;

          const formattedStatus = rawStatus
            ? rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1)
            : "Pending";

          return {
            id: registration.id,
            name: member.full_name || member.name || "Unknown Member",
            email: member.email || "No email",
            campaign: currentCampaign?.title || "Campaign",
            date:
              currentCampaign?.date ||
              currentCampaign?.campaign_date ||
              "",
            location: currentCampaign?.location || "Not specified",
            status: formattedStatus,
          };
        });

        if (!cancelled) {
          setAttendance(attendanceData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setAttendance([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingAttendance(false);
        }
      }
    };

    fetchAttendance();

    return () => {
      cancelled = true;
    };
  }, [selectedCampaign, campaigns]);

  // 5. Search and filter attendance
  const filteredAttendance = attendance.filter((item) => {
    const searchTerm = search.toLowerCase();

    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm) ||
      item.email.toLowerCase().includes(searchTerm) ||
      item.campaign.toLowerCase().includes(searchTerm);

    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;

    const matchesDate = !dateFilter || item.date === dateFilter;

    return matchesSearch && matchesStatus && matchesDate;
  });

  // 6. Calculate statistics
  const presentCount = attendance.filter(
    (item) => item.status === "Present"
  ).length;

  const absentCount = attendance.filter(
    (item) => item.status === "Absent"
  ).length;

  const pendingCount = attendance.filter(
    (item) => item.status === "Pending"
  ).length;

  // 7. Update attendance in Laravel database
  const updateStatus = async (registrationId, newStatus) => {
    if (campaignType !== "completed") return;

    try {
      setUpdatingId(registrationId);
      setError("");

      const response = await fetch(
        `${API_URL}/attendance/${registrationId}`,
        {
          method: "PUT",
          headers: getAdminHeaders(),
          body: JSON.stringify({
            status: newStatus.toLowerCase(),
          }),
        }
      );

      await readResponse(response);

      setAttendance((current) =>
        current.map((item) =>
          item.id === registrationId
            ? { ...item, status: newStatus }
            : item
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  // 8. Export attendance as CSV
  const exportCSV = () => {
    const headers = [
      "Volunteer Name",
      "Email",
      "Campaign",
      "Date",
      "Location",
      "Attendance Status",
    ];

    const escapeCSV = (value) =>
      `"${String(value).replace(/"/g, '""')}"`;

    const rows = filteredAttendance.map((item) =>
      [
        item.name,
        item.email,
        item.campaign,
        item.date,
        item.location,
        item.status,
      ]
        .map(escapeCSV)
        .join(",")
    );

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows,
    ].join("\r\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "volunteer-attendance.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  // 9. Statistics cards
  const stats = [
    {
      label: "Total Registrations",
      value: attendance.length,
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Present",
      value: presentCount,
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Absent",
      value: absentCount,
      icon: XCircle,
      color: "bg-red-100 text-red-600",
    },
    {
      label: "Pending",
      value: pendingCount,
      icon: Clock,
      color: "bg-amber-100 text-amber-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-1 text-sm font-medium text-blue-600">
            Administration / Attendance
          </p>

          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            Attendance Management
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Track volunteer attendance and verify participation in campaigns.
          </p>
        </div>

        <button
          onClick={exportCSV}
          disabled={filteredAttendance.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Campaign Selection */}
      <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setCampaignType("completed")}
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
              campaignType === "completed"
                ? "bg-blue-600 text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            <CheckCircle size={18} />
            Previous Campaigns
          </button>

          <button
            type="button"
            onClick={() => setCampaignType("upcoming")}
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
              campaignType === "upcoming"
                ? "bg-blue-600 text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            <CalendarDays size={18} />
            Upcoming Campaigns
          </button>
        </div>

        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Select Campaign
        </label>

        <select
          value={selectedCampaign}
          onChange={(e) => setSelectedCampaign(e.target.value)}
          disabled={loadingCampaigns || filteredCampaigns.length === 0}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 sm:max-w-md"
        >
          <option value="">
            {loadingCampaigns
              ? "Loading campaigns..."
              : filteredCampaigns.length === 0
              ? "No campaigns available"
              : "Select a campaign"}
          </option>

          {filteredCampaigns.map((campaign) => (
            <option key={campaign.id} value={String(campaign.id)}>
              {campaign.title}
            </option>
          ))}
        </select>

        {campaignType === "upcoming" && (
          <p className="mt-3 text-xs text-amber-600">
            Upcoming campaigns are displayed for registration checking.
            Attendance can only be marked after a campaign is completed.
          </p>
        )}
      </div>

      {/* Statistics */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>

                  <h2 className="mt-2 text-3xl font-bold text-slate-800">
                    {stat.value}
                  </h2>
                </div>

                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon size={23} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Attendance Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <ClipboardCheck size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Volunteer Attendance
              </h2>

              <p className="text-sm text-slate-500">
                {filteredAttendance.length} registration(s) found
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search volunteer..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Pending">Pending</option>
            </select>

            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              aria-label="Filter by date"
              className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-600 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {loadingCampaigns || loadingAttendance ? (
          <div className="px-6 py-16 text-center text-sm text-slate-500">
            Loading attendance records...
          </div>
        ) : !selectedCampaign ? (
          <div className="px-6 py-16 text-center">
            <CalendarDays
              size={35}
              className="mx-auto mb-3 text-slate-300"
            />

            <h3 className="font-semibold text-slate-800">
              No {campaignType === "completed" ? "previous" : "upcoming"} campaigns available
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Campaigns will appear here when their status is updated.
            </p>
          </div>
        ) : filteredAttendance.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <CalendarDays
              size={35}
              className="mx-auto mb-3 text-slate-300"
            />

            <h3 className="font-semibold text-slate-800">
              No attendance records found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or filters, or select another campaign.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Volunteer</th>
                    <th className="px-6 py-4 font-semibold">Campaign</th>
                    <th className="px-6 py-4 font-semibold">
                      Date & Location
                    </th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 text-right font-semibold">
                      Update Attendance
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredAttendance.map((item) => (
                    <tr
                      key={item.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-5">
                        <p className="font-semibold text-slate-800">
                          {item.name}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {item.email}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <p className="max-w-56 text-sm font-medium text-slate-700">
                          {item.campaign}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <p className="flex items-center gap-2 text-sm text-slate-700">
                          <CalendarDays
                            size={15}
                            className="text-slate-400"
                          />
                          {item.date || "Not specified"}
                        </p>

                        <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                          <MapPin
                            size={15}
                            className="text-slate-400"
                          />
                          {item.location}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
                            statusStyles[item.status] || statusStyles.Pending
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => updateStatus(item.id, "Present")}
                            disabled={
                              campaignType !== "completed" ||
                              updatingId === item.id
                            }
                            title="Mark present"
                            aria-label={`Mark ${item.name} present`}
                            className={`rounded-lg p-2 transition ${
                              item.status === "Present"
                                ? "bg-green-100 text-green-700"
                                : "text-green-600 hover:bg-green-50"
                            } disabled:cursor-not-allowed disabled:opacity-40`}
                          >
                            <CheckCircle size={19} />
                          </button>

                          <button
                            onClick={() => updateStatus(item.id, "Absent")}
                            disabled={
                              campaignType !== "completed" ||
                              updatingId === item.id
                            }
                            title="Mark absent"
                            aria-label={`Mark ${item.name} absent`}
                            className={`rounded-lg p-2 transition ${
                              item.status === "Absent"
                                ? "bg-red-100 text-red-700"
                                : "text-red-500 hover:bg-red-50"
                            } disabled:cursor-not-allowed disabled:opacity-40`}
                          >
                            <XCircle size={19} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="grid gap-4 p-4 md:hidden">
              {filteredAttendance.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-100 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {item.name}
                      </h3>

                      <p className="mt-1 break-all text-sm text-slate-500">
                        {item.email}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        statusStyles[item.status] || statusStyles.Pending
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-slate-500">
                    <p className="font-medium text-slate-700">
                      {item.campaign}
                    </p>

                    <p className="flex items-center gap-2">
                      <CalendarDays size={15} />
                      {item.date || "Not specified"}
                    </p>

                    <p className="flex items-center gap-2">
                      <MapPin size={15} />
                      {item.location}
                    </p>
                  </div>

                  <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
                    <button
                      onClick={() => updateStatus(item.id, "Present")}
                      disabled={
                        campaignType !== "completed" ||
                        updatingId === item.id
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <CheckCircle size={17} />
                      Present
                    </button>

                    <button
                      onClick={() => updateStatus(item.id, "Absent")}
                      disabled={
                        campaignType !== "completed" ||
                        updatingId === item.id
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <XCircle size={17} />
                      Absent
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <p className="mt-4 text-xs text-slate-400">
        Attendance records are retrieved from your Kindora database.
      </p>
    </div>
  );
}