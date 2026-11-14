
import { useNavigate, Link } from "react-router-dom";
import Header from "./header";
import { useState, useEffect } from "react";

import {
  User,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Award,
  Users,
  Settings,
  Pencil,
  CheckCircle,
  Clock3,
  LogOut,
  X,
} from "lucide-react";

function UserProfile() {
  const API_URL = "http://127.0.0.1:8000/api";
  const STORAGE_URL = "http://127.0.0.1:8000/storage/";

  const navigate = useNavigate();

  // PROFILE
  const [isEditing, setIsEditing] = useState(false);

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    joined: "",
    bio: "",
    status: "",
  });

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

  // CAMPAIGNS
  const [joinedCampaigns, setJoinedCampaigns] = useState([]);
  const [completedCampaigns, setCompletedCampaigns] = useState([]);
  const [campaignLoading, setCampaignLoading] = useState(true);
  const [campaignError, setCampaignError] = useState("");

  const [joinedVisibleCount, setJoinedVisibleCount] = useState(5);
  const [completedVisibleCount, setCompletedVisibleCount] = useState(5);

  // AUTHENTICATION
  const getToken = () => {
    return (
      localStorage.getItem("memberToken") ||
      sessionStorage.getItem("memberToken")
    );
  };

  // FETCH PROFILE
  const fetchProfile = async () => {
    try {
      const token = getToken();

      if (!token) {
        setError("Please log in to view your profile.");
        return;
      }

      const response = await fetch(`${API_URL}/member/profile`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to retrieve profile.");
      }

      const member = data.member;

      const profileData = {
        name: member.full_name || "",
        email: member.email || "",
        phone: member.phone || "",
        location: member.location || "",
        joined: member.created_at
          ? new Date(member.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
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

  // FETCH CAMPAIGNS
  const fetchMyCampaigns = async () => {
    try {
      const token = getToken();

      if (!token) {
        setCampaignError("Please log in to view your campaigns.");
        return;
      }

      const response = await fetch(`${API_URL}/my-campaigns`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load your campaigns.");
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

  // EDIT PROFILE
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // SAVE PROFILE
  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = getToken();

      if (!token) {
        throw new Error("Please log in again.");
      }

      const response = await fetch(`${API_URL}/member/profile`, {
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
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          throw new Error(
            Object.values(data.errors).flat().join("\n")
          );
        }

        throw new Error(data.message || "Failed to update profile.");
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
      setSuccess("Your profile has been updated successfully!");
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

  const completedCount = completedCampaigns.length;
  const achievement = getBadge(completedCount);

  // VOLUNTEER STATISTICS
  const stats = [
    {
      label: "Campaigns Joined",
      value: joinedCampaigns.length + completedCampaigns.length,
      icon: Users,
      color: "bg-blue-50 text-[#438FC4]",
    },
    {
      label: "Campaigns Completed",
      value: completedCount,
      icon: Award,
      color: "bg-green-50 text-green-600",
    },
  ];

  // FORMAT DATE
  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return date;

    return parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // CAMPAIGN IMAGE
  const getCampaignImage = (campaign) => {
    const image =
      campaign.image_path ||
      campaign.image_url ||
      campaign.image ||
      campaign.photo ||
      campaign.banner_image;

    if (!image) return null;

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    if (image.startsWith("/storage/")) {
      return `http://127.0.0.1:8000${image}`;
    }

    return `${STORAGE_URL}${image.replace(/^\/+/, "")}`;
  };

  // CAMPAIGN CARD
  const CampaignCard = ({ campaign, completed = false }) => {
    const imageUrl = getCampaignImage(campaign);

    return (
      <article className="flex flex-col gap-4 rounded-2xl border border-[#E4EFF7] bg-white p-4 transition hover:shadow-md sm:flex-row sm:items-center">
        <div className="h-32 w-full shrink-0 overflow-hidden rounded-xl bg-[#EAF5FC] sm:h-24 sm:w-32">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={campaign.title || "Campaign"}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[#438FC4]">
              {completed ? <Award size={35} /> : <Users size={35} />}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
              completed
                ? "bg-green-50 text-green-700"
                : "bg-blue-50 text-blue-700"
            }`}
          >
            {campaign.category || "Volunteer Campaign"}
          </span>

          <h3 className="mt-2 font-bold text-[#24364B]">
            {campaign.title || "Untitled Campaign"}
          </h3>

          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <CalendarDays size={14} />
              {formatDate(campaign.date)}
            </span>

            <span className="flex items-center gap-1.5">
              <MapPin size={14} />
              {campaign.location || "Location unavailable"}
            </span>
          </div>

          {!completed && (
            <p className="mt-2 text-xs text-slate-400">
              Registration: {campaign.registration_status || "Registered"}
            </p>
          )}
        </div>

        <div className="shrink-0">
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold ${
              completed
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {completed && <CheckCircle size={14} />}
            {completed ? "Completed" : "Registered"}
          </span>
        </div>
      </article>
    );
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F7FAFD]">
        <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">

          {/* PAGE HEADING */}
          <div className="mb-8">
            <p className="text-sm font-bold tracking-wider text-[#69ACD9]">
              MY ACCOUNT
            </p>

            <h1 className="mt-2 text-3xl font-extrabold text-[#24364B] sm:text-4xl">
              My Profile
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Your volunteer journey and personal information.
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
            <div className="mb-6 whitespace-pre-line rounded-xl bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* SUCCESS MESSAGE */}
          {success && (
            <div className="mb-6 rounded-xl bg-green-50 p-4 text-sm text-green-700">
              {success}
            </div>
          )}

          {!loading && !error && (
            <>
              {/* PROFILE OVERVIEW */}
              <section className="overflow-hidden rounded-3xl border border-[#E4EFF7] bg-white shadow-sm">
                <div className="h-32 bg-gradient-to-r from-[#B8DDF5] via-[#DDF0FC] to-[#EAF5FC]" />

                <div className="px-6 pb-7 sm:px-8">
                  <div className="-mt-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div className="flex items-end gap-4">
                      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-white bg-[#DDF0FC] text-[#438FC4] shadow-md">
                        <User size={48} />
                      </div>

                      <div className="pb-2">
                        <h2 className="text-xl font-extrabold text-[#24364B] sm:text-2xl">
                          {user.name}
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                          Kindora Volunteer Member
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold ${
                          user.status?.toLowerCase() === "active"
                            ? "bg-green-100 text-green-700"
                            : user.status?.toLowerCase() === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.status?.toLowerCase() === "active" ? (
                          <CheckCircle size={15} />
                        ) : (
                          <Clock3 size={15} />
                        )}

                        {user.status || "Unknown"} Member
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          setError("");
                          setSuccess("");
                          setEditForm(user);
                          setIsEditing(true);
                        }}
                        className="flex items-center gap-2 rounded-xl bg-[#438FC4] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#397EAD]"
                      >
                        <Pencil size={15} />
                        Edit Profile
                      </button>
                    </div>
                  </div>

                  <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-500">
                    {user.bio || "No motivation information provided."}
                  </p>

                  <div className="mt-6 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="flex min-w-0 items-center gap-3 text-sm text-slate-600">
                      <Mail size={17} className="shrink-0 text-[#69ACD9]" />
                      <span className="break-all">{user.email}</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Phone size={17} className="shrink-0 text-[#69ACD9]" />
                      {user.phone || "Not provided"}
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <MapPin size={17} className="shrink-0 text-[#69ACD9]" />
                      {user.location || "Not provided"}
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <CalendarDays size={17} className="shrink-0 text-[#69ACD9]" />
                      Joined {user.joined || "Unknown"}
                    </div>
                  </div>
                </div>
              </section>

              {/* EDIT PROFILE MODAL */}
              {isEditing && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4">
                  <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-xl sm:p-8">
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-extrabold text-[#24364B]">
                          Edit Profile
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                          Update your personal information.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setEditForm(user);
                        }}
                        disabled={saving}
                        className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
                      >
                        <X size={22} />
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
                          <label className="mb-2 block text-sm font-semibold text-[#24364B]">
                            {label}
                          </label>

                          <input
                            type={field === "email" ? "email" : "text"}
                            name={field}
                            value={editForm[field]}
                            onChange={handleInputChange}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#69ACD9] focus:ring-2 focus:ring-[#DDF0FC]"
                          />
                        </div>
                      ))}

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#24364B]">
                          About Me
                        </label>

                        <textarea
                          name="bio"
                          value={editForm.bio}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#69ACD9] focus:ring-2 focus:ring-[#DDF0FC]"
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
                        className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 rounded-xl bg-[#438FC4] py-3 text-sm font-bold text-white hover:bg-[#397EAD] disabled:opacity-50"
                      >
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* VOLUNTEER STATISTICS */}
              <section className="mt-8">
                <div className="mb-5">
                  <h2 className="text-xl font-extrabold text-[#24364B] sm:text-2xl">
                    My Volunteer Impact
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    A quick overview of your activities in Kindora.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                      <div
                        key={stat.label}
                        className="rounded-2xl border border-[#E4EFF7] bg-white p-5 shadow-sm"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm text-slate-500">
                              {stat.label}
                            </p>

                            <p className="mt-2 text-3xl font-extrabold text-[#24364B]">
                              {stat.value}
                            </p>

                            {stat.label === "Campaigns Completed" && (
                              <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${achievement.color}`}>
                                {achievement.name}
                              </span>
                            )}
                          </div>

                          <div className={`rounded-2xl p-3 ${stat.color}`}>
                            <Icon size={24} />
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
                    <h2 className="text-xl font-extrabold text-[#24364B] sm:text-2xl">
                      My Campaigns
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      Track your registered and completed volunteer activities.
                    </p>
                  </div>

                  <Link
                    to="/campaigns"
                    className="text-sm font-bold text-[#438FC4] hover:text-[#397EAD]"
                  >
                    Explore Campaigns →
                  </Link>
                </div>

                {campaignLoading ? (
                  <div className="py-8 text-center text-sm text-slate-500">
                    Loading your campaigns...
                  </div>
                ) : campaignError ? (
                  <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
                    {campaignError}
                  </div>
                ) : (
                  <>
                    {/* JOINED CAMPAIGNS */}
                    <div className="mb-10">
                      <div className="mb-5 flex items-center gap-2">
                        <Users className="text-[#438FC4]" size={22} />

                        <h3 className="text-lg font-bold text-[#24364B]">
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
                        <>
                          <div className="space-y-3">
                            {joinedCampaigns
                              .slice(0, joinedVisibleCount)
                              .map((campaign) => (
                                <CampaignCard
                                  key={campaign.registration_id}
                                  campaign={campaign}
                                />
                              ))}
                          </div>

                          {joinedCampaigns.length > 5 && (
                            <div className="mt-5 flex justify-center">
                              {joinedVisibleCount < joinedCampaigns.length ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setJoinedVisibleCount((prev) =>
                                      Math.min(prev + 5, joinedCampaigns.length)
                                    )
                                  }
                                  className="rounded-xl border border-[#8EC5E9] bg-white px-6 py-2.5 text-sm font-bold text-[#438FC4] hover:bg-[#EAF5FC]"
                                >
                                  Show More (
                                  {Math.min(
                                    5,
                                    joinedCampaigns.length - joinedVisibleCount
                                  )}{" "}
                                  more)
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setJoinedVisibleCount(5)}
                                  className="rounded-xl border border-[#8EC5E9] bg-white px-6 py-2.5 text-sm font-bold text-[#438FC4] hover:bg-[#EAF5FC]"
                                >
                                  Show Less
                                </button>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* COMPLETED CAMPAIGNS */}
                    <div>
                      <div className="mb-5 flex items-center gap-2">
                        <CheckCircle className="text-green-600" size={22} />

                        <h3 className="text-lg font-bold text-[#24364B]">
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
                        <>
                          <div className="space-y-3">
                            {completedCampaigns
                              .slice(0, completedVisibleCount)
                              .map((campaign) => (
                                <CampaignCard
                                  key={campaign.registration_id}
                                  campaign={campaign}
                                  completed={true}
                                />
                              ))}
                          </div>

                          {completedCampaigns.length > 5 && (
                            <div className="mt-5 flex justify-center">
                              {completedVisibleCount < completedCampaigns.length ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setCompletedVisibleCount((prev) =>
                                      Math.min(prev + 5, completedCampaigns.length)
                                    )
                                  }
                                  className="rounded-xl border border-green-200 bg-white px-6 py-2.5 text-sm font-bold text-green-700 hover:bg-green-50"
                                >
                                  Show More (
                                  {Math.min(
                                    5,
                                    completedCampaigns.length - completedVisibleCount
                                  )}{" "}
                                  more)
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setCompletedVisibleCount(5)}
                                  className="rounded-xl border border-green-200 bg-white px-6 py-2.5 text-sm font-bold text-green-700 hover:bg-green-50"
                                >
                                  Show Less
                                </button>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </>
                )}
              </section>

              {/* ACCOUNT SETTINGS */}
              <section className="mt-12 rounded-2xl border border-[#E4EFF7] bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-[#EAF5FC] p-3 text-[#438FC4]">
                    <Settings size={22} />
                  </div>

                  <div>
                    <h2 className="font-extrabold text-[#24364B]">
                      Account Settings
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Manage your account and sign out.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col justify-between gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-sm font-semibold text-[#24364B]">
                      Account Management
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Sign out of your Kindora member account.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-fit items-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 bg-white px-5 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="font-extrabold text-[#24364B]">
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
