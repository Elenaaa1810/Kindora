
import Header from "./header";
import { useEffect, useState } from "react";
import {
  Users,
  Heart,
  MessageCircle,
  Share2,
  CalendarDays,
  ArrowLeft,

  Trash2,
  Image as ImageIcon,
  Video,
  LoaderCircle,
  UserRound,
  Sparkles,
  MessageSquare,
} from "lucide-react";

const API_BASE = "http://127.0.0.1:8000/api";

function getToken() {
  return (
    localStorage.getItem("memberToken") ||
    sessionStorage.getItem("memberToken")
  );
}

async function apiRequest(url, options = {}) {
  const token = getToken();

  const headers = {
    Accept: "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Your session has expired. Please log in again.");
    }

    if (response.status === 403) {
      throw new Error(
        data.message || "You are not allowed to perform this action."
      );
    }

    throw new Error(
      data.message || "Something went wrong. Please try again."
    );
  }

  return data;
}

function formatDate(date) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getPosts(response) {
  return (
    response.data ||
    response.posts ||
    response.shared_posts ||
    []
  );
}

function getInitials(name) {
  if (!name) return "M";

  return name
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function PostCard({
  post,
  isShared,
  removing,
  onRemoveShare,
}) {
  const originalPost = post.post || post;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md">
      {/* SHARED LABEL */}
      {isShared && (
        <div className="flex items-center gap-2 border-b border-slate-100 bg-[#F7FAFD] px-5 py-3 text-xs font-semibold text-slate-500">
          <Share2 size={14} className="text-[#438FC4]" />
          You shared this post
          {post.shared_at && (
            <span className="ml-auto">
              {formatDate(post.shared_at)}
            </span>
          )}
        </div>
      )}

      {/* POST HEADER */}
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#DDF0FC] font-bold text-[#438FC4]">
            {originalPost.member?.name ? (
              getInitials(originalPost.member.name)
            ) : (
              <UserRound size={23} />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-[#24364B]">
              {originalPost.member?.name || "Community Member"}
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Community Member
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <CalendarDays size={14} />
                {formatDate(originalPost.created_at)}
              </span>

              {originalPost.status === "pending" && !isShared && (
                <span className="rounded-full bg-amber-50 px-2.5 py-1 font-semibold text-amber-600">
                  Pending Approval
                </span>
              )}

              {originalPost.status === "rejected" && !isShared && (
                <span className="rounded-full bg-rose-50 px-2.5 py-1 font-semibold text-rose-600">
                  Rejected
                </span>
              )}
            </div>
          </div>

          {/* REMOVE SHARE */}
          {isShared && (
            <button
              type="button"
              onClick={() => onRemoveShare(originalPost.id)}
              disabled={removing}
              title="Remove from your profile"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-rose-50 hover:text-rose-500 disabled:opacity-50"
            >
              {removing ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : (
                <Trash2 size={18} />
              )}
            </button>
          )}
        </div>

        {/* ACTIVITY */}
        {originalPost.activity && (
          <span className="mt-5 inline-flex rounded-full bg-[#EAF5FC] px-3 py-1.5 text-xs font-bold text-[#397EAD]">
            {originalPost.activity}
          </span>
        )}

        {/* DESCRIPTION */}
        <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
          {originalPost.description}
        </p>
      </div>

      {/* POST MEDIA */}
      {originalPost.media_url &&
        (originalPost.media_type === "video" ? (
          <video
            src={originalPost.media_url}
            controls
            preload="metadata"
            className="max-h-[480px] w-full bg-black"
          />
        ) : (
          <img
            src={originalPost.media_url}
            alt={`${originalPost.activity || "Community"} activity`}
            loading="lazy"
            className="max-h-[420px] w-full object-cover"
          />
        ))}

      {/* POST ENGAGEMENT */}
      <div className="px-5 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-3 text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <Heart size={16} className="text-[#69ACD9]" />
            {originalPost.likes_count || 0} likes
          </span>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MessageCircle size={15} />
              {originalPost.comments_count || 0}
            </span>

            <span className="flex items-center gap-1">
              <Share2 size={15} />
              {originalPost.shares_count || 0}
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-400">
          {originalPost.is_liked && (
            <span className="flex items-center gap-1 text-rose-400">
              <Heart size={14} fill="currentColor" />
              You liked this post
            </span>
          )}

          {!originalPost.is_liked && (
            <span className="flex items-center gap-1">
              <MessageSquare size={14} />
              Community post
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default function MyForum() {
  const [member, setMember] = useState(null);

  const [activeTab, setActiveTab] = useState("my-posts");

  const [myPosts, setMyPosts] = useState([]);
  const [sharedPosts, setSharedPosts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [removingPost, setRemovingPost] = useState(null);

  const isLoggedIn = Boolean(getToken());

  async function loadMyForum() {
    if (!getToken()) {
      setNotice("Please log in to view your personal forum.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setNotice("");

      const [profileResponse, myPostsResponse, sharedPostsResponse] =
        await Promise.all([
          apiRequest(`${API_BASE}/member/profile`),
          apiRequest(`${API_BASE}/community/my-posts`),
          apiRequest(`${API_BASE}/community/shared-posts`),
        ]);

      setMember(profileResponse.member || null);

      setMyPosts(getPosts(myPostsResponse));

      setSharedPosts(
        getPosts(sharedPostsResponse).map((item) => ({
          ...item,
          post: item.post || undefined,
        }))
      );
    } catch (error) {
      setNotice(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMyForum();
  }, []);

  // REMOVE A SHARED POST FROM THIS PROFILE
  async function removeShare(postId) {
    const confirmed = window.confirm(
      "Remove this shared post from your profile?"
    );

    if (!confirmed) return;

    try {
      setRemovingPost(postId);
      setNotice("");

      const data = await apiRequest(
        `${API_BASE}/community/posts/${postId}/share`,
        {
          method: "DELETE",
        }
      );

      setSharedPosts((previous) =>
        previous.filter((item) => {
          const originalPost = item.post || item;
          return originalPost.id !== postId;
        })
      );

      setNotice(data.message || "Shared post removed from your profile.");
    } catch (error) {
      setNotice(error.message);
    } finally {
      setRemovingPost(null);
    }
  }

  const displayedPosts =
    activeTab === "my-posts" ? myPosts : sharedPosts;

  const memberName = member?.name || "Kindora Member";

  if (!isLoggedIn) {
    return (
      <>
        <Header />

        <main className="min-h-screen bg-[#F7FAFD] px-5 py-20">
          <div className="mx-auto max-w-lg rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">
            <Users size={42} className="mx-auto text-[#8EC5E9]" />

            <h1 className="mt-4 text-2xl font-extrabold text-[#24364B]">
              Log In to View Your Forum
            </h1>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              Please log in to see your own posts and the posts you have shared.
            </p>

            <a
              href="/login"
              className="mt-6 inline-flex rounded-xl bg-[#8EC5E9] px-6 py-3 font-bold text-[#183B55] transition hover:bg-[#75B5E0]"
            >
              Log In
            </a>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F7FAFD]">
        {/* PROFILE HERO */}
        <section className="border-b border-[#DDF0FC] bg-[#EAF5FC] px-5 py-10 sm:py-14 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <a
              href="/community"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#397EAD] transition hover:gap-3"
            >
              <ArrowLeft size={17} />
              Back to Community
            </a>

          

          </div>
        </section>

        {/* MY FORUM CONTENT */}
        <section className="mx-auto max-w-5xl px-5 py-10 lg:px-8">
          <div className="mb-7">
            <p className="text-sm font-bold text-[#69ACD9]">
              MY FORUM
            </p>

            <h2 className="mt-2 text-2xl font-extrabold text-[#24364B] sm:text-3xl">
              Your Community Activity
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Keep track of the experiences you share and the stories you enjoy.
            </p>
          </div>

          {/* NOTICE */}
          {notice && (
            <div
              aria-live="polite"
              className="mb-6 flex items-start justify-between gap-3 rounded-xl border border-[#DDF0FC] bg-white p-4 text-sm leading-6 text-[#397EAD]"
            >
              <p>{notice}</p>

              <button
                onClick={() => setNotice("")}
                aria-label="Close notice"
                className="shrink-0 text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>
          )}

          {/* TABS */}
          <div className="mb-7 flex gap-2 rounded-2xl border border-slate-100 bg-white p-2 shadow-sm">
            <button
              onClick={() => setActiveTab("my-posts")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold transition ${
                activeTab === "my-posts"
                  ? "bg-[#DDF0FC] text-[#397EAD]"
                  : "text-slate-500 hover:bg-[#F7FAFD]"
              }`}
            >
              <Users size={17} />
              My Posts
              <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs">
                {myPosts.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("shared-posts")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold transition ${
                activeTab === "shared-posts"
                  ? "bg-[#DDF0FC] text-[#397EAD]"
                  : "text-slate-500 hover:bg-[#F7FAFD]"
              }`}
            >
              <Share2 size={17} />
              Shared Posts
              <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs">
                {sharedPosts.length}
              </span>
            </button>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-sm">
              <LoaderCircle
                size={30}
                className="mx-auto animate-spin text-[#69ACD9]"
              />

              <p className="mt-4 text-sm text-slate-500">
                Loading your forum...
              </p>
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && displayedPosts.length === 0 && (
            <div className="rounded-2xl border border-slate-100 bg-white px-6 py-14 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF5FC] text-[#69ACD9]">
                {activeTab === "my-posts" ? (
                  <ImageIcon size={29} />
                ) : (
                  <Share2 size={29} />
                )}
              </div>

              <h3 className="mt-5 text-lg font-bold text-[#24364B]">
                {activeTab === "my-posts"
                  ? "You haven't posted anything yet"
                  : "No shared posts yet"}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-500">
                {activeTab === "my-posts"
                  ? "Share your volunteering experiences with the community. Your posts will appear here after submission."
                  : "When you share posts from the Community Forum, they will appear here on your personal page."}
              </p>

              <a
                href="/community"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#8EC5E9] px-5 py-3 text-sm font-bold text-[#183B55] transition hover:bg-[#75B5E0]"
              >
                Visit Community Forum
                <ArrowLeft size={16} className="rotate-180" />
              </a>
            </div>
          )}

          {/* POST FEED */}
          {!loading && displayedPosts.length > 0 && (
            <div className="space-y-6">
              {displayedPosts.map((item) => {
                const post = item.post || item;

                return (
                  <PostCard
                    key={`${activeTab}-${post.id}`}
                    post={item}
                    isShared={activeTab === "shared-posts"}
                    removing={removingPost === post.id}
                    onRemoveShare={removeShare}
                  />
                );
              })}
            </div>
          )}

          {/* BOTTOM LINK */}
          <div className="mt-10 text-center">
            <a
              href="/community"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#438FC4] transition hover:gap-3"
            >
              <ArrowLeft size={16} />
              Return to Community Forum
            </a>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 bg-white px-5 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <span className="text-lg font-extrabold text-[#24364B]">
            Kindora<span className="text-[#69ACD9]">.</span>
          </span>

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
