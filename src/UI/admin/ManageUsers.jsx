
import React, { useState } from "react";
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
} from "lucide-react";

const initialUsers = [
  {
    id: 1,
    name: "Aung Aung",
    email: "aung@example.com",
    location: "Mandalay",
    joined: "2026-09-10",
    role: "Member",
    status: "Active",
    campaigns: 8,
    hours: 24,
  },
  {
    id: 2,
    name: "Su Su",
    email: "susu@example.com",
    location: "Yangon",
    joined: "2026-09-15",
    role: "Member",
    status: "Active",
    campaigns: 12,
    hours: 36,
  },
  {
    id: 3,
    name: "Mg Mg",
    email: "mgmg@example.com",
    location: "Naypyidaw",
    joined: "2026-09-20",
    role: "Member",
    status: "Suspended",
    campaigns: 2,
    hours: 5,
  },
  {
    id: 4,
    name: "Hnin Hnin",
    email: "hnin@example.com",
    location: "Mandalay",
    joined: "2026-09-22",
    role: "Member",
    status: "Active",
    campaigns: 15,
    hours: 42,
  },
  {
    id: 6,
    name: "May Thu",
    email: "may@example.com",
    location: "Yangon",
    joined: "2026-10-05",
    role: "Member",
    status: "Active",
    campaigns: 6,
    hours: 18,
  },
];

const statusStyles = {
  Active: "bg-green-100 text-green-700",
  Suspended: "bg-red-100 text-red-700",
};

const avatarColors = [
  "bg-blue-100 text-blue-700",
  "bg-pink-100 text-pink-700",
  "bg-purple-100 text-purple-700",
  "bg-green-100 text-green-700",
  "bg-amber-100 text-amber-700",
];

export default function ManageUsers() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);

  // Search and filter users
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

  // Update member status
  const updateStatus = (id, status) => {
    setUsers((current) =>
      current.map((user) =>
        user.id === id ? { ...user, status } : user
      )
    );

    setSelectedUser((current) =>
      current?.id === id ? { ...current, status } : current
    );

    setOpenMenu(null);
  };

  // Statistics cards
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
  ];

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

      {/* Statistics */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    {stat.label}
                  </p>

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

        {filteredUsers.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Users
              size={36}
              className="mx-auto mb-3 text-slate-300"
            />

            <h3 className="font-semibold text-slate-800">
              No members found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or filters.
            </p>
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
                    <th className="px-6 py-4 font-semibold">Activity</th>
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
                      {/* Member */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                              avatarColors[index % avatarColors.length]
                            }`}
                          >
                            {user.name
                              .split(" ")
                              .map((part) => part[0])
                              .join("")
                              .slice(0, 2)}
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

                      {/* Location */}
                      <td className="px-6 py-5">
                        <p className="flex items-center gap-2 text-sm text-slate-600">
                          <MapPin size={15} className="text-slate-400" />
                          {user.location}
                        </p>
                      </td>

                      {/* Joined */}
                      <td className="px-6 py-5">
                        <p className="flex items-center gap-2 text-sm text-slate-600">
                          <CalendarDays
                            size={15}
                            className="text-slate-400"
                          />
                          {user.joined}
                        </p>
                      </td>

                      {/* Activity */}
                      <td className="px-6 py-5">
                        <p className="text-sm font-semibold text-slate-700">
                          {user.campaigns} campaigns
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {user.hours} volunteering hours
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[user.status]}`}
                        >
                          {user.status}
                        </span>
                      </td>

                      {/* Actions */}
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
                              <div className="absolute right-0 top-10 z-20 w-48 rounded-xl border border-slate-100 bg-white p-2 shadow-lg">

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

                                {user.status === "Active" && (
                                  <button
                                    onClick={() =>
                                      updateStatus(user.id, "Suspended")
                                    }
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                  >
                                    <Ban size={16} />
                                    Suspend Account
                                  </button>
                                )}

                                {user.status === "Suspended" && (
                                  <button
                                    onClick={() =>
                                      updateStatus(user.id, "Active")
                                    }
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-green-700 hover:bg-green-50"
                                  >
                                    <RotateCcw size={16} />
                                    Restore Account
                                  </button>
                                )}

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
                      {user.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-semibold text-slate-800">
                          {user.name}
                        </h3>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[user.status]}`}
                        >
                          {user.status}
                        </span>
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
                      Joined {user.joined}
                    </p>

                    <p>
                      {user.campaigns} campaigns · {user.hours} volunteer hours
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3">

                    <button
                      onClick={() => setSelectedUser(user)}
                      className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                    >
                      View Details
                    </button>

                    {user.status === "Active" ? (
                      <button
                        onClick={() =>
                          updateStatus(user.id, "Suspended")
                        }
                        className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                      >
                        Suspend
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          updateStatus(user.id, "Active")
                        }
                        className="rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-100"
                      >
                        Restore
                      </button>
                    )}

                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <p className="mt-4 text-xs text-slate-400">
        Demo data only. Changes are not saved to a database.
      </p>

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
            {/* Modal Header */}
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

            {/* Modal Content */}
            <div className="p-6">

              <div className="mb-6 flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">
                  {selectedUser.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)}
                </div>

                <h3 className="mt-3 text-lg font-bold text-slate-800">
                  {selectedUser.name}
                </h3>

                <span
                  className={`mt-2 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[selectedUser.status]}`}
                >
                  {selectedUser.status}
                </span>
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
                      {selectedUser.joined}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Campaigns</p>
                    <p className="mt-1 text-2xl font-bold text-slate-800">
                      {selectedUser.campaigns}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Volunteer Hours</p>
                    <p className="mt-1 text-2xl font-bold text-slate-800">
                      {selectedUser.hours}
                    </p>
                  </div>
                </div>

              </div>

              {/* Modal Actions */}
              <div className="mt-6 flex flex-wrap gap-3">

                {selectedUser.status === "Active" ? (
                  <button
                    onClick={() =>
                      updateStatus(selectedUser.id, "Suspended")
                    }
                    className="flex-1 rounded-xl bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700"
                  >
                    Suspend Account
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      updateStatus(selectedUser.id, "Active")
                    }
                    className="flex-1 rounded-xl bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700"
                  >
                    Restore Account
                  </button>
                )}

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
