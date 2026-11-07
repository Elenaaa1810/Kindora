import React, { useEffect, useState } from "react";
import {
  Search,
  Users,
  UserCheck,
  UserX,
  Mail,
  MapPin,
  CalendarDays,
  MoreVertical,
  X,
  Eye,
  Ban,
  RotateCcw,
  CheckCircle,
  LoaderCircle,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000/api";

const avatarColors = [
  "bg-blue-100 text-blue-700",
  "bg-pink-100 text-pink-700",
  "bg-purple-100 text-purple-700",
  "bg-green-100 text-green-700",
  "bg-amber-100 text-amber-700",
];

const statusStyles = {
  Active: "bg-green-100 text-green-700",
  Suspended: "bg-red-100 text-red-700",
  pending: "bg-amber-100 text-amber-700",
  rejected: "bg-slate-100 text-slate-600",
};

const getToken = () => {
  return (
    localStorage.getItem("adminToken") ||
    sessionStorage.getItem("adminToken") ||
    localStorage.getItem("memberToken") ||
    sessionStorage.getItem("memberToken")
  );
};

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString();
};

const getInitials = (name = "") => {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load members from Laravel
  const fetchMembers = async () => {
    setLoading(true);
    setError("");

    try {
      const token = getToken();

      if (!token) {
        throw new Error("Please log in as an admin first.");
      }

      const response = await fetch(`${API_URL}/admin/members`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load members.");
      }

      const formattedMembers = (data.members || []).map((member) => ({
        id: member.id,
        name: member.full_name || "Unknown Member",
        email: member.email || "—",
        phone: member.phone || "—",
        location: member.location || "—",
        joined: member.created_at,
        role: member.role || "Member",
        status: member.status || "pending",
        campaigns: member.campaign_registrations_count ?? null,
        rejectionReason: member.rejection_reason || "",
      }));

      setUsers(formattedMembers);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Search and filter
  const filteredUsers = users.filter((user) => {
    const searchTerm = search.toLowerCase();

    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.location.toLowerCase().includes(searchTerm);

    const matchesStatus =
      statusFilter === "All" || user.status === statusFilter;

    const matchesRole =
      roleFilter === "All" || user.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  // Statistics
  const activeCount = users.filter(
    (user) => user.status === "Active"
  ).length;

  const suspendedCount = users.filter(
    (user) => user.status === "Suspended"
  ).length;

  const pendingCount = users.filter(
    (user) => user.status === "pending"
  ).length;

  // Update member information in React state
  const updateMemberInState = (updatedMember) => {
    const updatedUser = {
      id: updatedMember.id,
      name: updatedMember.full_name || "Unknown Member",
      email: updatedMember.email || "—",
      phone: updatedMember.phone || "—",
      location: updatedMember.location || "—",
      joined: updatedMember.created_at,
      role: updatedMember.role || "Member",
      status: updatedMember.status,
      campaigns: updatedMember.campaign_registrations_count ?? null,
      rejectionReason: updatedMember.rejection_reason || "",
    };

    setUsers((current) =>
      current.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      )
    );

    setSelectedUser((current) =>
      current?.id === updatedUser.id ? updatedUser : current
    );
  };

  // Send a request to Laravel
  const sendMemberAction = async (url, method, body = null) => {
    const token = getToken();

    if (!token) {
      throw new Error("Please log in as an admin first.");
    }

    const response = await fetch(`${API_URL}${url}`, {
      method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    const data = await response.json();

    if (!response.ok) {
      const validationMessage = data.errors
        ? Object.values(data.errors).flat().join(" ")
        : "";

      throw new Error(
        validationMessage || data.message || "The action failed."
      );
    }

    if (data.member) {
      updateMemberInState(data.member);
    }

    return data;
  };

  // Approve a pending member
  const approveMember = async (user) => {
    const confirmed = window.confirm(
      `Are you sure you want to approve ${user.name}?`
    );

    if (!confirmed) return;

    setActionLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await sendMemberAction(
        `/admin/members/${user.id}/approve`,
        "PATCH"
      );

      setSuccess(data.message || "Member approved successfully.");
      setOpenMenu(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Reject a pending member
  const rejectMember = async (user) => {
    const reason = window.prompt(
      `Enter the rejection reason for ${user.name}:`
    );

    if (reason === null) return;

    if (!reason.trim()) {
      setError("Please enter a rejection reason.");
      return;
    }

    setActionLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await sendMemberAction(
        `/admin/members/${user.id}/reject`,
        "PATCH",
        { rejection_reason: reason.trim() }
      );

      setSuccess(data.message || "Application rejected.");
      setOpenMenu(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Suspend or restore an account
  const updateStatus = async (user, newStatus) => {
    const action = newStatus === "Suspended" ? "suspend" : "restore";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${user.name}'s account?`
    );

    if (!confirmed) return;

    setActionLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await sendMemberAction(
        `/admin/members/${user.id}/status`,
        "PATCH",
        { status: newStatus }
      );

      setSuccess(data.message || `Account ${action}ed successfully.`);
      setOpenMenu(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const stats = [
    {
      label: "Total Members",
      value: users.length,
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Active Members",
      value: activeCount,
      icon: UserCheck,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Suspended",
      value: suspendedCount,
      icon: UserX,
      color: "bg-red-100 text-red-600",
    },
    {
      label: "Pending Approval",
      value: pendingCount,
      icon: CheckCircle,
      color: "bg-amber-100 text-amber-600",
    },
  ];

  const renderStatus = (status) => (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
        statusStyles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );

  const renderActions = (user) => (
    <>
      {user.status === "pending" && (
        <>
          <button
            onClick={() => approveMember(user)}
            disabled={actionLoading}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-green-700 hover:bg-green-50 disabled:opacity-50"
          >
            <CheckCircle size={16} />
            Approve Application
          </button>

          <button
            onClick={() => rejectMember(user)}
            disabled={actionLoading}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            <Ban size={16} />
            Reject Application
          </button>
        </>
      )}

      {user.status === "Active" && (
        <button
          onClick={() => updateStatus(user, "Suspended")}
          disabled={actionLoading}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          <Ban size={16} />
          Suspend Account
        </button>
      )}

      {user.status === "Suspended" && (
        <button
          onClick={() => updateStatus(user, "Active")}
          disabled={actionLoading}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-green-700 hover:bg-green-50 disabled:opacity-50"
        >
          <RotateCcw size={16} />
          Restore Account
        </button>
      )}

      {user.status === "rejected" && (
        <p className="px-3 py-2 text-xs text-slate-500">
          This application has been rejected.
        </p>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <p className="mb-1 text-sm font-medium text-blue-600">
          Administration / Users
        </p>

        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
          Manage Users
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          View member accounts and manage access to your volunteer community.
        </p>
      </div>

      {/* Error and success messages */}
      {error && (
        <div className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p>{error}</p>
          <button onClick={() => setError("")} aria-label="Dismiss error">
            <X size={18} />
          </button>
        </div>
      )}

      {success && (
        <div className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          <p>{success}</p>
          <button
            onClick={() => setSuccess("")}
            aria-label="Dismiss success message"
          >
            <X size={18} />
          </button>
        </div>
      )}

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

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-800">
              Registered Members
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredUsers.length} member(s) found
            </p>
          </div>

          {/* Search and filters */}
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
                placeholder="Search name, email, location..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="All">All Roles</option>
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-slate-500">
            <LoaderCircle size={30} className="mb-3 animate-spin" />
            <p className="text-sm">Loading members...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Users size={36} className="mx-auto mb-3 text-slate-300" />

            <h3 className="font-semibold text-slate-800">
              No members found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or filters.
            </p>

            <button
              onClick={fetchMembers}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Refresh Members
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Member</th>
                    <th className="px-6 py-4 font-semibold">Location</th>
                    <th className="px-6 py-4 font-semibold">Joined</th>
                    <th className="px-6 py-4 font-semibold">Campaigns</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                              avatarColors[index % avatarColors.length]
                            }`}
                          >
                            {getInitials(user.name)}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800">
                              {user.name}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              {user.email}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              {user.role}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <p className="flex items-center gap-2 text-sm text-slate-600">
                          <MapPin size={15} className="text-slate-400" />
                          {user.location}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <p className="flex items-center gap-2 text-sm text-slate-600">
                          <CalendarDays
                            size={15}
                            className="text-slate-400"
                          />
                          {formatDate(user.joined)}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {user.campaigns === null
                          ? "—"
                          : `${user.campaigns} campaigns`}
                      </td>

                      <td className="px-6 py-5">
                        {renderStatus(user.status)}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-end">
                          <div className="relative">
                            <button
                              onClick={() =>
                                setOpenMenu(
                                  openMenu === user.id ? null : user.id
                                )
                              }
                              aria-label={`Actions for ${user.name}`}
                              aria-expanded={openMenu === user.id}
                              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                            >
                              <MoreVertical size={19} />
                            </button>

                            {openMenu === user.id && (
                              <div className="absolute right-0 top-10 z-20 w-52 rounded-xl border border-slate-100 bg-white p-2 shadow-lg">
                                <button
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setOpenMenu(null);
                                  }}
                                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                >
                                  <Eye size={16} />
                                  View Details
                                </button>

                                {renderActions(user)}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="grid gap-4 p-4 md:hidden">
              {filteredUsers.map((user, index) => (
                <div
                  key={user.id}
                  className="rounded-xl border border-slate-100 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        avatarColors[index % avatarColors.length]
                      }`}
                    >
                      {getInitials(user.name)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-semibold text-slate-800">
                          {user.name}
                        </h3>
                        {renderStatus(user.status)}
                      </div>

                      <p className="mt-1 break-all text-sm text-slate-500">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-slate-500">
                    <p className="flex items-center gap-2">
                      <MapPin size={15} />
                      {user.location}
                    </p>

                    <p className="flex items-center gap-2">
                      <CalendarDays size={15} />
                      Joined {formatDate(user.joined)}
                    </p>

                    <p>
                      Campaigns: {user.campaigns ?? "—"}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                    >
                      View Details
                    </button>

                    {user.status === "pending" ? (
                      <>
                        <button
                          onClick={() => approveMember(user)}
                          disabled={actionLoading}
                          className="rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 disabled:opacity-50"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => rejectMember(user)}
                          disabled={actionLoading}
                          className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </>
                    ) : user.status === "Active" ? (
                      <button
                        onClick={() => updateStatus(user, "Suspended")}
                        disabled={actionLoading}
                        className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 disabled:opacity-50"
                      >
                        Suspend
                      </button>
                    ) : user.status === "Suspended" ? (
                      <button
                        onClick={() => updateStatus(user, "Active")}
                        disabled={actionLoading}
                        className="rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 disabled:opacity-50"
                      >
                        Restore
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Refresh and loading indicator */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-slate-400">
          Member information is loaded from your database.
        </p>

        <button
          onClick={fetchMembers}
          disabled={loading}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      {/* Member Details Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedUser(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="user-details-title"
            className="my-auto w-full max-w-lg rounded-2xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <h2
                id="user-details-title"
                className="text-xl font-bold text-slate-800"
              >
                Member Details
              </h2>

              <button
                onClick={() => setSelectedUser(null)}
                aria-label="Close member details"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6 flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">
                  {getInitials(selectedUser.name)}
                </div>

                <h3 className="mt-3 text-lg font-bold text-slate-800">
                  {selectedUser.name}
                </h3>

                <div className="mt-2">
                  {renderStatus(selectedUser.status)}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail size={18} className="mt-0.5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="break-all text-sm font-medium text-slate-700">
                      {selectedUser.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users size={18} className="mt-0.5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Phone</p>
                    <p className="text-sm font-medium text-slate-700">
                      {selectedUser.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin size={18} className="mt-0.5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Location</p>
                    <p className="text-sm font-medium text-slate-700">
                      {selectedUser.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CalendarDays
                    size={18}
                    className="mt-0.5 text-slate-400"
                  />
                  <div>
                    <p className="text-xs text-slate-500">Date Joined</p>
                    <p className="text-sm font-medium text-slate-700">
                      {formatDate(selectedUser.joined)}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">
                    Campaign Registrations
                  </p>
                  <p className="mt-1 text-2xl font-bold text-slate-800">
                    {selectedUser.campaigns ?? "—"}
                  </p>
                </div>

                {selectedUser.rejectionReason && (
                  <div className="rounded-xl bg-red-50 p-4">
                    <p className="text-sm font-semibold text-red-700">
                      Rejection Reason
                    </p>
                    <p className="mt-1 text-sm text-red-600">
                      {selectedUser.rejectionReason}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {selectedUser.status === "pending" ? (
                  <>
                    <button
                      onClick={() => approveMember(selectedUser)}
                      disabled={actionLoading}
                      className="flex-1 rounded-xl bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => rejectMember(selectedUser)}
                      disabled={actionLoading}
                      className="flex-1 rounded-xl bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </>
                ) : selectedUser.status === "Active" ? (
                  <button
                    onClick={() => updateStatus(selectedUser, "Suspended")}
                    disabled={actionLoading}
                    className="flex-1 rounded-xl bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    Suspend Account
                  </button>
                ) : selectedUser.status === "Suspended" ? (
                  <button
                    onClick={() => updateStatus(selectedUser, "Active")}
                    disabled={actionLoading}
                    className="flex-1 rounded-xl bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    Restore Account
                  </button>
                ) : null}

                <button
                  onClick={() => setSelectedUser(null)}
                  className="rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}