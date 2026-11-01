
import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  HeartHandshake,
  LayoutDashboard,
  CalendarDays,
  ClipboardCheck,
  Users,
  UserCheck,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
  ShieldCheck,
} from "lucide-react";

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

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Frontend demonstration only
    navigate("/login");
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
                Kinddora.
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

                    {isActive && (
                      <ChevronRight size={17} />
                    )}
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
            <button
              className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-sky-50 hover:text-sky-700"
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell size={21} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-400 ring-2 ring-white" />
            </button>

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
