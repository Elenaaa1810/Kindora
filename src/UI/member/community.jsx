
import Header from "./header";
import { useState } from "react";
import { Link } from 'react-router-dom';
import {
  HeartHandshake,
  Menu,
  X,
  Heart,
  MessageCircle,
  Share2,
  MapPin,
  CalendarDays,
  Users,
  ArrowRight,
  ImagePlus,
  Send,
  Sparkles,
  Clock,
} from "lucide-react";

const initialPosts = [
  {
    id: 1,
    name: "Emily Carter",
    role: "Community Volunteer",
    location: "Yangon, Myanmar",
    date: "October 12, 2026",
    activity: "Neighborhood Cleanup",
    description:
      "We spent the morning cleaning our neighborhood park together. It was wonderful to see everyone working as a team to make our community cleaner and more beautiful!",
    image:
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1000&q=80",
    likes: 28,
    comments: [
      { name: "Sarah", text: "Amazing work, everyone!" },
      { name: "David", text: "I'd love to join next time!" },
    ],
  },
  {
    id: 2,
    name: "James Wilson",
    role: "Environmental Volunteer",
    location: "Mandalay, Myanmar",
    date: "October 10, 2026",
    activity: "Community Tree Planting",
    description:
      "Another meaningful day planting trees with local volunteers. Small actions today can help create a greener future for the next generation.",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1000&q=80",
    likes: 42,
    comments: [
      { name: "Emily", text: "Such a great initiative!" },
    ],
  },
  {
    id: 3,
    name: "Sophia Miller",
    role: "Education Volunteer",
    location: "Mandalay, Myanmar",
    date: "October 8, 2026",
    activity: "Reading for Children",
    description:
      "Today we shared stories, read books, and learned together with some wonderful children. Thank you to everyone who gave their time and energy!",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1000&q=80",
    likes: 35,
    comments: [],
  },
];

const suggestedActivities = [
  {
    title: "Community Tree Planting",
    date: "October 18, 2026",
    location: "Yangon, Myanmar",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=500&q=80",
  },
  {
    title: "Orphanage Donation Drive",
    date: "October 22, 2026",
    location: "Mandalay, Myanmar",
    image:
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=500&q=80",
  },
];

export default function Community() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [posts, setPosts] = useState(initialPosts);
  const [likedPosts, setLikedPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [activeComments, setActiveComments] = useState([]);
  const [postText, setPostText] = useState("");
  const [postActivity, setPostActivity] = useState("General Volunteering");
  const [notice, setNotice] = useState("");

  function toggleLike(postId) {
    const alreadyLiked = likedPosts.includes(postId);

    setLikedPosts((previous) =>
      alreadyLiked
        ? previous.filter((id) => id !== postId)
        : [...previous, postId]
    );

    setPosts((previous) =>
      previous.map((post) =>
        post.id === postId
          ? { ...post, likes: post.likes + (alreadyLiked ? -1 : 1) }
          : post
      )
    );
  }

  function addComment(postId) {
    const text = (commentInputs[postId] || "").trim();
    if (!text) return;

    setPosts((previous) =>
      previous.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                { name: "You", text },
              ],
            }
          : post
      )
    );

    setCommentInputs((previous) => ({ ...previous, [postId]: "" }));
  }

  function createPost() {
    if (!postText.trim()) {
      setNotice("Please write something before sharing your post.");
      return;
    }

    const newPost = {
      id: Date.now(),
      name: "You",
      role: "Community Member",
      location: "Myanmar",
      date: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      activity: postActivity,
      description: postText.trim(),
      image: "",
      likes: 0,
      comments: [],
    };

    setPosts((previous) => [newPost, ...previous]);
    setPostText("");
    setNotice("Your post has been shared!");
  }

  function sharePost(post) {
    const text = `${post.activity}: ${post.description}`;

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(text)
        .then(() => setNotice("Post text copied to clipboard!"))
        .catch(() => setNotice(text));
    } else {
      setNotice(text);
    }
  }

  return (
    <>
    <Header />

      <main>
        {/* Community Hero */}
        <section className="bg-[#EAF5FC] px-5 py-14 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#438FC4] shadow-sm">
                <Sparkles size={16} />
                Every act of kindness matters
              </div>

              <h1 className="mt-6 font-['Poppins'] text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                A Community That
                <span className="block text-[#69ACD9]">
                  Inspires Change.
                </span>
              </h1>

              <p className="mt-5 font-['Inter'] max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                Connect with volunteers, celebrate meaningful experiences,
                share your activities, and inspire others to make a difference.
              </p>

              <a
                href="#share-experience"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#8EC5E9] px-6 py-4 font-bold text-[#183B55] transition hover:bg-[#75B5E0]"
              >
                Share Your Experience <ArrowRight size={19} />
              </a>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { value: "2,450+", label: "Community Members", icon: Users },
                { value: "128+", label: "Campaigns Completed", icon: HeartHandshake },
                { value: "8,640+", label: "Volunteer Hours", icon: Clock },
              ].map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.label}
                    className="flex items-center gap-4 rounded-2xl border border-white bg-white/80 p-5"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#DDF0FC] text-[#438FC4]">
                      <Icon size={24} />
                    </span>
                    <div>
                      <p className="text-2xl font-extrabold">{stat.value}</p>
                      <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-2 text-right text-xs text-slate-400">
              Sample statistics for demonstration
            </p>
          </div>
        </section>

        {/* Community Feed */}
        <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div>
              <div className="mb-7">
                <p className="font-bold text-[#69ACD9]">COMMUNITY STORIES</p>
                <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">
                  See What We're Doing
                </h2>
                <p className="mt-3 leading-7 text-slate-500">
                  Discover activities and stories shared by community members.
                </p>
              </div>

              {/* Create Post */}
              <div
                id="share-experience"
                className="mb-7 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6"
              >
                <h3 className="text-lg font-bold">Share your experience</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Tell the community about your volunteering activities.
                </p>

                <textarea
                  value={postText}
                  onChange={(event) => {
                    setPostText(event.target.value);
                    setNotice("");
                  }}
                  placeholder="What good things have you done recently?"
                  rows={4}
                  className="mt-4 w-full resize-y rounded-xl border border-slate-200 bg-[#F7FAFD] p-4 text-sm outline-none transition focus:border-[#8EC5E9] focus:ring-2 focus:ring-[#DDF0FC]"
                />

                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <select
                    value={postActivity}
                    onChange={(event) => setPostActivity(event.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#8EC5E9]"
                    aria-label="Select activity"
                  >
                    <option>General Volunteering</option>
                    <option>Environment</option>
                    <option>Charity</option>
                    <option>Education</option>
                    <option>Community</option>
                  </select>

                  <button
                    onClick={createPost}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8EC5E9] px-5 py-3 font-bold text-[#183B55] transition hover:bg-[#75B5E0]"
                  >
                    <Send size={17} />
                    Share Post
                  </button>
                </div>

                {notice && (
                  <p
                    aria-live="polite"
                    className="mt-3 break-words text-sm text-[#397EAD]"
                  >
                    {notice}
                  </p>
                )}

                <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                  <ImagePlus size={16} />
                  Text posts only in this demo. Photo uploads can be added later.
                </div>
              </div>

              {/* Posts */}
              <div className="space-y-6">
                {posts.map((post) => {
                  const isLiked = likedPosts.includes(post.id);
                  const showComments = activeComments.includes(post.id);

                  return (
                    <article
                      key={post.id}
                      className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
                    >
                      <div className="p-5 sm:p-6">
                        <div className="flex items-start gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#DDF0FC] text-[#438FC4]">
                            <Users size={23} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold">{post.name}</h3>
                            <p className="mt-0.5 text-sm text-slate-500">
                              {post.role}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-400">
                              <span className="flex items-center gap-1">
                                <MapPin size={14} />
                                {post.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <CalendarDays size={14} />
                                {post.date}
                              </span>
                            </div>
                          </div>
                        </div>

                        <span className="mt-5 inline-block rounded-full bg-[#EAF5FC] px-3 py-1.5 text-xs font-bold text-[#397EAD]">
                          {post.activity}
                        </span>

                        <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                          {post.description}
                        </p>
                      </div>

                      {post.image && (
                        <img
                          src={post.image}
                          alt={`${post.activity} volunteer activity`}
                          loading="lazy"
                          className="max-h-[420px] w-full object-cover"
                        />
                      )}

                      <div className="p-5 sm:px-6">
                        <div className="flex items-center justify-between text-sm text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <Heart size={16} className="text-[#69ACD9]" />
                            {post.likes} likes
                          </span>
                          <button
                            onClick={() =>
                              setActiveComments((previous) =>
                                showComments
                                  ? previous.filter((id) => id !== post.id)
                                  : [...previous, post.id]
                              )
                            }
                            className="hover:text-[#438FC4]"
                          >
                            {post.comments.length} comments
                          </button>
                        </div>

                        <div className="mt-4 grid grid-cols-3 border-t border-slate-100 pt-3">
                          <button
                            onClick={() => toggleLike(post.id)}
                            className={`flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold transition hover:bg-[#F7FAFD] ${
                              isLiked ? "text-rose-500" : "text-slate-500"
                            }`}
                          >
                            <Heart
                              size={18}
                              fill={isLiked ? "currentColor" : "none"}
                            />
                            Like
                          </button>

                          <button
                            onClick={() =>
                              setActiveComments((previous) =>
                                showComments
                                  ? previous.filter((id) => id !== post.id)
                                  : [...previous, post.id]
                              )
                            }
                            className="flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold text-slate-500 transition hover:bg-[#F7FAFD]"
                          >
                            <MessageCircle size={18} />
                            Comment
                          </button>

                          <button
                            onClick={() => sharePost(post)}
                            className="flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold text-slate-500 transition hover:bg-[#F7FAFD]"
                          >
                            <Share2 size={18} />
                            Share
                          </button>
                        </div>

                        {showComments && (
                          <div className="mt-3 border-t border-slate-100 pt-4">
                            <div className="space-y-3">
                              {post.comments.map((comment, index) => (
                                <div
                                  key={`${post.id}-${index}`}
                                  className="rounded-xl bg-[#F7FAFD] p-3"
                                >
                                  <p className="text-sm font-bold">
                                    {comment.name}
                                  </p>
                                  <p className="mt-1 break-words text-sm text-slate-600">
                                    {comment.text}
                                  </p>
                                </div>
                              ))}
                              {post.comments.length === 0 && (
                                <p className="text-sm text-slate-400">
                                  No comments yet. Start the conversation!
                                </p>
                              )}
                            </div>

                            <form
                              className="mt-4 flex gap-2"
                              onSubmit={(event) => {
                                event.preventDefault();
                                addComment(post.id);
                              }}
                            >
                              <input
                                value={commentInputs[post.id] || ""}
                                onChange={(event) =>
                                  setCommentInputs((previous) => ({
                                    ...previous,
                                    [post.id]: event.target.value,
                                  }))
                                }
                                placeholder="Write a comment..."
                                className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#8EC5E9]"
                              />
                              <button
                                type="submit"
                                aria-label="Send comment"
                                className="flex items-center justify-center rounded-xl bg-[#8EC5E9] px-4 text-[#183B55] transition hover:bg-[#75B5E0]"
                              >
                                <Send size={18} />
                              </button>
                            </form>
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6 lg:sticky lg:top-28">
              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-bold">Upcoming Activities</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Find your next opportunity to help.
                </p>

                <div className="mt-5 space-y-5">
                  {suggestedActivities.map((activity) => (
                    <div key={activity.title} className="flex gap-3">
                      <img
                        src={activity.image}
                        alt={activity.title}
                        loading="lazy"
                        className="h-20 w-20 shrink-0 rounded-xl object-cover"
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold leading-5">
                          {activity.title}
                        </h4>
                        <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                          <CalendarDays size={14} />
                          {activity.date}
                        </p>
                        <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                          <MapPin size={14} />
                          {activity.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <a
                  href="/campaigns"
                  className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-[#EAF5FC] py-3 font-bold text-[#397EAD] transition hover:bg-[#DDF0FC]"
                >
                  View Campaigns <ArrowRight size={17} />
                </a>
              </div>

              <div className="rounded-2xl bg-[#DDF3E4] p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-green-700">
                  <HeartHandshake size={25} />
                </span>
                <h3 className="mt-4 text-xl font-extrabold">
                  Every Helping Hand Matters
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Your time, kindness, and ideas can inspire others and make
                  your community stronger.
                </p>
                <a
                  href="/campaigns"
                  className="mt-4 inline-flex items-center gap-2 font-bold text-green-800 hover:gap-3"
                >
                  Get Involved <ArrowRight size={17} />
                </a>
              </div>
            </aside>
          </div>
        </section>
      </main>

      {/* Shared Footer */}
      <footer className="border-t border-slate-100 bg-white px-5 py-10 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
          <a href="/#home" className="flex items-center gap-2">
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
