
import React, { useState } from "react";
import {
  Search,
  Plus,
  CalendarDays,
  MapPin,
  Users,
  Pencil,
  Trash2,
  X,
  Leaf,
  Heart,
  Package,
  CheckCircle,
} from "lucide-react";

const initialCampaigns = [
  {
    id: 1,
    title: "Community Cleaning Day",
    category: "Environment",
    date: "2026-11-05",
    time: "08:00 AM",
    location: "Mandalay City",
    volunteers: 24,
    capacity: 40,
    status: "Upcoming",
    description: "Help clean public spaces and keep our community beautiful.",
  },
  {
    id: 2,
    title: "Donation for Children",
    category: "Donation",
    date: "2026-11-12",
    time: "09:00 AM",
    location: "Mandalay",
    volunteers: 18,
    capacity: 30,
    status: "Upcoming",
    description: "Collect and donate essential supplies for children in need.",
  },
  {
    id: 3,
    title: "Tree Planting Campaign",
    category: "Environment",
    date: "2026-10-10",
    time: "07:30 AM",
    location: "Mandalay Park",
    volunteers: 35,
    capacity: 35,
    status: "Completed",
    description: "Plant trees to support a greener and healthier environment.",
  },
];

const emptyForm = {
  title: "",
  category: "Environment",
  date: "",
  time: "",
  location: "",
  capacity: "30",
  description: "",
};

const categoryStyles = {
  Environment: "bg-green-100 text-green-700",
  Donation: "bg-pink-100 text-pink-700",
  Education: "bg-blue-100 text-blue-700",
  Community: "bg-purple-100 text-purple-700",
};

export default function CampaignManagement() {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.title.toLowerCase().includes(search.toLowerCase()) ||
      campaign.location.toLowerCase().includes(search.toLowerCase()) ||
      campaign.category.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filter === "All" || campaign.status === filter;

    return matchesSearch && matchesFilter;
  });

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (campaign) => {
    setEditingId(campaign.id);
    setForm({
      title: campaign.title,
      category: campaign.category,
      date: campaign.date,
      time: campaign.time,
      location: campaign.location,
      capacity: String(campaign.capacity),
      description: campaign.description,
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedDate = new Date(`${form.date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingCampaign = campaigns.find(
      (campaign) => campaign.id === editingId
    );

    if (selectedDate < today && existingCampaign?.status !== "Completed") {
      alert("Please select today or a future date.");
      return;
    }

    const updatedCampaign = {
      id: editingId ?? Date.now(),
      ...form,
      capacity: Number(form.capacity),
      volunteers: existingCampaign?.volunteers ?? 0,
      status:
        existingCampaign?.status === "Completed"
          ? "Completed"
          : selectedDate < today
            ? "Completed"
            : "Upcoming",
    };

    if (editingId !== null) {
      setCampaigns((current) =>
        current.map((campaign) =>
          campaign.id === editingId ? updatedCampaign : campaign
        )
      );
    } else {
      setCampaigns((current) => [updatedCampaign, ...current]);
    }

    setShowForm(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const deleteCampaign = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this campaign?"
    );

    if (confirmed) {
      setCampaigns((current) =>
        current.filter((campaign) => campaign.id !== id)
      );
    }
  };

  const markCompleted = (id) => {
    setCampaigns((current) =>
      current.map((campaign) =>
        campaign.id === id
          ? { ...campaign, status: "Completed" }
          : campaign
      )
    );
  };

  const stats = [
    {
      label: "Total Campaigns",
      value: campaigns.length,
      icon: Heart,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Upcoming",
      value: campaigns.filter((c) => c.status === "Upcoming").length,
      icon: CalendarDays,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Completed",
      value: campaigns.filter((c) => c.status === "Completed").length,
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Total Volunteers",
      value: campaigns.reduce((sum, c) => sum + c.volunteers, 0),
      icon: Users,
      color: "bg-pink-100 text-pink-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-1 text-sm font-medium text-blue-600">
            Administration / Campaigns
          </p>
          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            Campaign Management
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Create and manage volunteer campaigns and activities.
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus size={19} />
          Add Campaign
        </button>
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

      {/* Campaign list */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              All Campaigns
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {filteredCampaigns.length} campaign(s) found
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search campaigns..."
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-64"
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {filteredCampaigns.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <CalendarDays size={27} />
            </div>
            <h3 className="font-semibold text-slate-800">
              No campaigns found
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Try another search or create a new campaign.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Campaign</th>
                    <th className="px-6 py-4 font-semibold">Date & Time</th>
                    <th className="px-6 py-4 font-semibold">Volunteers</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredCampaigns.map((campaign) => (
                    <tr
                      key={campaign.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-start gap-3">
                          <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                            {campaign.category === "Environment" ? (
                              <Leaf size={20} />
                            ) : campaign.category === "Donation" ? (
                              <Package size={20} />
                            ) : (
                              <Heart size={20} />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">
                              {campaign.title}
                            </p>
                            <span
                              className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                                categoryStyles[campaign.category] ||
                                "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {campaign.category}
                            </span>
                            <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                              <MapPin size={13} />
                              {campaign.location}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <p className="text-sm font-medium text-slate-700">
                          {campaign.date}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {campaign.time}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <p className="text-sm font-semibold text-slate-700">
                          {campaign.volunteers} / {campaign.capacity}
                        </p>
                        <div className="mt-2 h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-blue-500"
                            style={{
                              width: `${Math.min(
                                100,
                                (campaign.volunteers /
                                  Math.max(1, campaign.capacity)) *
                                  100
                              )}%`,
                            }}
                          />
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                            campaign.status === "Completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {campaign.status}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          {campaign.status !== "Completed" && (
                            <button
                              onClick={() => markCompleted(campaign.id)}
                              title="Mark completed"
                              aria-label={`Mark ${campaign.title} completed`}
                              className="rounded-lg p-2 text-green-600 hover:bg-green-50"
                            >
                              <CheckCircle size={18} />
                            </button>
                          )}
                          <button
                            onClick={() => openEditForm(campaign)}
                            title="Edit campaign"
                            aria-label={`Edit ${campaign.title}`}
                            className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => deleteCampaign(campaign.id)}
                            title="Delete campaign"
                            aria-label={`Delete ${campaign.title}`}
                            className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile campaign cards */}
            <div className="grid gap-4 p-4 md:hidden">
              {filteredCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="rounded-xl border border-slate-100 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {campaign.title}
                      </h3>
                      <span
                        className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          categoryStyles[campaign.category] ||
                          "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {campaign.category}
                      </span>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        campaign.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {campaign.status}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-slate-500">
                    <p className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      {campaign.date} · {campaign.time}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin size={16} />
                      {campaign.location}
                    </p>
                    <p className="flex items-center gap-2">
                      <Users size={16} />
                      {campaign.volunteers} / {campaign.capacity} volunteers
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-3">
                    {campaign.status !== "Completed" && (
                      <button
                        onClick={() => markCompleted(campaign.id)}
                        className="rounded-lg p-2 text-green-600 hover:bg-green-50"
                        aria-label={`Mark ${campaign.title} completed`}
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => openEditForm(campaign)}
                      className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                      aria-label={`Edit ${campaign.title}`}
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => deleteCampaign(campaign.id)}
                      className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                      aria-label={`Delete ${campaign.title}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Add/Edit modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowForm(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="campaign-form-title"
            className="my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl"
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white p-5">
              <div>
                <h2
                  id="campaign-form-title"
                  className="text-xl font-bold text-slate-800"
                >
                  {editingId !== null ? "Edit Campaign" : "Add New Campaign"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Enter the details of the volunteer activity.
                </p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close form"
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Campaign Title *
                </label>
                <input
                  required
                  maxLength={100}
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  placeholder="e.g. Community Cleaning Day"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Category *
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option>Environment</option>
                  <option>Donation</option>
                  <option>Education</option>
                  <option>Community</option>
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Date *
                  </label>
                  <input
                    required
                    type="date"
                    min={
                      editingId !== null &&
                      campaigns.find((c) => c.id === editingId)?.status ===
                        "Completed"
                        ? undefined
                        : new Date().toLocaleDateString("en-CA")
                    }
                    value={form.date}
                    onChange={(e) =>
                      setForm({ ...form, date: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Time *
                  </label>
                  <input
                    required
                    type="time"
                    value={form.time}
                    onChange={(e) =>
                      setForm({ ...form, time: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Location *
                  </label>
                  <input
                    required
                    maxLength={150}
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                    placeholder="Enter campaign location"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Volunteer Capacity *
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    max="10000"
                    value={form.capacity}
                    onChange={(e) =>
                      setForm({ ...form, capacity: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Description *
                </label>
                <textarea
                  required
                  maxLength={1000}
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Describe the campaign and what volunteers will do..."
                  className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  {editingId !== null ? "Save Changes" : "Create Campaign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
