
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
  ArrowRight,
  Users,
  Settings,
  Pencil,
  CheckCircle,
  Clock3,
  LogOut,
  X,
  MessageCircle,
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
  const [expandedCampaignSection, setExpandedCampaignSection] =
    useState(null);

  // AUTHENTICATION
  const getToken = () => {
    return (
      localStorage.getItem("memberToken") ||
      sessionStorage.getItem("memberToken")
    );
  };

  // COMMON API HEADERS
  const getAuthHeaders = () => ({
    Accept: "application/json",
    Authorization: `Bearer ${getToken()}`,
  });

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
        headers: getAuthHeaders(),
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

  // OPEN EDIT MODAL
  const handleEdit = () => {
    setError("");
    setSuccess("");
    setEditForm({ ...user });
    setIsEditing(true);
  };

  // CLOSE EDIT MODAL
  const handleCancelEdit = () => {
    setEditForm({ ...user });
    setIsEditing(false);
    setError("");
  };

  // SAVE PROFILE
  const handleSave = async (e) => {
    if (e) e.preventDefault();

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

      if (!updatedMember) {
        throw new Error(
          "Profile update response is missing member information. Please check your backend response."
        );
      }

      const updatedProfile = {
        ...user,
        name: updatedMember.full_name ?? editForm.name,
        email: updatedMember.email ?? editForm.email,
        phone: updatedMember.phone ?? editForm.phone,
        location: updatedMember.location ?? editForm.location,
        bio: updatedMember.motivation ?? editForm.bio,
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
      <article className="flex w-[285px] shrink-0 flex-col overflow-hidden rounded-2xl border border-[#E4EFF7] bg-white transition hover:-translate-y-1 hover:shadow-md sm:w-[320px]">
        <div className="h-40 w-full overflow-hidden bg-[#EAF5FC]">
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
              {completed ? <Award size={42} /> : <Users size={42} />}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <span
            className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${
              completed
                ? "bg-green-50 text-green-700"
                : "bg-blue-50 text-blue-700"
            }`}
          >
            {campaign.category || "Volunteer Campaign"}
          </span>

          <h3 className="mt-3 line-clamp-2 min-h-12 font-bold text-[#24364B]">
            {campaign.title || "Untitled Campaign"}
          </h3>

          <div className="mt-3 space-y-2 text-xs text-slate-500">
            <span className="flex items-center gap-2">
              <CalendarDays size={14} className="shrink-0" />
              {formatDate(campaign.date)}
            </span>

            <span className="flex items-center gap-2">
              <MapPin size={14} className="shrink-0" />
              <span className="truncate">
                {campaign.location || "Location unavailable"}
              </span>
            </span>
          </div>

          {!completed && (
            <p className="mt-3 text-xs text-slate-400">
              Registration: {campaign.registration_status || "Registered"}
            </p>
          )}

          <div className="mt-auto pt-4">
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
          {error && !isEditing && (
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
                        onClick={handleEdit}
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

              {/* MY FORUM */}
              <section className="mt-8">
                <div className="rounded-2xl border border-[#E4EFF7] bg-white p-6 shadow-sm sm:p-8">
                  <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#DDF0FC] text-[#438FC4]">
                        <MessageCircle size={24} />
                      </div>

                      <div>
                        <h2 className="text-xl font-extrabold text-[#24364B]">
                          My Forum
                        </h2>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                          View your own volunteering posts and the community
                          posts you have shared to your personal profile.
                        </p>
                      </div>
                    </div>

                    <Link
                      to="/myforum"
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#438FC4] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#397EAD]"
                    >
                      Visit My Forum
                      <ArrowRight size={17} />
                    </Link>
                  </div>
                </div>
              </section>

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
                              <span
                                className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${achievement.color}`}
                              >
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
                    {/* CAMPAIGN SUMMARY CARDS */}
                    <div className="grid gap-5 sm:grid-cols-2">
                      {/* REGISTERED CAMPAIGNS */}
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedCampaignSection(
                            expandedCampaignSection === "registered"
                              ? null
                              : "registered"
                          )
                        }
                        aria-expanded={
                          expandedCampaignSection === "registered"
                        }
                        className={`group rounded-2xl border p-6 text-left transition duration-200 ${
                          expandedCampaignSection === "registered"
                            ? "border-[#438FC4] bg-[#EAF5FC] shadow-md"
                            : "border-[#E4EFF7] bg-white hover:border-[#8EC5E9] hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#DDF0FC] text-[#438FC4]">
                            <Users size={24} />
                          </div>

                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                            {joinedCampaigns.length} Campaigns
                          </span>
                        </div>

                        <div className="mt-5 flex items-end justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-extrabold text-[#24364B]">
                              Registered Campaigns
                            </h3>

                            <p className="mt-2 text-sm text-slate-500">
                              View the campaigns you have registered for.
                            </p>
                          </div>

                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition ${
                              expandedCampaignSection === "registered"
                                ? "rotate-180 bg-[#438FC4] text-white"
                                : "bg-[#EAF5FC] text-[#438FC4]"
                            }`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m6 9 6 6 6-6" />
                            </svg>
                          </span>
                        </div>

                        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-blue-100">
                          <div className="h-full w-full rounded-full bg-[#438FC4]" />
                        </div>
                      </button>

                      {/* COMPLETED CAMPAIGNS */}
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedCampaignSection(
                            expandedCampaignSection === "completed"
                              ? null
                              : "completed"
                          )
                        }
                        aria-expanded={
                          expandedCampaignSection === "completed"
                        }
                        className={`group rounded-2xl border p-6 text-left transition duration-200 ${
                          expandedCampaignSection === "completed"
                            ? "border-green-500 bg-green-50 shadow-md"
                            : "border-[#E4EFF7] bg-white hover:border-green-300 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                            <Award size={24} />
                          </div>

                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                            {completedCampaigns.length} Campaigns
                          </span>
                        </div>

                        <div className="mt-5 flex items-end justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-extrabold text-[#24364B]">
                              Completed Campaigns
                            </h3>

                            <p className="mt-2 text-sm text-slate-500">
                              View the volunteer activities you have completed.
                            </p>
                          </div>

                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition ${
                              expandedCampaignSection === "completed"
                                ? "rotate-180 bg-green-600 text-white"
                                : "bg-green-100 text-green-600"
                            }`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m6 9 6 6 6-6" />
                            </svg>
                          </span>
                        </div>

                        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-green-100">
                          <div className="h-full w-full rounded-full bg-green-500" />
                        </div>
                      </button>
                    </div>

                    {/* REGISTERED CAMPAIGN LIST */}
                    {expandedCampaignSection === "registered" && (
                      <div className="mt-6 rounded-2xl border border-[#E4EFF7] bg-white p-5 shadow-sm sm:p-6">
                        <div className="mb-5 flex items-center justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-extrabold text-[#24364B]">
                              Registered Campaigns
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                              Your upcoming volunteer activities.
                            </p>
                          </div>

                          <span className="rounded-full bg-blue-100 px-3 py-1.5 text-xs font-bold text-blue-700">
                            {joinedCampaigns.length}
                          </span>
                        </div>

                        {joinedCampaigns.length === 0 ? (
                          <div className="rounded-xl border border-dashed border-slate-300 bg-[#F7FAFD] p-8 text-center">
                            <Users
                              className="mx-auto mb-3 text-slate-300"
                              size={35}
                            />

                            <p className="font-semibold text-slate-600">
                              No registered campaigns yet.
                            </p>

                            <p className="mt-2 text-sm text-slate-400">
                              Explore campaigns and start volunteering!
                            </p>

                            <Link
                              to="/campaigns"
                              className="mt-4 inline-flex rounded-xl bg-[#438FC4] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#397EAD]"
                            >
                              Explore Campaigns
                            </Link>
                          </div>
                        ) : (
                          <div className="flex gap-5 overflow-x-auto pb-4">
                            {joinedCampaigns.map((campaign) => (
                              <CampaignCard
                                key={campaign.registration_id || campaign.id}
                                campaign={campaign}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* COMPLETED CAMPAIGN LIST */}
                    {expandedCampaignSection === "completed" && (
                      <div className="mt-6 rounded-2xl border border-green-100 bg-white p-5 shadow-sm sm:p-6">
                        <div className="mb-5 flex items-center justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-extrabold text-[#24364B]">
                              Completed Campaigns
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                              Your verified volunteer achievements.
                            </p>
                          </div>

                          <span className="rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold text-green-700">
                            {completedCampaigns.length}
                          </span>
                        </div>

                        {completedCampaigns.length === 0 ? (
                          <div className="rounded-xl border border-dashed border-slate-300 bg-[#F7FAFD] p-8 text-center">
                            <Award
                              className="mx-auto mb-3 text-slate-300"
                              size={35}
                            />

                            <p className="font-semibold text-slate-600">
                              No completed campaigns yet.
                            </p>

                            <p className="mt-2 text-sm text-slate-400">
                              Your completed activities will appear here after attendance is verified.
                            </p>
                          </div>
                        ) : (
                          <div className="flex gap-5 overflow-x-auto pb-4">
                            {completedCampaigns.map((campaign) => (
                              <CampaignCard
                                key={campaign.registration_id || campaign.id}
                                campaign={campaign}
                                completed={true}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
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
            © 2026 Kindora.
          </p>
        </div>
      </footer>

      {/* EDIT PROFILE MODAL */}
      {isEditing && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#24364B]/50 px-4 py-6 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCancelEdit();
            }
          }}
        >
          <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            {/* MODAL HEADER */}
            <div className="mb-6 flex items-start justify-between border-b border-slate-100 pb-5">
              <div>
                <p className="text-xs font-bold tracking-wider text-[#69ACD9]">
                  ACCOUNT SETTINGS
                </p>

                <h2 className="mt-2 text-2xl font-extrabold text-[#24364B]">
                  Edit Your Profile
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Update your personal information below.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={saving}
                className="rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                aria-label="Close edit profile"
              >
                <X size={20} />
              </button>
            </div>

            {/* MODAL ERROR */}
            {error && (
              <div className="mb-5 whitespace-pre-line rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* EDIT FORM */}
            <form onSubmit={handleSave} className="space-y-5">
              {/* FULL NAME */}
              <div>
                <label
                  htmlFor="profile-name"
                  className="mb-2 block text-sm font-semibold text-[#24364B]"
                >
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="profile-name"
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    required
                    maxLength={255}
                    disabled={saving}
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-slate-200 bg-[#F7FAFD] py-3 pl-11 pr-4 text-sm text-[#24364B] outline-none transition focus:border-[#438FC4] focus:ring-2 focus:ring-[#438FC4]/10 disabled:opacity-60"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label
                  htmlFor="profile-email"
                  className="mb-2 block text-sm font-semibold text-[#24364B]"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="profile-email"
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleInputChange}
                    required
                    maxLength={255}
                    disabled={saving}
                    placeholder="Enter your email address"
                    className="w-full rounded-xl border border-slate-200 bg-[#F7FAFD] py-3 pl-11 pr-4 text-sm text-[#24364B] outline-none transition focus:border-[#438FC4] focus:ring-2 focus:ring-[#438FC4]/10 disabled:opacity-60"
                  />
                </div>
              </div>

              {/* PHONE */}
              <div>
                <label
                  htmlFor="profile-phone"
                  className="mb-2 block text-sm font-semibold text-[#24364B]"
                >
                  Phone Number
                </label>

                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="profile-phone"
                    type="tel"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleInputChange}
                    maxLength={30}
                    disabled={saving}
                    placeholder="Enter your phone number"
                    className="w-full rounded-xl border border-slate-200 bg-[#F7FAFD] py-3 pl-11 pr-4 text-sm text-[#24364B] outline-none transition focus:border-[#438FC4] focus:ring-2 focus:ring-[#438FC4]/10 disabled:opacity-60"
                  />
                </div>
              </div>

              {/* LOCATION */}
              <div>
                <label
                  htmlFor="profile-location"
                  className="mb-2 block text-sm font-semibold text-[#24364B]"
                >
                  Location
                </label>

                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="profile-location"
                    type="text"
                    name="location"
                    value={editForm.location}
                    onChange={handleInputChange}
                    maxLength={255}
                    disabled={saving}
                    placeholder="Enter your location"
                    className="w-full rounded-xl border border-slate-200 bg-[#F7FAFD] py-3 pl-11 pr-4 text-sm text-[#24364B] outline-none transition focus:border-[#438FC4] focus:ring-2 focus:ring-[#438FC4]/10 disabled:opacity-60"
                  />
                </div>
              </div>

              {/* BIO / MOTIVATION */}
              <div>
                <label
                  htmlFor="profile-bio"
                  className="mb-2 block text-sm font-semibold text-[#24364B]"
                >
                  About Me / Motivation
                </label>

                <textarea
                  id="profile-bio"
                  name="bio"
                  value={editForm.bio}
                  onChange={handleInputChange}
                  rows={4}
                  maxLength={1000}
                  disabled={saving}
                  placeholder="Tell us a little about yourself and why you enjoy volunteering..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-[#F7FAFD] p-4 text-sm text-[#24364B] outline-none transition focus:border-[#438FC4] focus:ring-2 focus:ring-[#438FC4]/10 disabled:opacity-60"
                />

                <p className="mt-1 text-right text-xs text-slate-400">
                  {editForm.bio.length}/1000 characters
                </p>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#438FC4] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#397EAD] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={17} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default UserProfile;
