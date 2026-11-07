
import { useNavigate, Link } from "react-router-dom";
import Header from "./header";
import { useState, useEffect } from "react";

import {
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
  X,
  TreePine,
  HandHeart,
  BookOpen,
} from "lucide-react";

function UserProfile() {
  const API_URL = "http://127.0.0.1:8000/api";

  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);

  // PROFILE DATA
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    joined: "",
    bio: "",
    status: "",
  });

  // EDIT PROFILE FORM
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    joined: "",
    bio: "",
    status: "",
  });

  // LOADING AND MESSAGES
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // CAMPAIGN DATA
  const [joinedCampaigns, setJoinedCampaigns] = useState([]);
  const [completedCampaigns, setCompletedCampaigns] = useState([]);
  const [campaignLoading, setCampaignLoading] = useState(true);
  const [campaignError, setCampaignError] = useState("");

  // GET AUTHENTICATION TOKEN
  const getToken = () => {
    return (
      localStorage.getItem("memberToken") ||
      sessionStorage.getItem("memberToken")
    );
  };

  // FETCH MEMBER PROFILE
  const fetchProfile = async () => {
    try {
      const token = getToken();

      if (!token) {
        setError("Please log in to view your profile.");
        return;
      }

      const response = await fetch(
        `${API_URL}/member/profile`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to retrieve profile."
        );
      }

      const member = data.member;

      const profileData = {
        name: member.full_name || "",
        email: member.email || "",
        phone: member.phone || "",
        location: member.location || "",

        joined: member.created_at
          ? new Date(member.created_at).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )
          : "",

        bio: member.motivation || "",
        status: member.status || "",
      };

      setUser(profileData);
      setEditForm(profileData);

    } catch (err) {
      setError(err.message);

    } finally {
      setLoading(false);
    }
  };

  // FETCH MEMBER JOINED AND COMPLETED CAMPAIGNS
  const fetchMyCampaigns = async () => {
    try {
      const token = getToken();

      if (!token) {
        setCampaignError("Please log in to view your campaigns.");
        return;
      }

      const response = await fetch(
        `${API_URL}/my-campaigns`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load your campaigns."
        );
      }

      setJoinedCampaigns(data.joined || []);
      setCompletedCampaigns(data.completed || []);

    } catch (err) {
      setCampaignError(err.message);
      console.error("Campaign loading error:", err);

    } finally {
      setCampaignLoading(false);
    }
  };

  // LOAD PROFILE AND CAMPAIGNS
  useEffect(() => {
    fetchProfile();
    fetchMyCampaigns();
  }, []);

  // HANDLE EDIT FORM INPUTS
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // SAVE PROFILE TO DATABASE
  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = getToken();

      if (!token) {
        throw new Error("Please log in again.");
      }

      const response = await fetch(
        `${API_URL}/member/profile`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            full_name: editForm.name,
            email: editForm.email,
            phone: editForm.phone,
            location: editForm.location,
            motivation: editForm.bio,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const validationMessage = Object.values(
            data.errors
          )
            .flat()
            .join("\n");

          throw new Error(validationMessage);
        }

        throw new Error(
          data.message || "Failed to update profile."
        );
      }

      const updatedMember = data.member;

      const updatedProfile = {
        ...user,
        name: updatedMember.full_name || "",
        email: updatedMember.email || "",
        phone: updatedMember.phone || "",
        location: updatedMember.location || "",
        bio: updatedMember.motivation || "",
      };

      setUser(updatedProfile);
      setEditForm(updatedProfile);

      setIsEditing(false);

      setSuccess(
        "Your profile has been updated successfully!"
      );

    } catch (err) {
      setError(err.message);

    } finally {
      setSaving(false);
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("memberToken");
    localStorage.removeItem("member");

    sessionStorage.removeItem("memberToken");
    sessionStorage.removeItem("member");

    navigate("/", { replace: true });
  };

  // MEMBERSHIP STATUS
  const membershipStatus = user.status;

  // ACHIEVEMENT BADGE
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

  // COMPLETED CAMPAIGNS COUNT FROM DATABASE
  const completedCount = completedCampaigns.length;

  const achievement = getBadge(completedCount);

  // VOLUNTEER STATISTICS
  const stats = [
    {
      label: "Campaigns Joined",
      value: joinedCampaigns.length + completedCampaigns.length,
      icon: Users,
    },
    {
      label: "Completed Activities",
      value: completedCount,
      icon: Award,
    },
  ];

  // FORMAT CAMPAIGN DATE
  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // CAMPAIGN CARD
  const CampaignCard = ({ campaign, completed = false }) => (
    <article className="flex flex-col justify-between gap-4 rounded-2xl border border-[#E4EFF7] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-6">

      <div className="flex items-start gap-4">

        <div
          className={`rounded-xl p-4 ${
            completed
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {completed ? (
            <Award size={25} />
          ) : (
            <Users size={25} />
          )}
        </div>

        <div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              completed
                ? "bg-green-50 text-green-700"
                : "bg-blue-50 text-blue-700"
            }`}
          >
            {campaign.category}
          </span>

          <h3 className="mt-3 font-bold sm:text-lg">
            {campaign.title}
          </h3>

          <div className="mt-2 flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:gap-5">

            <span className="flex items-center gap-2">
              <CalendarDays size={15} />
              {formatDate(campaign.date)}
            </span>

            <span className="flex items-center gap-2">
              <MapPin size={15} />
              {campaign.location}
            </span>

          </div>

          {!completed && (
            <p className="mt-2 text-xs text-slate-400">
              Registration: {campaign.registration_status}
            </p>
          )}

        </div>

      </div>

      <span
        className={`w-fit shrink-0 rounded-full px-4 py-2 text-sm font-bold ${
          completed
            ? "bg-green-100 text-green-700"
            : "bg-blue-100 text-blue-700"
        }`}
      >
        {completed ? (
          <span className="flex items-center gap-2">
            <CheckCircle size={15} />
            Completed
          </span>
        ) : (
          "Registered"
        )}
      </span>

    </article>
  );

  return (
    <>
      <Header />

      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">

        {/* PAGE HEADING */}
        <div className="mb-8">

          <p className="font-bold text-[#69ACD9]">
            MY ACCOUNT
          </p>

          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your personal information and track your volunteer journey.
          </p>

        </div>

        {/* PROFILE LOADING */}
        {loading && (
          <div className="py-10 text-center text-slate-500">
            Loading your profile...
          </div>
        )}

        {/* PROFILE ERROR */}
        {error && (
          <div className="mb-6 whitespace-pre-line rounded-xl bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {/* PROFILE SUCCESS */}
        {success && (
          <div className="mb-6 rounded-xl bg-green-50 p-4 text-green-700">
            {success}
          </div>
        )}

        {!loading && !error && (
          <>

            {/* PROFILE CARD */}
            <section className="overflow-hidden rounded-3xl border border-[#E4EFF7] bg-white shadow-sm">

              <div className="h-36 bg-gradient-to-r from-[#B8DDF5] via-[#DDF0FC] to-[#EAF5FC]" />

              <div className="px-6 pb-7 sm:px-8">

                <div className="-mt-14 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

                  <div className="relative">

                    <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-[#DDF0FC] text-[#438FC4] shadow-md">
                      <User size={55} />
                    </div>

                    <button
                      type="button"
                      className="absolute bottom-1 right-1 rounded-full bg-[#438FC4] p-2 text-white shadow-md hover:bg-[#397EAD]"
                      aria-label="Change profile picture"
                      title="Change profile picture (demo)"
                    >
                      <Camera size={16} />
                    </button>

                  </div>

                  <div className="flex flex-wrap items-center gap-3">

                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${
                        membershipStatus?.toLowerCase() === "active"
                          ? "bg-green-100 text-green-700"
                          : membershipStatus?.toLowerCase() === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >

                      {membershipStatus?.toLowerCase() === "active" ? (
                        <CheckCircle size={16} />
                      ) : (
                        <Clock3 size={16} />
                      )}

                      {membershipStatus} Member

                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        setError("");
                        setSuccess("");
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

                  <h2 className="text-2xl font-extrabold">
                    {user.name}
                  </h2>

                  <p className="mt-2 max-w-2xl leading-7 text-slate-500">
                    {user.bio || "No motivation information provided."}
                  </p>

                </div>

                <div className="mt-6 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2 lg:grid-cols-3">

                  <p className="flex items-center gap-3 text-sm text-slate-600">
                    <Mail size={18} className="text-[#69ACD9]" />
                    {user.email}
                  </p>

                  <p className="flex items-center gap-3 text-sm text-slate-600">
                    <Phone size={18} className="text-[#69ACD9]" />
                    {user.phone || "Not provided"}
                  </p>

                  <p className="flex items-center gap-3 text-sm text-slate-600">
                    <MapPin size={18} className="text-[#69ACD9]" />
                    {user.location || "Not provided"}
                  </p>

                  <p className="flex items-center gap-3 text-sm text-slate-600">
                    <CalendarDays size={18} className="text-[#69ACD9]" />
                    Joined {user.joined}
                  </p>

                </div>

              </div>
            </section>

            {/* EDIT PROFILE MODAL */}
            {isEditing && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4">

                <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl sm:p-8">

                  <div className="mb-6 flex items-center justify-between">

                    <h2 className="text-2xl font-extrabold">
                      Edit Profile
                    </h2>

                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setEditForm(user);
                      }}
                      disabled={saving}
                    >
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
                          type={field === "email" ? "email" : "text"}
                          name={field}
                          value={editForm[field]}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#69ACD9]"
                        />

                      </div>

                    ))}

                    <div>

                      <label className="mb-2 block text-sm font-semibold">
                        About Me
                      </label>

                      <textarea
                        name="bio"
                        value={editForm.bio}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#69ACD9]"
                      />

                    </div>

                  </div>

                  <div className="mt-6 flex gap-3">

                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setEditForm(user);
                      }}
                      disabled={saving}
                      className="flex-1 rounded-xl border border-slate-200 py-3 font-semibold hover:bg-slate-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 rounded-xl bg-[#438FC4] py-3 font-bold text-white hover:bg-[#397EAD] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>

                  </div>

                </div>
              </div>
            )}

            {/* VOLUNTEER STATISTICS */}
            <section className="mt-8">

              <h2 className="mb-5 text-2xl font-extrabold">
                My Volunteer Impact
              </h2>

              <div className="grid gap-5 sm:grid-cols-2">

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

            {/* MY CAMPAIGNS */}
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

              {campaignLoading ? (

                <div className="py-8 text-center text-slate-500">
                  Loading your campaigns...
                </div>

              ) : campaignError ? (

                <div className="rounded-xl bg-red-50 p-4 text-red-600">
                  {campaignError}
                </div>

              ) : (

                <>

                  {/* JOINED CAMPAIGNS */}
                  <div className="mb-10">

                    <div className="mb-5 flex items-center gap-2">

                      <Users className="text-[#438FC4]" size={22} />

                      <h3 className="text-xl font-bold">
                        Joined Campaigns
                      </h3>

                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                        {joinedCampaigns.length}
                      </span>

                    </div>

                    {joinedCampaigns.length === 0 ? (

                      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">

                        <Users className="mx-auto mb-3 text-slate-300" size={35} />

                        <p className="font-semibold text-slate-600">
                          No joined campaigns yet.
                        </p>

                        <p className="mt-2 text-sm text-slate-400">
                          Explore campaigns and start volunteering!
                        </p>

                      </div>

                    ) : (

                      <div className="space-y-4">

                        {joinedCampaigns.map((campaign) => (
                          <CampaignCard
                            key={campaign.registration_id}
                            campaign={campaign}
                          />
                        ))}

                      </div>

                    )}

                  </div>

                  {/* COMPLETED CAMPAIGNS */}
                  <div>

                    <div className="mb-5 flex items-center gap-2">

                      <CheckCircle className="text-green-600" size={22} />

                      <h3 className="text-xl font-bold">
                        Completed Campaigns
                      </h3>

                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                        {completedCampaigns.length}
                      </span>

                    </div>

                    {completedCampaigns.length === 0 ? (

                      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">

                        <Award className="mx-auto mb-3 text-slate-300" size={35} />

                        <p className="font-semibold text-slate-600">
                          No completed campaigns yet.
                        </p>

                        <p className="mt-2 text-sm text-slate-400">
                          Your completed activities will appear here after attendance is verified.
                        </p>

                      </div>

                    ) : (

                      <div className="space-y-4">

                        {completedCampaigns.map((campaign) => (
                          <CampaignCard
                            key={campaign.registration_id}
                            campaign={campaign}
                            completed={true}
                          />
                        ))}

                      </div>

                    )}

                  </div>

                </>
              )}

            </section>

          </>
        )}

        {/* ACCOUNT SETTINGS */}
        <section className="mt-12 rounded-2xl border border-[#E4EFF7] bg-white p-6 sm:p-8">

          <div className="flex items-center gap-3">

            <Settings className="text-[#438FC4]" size={24} />

            <h2 className="text-xl font-extrabold">
              Account Settings
            </h2>

          </div>

          <div className="mt-6 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">

            <div>

              <p className="font-semibold">
                Account Management
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Manage your account and sign out when needed.
              </p>

            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-fit shrink-0 items-center gap-2 rounded-xl border border-red-200 px-4 py-3 font-semibold text-red-600 transition hover:bg-red-50"
            >
              <LogOut size={20} />
              Logout
            </button>

          </div>

        </section>

      </main>

      {/* FOOTER */}
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
