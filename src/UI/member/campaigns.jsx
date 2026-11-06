
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

  const [joinedCampaigns, setJoinedCampaigns] = useState([]);
  const [joiningCampaignId, setJoiningCampaignId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch campaigns from Laravel
  async function fetchCampaigns() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to load campaigns.");
      }

      const data = await response.json();

      const upcomingCampaigns = data
        .filter(
          (campaign) =>
            campaign.status?.toLowerCase() === "upcoming"
        )
        .map((campaign) => ({
          ...campaign,

          category:
            campaign.category === "Donation"
              ? "Charity"
              : campaign.category,

          // Get volunteer count from Laravel
          volunteers: Number(campaign.volunteers ?? 0),

          image:
            campaign.image_url ||
            fallbackImages[campaign.category] ||
            fallbackImages.Community,
        }));

      setCampaigns(upcomingCampaigns);
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

  // If the user is not logged in, no campaigns are marked as joined
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

  // Search and filter campaigns
  const filteredCampaigns = campaigns.filter((campaign) => {
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

    return matchesCategory && matchesSearch && matchesLocation;
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

      // Save joined campaign in React state
      setJoinedCampaigns((previous) => [
        ...new Set([...previous, campaign.id]),
      ]);

      // Update volunteer count immediately
      setCampaigns((previous) =>
        previous.map((item) =>
          item.id === campaign.id
            ? {
                ...item,
                volunteers: Number(
                  data.volunteers ?? item.volunteers + 1
                ),
              }
            : item
        )
      );

      alert(data.message || "You have successfully joined the campaign!");
    } catch (err) {
      console.error("Campaign registration error:", err);

      alert("Unable to connect to the server. Please try again.");
    } finally {
      setJoiningCampaignId(null);
    }
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
                onClick={() => {
                  setSearch("");
                  setSelectedLocation("All locations");
                  setSelectedCategory("All");
                }}
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
                Upcoming Campaigns
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
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCampaigns.map((campaign) => {
                const isJoined = joinedCampaigns.includes(campaign.id);

                const isFull =
                  campaign.volunteers >= campaign.capacity;

                const isJoining = joiningCampaignId === campaign.id;

                return (
                  <article
                    key={campaign.id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative overflow-hidden">
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
                    </div>

                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <h3 className="text-xl font-bold">
                        {campaign.title}
                      </h3>

                      <p className="mt-3 text-sm leading-6 text-slate-500">
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
                          <Clock
                            size={18}
                            className="mt-0.5 shrink-0 text-[#69ACD9]"
                          />
                          {formatTime(campaign.time)}
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

                      <button
                        onClick={() => handleJoin(campaign)}
                        disabled={
                          isJoined ||
                          isFull ||
                          isJoining ||
                          joiningCampaignId !== null
                        }
                        className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3 font-bold transition ${
                          isJoined
                            ? "cursor-not-allowed bg-green-100 text-green-700"
                            : isJoining
                              ? "cursor-wait bg-[#DDF0FC] text-[#397EAD]"
                              : isFull
                                ? "cursor-not-allowed bg-slate-100 text-slate-400"
                                : "bg-[#EAF5FC] text-[#397EAD] hover:bg-[#B8DDF5]"
                        }`}
                      >
                        {isJoined
                          ? "Joined"
                          : isJoining
                            ? "Joining..."
                            : isFull
                              ? "Campaign Full"
                              : "Join Campaign"}

                        {!isJoined && !isFull && !isJoining && (
                          <ArrowRight size={17} />
                        )}
                      </button>
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
                No campaigns found
              </h3>
              <p className="mt-2 text-slate-500">
                Try another keyword, category, or location.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedLocation("All locations");
                  setSelectedCategory("All");
                }}
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
