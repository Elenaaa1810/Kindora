
import React from "react";
import {
  Users,
  CalendarDays,
  ClipboardCheck,
  Clock,
  ArrowUpRight,
  ArrowRight,
  MapPin,
  HeartHandshake,
  Sprout,
  HandHeart,
} from "lucide-react";

const stats = [
  {
    title: "Total Users",
    value: "248",
    note: "Registered members",
    icon: Users,
    color: "bg-sky-100 text-sky-700",
  },
  {
    title: "Total Campaigns",
    value: "36",
    note: "Created campaigns",
    icon: CalendarDays,
    color: "bg-violet-100 text-violet-700",
  },
  {
    title: "Pending Attendance",
    value: "12",
    note: "Awaiting approval",
    icon: ClipboardCheck,
    color: "bg-amber-100 text-amber-700",
  },
  {
    title: "Volunteer Hours",
    value: "1,284",
    note: "Verified total hours",
    icon: Clock,
    color: "bg-emerald-100 text-emerald-700",
  },
];

const campaigns = [
  {
    title: "Community Park Cleanup",
    category: "Environment",
    date: "Oct 20, 2026",
    location: "Mandalay",
    volunteers: 24,
    limit: 40,
    status: "Upcoming",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "Helping Hands Donation",
    category: "Donation",
    date: "Oct 23, 2026",
    location: "Mandalay",
    volunteers: 18,
    limit: 30,
    status: "Upcoming",
    color: "bg-sky-100 text-sky-700",
  },
  {
    title: "School Supply Collection",
    category: "Education",
    date: "Oct 26, 2026",
    location: "Amarapura",
    volunteers: 15,
    limit: 25,
    status: "Upcoming",
    color: "bg-violet-100 text-violet-700",
  },
];

const activities = [
  {
    name: "Aung Aung",
    action: "registered for",
    campaign: "Community Park Cleanup",
    time: "10 minutes ago",
    initials: "AA",
    color: "bg-sky-100 text-sky-700",
  },
  {
    name: "Su Su",
    action: "registered for",
    campaign: "Helping Hands Donation",
    time: "35 minutes ago",
    initials: "SS",
    color: "bg-pink-100 text-pink-700",
  },
  {
    name: "Mg Mg",
    action: "submitted attendance for",
    campaign: "School Supply Collection",
    time: "1 hour ago",
    initials: "MM",
    color: "bg-violet-100 text-violet-700",
  },
];

export default function AdminDashboard() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Welcome section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-100 via-blue-50 to-indigo-100 p-6 sm:p-8 lg:p-10">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-sm font-medium text-sky-700">
            <HeartHandshake size={17} />
            Volunteer Management
          </div>

          <h1 className="text-2xl font-bold leading-tight text-slate-800 sm:text-3xl lg:text-4xl">
            Welcome back, Admin!
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
            Here's what's happening in your community.
            Manage campaigns, review attendance, and help
            your volunteers make a difference.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/admin/campaigns"
              className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              Manage Campaigns
              <ArrowRight size={17} />
            </a>

            <a
              href="/admin/attendance"
              className="inline-flex items-center gap-2 rounded-xl border border-white bg-white/80 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white"
            >
              Review Attendance
            </a>
          </div>
        </div>

        <div className="absolute -right-8 -top-12 hidden h-64 w-64 items-center justify-center rounded-full bg-white/30 md:flex">
          <div className="flex h-44 w-44 items-center justify-center rounded-full bg-white/40">
            <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-white/70 text-sky-600 shadow-sm">
              <HandHeart size={60} strokeWidth={1.4} />
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section>
        <div className="mb-5">
          <h2 className="text-lg font-bold text-slate-800">
            Overview
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            A quick look at your volunteer community.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {stat.title}
                    </p>
                    <h3 className="mt-3 text-3xl font-bold text-slate-800">
                      {stat.value}
                    </h3>
                  </div>

                  <div className={`rounded-xl p-3 ${stat.color}`}>
                    <Icon size={23} />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  {stat.note}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Impact banner */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex items-center gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5">
          <div className="rounded-xl bg-white p-3 text-emerald-600">
            <Sprout size={25} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Trees Planted</p>
            <p className="text-2xl font-bold text-slate-800">560</p>
            <p className="mt-1 text-xs text-emerald-700">
              Community impact
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-rose-100 bg-rose-50/70 p-5">
          <div className="rounded-xl bg-white p-3 text-rose-500">
            <HandHeart size={25} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Donation Packages</p>
            <p className="text-2xl font-bold text-slate-800">320</p>
            <p className="mt-1 text-xs text-rose-600">
              Packages collected
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-sky-100 bg-sky-50/70 p-5">
          <div className="rounded-xl bg-white p-3 text-sky-600">
            <Users size={25} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Completed Campaigns</p>
            <p className="text-2xl font-bold text-slate-800">28</p>
            <p className="mt-1 text-xs text-sky-700">
              Community activities
            </p>
          </div>
        </div>
      </section>

      {/* Campaign list */}
      <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5 sm:p-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Upcoming Campaigns
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Keep track of your upcoming activities.
            </p>
          </div>

          <a
            href="/admin/campaigns"
            className="inline-flex items-center gap-1 text-sm font-semibold text-sky-700 hover:text-sky-800"
          >
            View all
            <ArrowUpRight size={17} />
          </a>
        </div>

        <div className="divide-y divide-slate-100">
          {campaigns.map((campaign) => (
            <div
              key={campaign.title}
              className="flex flex-col gap-4 p-5 transition hover:bg-slate-50/70 sm:p-6 lg:flex-row lg:items-center lg:justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                  <CalendarDays size={23} />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-800">
                    {campaign.title}
                  </h3>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays size={14} />
                      {campaign.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} />
                      {campaign.location}
                    </span>
                  </div>

                  <span
                    className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${campaign.color}`}
                  >
                    {campaign.category}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 lg:min-w-52 lg:justify-end">
                <div className="min-w-28">
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="text-slate-500">
                      Volunteers
                    </span>
                    <span className="font-semibold text-slate-700">
                      {campaign.volunteers}/{campaign.limit}
                    </span>
                  </div>

                  <div className="mt-2 h-2 w-32 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-sky-500"
                      style={{
                        width: `${Math.min(
                          (campaign.volunteers / campaign.limit) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                  {campaign.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent activity */}
      <section className="rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Recent Activity
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Latest volunteer activity on your platform.
            </p>
          </div>

          <div className="rounded-xl bg-sky-50 p-2.5 text-sky-600">
            <ClipboardCheck size={21} />
          </div>
        </div>

        <div className="divide-y divide-slate-100 px-5 sm:px-6">
          {activities.map((activity) => (
            <div
              key={`${activity.name}-${activity.time}`}
              className="flex items-start gap-3 py-5"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${activity.color}`}
              >
                {activity.initials}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm leading-6 text-slate-700">
                  <span className="font-semibold text-slate-800">
                    {activity.name}
                  </span>{" "}
                  {activity.action}{" "}
                  <span className="font-medium text-sky-700">
                    {activity.campaign}
                  </span>
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer note */}
      <footer className="pb-2 text-center text-xs text-slate-400">
        Every small action creates a better community.
      </footer>
    </div>
  );
}
