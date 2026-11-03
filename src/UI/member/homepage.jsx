import Header from "./header";
import { Link } from 'react-router-dom';
import { useState } from "react";
import {
  HeartHandshake,
  Menu,
  X,
  MapPin,
  CalendarDays,
  Users,
  ArrowRight,
  Clock,
  TreePine,
  HandHeart,
  BookOpen,
  Sparkles,
} from "lucide-react";

const campaigns = [
  {
    title: "Community Tree Planting",
    category: "Environment",
    date: "October 18, 2026",
    location: "Yangon, Myanmar",
    volunteers: 24,
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=80",
    color: "bg-green-100 text-green-700",
  },
  {
    title: "Orphanage Donation Drive",
    category: "Charity",
    date: "October 22, 2026",
    location: "Mandalay, Myanmar",
    volunteers: 18,
    image:
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=900&q=80",
    color: "bg-purple-100 text-purple-700",
  },
  {
    title: "Neighborhood Cleanup",
    category: "Community",
    date: "October 25, 2026",
    location: "Yangon, Myanmar",
    volunteers: 32,
    image:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=900&q=80",
    color: "bg-sky-100 text-sky-700",
  },
];

const categories = [
  { name: "Environment", icon: TreePine, color: "bg-green-100 text-green-700" },
  { name: "Charity", icon: HandHeart, color: "bg-pink-100 text-pink-700" },
  { name: "Education", icon: BookOpen, color: "bg-purple-100 text-purple-700" },
  { name: "Community", icon: Users, color: "bg-sky-100 text-sky-700" },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
     <>
    <Header />

      <main>
        {/* Hero */}
        <section id="home" className="overflow-hidden">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#E5F3FC] px-4 py-2 text-sm font-semibold text-[#438FC4]">
                <Sparkles size={16} />
                Together, we can make a difference
              </div>

              <h1 className="max-w-xl font-['Poppins'] text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Small Acts,
                <br />
                <span className="text-[#69ACD9]">Big Impact!</span>
            </h1>

             <p className="mt-6 max-w-lg font-['Inter'] text-base leading-8 text-slate-600 sm:text-lg">
  Discover meaningful volunteer opportunities, support your
  community, and create positive change together. Every helping
  hand matters.
</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#campaigns"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8EC5E9] px-6 py-4 font-bold text-[#183B55] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#75B5E0]"
                >
                  Explore Campaigns <ArrowRight size={19} />
                </a>
                <a
                  href="#signup"
                  className="inline-flex items-center justify-center rounded-xl border border-[#C8DFEF] bg-white px-6 py-4 font-bold transition hover:bg-[#EDF7FD]"
                >
                  Join Our Community
                </a>
              </div>

              <div className="mt-8 flex items-center gap-3">
                <div className="flex -space-x-3">
                  {[
                    "photo-1534528741775-53994a69daeb",
                    "photo-1500648767791-00dcc994a43e",
                    "photo-1531123897727-8f129e1688ce",
                  ].map((photo) => (
                    <img
                      key={photo}
                      src={`https://images.unsplash.com/${photo}?auto=format&fit=crop&w=100&h=100&q=80`}
                      alt="Community volunteer"
                      className="h-10 w-10 rounded-full border-2 border-white object-cover"
                    />
                  ))}
                </div>
                <p className="text-sm text-slate-600">
                  <strong className="text-[#24364B]">Be part of something good.</strong>
                  <br /> Start helping your community today.
                </p>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl">
              <div className="absolute -left-5 -top-5 h-28 w-28 rounded-full bg-[#DDF3E4]" />
              <div className="absolute -bottom-5 -right-4 h-32 w-32 rounded-full bg-[#FBE6D8]" />

              <img
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=85"
                alt="Volunteers working together to help their community"
                className="relative h-[340px] w-full rounded-[2rem] object-cover shadow-xl sm:h-[450px]"
              />

              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/60 bg-white/95 p-4 shadow-lg backdrop-blur sm:bottom-7 sm:left-7 sm:right-7 sm:p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#DDF3E4] text-green-700">
                    <HeartHandshake size={25} />
                  </div>
                  <div>
                    <p className="font-bold">Make every moment count</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Your time can change someone's life.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Statistics */}
        <section className="px-5 py-12 lg:px-8">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 rounded-3xl border border-[#E4EFF7] bg-white p-6 shadow-sm sm:grid-cols-4 sm:p-8">
            {[
              { number: "2,450+", label: "Community Volunteers", icon: Users },
              { number: "128+", label: "Campaigns Completed", icon: HeartHandshake },
              { number: "8,640+", label: "Volunteer Hours", icon: Clock },
              { number: "35+", label: "Communities Helped", icon: MapPin },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="p-3 text-center sm:p-4">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF5FC] text-[#438FC4]">
                    <Icon size={23} />
                  </div>
                  <p className="text-2xl font-extrabold sm:text-3xl">
                    {stat.number}
                  </p>
                  <p className="mt-2 text-xs text-slate-500 sm:text-sm">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
          <p className="mx-auto mt-3 max-w-7xl text-right text-xs text-slate-400">
            Sample statistics for demonstration
          </p>
        </section>

        {/* Categories */}
        <section id="about" className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <div className="text-center">
            <p className="font-bold text-[#69ACD9]">FIND YOUR PURPOSE</p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              How would you like to help?
            </h2>
            <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-500">
              Find a cause close to your heart and take the first step toward
              making a positive difference.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <a
                  key={category.name}
                  href="#campaigns"
                  className="group rounded-2xl border border-slate-100 bg-white p-6 text-center transition hover:-translate-y-1 hover:shadow-lg sm:p-8"
                >
                  <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${category.color}`}>
                    <Icon size={30} />
                  </div>
                  <h3 className="mt-4 font-bold">{category.name}</h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Explore opportunities
                  </p>
                  <ArrowRight
                    size={18}
                    className="mx-auto mt-4 text-[#69ACD9] transition group-hover:translate-x-1"
                  />
                </a>
              );
            })}
          </div>
        </section>

        {/* Featured Campaigns */}
        <section id="campaigns" className="bg-[#EAF5FC] px-5 py-16 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="font-bold text-[#438FC4]">MAKE A DIFFERENCE</p>
                <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                  Featured Campaigns
                </h2>
                <p className="mt-3 max-w-xl leading-7 text-slate-600">
                  Discover upcoming activities and find the perfect way to
                  contribute to your community.
                </p>
              </div>
              <a
                href="#campaigns"
                className="inline-flex items-center gap-2 font-bold text-[#397EAD] hover:gap-3"
              >
                View all campaigns <ArrowRight size={18} />
              </a>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {campaigns.map((campaign) => (
                <article
                  key={campaign.title}
                  className="group overflow-hidden rounded-2xl border border-white bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={campaign.image}
                      alt={campaign.title}
                      className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-bold ${campaign.color}`}>
                      {campaign.category}
                    </span>
                  </div>

                  <div className="p-5 sm:p-6">
                    <h3 className="text-xl font-bold">{campaign.title}</h3>
                    <div className="mt-4 space-y-3 text-sm text-slate-500">
                      <p className="flex items-center gap-2">
                        <CalendarDays size={17} className="text-[#69ACD9]" />
                        {campaign.date}
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin size={17} className="text-[#69ACD9]" />
                        {campaign.location}
                      </p>
                      <p className="flex items-center gap-2">
                        <Users size={17} className="text-[#69ACD9]" />
                        {campaign.volunteers} volunteers registered
                      </p>
                    </div>
                    <a
                      href="#signup"
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#EAF5FC] py-3 font-bold text-[#397EAD] transition hover:bg-[#B8DDF5]"
                    >
                      View Details <ArrowRight size={17} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Community CTA */}
        <section id="community" className="px-5 py-16 lg:px-8">
          <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 overflow-hidden rounded-[2rem] bg-[#CDE8F8] p-8 sm:p-12 lg:flex-row lg:items-center lg:p-16">
            <div className="absolute -right-10 -top-16 h-52 w-52 rounded-full bg-white/30" />
            <div className="relative max-w-2xl">
              <p className="font-bold text-[#397EAD]">YOUR COMMUNITY NEEDS YOU</p>
              <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                One small action can inspire a thousand more.
              </h2>
              <p className="mt-4 leading-7 text-slate-700">
                Meet kind people, support meaningful causes, and track the
                positive impact you make along the way.
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
      <footer className="border-t border-slate-100 bg-white px-5 py-10 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
          <a href="#home" className="flex items-center gap-2">
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

export default App;

