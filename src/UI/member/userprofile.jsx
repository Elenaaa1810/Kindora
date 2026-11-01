import Header from "./header";
import { useState } from "react";
import {
  HeartHandshake,
  User,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Clock,
  Award,
  Users,
  Settings,
  Camera,
  Pencil,
  CheckCircle,
  Clock3,
  LogOut,
  Menu,
  X,
  TreePine,
  HandHeart,
  BookOpen,
} from "lucide-react";
import { Link } from "react-router-dom";

function UserProfile() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [user, setUser] = useState({
    name: "Emily Johnson",
    email: "emily.johnson@email.com",
    phone: "+95 9 123 456 789",
    location: "Yangon, Myanmar",
    joined: "September 15, 2026",
    bio: "I love helping my community and participating in activities that make a positive difference.",
  });

  const [editForm, setEditForm] = useState(user);

  const membershipStatus = "Approved";

  // Completed activities count
  const completedCampaigns = 10;

  // Achievement badge based on completed activities
  const getBadge = (count) => {
    if (count >= 100) {
      return {
        name: "Gold Badge",
        color: "bg-yellow-100 text-yellow-700",
      };
    }

    if (count >= 50) {
      return {
        name: "Silver Badge",
        color: "bg-slate-200 text-slate-700",
      };
    }

    if (count >= 10) {
      return {
        name: "Bronze Badge",
        color: "bg-orange-100 text-orange-700",
      };
    }

    return {
      name: "No Badge Yet",
      color: "bg-blue-100 text-blue-700",
    };
  };

  const achievement = getBadge(completedCampaigns);

  const campaigns = [
    {
      title: "Community Tree Planting",
      category: "Environment",
      date: "October 18, 2026",
      location: "Yangon, Myanmar",
      status: "Registered",
      icon: TreePine,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Orphanage Donation Drive",
      category: "Charity",
      date: "October 22, 2026",
      location: "Mandalay, Myanmar",
      status: "Registered",
      icon: HandHeart,
      color: "bg-pink-100 text-pink-700",
    },
    {
      title: "Community Education Support",
      category: "Education",
      date: "October 10, 2026",
      location: "Yangon, Myanmar",
      status: "Completed",
      icon: BookOpen,
      color: "bg-purple-100 text-purple-700",
    },
  ];

  const handleSave = () => {
    setUser(editForm);
    setIsEditing(false);
  };

  const stats = [
    { label: "Campaigns Joined", value: "8", icon: Users },
    { label: "Volunteer Hours", value: "32", icon: Clock },
    {
      label: "Completed Activities",
      value: completedCampaigns,
      icon: Award,
    },
  ];

  return (
     <>
    <Header />

      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">

        {/* Page Heading */}
        <div className="mb-8">
          <p className="font-bold text-[#69ACD9]">MY ACCOUNT</p>
          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
            My Profile
          </h1>
          <p className="mt-2 text-slate-500">
            Manage your personal information and track your volunteer journey.
          </p>
        </div>

        {/* Profile Card */}
        <section className="overflow-hidden rounded-3xl border border-[#E4EFF7] bg-white shadow-sm">

          <div className="h-36 bg-gradient-to-r from-[#B8DDF5] via-[#DDF0FC] to-[#EAF5FC]" />

          <div className="px-6 pb-7 sm:px-8">

            <div className="-mt-14 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

              <div className="relative">
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-[#DDF0FC] text-[#438FC4] shadow-md">
                  <User size={55} />
                </div>

                <button
                  className="absolute bottom-1 right-1 rounded-full bg-[#438FC4] p-2 text-white shadow-md hover:bg-[#397EAD]"
                  aria-label="Change profile picture"
                  title="Change profile picture (demo)"
                >
                  <Camera size={16} />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${
                  membershipStatus === "Approved"
                    ? "bg-green-100 text-green-700"
                    : membershipStatus === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  {membershipStatus === "Approved" ? (
                    <CheckCircle size={16} />
                  ) : (
                    <Clock3 size={16} />
                  )}
                  {membershipStatus} Member
                </span>

                <button
                  onClick={() => {
                    setEditForm(user);
                    setIsEditing(true);
                  }}
                  className="flex items-center gap-2 rounded-xl bg-[#8EC5E9] px-5 py-3 font-bold text-[#183B55] hover:bg-[#75B5E0]"
                >
                  <Pencil size={17} />
                  Edit Profile
                </button>
              </div>
            </div>

            <div className="mt-5">
              <h2 className="text-2xl font-extrabold">{user.name}</h2>
              <p className="mt-2 max-w-2xl leading-7 text-slate-500">
                {user.bio}
              </p>
            </div>

            <div className="mt-6 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2 lg:grid-cols-3">
              <p className="flex items-center gap-3 text-sm text-slate-600">
                <Mail size={18} className="text-[#69ACD9]" />
                {user.email}
              </p>

              <p className="flex items-center gap-3 text-sm text-slate-600">
                <Phone size={18} className="text-[#69ACD9]" />
                {user.phone}
              </p>

              <p className="flex items-center gap-3 text-sm text-slate-600">
                <MapPin size={18} className="text-[#69ACD9]" />
                {user.location}
              </p>

              <p className="flex items-center gap-3 text-sm text-slate-600">
                <CalendarDays size={18} className="text-[#69ACD9]" />
                Joined {user.joined}
              </p>
            </div>
          </div>
        </section>

        {/* Edit Profile Modal */}
        {isEditing && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4">
            <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl sm:p-8">

              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-extrabold">Edit Profile</h2>
                <button onClick={() => setIsEditing(false)}>
                  <X size={23} />
                </button>
              </div>

              <div className="space-y-4">
                {[
                  ["Full Name", "name"],
                  ["Email Address", "email"],
                  ["Phone Number", "phone"],
                  ["Location", "location"],
                ].map(([label, field]) => (
                  <div key={field}>
                    <label className="mb-2 block text-sm font-semibold">
                      {label}
                    </label>
                    <input
                      type="text"
                      value={editForm[field]}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          [field]: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#69ACD9]"
                    />
                  </div>
                ))}

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    About Me
                  </label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) =>
                      setEditForm({ ...editForm, bio: e.target.value })
                    }
                    rows="3"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#69ACD9]"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-3 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  className="flex-1 rounded-xl bg-[#438FC4] py-3 font-bold text-white hover:bg-[#397EAD]"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Volunteer Statistics */}
        <section className="mt-8">
          <h2 className="mb-5 text-2xl font-extrabold">
            My Volunteer Impact
          </h2>

          <div className="grid gap-5 sm:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-[#E4EFF7] bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">
                        {stat.label}
                      </p>

                      <p className="mt-2 text-3xl font-extrabold">
                        {stat.value}
                      </p>

                      {/* Achievement Badge inside Completed Activities */}
                      {stat.label === "Completed Activities" && (
                        <span
                          className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-bold ${achievement.color}`}
                        >
                          {achievement.name}
                        </span>
                      )}
                    </div>

                    <div className="rounded-2xl bg-[#EAF5FC] p-4 text-[#438FC4]">
                      <Icon size={25} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Registered Campaigns */}
        <section className="mt-12">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-extrabold">
                My Campaigns
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                View your registered and completed volunteer activities.
              </p>
            </div>

            <Link
              to="/campaigns"
              className="font-bold text-[#438FC4] hover:text-[#397EAD]"
            >
              Explore Campaigns →
            </Link>
          </div>

          <div className="space-y-4">
            {campaigns.map((campaign) => {
              const Icon = campaign.icon;

              return (
                <article
                  key={campaign.title}
                  className="flex flex-col justify-between gap-4 rounded-2xl border border-[#E4EFF7] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className={`rounded-xl p-4 ${campaign.color}`}>
                      <Icon size={25} />
                    </div>

                    <div>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${campaign.color}`}>
                        {campaign.category}
                      </span>

                      <h3 className="mt-3 font-bold sm:text-lg">
                        {campaign.title}
                      </h3>

                      <div className="mt-2 flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:gap-5">
                        <span className="flex items-center gap-2">
                          <CalendarDays size={15} />
                          {campaign.date}
                        </span>

                        <span className="flex items-center gap-2">
                          <MapPin size={15} />
                          {campaign.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className={`w-fit rounded-full px-4 py-2 text-sm font-bold ${
                    campaign.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    {campaign.status}
                  </span>
                </article>
              );
            })}
          </div>
        </section>

        {/* Account Settings */}
        <section className="mt-12 rounded-2xl border border-[#E4EFF7] bg-white p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <Settings className="text-[#438FC4]" size={24} />
            <h2 className="text-xl font-extrabold">Account Settings</h2>
          </div>

          <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="font-semibold">Account Management</p>
              <p className="mt-1 text-sm text-slate-500">
                Manage your account and sign out when needed.
              </p>
            </div>

            <button
              onClick={() => alert("Connect this button to your logout function.")}
              className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-3 font-bold text-red-600 transition hover:bg-red-50"
            >
              <LogOut size={18} />
              Log Out
            </button>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-100 bg-white px-5 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="font-extrabold">
            Kindora<span className="text-[#69ACD9]">.</span>
          </p>
          <p className="text-sm text-slate-400">
            © 2026 Kindora. Demo project.
          </p>
        </div>
      </footer>
    </>
  );
}

export default UserProfile;
