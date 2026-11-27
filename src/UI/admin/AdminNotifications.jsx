
import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import {
  Bell,
  UserPlus,
  CalendarPlus,
  MessageSquare,
  Clock,
  RefreshCw,
  ChevronRight,
  Users,
  CalendarDays,
  CheckCircle2,
  Inbox,
} from "lucide-react";

const filters = [
  { label: "All", value: "all" },
  { label: "Members", value: "member" },
  { label: "Campaigns", value: "campaign" },
  { label: "Community", value: "post" },
];

const getNotificationIcon = (type) => {
  switch (type) {
    case "member":
      return UserPlus;
    case "campaign":
      return CalendarPlus;
    case "post":
      return MessageSquare;
    default:
      return Bell;
  }
};

const getNotificationStyle = (type) => {
  switch (type) {
    case "member":
      return "bg-blue-100 text-blue-600";
    case "campaign":
      return "bg-purple-100 text-purple-600";
    case "post":
      return "bg-amber-100 text-amber-600";
    default:
      return "bg-sky-100 text-sky-600";
  }
};

const getCategoryLabel = (type) => {
  switch (type) {
    case "member":
      return "Member Registration";
    case "campaign":
      return "Campaign Registration";
    case "post":
      return "Community Post";
    default:
      return "Notification";
  }
};

export default function AdminNotifications() {
  const navigate = useNavigate();

  const {
    notifications = [],
    notificationLoading,
    notificationError,
    fetchNotifications,
    formatNotificationDate,
    lastViewedAt,
  } = useOutletContext();

  const [activeFilter, setActiveFilter] = useState("all");

  // Filter notifications
  const filteredNotifications =
    activeFilter === "all"
      ? notifications
      : notifications.filter(
          (notification) => notification.type === activeFilter
        );

  // Count notification categories
  const memberCount = notifications.filter(
    (item) => item.type === "member"
  ).length;

  const campaignCount = notifications.filter(
    (item) => item.type === "campaign"
  ).length;

  const postCount = notifications.filter(
    (item) => item.type === "post"
  ).length;

  // Check new notifications
  const isNewNotification = (notification) => {
    return (
      new Date(notification.date).getTime() > lastViewedAt
    );
  };

  const handleNotificationClick = (notification) => {
    navigate(notification.link);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-7">

      {/* Page Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Bell size={25} className="text-sky-600" />

            <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
              Notifications
            </h1>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Stay updated with new registrations and community activities.
          </p>
        </div>

        <button
          onClick={fetchNotifications}
          disabled={notificationLoading}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={notificationLoading ? "animate-spin" : ""}
          />

          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Member Registrations
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-800">
                {memberCount}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Users size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Campaign Registrations
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-800">
                {campaignCount}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <CalendarDays size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Pending Community Posts
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-800">
                {postCount}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <MessageSquare size={23} />
            </div>
          </div>
        </div>
      </div>

      {/* Notification List */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">

        {/* List Header */}
        <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Recent Notifications
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                View and manage your latest admin activities.
              </p>
            </div>

            <span className="text-xs font-medium text-slate-400">
              {notifications.length} notifications
            </span>
          </div>

          {/* Filters */}
          <div className="mt-5 flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  activeFilter === filter.value
                    ? "bg-sky-100 text-sky-800"
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {notificationLoading && notifications.length === 0 ? (
          <div className="py-16 text-center">
            <RefreshCw
              size={30}
              className="mx-auto animate-spin text-sky-500"
            />

            <p className="mt-4 text-sm text-slate-500">
              Loading notifications...
            </p>
          </div>
        ) : notificationError && notifications.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <Bell size={32} className="mx-auto text-rose-400" />

            <p className="mt-4 font-semibold text-slate-700">
              Unable to load notifications
            </p>

            <p className="mt-2 text-sm text-slate-400">
              {notificationError}
            </p>

            <button
              onClick={fetchNotifications}
              className="mt-5 rounded-xl bg-sky-100 px-5 py-2.5 text-sm font-semibold text-sky-700 hover:bg-sky-200"
            >
              Try Again
            </button>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Inbox size={30} />
            </div>

            <h3 className="mt-5 font-bold text-slate-700">
              No notifications found
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              There are no notifications in this category yet.
            </p>
          </div>
        ) : (
          <div>
            {filteredNotifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              const isNew = isNewNotification(notification);

              return (
                <button
                  key={notification.id}
                  onClick={() =>
                    handleNotificationClick(notification)
                  }
                  className="group flex w-full items-start gap-4 border-b border-slate-50 px-5 py-5 text-left transition hover:bg-sky-50/60 sm:px-7"
                >
                  {/* Icon */}
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${getNotificationStyle(
                      notification.type
                    )}`}
                  >
                    <Icon size={22} />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-800">
                        {notification.title}
                      </h3>

                      {isNew && (
                        <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-500">
                          NEW
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                      {notification.description}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <span className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Clock size={13} />

                        {formatNotificationDate(notification.date)}
                      </span>

                      <span className="h-1 w-1 rounded-full bg-slate-300" />

                      <span className="text-xs font-medium text-sky-600">
                        {getCategoryLabel(notification.type)}
                      </span>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex shrink-0 items-center gap-2 self-center">
                    {isNew && (
                      <span className="h-2 w-2 rounded-full bg-red-500" />
                    )}

                    <ChevronRight
                      size={19}
                      className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-sky-600"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-col items-center justify-between gap-2 bg-slate-50 px-5 py-4 sm:flex-row sm:px-7">
          <p className="text-xs text-slate-400">
            Showing the latest available notifications.
          </p>

          
        </div>
      </div>
    </div>
  );
}
