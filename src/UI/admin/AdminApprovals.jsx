
import React, { useState } from "react";
import {
  Search,
  UserCheck,
  UserX,
  Clock,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Eye,
  X,
  CheckCircle,
  XCircle,
  Users,
  FileText,
  MessageSquare,
} from "lucide-react";

const initialApplicants = [
  {
    id: 1,
    name: "Emily Johnson",
    email: "emily@gmail.com",
    phone: "09123456789",
    location: "Yangon, Myanmar",
    date: "October 28, 2026",
    interest: "Environment",
    reason: "I want to help protect the environment and participate in community activities.",
    status: "Pending",
    rejectionReason: "",
  },
  {
    id: 2,
    name: "Michael Smith",
    email: "michael@gmail.com",
    phone: "09987654321",
    location: "Mandalay, Myanmar",
    date: "October 29, 2026",
    interest: "Education",
    reason: "I enjoy teaching and would like to support children in need.",
    status: "Pending",
    rejectionReason: "",
  },
  {
    id: 3,
    name: "Sophia Brown",
    email: "sophia@gmail.com",
    phone: "09222333444",
    location: "Yangon, Myanmar",
    date: "October 25, 2026",
    interest: "Charity",
    reason: "I would love to contribute to donation and charity campaigns.",
    status: "Approved",
    rejectionReason: "",
  },
  {
    id: 4,
    name: "James Wilson",
    email: "james@gmail.com",
    phone: "09444555666",
    location: "Naypyidaw, Myanmar",
    date: "October 24, 2026",
    interest: "Community",
    reason: "I want to support local communities.",
    status: "Rejected",
    rejectionReason: "Please provide more complete information about your volunteering interests.",
  },
];

const statusStyles = {
  Pending: "bg-amber-50 text-amber-700",
  Approved: "bg-emerald-50 text-emerald-700",
  Rejected: "bg-rose-50 text-rose-600",
};

export default function MemberApproval() {
  const [applicants, setApplicants] = useState(initialApplicants);
  const [activeTab, setActiveTab] = useState("Pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [rejectingApplicant, setRejectingApplicant] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const pendingCount = applicants.filter(
    (user) => user.status === "Pending"
  ).length;

  const approvedCount = applicants.filter(
    (user) => user.status === "Approved"
  ).length;

  const rejectedCount = applicants.filter(
    (user) => user.status === "Rejected"
  ).length;

  const filteredApplicants = applicants.filter((user) => {
    const matchesTab = user.status === activeTab;

    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const handleApprove = (id) => {
    setApplicants((prev) =>
      prev.map((user) =>
        user.id === id
          ? { ...user, status: "Approved", rejectionReason: "" }
          : user
      )
    );

    setSelectedApplicant(null);
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      return;
    }

    setApplicants((prev) =>
      prev.map((user) =>
        user.id === rejectingApplicant.id
          ? {
              ...user,
              status: "Rejected",
              rejectionReason: rejectionReason.trim(),
            }
          : user
      )
    );

    setRejectingApplicant(null);
    setRejectionReason("");
    setSelectedApplicant(null);
  };

  const tabs = [
    {
      name: "Pending",
      count: pendingCount,
      icon: Clock,
    },
    {
      name: "Approved",
      count: approvedCount,
      icon: UserCheck,
    },
    {
      name: "Rejected",
      count: rejectedCount,
      icon: UserX,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Member Approvals
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Review and manage new volunteer membership applications.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-sky-50 px-4 py-3">
          <Users size={20} className="text-sky-600" />
          <span className="text-sm font-semibold text-sky-800">
            {pendingCount} Pending Applications
          </span>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Pending</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-800">
                {pendingCount}
              </h2>
            </div>
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <Clock size={22} />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Waiting for administrator review
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Approved</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-800">
                {approvedCount}
              </h2>
            </div>
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <CheckCircle size={22} />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Successfully approved applicants
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Rejected</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-800">
                {rejectedCount}
              </h2>
            </div>
            <div className="rounded-xl bg-rose-50 p-3 text-rose-600">
              <XCircle size={22} />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Applications not accepted
          </p>
        </div>
      </div>

      {/* Application Management */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-100 px-5 pt-5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.name;

            return (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "border-sky-500 text-sky-700"
                    : "border-transparent text-slate-400 hover:text-slate-700"
                }`}
              >
                <Icon size={17} />
                {tab.name}
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    isActive
                      ? "bg-sky-100 text-sky-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-slate-800">
              {activeTab} Applications
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              {activeTab === "Pending"
                ? "Review applicants before granting membership."
                : `View all ${activeTab.toLowerCase()} applications.`}
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search applicants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
          </div>
        </div>

        {/* Applicant Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Applicant</th>
                <th className="px-6 py-4 font-semibold">Interest</th>
                <th className="px-6 py-4 font-semibold">Applied Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredApplicants.length > 0 ? (
                filteredApplicants.map((user) => (
                  <tr
                    key={user.id}
                    className="transition hover:bg-slate-50/70"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 font-bold text-sky-700">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {user.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-lg bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-700">
                        {user.interest}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {user.date}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[user.status]}`}
                      >
                        {user.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <button
                          onClick={() => setSelectedApplicant(user)}
                          className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
                        >
                          <Eye size={15} />
                          View Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                      <FileText size={25} />
                    </div>
                    <p className="mt-4 font-semibold text-slate-700">
                      No {activeTab.toLowerCase()} applications found
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Try changing your search or selecting another tab.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="border-t border-slate-100 px-6 py-4">
          <p className="text-xs text-slate-400">
            Showing {filteredApplicants.length} application(s)
          </p>
        </div>
      </div>

      {/* Applicant Details Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4">
          <div className="my-auto w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Applicant Details
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Review this membership application
                </p>
              </div>

              <button
                onClick={() => setSelectedApplicant(null)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-2xl font-bold text-sky-700">
                  {selectedApplicant.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {selectedApplicant.name}
                  </h3>
                  <span
                    className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[selectedApplicant.status]}`}
                  >
                    {selectedApplicant.status}
                  </span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <Mail className="text-sky-600" size={18} />
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400">Email</p>
                    <p className="break-all text-sm font-medium text-slate-700">
                      {selectedApplicant.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="text-sky-600" size={18} />
                  <div>
                    <p className="text-xs text-slate-400">Phone</p>
                    <p className="text-sm font-medium text-slate-700">
                      {selectedApplicant.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="text-sky-600" size={18} />
                  <div>
                    <p className="text-xs text-slate-400">Location</p>
                    <p className="text-sm font-medium text-slate-700">
                      {selectedApplicant.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CalendarDays className="text-sky-600" size={18} />
                  <div>
                    <p className="text-xs text-slate-400">Applied Date</p>
                    <p className="text-sm font-medium text-slate-700">
                      {selectedApplicant.date}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Volunteering Interest
                </p>
                <span className="rounded-lg bg-sky-100 px-3 py-1.5 text-xs font-semibold text-sky-700">
                  {selectedApplicant.interest}
                </span>
              </div>

              <div>
                <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <MessageSquare size={17} className="text-sky-600" />
                  Why do you want to join Kindora?
                </p>
                <p className="rounded-xl border border-slate-100 bg-white p-4 text-sm leading-6 text-slate-600">
                  {selectedApplicant.reason}
                </p>
              </div>

              {selectedApplicant.status === "Rejected" &&
                selectedApplicant.rejectionReason && (
                  <div className="rounded-xl bg-rose-50 p-4">
                    <p className="text-sm font-semibold text-rose-700">
                      Rejection Reason
                    </p>
                    <p className="mt-2 text-sm leading-6 text-rose-600">
                      {selectedApplicant.rejectionReason}
                    </p>
                  </div>
                )}

              {selectedApplicant.status === "Pending" && (
                <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">
                  <button
                    onClick={() => handleApprove(selectedApplicant.id)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
                  >
                    <CheckCircle size={18} />
                    Approve Application
                  </button>

                  <button
                    onClick={() => {
                      setRejectingApplicant(selectedApplicant);
                      setRejectionReason("");
                    }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                  >
                    <XCircle size={18} />
                    Reject Application
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {rejectingApplicant && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Reject Application
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Provide a reason for rejecting {rejectingApplicant.name}.
                </p>
              </div>

              <button
                onClick={() => setRejectingApplicant(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <textarea
              rows="4"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter the reason for rejection..."
              className="mt-5 w-full resize-none rounded-xl border border-slate-200 p-4 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setRejectingApplicant(null)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
                className="flex-1 rounded-xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
