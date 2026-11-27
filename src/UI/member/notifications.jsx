
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./header";
import {
  Bell,
  Heart,
  MessageCircle,
  MessageSquareReply,
  Share2,
  CheckCircle,
  CalendarCheck,
  Trash2,
  Check,
  RefreshCw,
  ChevronRight,
  Inbox,
  X,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000/api";

const getToken = () => {
  return (
    localStorage.getItem("memberToken") ||
    sessionStorage.getItem("memberToken")
  );
};

const getHeaders = () => ({
  Accept: "application/json",
  Authorization: `Bearer ${getToken()}`,
});

const formatDate = (date) => {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "";

  return parsedDate.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const getNotificationStyle = (type) => {
  switch (type) {
    case "post_liked":
      return {
        icon: Heart,
        color: "bg-rose-100 text-rose-600",
      };

    case "post_commented":
      return {
        icon: MessageCircle,
        color: "bg-blue-100 text-blue-600",
      };

    case "comment_reply":
      return {
        icon: MessageSquareReply,
        color: "bg-purple-100 text-purple-600",
      };

    case "post_shared":
      return {
        icon: Share2,
        color: "bg-cyan-100 text-cyan-600",
      };

case "post_approved":
  return {
    icon: CheckCircle,
    color: "bg-green-100 text-green-600",
  };

case "post_rejected":
  return {
    icon: X,
    color: "bg-red-100 text-red-600",
  };

    case "attendance_present":
      return {
        icon: CalendarCheck,
        color: "bg-sky-100 text-sky-600",
      };

    default:
      return {
        icon: Bell,
        color: "bg-slate-100 text-slate-600",
      };
  }
};

export default function Notifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // ========================================
  // FETCH NOTIFICATIONS
  // ========================================

  const fetchNotifications = async (showRefresh = false) => {
    if (!getToken()) {
      setError("Please log in to view your notifications.");
      setLoading(false);
      return;
    }

    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const response = await fetch(
        `${API_URL}/member/notifications`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to load notifications."
        );
      }

      const notificationData = result.data?.data || [];

      setNotifications(notificationData);
      setUnreadCount(result.unread_count || 0);
    } catch (err) {
      console.error("Notification error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // ========================================
  // MARK ONE NOTIFICATION AS READ
  // ========================================

  const markAsRead = async (id) => {
    try {
      const response = await fetch(
        `${API_URL}/member/notifications/${id}/read`,
        {
          method: "PATCH",
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error("Unable to mark notification as read.");
      }

      setNotifications((previous) =>
        previous.map((notification) =>
          notification.id === id
            ? { ...notification, read_at: new Date().toISOString() }
            : notification
        )
      );

      setUnreadCount((previous) => Math.max(0, previous - 1));

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // ========================================
  // MARK ALL AS READ
  // ========================================

  const markAllAsRead = async () => {
    try {
      const response = await fetch(
        `${API_URL}/member/notifications/read-all`,
        {
          method: "PATCH",
          headers: getHeaders(),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to mark all as read."
        );
      }

      const currentTime = new Date().toISOString();

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          read_at: notification.read_at || currentTime,
        }))
      );

      setUnreadCount(0);
    } catch (err) {
      console.error("Mark all as read error:", err);
      alert(err.message);
    }
  };

  // ========================================
  // DELETE NOTIFICATION
  // ========================================

  const deleteNotification = async (id) => {
    try {
      const notification = notifications.find(
        (item) => item.id === id
      );

      const response = await fetch(
        `${API_URL}/member/notifications/${id}`,
        {
          method: "DELETE",
          headers: getHeaders(),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to delete notification."
        );
      }

      setNotifications((previous) =>
        previous.filter((item) => item.id !== id)
      );

      if (notification && !notification.read_at) {
        setUnreadCount((previous) => Math.max(0, previous - 1));
      }
    } catch (err) {
      console.error("Delete notification error:", err);
      alert(err.message);
    }
  };

  // ========================================
  // CLICK NOTIFICATION
  // ========================================

  const handleNotificationClick = async (notification) => {
    if (!notification.read_at) {
      await markAsRead(notification.id);
    }

    const destination = notification.data?.url;

    if (destination) {
      navigate(destination);
    }
  };

  // ========================================
  // MAIN PAGE
  // ========================================

  return (
    <div className="min-h-screen bg-[#F7FAFD]">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Page heading */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DDF0FC] text-[#438FC4]">
                <Bell size={25} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-[#24364B] sm:text-3xl">
                  Notifications
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Stay updated with your Kindora activities.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#CDE8F8] bg-white px-4 py-2.5 text-sm font-semibold text-[#438FC4] transition hover:bg-[#EAF5FC] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Check size={17} />
            Mark all as read
          </button>
        </div>

        {/* Notification list */}
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">

          {/* List heading */}
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
            <div>
              <h2 className="font-bold text-[#24364B]">
                All Notifications
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Your latest updates and activities
              </p>
            </div>

            <button
              onClick={() => fetchNotifications(true)}
              disabled={refreshing}
              className="rounded-xl p-2.5 text-slate-400 transition hover:bg-[#EAF5FC] hover:text-[#438FC4]"
              title="Refresh notifications"
            >
              <RefreshCw
                size={18}
                className={refreshing ? "animate-spin" : ""}
              />
            </button>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="py-16 text-center">
              <RefreshCw
                size={28}
                className="mx-auto animate-spin text-[#67A9D7]"
              />

              <p className="mt-3 text-sm text-slate-400">
                Loading notifications...
              </p>
            </div>
          ) : error ? (
            <div className="px-5 py-16 text-center">
              <p className="text-sm text-rose-500">{error}</p>

              <button
                onClick={() => fetchNotifications()}
                className="mt-4 text-sm font-semibold text-[#438FC4] hover:underline"
              >
                Try again
              </button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF5FC] text-[#67A9D7]">
                <Inbox size={30} />
              </div>

              <h3 className="mt-5 font-semibold text-[#24364B]">
                No notifications yet
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                When someone interacts with your posts or your
                attendance is updated, notifications will appear here.
              </p>
            </div>
          ) : (
            <div>
              {notifications.map((notification) => {
                const data = notification.data || {};
                const style = getNotificationStyle(data.type);
                const Icon = style.icon;
                const isUnread = !notification.read_at;

                return (
                  <div
                    key={notification.id}
                    className={`group flex items-start gap-3 border-b border-slate-50 px-4 py-5 transition hover:bg-[#F7FAFD] sm:gap-4 sm:px-6 ${
                      isUnread ? "bg-[#F4FAFE]" : "bg-white"
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${style.color}`}
                    >
                      <Icon size={20} />
                    </div>

                    {/* Notification information */}
                    <button
                      onClick={() =>
                        handleNotificationClick(notification)
                      }
                      className="min-w-0 flex-1 text-left"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <h3
                          className={`text-sm ${
                            isUnread
                              ? "font-bold text-[#24364B]"
                              : "font-semibold text-slate-600"
                          }`}
                        >
                          {data.title || "Notification"}
                        </h3>

                        {isUnread && (
                          <span className="h-2 w-2 rounded-full bg-[#438FC4]" />
                        )}
                      </div>

                      <p className="mt-1 text-sm leading-relaxed text-slate-500">
                        {data.message || "You have a new notification."}
                      </p>

                      <p className="mt-2 text-xs text-slate-400">
                        {formatDate(notification.created_at)}
                      </p>
                    </button>

                    {/* Actions */}
                    <div className="flex shrink-0 items-center gap-1">
                      {isUnread && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          title="Mark as read"
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-[#DDF0FC] hover:text-[#438FC4]"
                        >
                          <Check size={17} />
                        </button>
                      )}

                      <button
                        onClick={() =>
                          deleteNotification(notification.id)
                        }
                        title="Delete notification"
                        className="rounded-lg p-2 text-slate-300 transition hover:bg-rose-50 hover:text-rose-500"
                      >
                        <Trash2 size={17} />
                      </button>

                      <ChevronRight
                        size={17}
                        className="hidden text-slate-300 sm:block"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer */}
          {!loading && !error && notifications.length > 0 && (
            <div className="bg-slate-50 px-5 py-4 text-center">
              <p className="text-xs text-slate-400">
                Showing your latest notifications
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
