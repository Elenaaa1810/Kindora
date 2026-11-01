import Header from "./header";
import { useState } from "react";
import { Link } from 'react-router-dom';
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

const campaigns = [
  {
    id: 1,
    title: "Community Tree Planting",
    category: "Environment",
    date: "October 18, 2026",
    time: "8:00 AM - 12:00 PM",
    location: "Yangon, Myanmar",
    volunteers: 24,
    capacity: 40,
    description:
      "Help make our community greener by planting trees and learning about environmental protection.",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=80",
    color: "bg-green-100 text-green-700",
  },
  {
    id: 2,
    title: "Orphanage Donation Drive",
    category: "Charity",
    date: "October 22, 2026",
    time: "9:00 AM - 1:00 PM",
    location: "Mandalay, Myanmar",
    volunteers: 18,
    capacity: 30,
    description:
      "Support children by helping organize donations of school supplies, clothes, and daily necessities.",
    image:
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=900&q=80",
    color: "bg-pink-100 text-pink-700",
  },
  {
    id: 3,
    title: "Neighborhood Cleanup",
    category: "Community",
    date: "October 25, 2026",
    time: "7:00 AM - 10:00 AM",
    location: "Yangon, Myanmar",
    volunteers: 32,
    capacity: 50,
    description:
      "Work with local volunteers to clean public spaces and encourage a cleaner neighborhood.",
    image:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=900&q=80",
    color: "bg-sky-100 text-sky-700",
  },
  {
    id: 4,
    title: "Reading for Children",
    category: "Education",
    date: "October 28, 2026",
    time: "10:00 AM - 12:00 PM",
    location: "Mandalay, Myanmar",
    volunteers: 12,
    capacity: 25,
    description:
      "Spend time reading stories with children and help them develop their reading skills.",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80",
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: 5,
    title: "Community Food Distribution",
    category: "Charity",
    date: "November 2, 2026",
    time: "8:00 AM - 12:00 PM",
    location: "Yangon, Myanmar",
    volunteers: 20,
    capacity: 35,
    description:
      "Help prepare and distribute food packages to community members who need assistance.",
    image:
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=80",
    color: "bg-orange-100 text-orange-700",
  },
  {
    id: 6,
    title: "School Supply Collection",
    category: "Education",
    date: "November 5, 2026",
    time: "9:00 AM - 12:00 PM",
    location: "Naypyidaw, Myanmar",
    volunteers: 15,
    capacity: 30,
    description:
      "Collect and organize learning materials to help students access the supplies they need.",
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80",
    color: "bg-purple-100 text-purple-700",
  },
];

const categories = [
  { name: "All", icon: Sparkles },
  { name: "Environment", icon: TreePine },
  { name: "Charity", icon: HandHeart },
  { name: "Education", icon: BookOpen },
  { name: "Community", icon: Users },
];

export default function Campaigns() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All locations");
  const [joinedCampaigns, setJoinedCampaigns] = useState([]);

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesCategory =
      selectedCategory === "All" ||
      campaign.category === selectedCategory;

    const matchesSearch =
      campaign.title.toLowerCase().includes(search.toLowerCase()) ||
      campaign.description.toLowerCase().includes(search.toLowerCase()) ||
      campaign.location.toLowerCase().includes(search.toLowerCase());

    const matchesLocation =
      selectedLocation === "All locations" ||
      campaign.location.startsWith(selectedLocation);

    return matchesCategory && matchesSearch && matchesLocation;
  });

  function handleJoin(campaign) {
    if (joinedCampaigns.includes(campaign.id)) {
      setJoinedCampaigns((previous) =>
        previous.filter((id) => id !== campaign.id)
      );
      return;
    }

    if (campaign.volunteers >= campaign.capacity) {
      alert("Sorry, this campaign is full.");
      return;
    }

    setJoinedCampaigns((previous) => [...previous, campaign.id]);

    alert(`You have joined "${campaign.title}" in this demo!`);
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
              <p className="font-bold text-[#69ACD9]">EXPLORE OPPORTUNITIES</p>
              <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">
                Upcoming Campaigns
              </h2>
              <p className="mt-3 text-slate-500">
                Find a cause you care about and get involved.
              </p>
            </div>

            <p className="text-sm font-medium text-slate-500">
              {filteredCampaigns.length} campaigns found
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

          {/* Cards */}
          {filteredCampaigns.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCampaigns.map((campaign) => {
                const isJoined = joinedCampaigns.includes(campaign.id);
                const isFull = campaign.volunteers >= campaign.capacity;

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
                      />
                      <span
                        className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-bold ${campaign.color}`}
                      >
                        {campaign.category}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <h3 className="text-xl font-bold">{campaign.title}</h3>

                      <p className="mt-3 text-sm leading-6 text-slate-500">
                        {campaign.description}
                      </p>

                      <div className="mt-5 space-y-3 text-sm text-slate-500">
                        <p className="flex items-start gap-2">
                          <CalendarDays
                            size={18}
                            className="mt-0.5 shrink-0 text-[#69ACD9]"
                          />
                          {campaign.date}
                        </p>

                        <p className="flex items-start gap-2">
                          <Clock
                            size={18}
                            className="mt-0.5 shrink-0 text-[#69ACD9]"
                          />
                          {campaign.time}
                        </p>

                        <p className="flex items-start gap-2">
                          <MapPin
                            size={18}
                            className="mt-0.5 shrink-0 text-[#69ACD9]"
                          />
                          {campaign.location}
                        </p>

                        <p className="flex items-center gap-2">
                          <Users size={18} className="shrink-0 text-[#69ACD9]" />
                          {campaign.volunteers} / {campaign.capacity} volunteers
                        </p>
                      </div>

                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-[#8EC5E9]"
                          style={{
                            width: `${Math.min(
                              (campaign.volunteers / campaign.capacity) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>

                      <button
                        onClick={() => handleJoin(campaign)}
                        disabled={isFull && !isJoined}
                        className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3 font-bold transition ${
                          isJoined
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : isFull
                              ? "cursor-not-allowed bg-slate-100 text-slate-400"
                              : "bg-[#EAF5FC] text-[#397EAD] hover:bg-[#B8DDF5]"
                        }`}
                      >
                        {isJoined
                          ? "Cancel Registration"
                          : isFull
                            ? "Campaign Full"
                            : "Join Campaign"}
                        {!isJoined && !isFull && <ArrowRight size={17} />}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <Search size={36} className="mx-auto text-slate-300" />
              <h3 className="mt-4 text-xl font-bold">No campaigns found</h3>
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

            <a
              href="/#signup"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#24364B] px-6 py-4 font-bold text-white transition hover:bg-[#344F6B]"
            >
              Become a Volunteer <ArrowRight size={19} />
            </a>
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
