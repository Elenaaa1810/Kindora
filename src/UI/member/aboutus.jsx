import Header from "./header";
import { Link } from "react-router-dom";

import {
  HeartHandshake,
  Users,
  Target,
  Eye,
  HandHeart,
  Sprout,
  Award,
  Clock,
  CalendarCheck,
  ArrowRight,
} from "lucide-react";

const AboutUs = () => {
  

  const values = [
    {
      icon: <HeartHandshake size={27} />,
      title: "Kindness",
      description:
        "We believe every act of kindness can make someone's life better.",
      color: "bg-[#DDF0FC]",
    },
    {
      icon: <Users size={27} />,
      title: "Community",
      description:
        "We bring people together to support one another and create change.",
      color: "bg-[#E4F5F8]",
    },
    {
      icon: <Sprout size={27} />,
      title: "Growth",
      description:
        "We encourage everyone to learn, grow, and help their communities.",
      color: "bg-[#E6F5E9]",
    },
    {
      icon: <Award size={27} />,
      title: "Impact",
      description:
        "We celebrate every contribution that makes a positive difference.",
      color: "bg-[#F0EAFE]",
    },
  ];

  const activities = [
    {
      icon: "🌳",
      title: "Environmental Care",
      description:
        "Take part in tree planting, neighborhood cleanups, and environmental campaigns.",
      color: "bg-[#E6F5E9]",
    },
    {
      icon: "🎁",
      title: "Donation Campaigns",
      description:
        "Help collect and distribute food, clothes, books, and essential supplies.",
      color: "bg-[#FCEAF0]",
    },
    {
      icon: "❤️",
      title: "Community Support",
      description:
        "Support people in need through meaningful community activities.",
      color: "bg-[#DDF0FC]",
    },
  ];


  return (
    <>
    <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#EAF5FC] via-white to-[#F0FAFC] px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#DDF0FC] bg-white px-4 py-2 text-sm font-semibold text-[#438FC4] shadow-sm">
            <HeartHandshake size={18} />
            About Our Community
          </span>

          <h1 className="mx-auto mt-7 max-w-4xl text-4xl font-['Poppins'] font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Small Acts,
            <span className="block text-[#67A9D7]">
              Big Impact!
            </span>
          </h1>

          <p className="mx-auto font-['Inter'] mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            We connect passionate people with meaningful volunteering
            opportunities. Together, we can support our communities,
            care for the environment, and create a better future for everyone.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/campaigns"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8EC5E9] px-7 py-3.5 font-semibold text-[#183B55] shadow-md shadow-blue-100 transition hover:-translate-y-0.5 hover:bg-[#75B5E0]"
            >
              Explore Campaigns
              <ArrowRight size={19} />
            </Link>

            <Link
              to="/community"
              className="inline-flex items-center justify-center rounded-xl border border-[#B8DDF3] bg-white px-7 py-3.5 font-semibold text-[#438FC4] transition hover:bg-[#EAF5FC]"
            >
              Join Our Community
            </Link>
          </div>

          <div className="mx-auto mt-16 grid max-w-4xl gap-5 sm:grid-cols-3">
            {[
              {
                icon: "🌍",
                title: "Local Communities",
                text: "Make a difference where you live.",
              },
              {
                icon: "🤝",
                title: "Shared Purpose",
                text: "Work together toward meaningful goals.",
              },
              {
                icon: "🌟",
                title: "Positive Change",
                text: "Every contribution matters.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-[#DDF0FC] bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <span className="text-3xl">{item.icon}</span>
                <h3 className="mt-3 font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Our Organization */}
      <section className="px-5 py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative">
            <div className="rounded-3xl bg-[#EAF5FC] p-6 sm:p-10">
              <div className="rounded-2xl bg-white p-7 shadow-sm sm:p-10">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#DDF0FC] text-[#438FC4]">
                  <HandHeart size={34} />
                </div>

                <h3 className="mt-6 text-2xl font-bold text-slate-900">
                  Small Actions, Lasting Change
                </h3>

                <p className="mt-4 font-['Inter'] leading-8 text-slate-600">
                  A helping hand, a donation, or a few hours of your time
                  can make a meaningful difference in someone's life.
                </p>

                <div className="mt-7 flex items-center gap-3 border-t border-slate-100 pt-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#DDF0FC] text-[#438FC4]">
                    <HeartHandshake size={23} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">
                      Every action counts
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Be part of something meaningful.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -right-3 -top-5 -z-10 h-24 w-24 rounded-full bg-[#DDF0FC]" />
            <div className="absolute -bottom-5 -left-3 -z-10 h-20 w-20 rounded-full bg-[#F0EAFE]" />
          </div>

          <div>
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#438FC4]">
              Who We Are
            </span>

            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
              Bringing people together through kindness.
            </h2>

            <p className="mt-6 font-['Inter'] leading-8 text-slate-600">
              Kindora is a community-focused volunteering platform
              designed to help people discover opportunities to help others.
              We believe everyone has something valuable to contribute,
              regardless of their experience.
            </p>

            <p className="mt-4 font-['Inter'] leading-8 text-slate-600">
              Through Kindora, people can discover campaigns, register
              for volunteer activities, share their experiences, and
              recognize the positive results of their efforts.
            </p>

            <div className="mt-8 rounded-2xl border-l-4 border-[#67A9D7] bg-[#EAF5FC] p-5">
              <p className="font-semibold leading-7 text-slate-800">
                "A better community begins when we choose to help one another."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission and Vision */}
      <section className="bg-slate-50 px-5 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#438FC4]">
              Our Purpose
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              What We Stand For
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              We are guided by a shared commitment to helping people
              and creating positive change.
            </p>
          </div>

          <div className="grid gap-7 md:grid-cols-2">
            <div className="rounded-3xl border border-[#DDF0FC] bg-white p-8 shadow-sm transition hover:shadow-md sm:p-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DDF0FC] text-[#438FC4]">
                <Target size={29} />
              </div>

              <h3 className="mt-6 text-2xl font-bold text-slate-900">
                Our Mission
              </h3>

              <p className="mt-4 font-['Inter'] leading-8 text-slate-600">
                Our mission is to make volunteering more accessible
                by connecting people with community campaigns and
                activities. We aim to encourage participation, support
                local needs, and help volunteers understand the value
                of their contributions.
              </p>
            </div>

            <div className="rounded-3xl border border-[#DDF0FC] bg-white p-8 shadow-sm transition hover:shadow-md sm:p-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E4F5F8] text-[#438FC4]">
                <Eye size={29} />
              </div>

              <h3 className="mt-6 text-2xl font-bold text-slate-900">
                Our Vision
              </h3>

              <p className="mt-4 font-['Inter'] leading-8 text-slate-600">
                Our vision is to build a caring and active community
                where helping others becomes part of everyday life.
                We hope to inspire people to volunteer, work together,
                and create lasting positive change.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="px-5 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#438FC4]">
              What Matters to Us
            </span>

            <h2 className="mt-4 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Our Core Values
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              These values guide our community and inspire the way
              we help one another.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-slate-100 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-100/60"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl text-[#438FC4] ${value.color}`}
                >
                  {value.icon}
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  {value.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteering Activities */}
      <section className="bg-[#F5FAFE] px-5 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#438FC4]">
              Get Involved
            </span>

            <h2 className="mt-4 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Ways to Make an Impact
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Find a cause you care about and take the first step
              toward making a difference.
            </p>
          </div>

          <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity) => (
              <div
                key={activity.title}
                className="rounded-3xl border border-white bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl text-3xl ${activity.color}`}
                >
                  {activity.icon}
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  {activity.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {activity.description}
                </p>

                <Link
                  to="/campaigns"
                  className="mt-6 inline-flex items-center gap-2 font-semibold text-[#438FC4] transition hover:text-[#183B55]"
                >
                  Find Opportunities
                  <ArrowRight size={18} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Impact Tracker */}
      <section className="px-5 py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#438FC4]">
              Your Contribution Matters
            </span>

            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
              Every hour. Every action. Every difference.
            </h2>

            <p className="mt-6 leading-8 text-slate-600">
              Volunteering is about more than participating. It is
              also about recognizing the positive impact of your efforts.
              Kindora's Volunteer Impact Tracker is designed to help
              volunteers keep track of completed activities and verified
              volunteering hours.
            </p>

            <p className="mt-4 leading-8 text-slate-600">
              Volunteers can celebrate achievements, follow their
              progress, and stay motivated to continue supporting
              their communities.
            </p>

            <Link
              to="/community"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#8EC5E9] px-6 py-3.5 font-semibold text-[#183B55] transition hover:bg-[#75B5E0]"
            >
              Discover Our Community
              <ArrowRight size={19} />
            </Link>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-[#DDF0FC] via-[#F0FAFC] to-[#F0EAFE] p-5 sm:p-9">
            <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Volunteer Impact Tracker
                  </p>
                  <h3 className="mt-2 text-xl font-bold text-slate-900">
                    Your Volunteer Journey
                  </h3>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DDF0FC] text-[#438FC4]">
                  <Award size={27} />
                </div>
              </div>

              <div className="mt-8 space-y-5">
                <div className="flex items-center gap-4 rounded-xl bg-[#F5FAFE] p-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#DDF0FC] text-[#438FC4]">
                    <CalendarCheck size={23} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">
                      Completed Campaigns
                    </h4>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Keep track of your completed activities.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-xl bg-[#F0FAFC] p-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E4F5F8] text-[#438FC4]">
                    <Clock size={23} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">
                      Verified Volunteer Hours
                    </h4>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Recognize your confirmed volunteering time.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-xl bg-[#F8F5FF] p-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F0EAFE] text-purple-600">
                    <Award size={23} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">
                      Achievements & Milestones
                    </h4>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Celebrate progress throughout your journey.
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-center text-xs leading-5 text-slate-400">
                Actual progress and achievements require verified
                volunteer records from the system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="px-5 pb-20 sm:pb-24">
        <div className="mx-auto max-w-6xl rounded-3xl bg-gradient-to-r from-[#438FC4] to-[#67B9D9] px-6 py-14 text-center shadow-xl shadow-blue-100 sm:px-12 sm:py-16">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-white">
            <HeartHandshake size={35} />
          </div>

          <h2 className="mt-6 text-3xl font-extrabold text-white sm:text-4xl">
            Be Part of Something Good.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-blue-50">
            Your time, kindness, and effort can make a difference.
            Join Kindora and discover how you can help create a
            brighter future for your community.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/campaigns"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 font-semibold text-[#183B55] transition hover:bg-[#EAF5FC]"
            >
              Explore Campaigns
              <ArrowRight size={19} />
            </Link>

            <Link
              to="/community"
              className="inline-flex items-center justify-center rounded-xl border border-white/60 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10"
            >
              Join Our Community
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white px-5 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Link to="/home" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#DDF0FC] text-[#438FC4]">
              <HeartHandshake size={22} />
            </span>
            <span className="text-lg font-extrabold text-slate-900">
              Kindora<span className="text-[#67A9D7]">.</span>
            </span>
          </Link>

          <p className="text-center text-sm text-slate-500">
            Together, we can make a difference.
          </p>

          <div className="flex gap-5 text-sm font-medium text-slate-500">
            <Link to="/campaigns" className="hover:text-[#438FC4]">
              Campaigns
            </Link>
            <Link to="/community" className="hover:text-[#438FC4]">
              Community
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Kindora. All rights reserved.
        </p>
      </footer>
    </>
  );
};

export default AboutUs;
