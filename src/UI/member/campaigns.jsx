
import { Link, useNavigate } from "react-router-dom";
import Header from "./header";
import { useState, useEffect } from "react";
import {
  HeartHandshake,
  Search,
  MapPin,
  CalendarDays,
  Users,
  ArrowRight,
  TreePine,
  HandHeart,
  BookOpen,
  Sparkles,
  Clock,
  Filter,
  X,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000/api/campaigns";

const fallbackImages = {
  Environment:
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=80",
  Donation:
    "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=900&q=80",
  Education:
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80",
  Community:
    "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=900&q=80",
};

const categories = [
  { name: "All", icon: Sparkles },
  { name: "Environment", icon: TreePine },
  { name: "Charity", icon: HandHeart },
  { name: "Education", icon: BookOpen },
  { name: "Community", icon: Users },
];

const categoryColors = {
  Environment: "bg-green-100 text-green-700",
  Donation: "bg-pink-100 text-pink-700",
  Charity: "bg-pink-100 text-pink-700",
  Education: "bg-purple-100 text-purple-700",
  Community: "bg-sky-100 text-sky-700",
};

function formatDate(date) {
  if (!date) return "";

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) return date;

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(time) {
  if (!time) return "";

  const [hours, minutes] = time.split(":");
  const parsedHours = Number(hours);

  if (Number.isNaN(parsedHours)) return time;

  const period = parsedHours >= 12 ? "PM" : "AM";
  const displayHours = parsedHours % 12 || 12;

  return `${displayHours}:${minutes || "00"} ${period}`;
}

export default function Campaigns() {
  const navigate = useNavigate();

  const [campaigns, setCampaigns] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All locations");

  const [activeTab, setActiveTab] = useState("Upcoming");

  const [joinedCampaigns, setJoinedCampaigns] = useState([]);
  const [joiningCampaignId, setJoiningCampaignId] = useState(null);

  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all campaigns from Laravel
  async function fetchCampaigns() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to load campaigns.");
      }

      const data = await response.json();

      const allCampaigns = data.map((campaign) => ({
        ...campaign,

        category:
          campaign.category === "Donation"
            ? "Charity"
            : campaign.category,

        volunteers: Number(campaign.volunteers ?? 0),

        image:
          campaign.image_url ||
          fallbackImages[campaign.category] ||
          fallbackImages.Community,
      }));

      setCampaigns(allCampaigns);
    } catch (err) {
      console.error("Campaign loading error:", err);
      setError(
        "Unable to connect to the campaign server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // Fetch campaigns already joined by the logged-in member
  async function fetchJoinedCampaigns() {
    const token =
      localStorage.getItem("memberToken") ||
      sessionStorage.getItem("memberToken");

    if (!token) {
      setJoinedCampaigns([]);
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/my-campaigns",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.status === 401) {
        setJoinedCampaigns([]);
        return;
      }

      if (!response.ok) {
        throw new Error("Unable to load your campaign registrations.");
      }

      const data = await response.json();

      setJoinedCampaigns(
        (data.campaign_ids || []).map(Number)
      );
    } catch (err) {
      console.error("Joined campaigns loading error:", err);
    }
  }

  // Load campaigns when the page opens
  useEffect(() => {
    fetchCampaigns();
    fetchJoinedCampaigns();
  }, []);

  // Close modal with Escape key
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setSelectedCampaign(null);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedCampaign) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedCampaign]);

  // Filter campaigns by tab, category, search and location
  const filteredCampaigns = campaigns.filter((campaign) => {
    const status = campaign.status?.toLowerCase();

    const matchesTab =
      activeTab === "Upcoming"
        ? status === "upcoming"
        : status === "completed";

    const matchesCategory =
      selectedCategory === "All" ||
      campaign.category === selectedCategory;

    const searchText = search.toLowerCase();

    const matchesSearch =
      (campaign.title || "").toLowerCase().includes(searchText) ||
      (campaign.description || "").toLowerCase().includes(searchText) ||
      (campaign.location || "").toLowerCase().includes(searchText);

    const matchesLocation =
      selectedLocation === "All locations" ||
      (campaign.location || "").startsWith(selectedLocation);

    return (
      matchesTab &&
      matchesCategory &&
      matchesSearch &&
      matchesLocation
    );
  });

  // Join campaign through Laravel API
  async function handleJoin(campaign) {
    const token =
      localStorage.getItem("memberToken") ||
      sessionStorage.getItem("memberToken");

    if (!token) {
      alert("Please log in before joining a campaign.");
      navigate("/login");
      return;
    }

    if (joiningCampaignId !== null) {
      return;
    }

    try {
      setJoiningCampaignId(campaign.id);

      const response = await fetch(
        `${API_URL}/${campaign.id}/join`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          alert("Your login session has expired. Please log in again.");
          navigate("/login");
          return;
        }

        if (response.status === 409) {
          alert("You have already joined this campaign.");

          setJoinedCampaigns((previous) => [
            ...new Set([...previous, campaign.id]),
          ]);

          return;
        }

        alert(data.message || "Unable to join this campaign.");
        return;
      }

      // Update joined campaign status
      setJoinedCampaigns((previous) => [
        ...new Set([...previous, campaign.id]),
      ]);

      // Update volunteer count
      const updatedVolunteers = Number(
        data.volunteers ?? campaign.volunteers + 1
      );

      setCampaigns((previous) =>
        previous.map((item) =>
          item.id === campaign.id
            ? {
                ...item,
                volunteers: updatedVolunteers,
              }
            : item
        )
      );

      // Update selected campaign details
      setSelectedCampaign((previous) =>
        previous?.id === campaign.id
          ? {
              ...previous,
              volunteers: updatedVolunteers,
            }
          : previous
      );

      alert(data.message || "You have successfully joined the campaign!");
    } catch (err) {
      console.error("Campaign registration error:", err);

      alert("Unable to connect to the server. Please try again.");
    } finally {
      setJoiningCampaignId(null);
    }
  }

  // Reset all filters
  function resetFilters() {
    setSearch("");
    setSelectedLocation("All locations");
    setSelectedCategory("All");
  }

  return (
    <>
      <Header />

      <main>
        {/* Hero */}
        <section className="bg-[#EAF5FC] px-5 py-14 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#438FC4] shadow-sm">
                <Sparkles size={16} />
                Make a difference together
              </div>

              <h1 className="mt-6 font-['Poppins'] text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                Find Your Next
                <span className="block text-[#69ACD9]">
                  Volunteer Campaign
                </span>
              </h1>

              <p className="mt-5 font-['Inter'] max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                Discover meaningful activities near you, meet people who care,
                and take action to make your community a better place.
              </p>
            </div>

            {/* Search */}
            <div className="mt-9 grid gap-3 rounded-2xl border border-white bg-white p-3 shadow-sm sm:grid-cols-[1fr_220px_auto] sm:p-4">
              <div className="flex items-center gap-3 rounded-xl bg-[#F7FAFD] px-4">
                <Search size={20} className="shrink-0 text-[#69ACD9]" />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search campaigns..."
                  className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-slate-400"
                  aria-label="Search campaigns"
                />
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-[#F7FAFD] px-4">
                <MapPin size={20} className="shrink-0 text-[#69ACD9]" />
                <select
                  value={selectedLocation}
                  onChange={(event) => setSelectedLocation(event.target.value)}
                  className="w-full bg-transparent py-4 text-sm outline-none"
                  aria-label="Filter by location"
                >
                  <option>All locations</option>
                  <option>Yangon</option>
                  <option>Mandalay</option>
                  <option>Naypyidaw</option>
                </select>
              </div>

              <button
                onClick={resetFilters}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#24364B] px-5 py-4 font-semibold text-white transition hover:bg-[#344F6B]"
              >
                <Filter size={18} />
                Reset filters
              </button>
            </div>
          </div>
        </section>

        {/* Campaign list */}
        <section
          id="campaign-list"
          className="mx-auto max-w-7xl px-5 py-14 sm:py-16 lg:px-8"
        >
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-bold text-[#69ACD9]">
                EXPLORE OPPORTUNITIES
              </p>

              <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">
                Volunteer Campaigns
              </h2>

              <p className="mt-3 text-slate-500">
                Find a cause you care about and get involved.
              </p>
            </div>

            <p className="text-sm font-medium text-slate-500">
              {loading
                ? "Loading campaigns..."
                : `${filteredCampaigns.length} campaigns found`}
            </p>
          </div>

          {/* Upcoming and Previous Tabs */}
          <div className="mt-8 flex gap-3 border-b border-slate-200">
            <button
              onClick={() => setActiveTab("Upcoming")}
              className={`relative px-5 py-3 text-sm font-bold transition ${
                activeTab === "Upcoming"
                  ? "text-[#397EAD]"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Upcoming Campaigns

              {activeTab === "Upcoming" && (
                <span className="absolute bottom-0 left-0 h-1 w-full rounded-full bg-[#69ACD9]" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("Previous")}
              className={`relative px-5 py-3 text-sm font-bold transition ${
                activeTab === "Previous"
                  ? "text-[#397EAD]"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Previous Campaigns

              {activeTab === "Previous" && (
                <span className="absolute bottom-0 left-0 h-1 w-full rounded-full bg-[#69ACD9]" />
              )}
            </button>
          </div>

          {/* Category filters */}
          <div className="mt-8 flex gap-3 overflow-x-auto pb-2">
            {categories.map((category) => {
              const Icon = category.icon;
              const active = selectedCategory === category.name;

              return (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`flex shrink-0 items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition ${
                    active
                      ? "border-[#24364B] bg-[#24364B] text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-[#8EC5E9] hover:bg-[#EAF5FC]"
                  }`}
                >
                  <Icon size={17} />
                  {category.name}
                </button>
              );
            })}
          </div>

          {/* Loading state */}
          {loading && (
            <div className="mt-12 py-16 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#DDF0FC] border-t-[#438FC4]" />
              <p className="mt-4 text-slate-500">
                Loading campaigns...
              </p>
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="mt-8 rounded-2xl border border-red-100 bg-red-50 px-6 py-12 text-center">
              <p className="font-semibold text-red-600">{error}</p>

              <button
                onClick={fetchCampaigns}
                className="mt-5 rounded-xl bg-[#24364B] px-5 py-3 font-semibold text-white hover:bg-[#344F6B]"
              >
                Try again
              </button>
            </div>
          )}

          {/* Campaign cards */}
          {!loading && !error && filteredCampaigns.length > 0 && (
            <div className="mt-8 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCampaigns.map((campaign) => {
                const isPrevious =
                  campaign.status?.toLowerCase() === "completed";

                return (
                  <article
                    key={campaign.id}
                    onClick={() => setSelectedCampaign(campaign)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedCampaign(campaign);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`View details for ${campaign.title}`}
                    className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#69ACD9]"
                  >
                    <div className="relative shrink-0 overflow-hidden">
                      <img
                        src={campaign.image}
                        alt={campaign.title}
                        className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.src = fallbackImages.Community;
                        }}
                      />

                      <span
                        className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-bold ${
                          categoryColors[campaign.category] ||
                          "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {campaign.category}
                      </span>

                      {isPrevious && (
                        <span className="absolute right-4 top-4 rounded-full bg-slate-800/80 px-3 py-1.5 text-xs font-bold text-white">
                          Completed
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <h3 className="line-clamp-2 min-h-[3.5rem] text-xl font-bold">
                        {campaign.title}
                      </h3>

                      {/* Short description preview */}
                      <p className="mt-3 line-clamp-2 min-h-[3rem] text-sm leading-6 text-slate-500">
                        {campaign.description}
                      </p>

                      <div className="mt-5 space-y-3 text-sm text-slate-500">
                        <p className="flex items-start gap-2">
                          <CalendarDays
                            size={18}
                            className="mt-0.5 shrink-0 text-[#69ACD9]"
                          />
                          {formatDate(campaign.date)}
                        </p>

                        <p className="flex items-start gap-2">
                          <MapPin
                            size={18}
                            className="mt-0.5 shrink-0 text-[#69ACD9]"
                          />
                          {campaign.location}
                        </p>

                        <p className="flex items-center gap-2">
                          <Users
                            size={18}
                            className="shrink-0 text-[#69ACD9]"
                          />
                          {campaign.volunteers} / {campaign.capacity} volunteers
                        </p>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-[#8EC5E9]"
                          style={{
                            width: `${
                              campaign.capacity > 0
                                ? Math.min(
                                    (campaign.volunteers /
                                      campaign.capacity) *
                                      100,
                                    100
                                  )
                                : 0
                            }%`,
                          }}
                        />
                      </div>

                      {/* View details */}
                      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-5 mt-5">
                        <span className="text-sm font-bold text-[#397EAD]">
                          View Details
                        </span>

                        <ArrowRight
                          size={18}
                          className="text-[#69ACD9] transition group-hover:translate-x-1"
                        />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && filteredCampaigns.length === 0 && (
            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <Search size={36} className="mx-auto text-slate-300" />

              <h3 className="mt-4 text-xl font-bold">
                {activeTab === "Upcoming"
                  ? "No upcoming campaigns found"
                  : "No previous campaigns found"}
              </h3>

              <p className="mt-2 text-slate-500">
                Try another keyword, category, or location.
              </p>

              <button
                onClick={resetFilters}
                className="mt-5 rounded-xl bg-[#8EC5E9] px-5 py-3 font-semibold text-[#183B55] hover:bg-[#75B5E0]"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        {/* Call to action */}
        <section className="px-5 pb-16 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-[2rem] bg-[#CDE8F8] p-8 sm:p-12 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 font-bold text-[#397EAD]">
                <HeartHandshake size={21} />
                BE PART OF THE CHANGE
              </div>

              <h2 className="mt-3 text-3xl font-extrabold">
                Your community needs your kindness.
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                Every hour, every idea, and every helping hand can make a
                difference.
              </p>
            </div>

            <Link
              to={
                localStorage.getItem("memberToken") ||
                sessionStorage.getItem("memberToken")
                  ? "/userprofile"
                  : "/register"
              }
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#24364B] px-6 py-4 font-bold text-white transition hover:bg-[#344F6B]"
            >
              Become a Volunteer <ArrowRight size={19} />
            </Link>
          </div>
        </section>
      </main>

      {/* Campaign Details Popup Modal */}
      {selectedCampaign && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
          onClick={() => setSelectedCampaign(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="campaign-modal-title"
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedCampaign(null)}
              aria-label="Close campaign details"
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md transition hover:bg-white hover:text-red-500"
            >
              <X size={21} />
            </button>

            {/* Campaign image */}
            <div className="relative">
              <img
                src={selectedCampaign.image}
                alt={selectedCampaign.title}
                className="h-56 w-full object-cover sm:h-72"
              />

              <span
                className={`absolute bottom-4 left-5 rounded-full px-4 py-2 text-xs font-bold ${
                  categoryColors[selectedCampaign.category] ||
                  "bg-slate-100 text-slate-700"
                }`}
              >
                {selectedCampaign.category}
              </span>

              {selectedCampaign.status?.toLowerCase() === "completed" && (
                <span className="absolute bottom-4 right-5 rounded-full bg-slate-800/80 px-4 py-2 text-xs font-bold text-white">
                  Completed
                </span>
              )}
            </div>

            {/* Campaign information */}
            <div className="p-6 sm:p-8">
              <h2
                id="campaign-modal-title"
                className="text-2xl font-extrabold text-[#24364B] sm:text-3xl"
              >
                {selectedCampaign.title}
              </h2>

              {/* Full description */}
              <div className="mt-5">
                <h3 className="text-sm font-bold uppercase tracking-wide text-[#69ACD9]">
                  About This Campaign
                </h3>

                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                  {selectedCampaign.description || "No description available."}
                </p>
              </div>

              {/* Campaign details */}
              <div className="mt-7 grid gap-4 rounded-2xl bg-[#F7FAFD] p-5 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <CalendarDays
                    size={21}
                    className="mt-1 shrink-0 text-[#69ACD9]"
                  />

                  <div>
                    <p className="text-xs font-semibold text-slate-400">
                      DATE
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#24364B]">
                      {formatDate(selectedCampaign.date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock
                    size={21}
                    className="mt-1 shrink-0 text-[#69ACD9]"
                  />

                  <div>
                    <p className="text-xs font-semibold text-slate-400">
                      TIME
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#24364B]">
                      {formatTime(selectedCampaign.time) || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin
                    size={21}
                    className="mt-1 shrink-0 text-[#69ACD9]"
                  />

                  <div>
                    <p className="text-xs font-semibold text-slate-400">
                      LOCATION
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#24364B]">
                      {selectedCampaign.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users
                    size={21}
                    className="mt-1 shrink-0 text-[#69ACD9]"
                  />

                  <div>
                    <p className="text-xs font-semibold text-slate-400">
                      VOLUNTEERS
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#24364B]">
                      {selectedCampaign.volunteers} / {selectedCampaign.capacity}
                    </p>
                  </div>
                </div>
              </div>

              {/* Volunteer progress */}
              <div className="mt-6">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-semibold text-slate-600">
                    Volunteer Capacity
                  </span>

                  <span className="font-bold text-[#397EAD]">
                    {selectedCampaign.capacity > 0
                      ? Math.round(
                          Math.min(
                            (selectedCampaign.volunteers /
                              selectedCampaign.capacity) *
                              100,
                            100
                          )
                        )
                      : 0}%
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-[#8EC5E9] transition-all"
                    style={{
                      width: `${
                        selectedCampaign.capacity > 0
                          ? Math.min(
                              (selectedCampaign.volunteers /
                                selectedCampaign.capacity) *
                                100,
                              100
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Join button only for upcoming campaigns */}
              {selectedCampaign.status?.toLowerCase() === "upcoming" && (
                <button
                  onClick={() => handleJoin(selectedCampaign)}
                  disabled={
                    joinedCampaigns.includes(selectedCampaign.id) ||
                    selectedCampaign.volunteers >= selectedCampaign.capacity ||
                    joiningCampaignId !== null
                  }
                  className={`mt-8 flex w-full items-center justify-center gap-2 rounded-xl py-4 font-bold transition ${
                    joinedCampaigns.includes(selectedCampaign.id)
                      ? "cursor-not-allowed bg-green-100 text-green-700"
                      : joiningCampaignId === selectedCampaign.id
                        ? "cursor-wait bg-[#DDF0FC] text-[#397EAD]"
                        : selectedCampaign.volunteers >= selectedCampaign.capacity
                          ? "cursor-not-allowed bg-slate-100 text-slate-400"
                          : "bg-[#24364B] text-white hover:bg-[#344F6B]"
                  }`}
                >
                  {joinedCampaigns.includes(selectedCampaign.id)
                    ? "Already Joined"
                    : joiningCampaignId === selectedCampaign.id
                      ? "Joining..."
                      : selectedCampaign.volunteers >= selectedCampaign.capacity
                        ? "Campaign Full"
                        : "Join Campaign"}

                  {!joinedCampaigns.includes(selectedCampaign.id) &&
                    joiningCampaignId !== selectedCampaign.id &&
                    selectedCampaign.volunteers < selectedCampaign.capacity && (
                      <ArrowRight size={18} />
                    )}
                </button>
              )}

              {/* Previous campaign message */}
              {selectedCampaign.status?.toLowerCase() === "completed" && (
                <div className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-slate-100 py-4 font-bold text-slate-500">
                  <HeartHandshake size={20} />
                  This campaign has been completed.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white px-5 py-8 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <a href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#DDF0FC] text-[#438FC4]">
              <HeartHandshake size={22} />
            </span>

            <span className="text-lg font-extrabold">
              Kindora<span className="text-[#69ACD9]">.</span>
            </span>
          </a>

          <p className="text-center text-sm text-slate-500">
            Together, we make our communities better.
          </p>

          <p className="text-sm text-slate-400">
            © 2026 Kindora. Demo project.
          </p>
        </div>
      </footer>
    </>
  );
}
