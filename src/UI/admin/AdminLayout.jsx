
import React, { useState, useEffect, useCallback } from "react";
import {
  Outlet,
  NavLink,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  HeartHandshake,
  LayoutDashboard,
  CalendarDays,
  ClipboardCheck,
  Users,
  UserCheck,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
  ShieldCheck,
  MessageSquare,
  UserPlus,
  CalendarPlus,
  RefreshCw,
  Clock,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000/api";

const navigation = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
    end: true,
  },
  {
    name: "Campaigns",
    path: "/admin/campaigns",
    icon: CalendarDays,
  },
  {
    name: "Attendance",
    path: "/admin/attendance",
    icon: ClipboardCheck,
  },
  {
    name: "Manage Users",
    path: "/admin/users",
    icon: Users,
  },
  {
    name: "Member Approvals",
    path: "/admin/approvals",
    icon: UserCheck,
  },
  {
    name: "Community Posts",
    path: "/admin/community-posts",
    icon: MessageSquare,
  },
  
];

const getAdminHeaders = () => {
  const token = localStorage.getItem("adminToken");

  return {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const getArrayData = (data, key) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const formatNotificationDate = (date) => {
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

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [notificationError, setNotificationError] = useState("");

  const [lastViewedAt, setLastViewedAt] = useState(() =>
    Number(localStorage.getItem("adminNotificationsLastViewed")) || 0
  );

  const navigate = useNavigate();
  const location = useLocation();

  // ========================================
  // FETCH ADMIN NOTIFICATIONS
  // ========================================

  const fetchNotifications = useCallback(async () => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      setNotifications([]);
      return;
    }

    setNotificationLoading(true);
    setNotificationError("");

    try {
      const headers = getAdminHeaders();

      const [
        memberResponse,
        registrationResponse,
        postResponse,
      ] = await Promise.all([
        fetch(`${API_URL}/admin/members`, {
          method: "GET",
          headers,
        }),

        fetch(`${API_URL}/admin/campaign-registrations`, {
          method: "GET",
          headers,
        }),

        fetch(`${API_URL}/admin/community-posts?status=all`, {
          method: "GET",
          headers,
        }),
      ]);

      const memberData = await memberResponse.json();
      const registrationData = await registrationResponse.json();
      const postData = await postResponse.json();

      if (!memberResponse.ok) {
        throw new Error(
          memberData.message || "Unable to load member registrations."
        );
      }

      if (!registrationResponse.ok) {
        throw new Error(
          registrationData.message ||
            "Unable to load campaign registrations."
        );
      }

      if (!postResponse.ok) {
        throw new Error(
          postData.message || "Unable to load community posts."
        );
      }

      const members = getArrayData(memberData, "members");
      const registrations = getArrayData(
        registrationData,
        "registrations"
      );
      const pendingPosts = getArrayData(postData, "posts");

      // Member registrations
      const memberNotifications = members.map((member) => ({
        id: `member-${member.id}`,
        type: "member",
        title: "New Member Registration",
        description: `${
          member.full_name || member.name || "A member"
        } registered for Kindora.`,
        date: member.created_at,
        link: "/admin/approvals",
      }));

      // Campaign registrations
      const campaignNotifications = registrations.map((registration) => ({
        id: `campaign-${registration.id}`,
        type: "campaign",
        title: "New Campaign Registration",
        description: `${
          registration.member?.full_name ||
          registration.member?.name ||
          "A member"
        } registered for ${
          registration.campaign?.title ||
          registration.campaign?.name ||
          "a campaign"
        }.`,
        date: registration.created_at,
        link: "/admin/attendance",
      }));

      // Pending community posts
      const postNotifications = pendingPosts.map((post) => ({
        id: `post-${post.id}`,
        type: "post",
        title: "New Post Waiting for Approval",
        description: `${
          post.member_name ||
          post.member?.full_name ||
          post.member?.name ||
          "A member"
        } submitted a new community post.`,
        date: post.created_at,
        link: "/admin/community-posts",
      }));

      // Combine and sort notifications
      const combinedNotifications = [
        ...memberNotifications,
        ...campaignNotifications,
        ...postNotifications,
      ]
        .filter((item) => item.date)
        .sort(
          (a, b) =>
            new Date(b.date).getTime() -
            new Date(a.date).getTime()
        );

      setNotifications(combinedNotifications);
    } catch (error) {
      console.error("Notification error:", error);
      setNotificationError(error.message);
    } finally {
      setNotificationLoading(false);
    }
  }, []);

  // Fetch notifications when layout loads
  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // ========================================
  // MARK NOTIFICATIONS AS VIEWED
  // ========================================

  useEffect(() => {
    if (location.pathname === "/admin/notifications") {
      const viewedTime = Date.now();

      localStorage.setItem(
        "adminNotificationsLastViewed",
        String(viewedTime)
      );

      setLastViewedAt(viewedTime);
    }
  }, [location.pathname]);

  // Check whether there are new notifications
  const hasNewNotifications = notifications.some((notification) => {
    return new Date(notification.date).getTime() > lastViewedAt;
  });

  // ========================================
  // ADMIN LOGOUT
  // ========================================

  const handleLogout = async () => {
    const token = localStorage.getItem("adminToken");

    try {
      await fetch(`${API_URL}/admin/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminInfo");
      localStorage.removeItem("adminNotificationsLastViewed");

      window.location.href = "/admin/login";
    }
  };

  // ========================================
  // MAIN LAYOUT
  // ========================================

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-100 bg-white transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
          <NavLink
            to="/admin"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
              <HeartHandshake size={25} />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-800">
                Kindora.
              </h1>

              <p className="text-xs text-slate-400">
                Volunteer Admin
              </p>
            </div>
          </NavLink>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={21} />
          </button>
        </div>

        {/* Admin profile */}
        <div className="mx-4 mt-6 flex items-center gap-3 rounded-2xl bg-sky-50 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-200 text-sm font-bold text-sky-800">
            AD
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-800">
              Administrator
            </p>

            <p className="text-xs text-slate-500">
              System Admin
            </p>
          </div>

          <ShieldCheck size={19} className="text-sky-600" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-7">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Main Menu
          </p>

          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-sky-100 text-sky-800"
                      : "text-slate-500 hover:bg-slate-50 hover:text-sky-700"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={20} />

                    <span className="flex-1">{item.name}</span>

                    {item.path === "/admin/notifications" &&
                      hasNewNotifications && (
                        <span className="h-2 w-2 rounded-full bg-red-500" />
                      )}

                    {isActive && <ChevronRight size={17} />}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom navigation */}
        <div className="border-t border-slate-100 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-rose-500 transition hover:bg-rose-50"
          >
            <LogOut size={20} />
            Logout
          </button>

          <p className="mt-3 text-center text-xs text-slate-400">
            Kindora © 2026
          </p>
        </div>
      </aside>

      {/* Main content */}
      <div className="min-h-screen lg:pl-72">

        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-100 bg-white/90 px-4 backdrop-blur-md sm:px-8">

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu size={23} />
            </button>

            <div>
              <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
                Admin Panel
              </h2>

              <p className="hidden text-xs text-slate-400 sm:block">
                Manage your volunteering community
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">

            {/* Notification bell - opens separate page */}
            <Link
              to="/admin/notifications"
              aria-label="Admin notifications"
              title="Notifications"
              className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-sky-50 hover:text-sky-700"
            >
              <Bell size={21} />

              {hasNewNotifications && (
                <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
              )}
            </Link>

            <div className="hidden h-8 w-px bg-slate-200 sm:block" />

            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-700">
                AD
              </div>

              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-slate-700">
                  Admin
                </p>

                <p className="text-xs text-slate-400">
                  Administrator
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Child pages */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet
            context={{
              notifications,
              notificationLoading,
              notificationError,
              fetchNotifications,
              formatNotificationDate,
              lastViewedAt,
            }}
          />
        </main>
      </div>
    </div>
  );
}
