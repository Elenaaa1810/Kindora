
import React, { useState, useEffect, useRef } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
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
  UserPlus,
  CalendarPlus,
  Clock,
  RefreshCw,
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
    hour: "numeric",
    minute: "2-digit",
  });
};

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationsViewed, setNotificationsViewed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [notificationError, setNotificationError] = useState("");

  const notificationRef = useRef(null);
  const navigate = useNavigate();

  // Fetch notifications from Laravel
  const fetchNotifications = async () => {
    setNotificationLoading(true);
    setNotificationError("");

    try {
      const headers = getAdminHeaders();

      const [memberResponse, registrationResponse] = await Promise.all([
        fetch(`${API_URL}/admin/members`, {
          method: "GET",
          headers,
        }),

        fetch(`${API_URL}/admin/campaign-registrations`, {
          method: "GET",
          headers,
        }),
      ]);

      const memberData = await memberResponse.json();

      if (!memberResponse.ok) {
        throw new Error(
          memberData.message || "Unable to load member registrations."
        );
      }

      const registrationData = await registrationResponse.json();

      if (!registrationResponse.ok) {
        throw new Error(
          registrationData.message ||
            "Unable to load campaign registrations."
        );
      }

      const members = getArrayData(memberData, "members");
      const registrations = getArrayData(
        registrationData,
        "registrations"
      );

      // Member registration notifications
      const memberNotifications = members.map((member) => ({
        id: `member-${member.id}`,
        type: "member",
        title: "New Member Registration",
        description: `${member.full_name || "A member"} registered for Kindora.`,
        date: member.created_at,
        icon: UserPlus,
        link: "/admin/approvals",
      }));

      // Campaign registration notifications
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
        icon: CalendarPlus,
        link: "/admin/attendance",
      }));

      // Combine and sort newest first
      const combinedNotifications = [
        ...memberNotifications,
        ...campaignNotifications,
      ]
        .filter((item) => item.date)
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        .slice(0, 10);

      setNotifications(combinedNotifications);
    } catch (error) {
      console.error("Notification error:", error);
      setNotificationError(error.message);
    } finally {
      setNotificationLoading(false);
    }
  };

  // Load notifications and refresh every 30 seconds
  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Admin logout
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
      window.location.href = "/admin/login";
    }
  };

  // Click notification
  const handleNotificationClick = (notification) => {
    setNotificationOpen(false);
    navigate(notification.link);
  };

  // Click notification bell
  const handleBellClick = () => {
    const willOpen = !notificationOpen;

    setNotificationOpen(willOpen);

    if (willOpen) {
      // Hide notification number when bell is clicked
      setNotificationsViewed(true);
      fetchNotifications();
    }
  };

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
            KindConnect © 2026
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
            {/* Notification bell and dropdown */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={handleBellClick}
                className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-sky-50 hover:text-sky-700"
                aria-label="Notifications"
                title="Notifications"
              >
                <Bell size={21} />

                {/* Hide number after bell is clicked */}
                {notifications.length > 0 && !notificationsViewed && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                    {notifications.length > 9 ? "9+" : notifications.length}
                  </span>
                )}
              </button>

              {/* Notification dropdown */}
              {notificationOpen && (
                <div className="absolute right-0 top-14 z-50 w-[340px] overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl sm:w-[390px]">
                  {/* Dropdown header */}
                  <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                    <div>
                      <h3 className="font-bold text-slate-800">
                        Notifications
                      </h3>
                      <p className="mt-1 text-xs text-slate-400">
                        Recent registrations
                      </p>
                    </div>

                    <button
                      onClick={fetchNotifications}
                      disabled={notificationLoading}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-sky-50 hover:text-sky-600"
                      title="Refresh notifications"
                    >
                      <RefreshCw
                        size={16}
                        className={
                          notificationLoading ? "animate-spin" : ""
                        }
                      />
                    </button>
                  </div>

                  {/* Notification list */}
                  <div className="max-h-[400px] overflow-y-auto">
                    {notificationLoading && notifications.length === 0 ? (
                      <div className="py-10 text-center">
                        <RefreshCw
                          size={22}
                          className="mx-auto animate-spin text-sky-500"
                        />
                        <p className="mt-3 text-sm text-slate-400">
                          Loading notifications...
                        </p>
                      </div>
                    ) : notificationError ? (
                      <div className="px-5 py-8 text-center">
                        <p className="text-sm text-rose-500">
                          {notificationError}
                        </p>

                        <button
                          onClick={fetchNotifications}
                          className="mt-3 text-sm font-semibold text-sky-600 hover:underline"
                        >
                          Try again
                        </button>
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="px-5 py-10 text-center">
                        <Bell
                          size={28}
                          className="mx-auto text-slate-300"
                        />

                        <p className="mt-3 text-sm font-semibold text-slate-600">
                          No notifications yet
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          New registrations will appear here.
                        </p>
                      </div>
                    ) : (
                      notifications.map((notification) => {
                        const Icon = notification.icon;

                        return (
                          <button
                            key={notification.id}
                            onClick={() =>
                              handleNotificationClick(notification)
                            }
                            className="flex w-full items-start gap-3 border-b border-slate-50 px-5 py-4 text-left transition hover:bg-sky-50"
                          >
                            <div
                              className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                                notification.type === "member"
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-purple-100 text-purple-600"
                              }`}
                            >
                              <Icon size={19} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-slate-800">
                                {notification.title}
                              </p>

                              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                                {notification.description}
                              </p>

                              <p className="mt-2 flex items-center gap-1 text-[11px] text-slate-400">
                                <Clock size={12} />
                                {formatNotificationDate(notification.date)}
                              </p>
                            </div>

                            <ChevronRight
                              size={16}
                              className="mt-2 shrink-0 text-slate-300"
                            />
                          </button>
                        );
                      })
                    )}
                  </div>

                  <div className="border-t border-slate-100 bg-slate-50 px-5 py-3">
                    <p className="text-center text-xs text-slate-400">
                      Showing the 10 most recent registrations
                    </p>
                  </div>
                </div>
              )}
            </div>

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

        {/* Child pages appear here */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
