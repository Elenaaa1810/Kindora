
import Header from "./header";
import { useEffect, useState } from "react";
import {
  HeartHandshake,
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
  Bookmark,
  X,
  MessageSquareReply,
} from "lucide-react";

const API_BASE = "http://127.0.0.1:8000/api";

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

function getToken() {
  return (
    localStorage.getItem("memberToken") ||
    sessionStorage.getItem("memberToken")
  );
}

// API REQUEST
// Authorization is optional because guests can view community posts.
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
      throw new Error("Please log in to use this feature.");
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

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPageUrl, setNextPageUrl] = useState(null);

  // MEMBER ACCOUNT STATUS
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [memberStatus, setMemberStatus] = useState(null);
  const [checkingMember, setCheckingMember] = useState(true);

  const canSharePost =
    isLoggedIn &&
    memberStatus?.toLowerCase() === "active";

  const [postText, setPostText] = useState("");
  const [postActivity, setPostActivity] = useState(
    "General Volunteering"
  );
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState("");
  const [notice, setNotice] = useState("");
  const [posting, setPosting] = useState(false);

  const [activeComments, setActiveComments] = useState([]);
  const [commentsByPost, setCommentsByPost] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [replyInputs, setReplyInputs] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [savingPost, setSavingPost] = useState(null);

  // CHECK MEMBER LOGIN AND APPROVAL STATUS
  async function checkMemberStatus() {
    const token = getToken();

    if (!token) {
      setIsLoggedIn(false);
      setMemberStatus(null);
      setCheckingMember(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/member/profile`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.member) {
        setIsLoggedIn(false);
        setMemberStatus(null);
        return;
      }

      setIsLoggedIn(true);
      setMemberStatus(data.member.status || null);
    } catch (error) {
      console.error("Could not check member status:", error);
      setIsLoggedIn(false);
      setMemberStatus(null);
    } finally {
      setCheckingMember(false);
    }
  }

  // LOAD COMMUNITY POSTS
  async function loadPosts() {
    try {
      setLoading(true);

      const data = await apiRequest(
        `${API_BASE}/community/posts`
      );

      setPosts(data.data || []);
      setNextPageUrl(data.next_page_url || null);
    } catch (error) {
      setNotice(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
    checkMemberStatus();
  }, []);

  // LOAD MORE POSTS
  async function loadMorePosts() {
    if (!nextPageUrl || loadingMore) return;

    try {
      setLoadingMore(true);

      const data = await apiRequest(nextPageUrl);

      setPosts((previous) => [
        ...previous,
        ...(data.data || []),
      ]);

      setNextPageUrl(data.next_page_url || null);
    } catch (error) {
      setNotice(error.message);
    } finally {
      setLoadingMore(false);
    }
  }

  // SELECT PHOTO OR VIDEO
  function handleMediaChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "video/mp4",
      "video/quicktime",
      "video/webm",
    ];

    if (!allowedTypes.includes(file.type)) {
      setNotice(
        "Please select a JPG, PNG, WEBP, MP4, MOV or WEBM file."
      );
      event.target.value = "";
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setNotice("Your media file must be smaller than 50 MB.");
      event.target.value = "";
      return;
    }

    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
    }

    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
    setNotice("");
  }

  function removeMedia() {
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
    }

    setMediaFile(null);
    setMediaPreview("");

    const input = document.getElementById("community-media");
    if (input) input.value = "";
  }

  // CREATE POST
  // Newly submitted posts are pending admin approval.
  async function createPost(event) {
    event.preventDefault();

    if (!canSharePost) {
      setNotice(
        "Only approved members can share community posts."
      );
      return;
    }

    if (!postText.trim()) {
      setNotice("Please write something before sharing your post.");
      return;
    }

    try {
      setPosting(true);
      setNotice("");

      const formData = new FormData();

      formData.append("description", postText.trim());
      formData.append("activity", postActivity);

      if (mediaFile) {
        formData.append("media", mediaFile);
      }

      const data = await apiRequest(
        `${API_BASE}/community/posts`,
        {
          method: "POST",
          body: formData,
        }
      );

      // Clear the form after successful submission.
      setPostText("");
      setPostActivity("General Volunteering");
      removeMedia();

      // Do not add the pending post to the public feed.
      // The post will appear only after admin approval.
      setNotice(
        data.message ||
          "Your post has been submitted and is waiting for admin approval."
      );
    } catch (error) {
      setNotice(error.message);
    } finally {
      setPosting(false);
    }
  }

  // LIKE OR UNLIKE
  async function toggleLike(postId) {
    try {
      const data = await apiRequest(
        `${API_BASE}/community/posts/${postId}/like`,
        { method: "POST" }
      );

      setPosts((previous) =>
        previous.map((post) =>
          post.id === postId
            ? {
                ...post,
                is_liked: data.is_liked,
                likes_count: data.likes_count,
              }
            : post
        )
      );
    } catch (error) {
      setNotice(error.message);
    }
  }

  // SAVE OR UNSAVE
  async function toggleSave(postId) {
    try {
      setSavingPost(postId);

      const data = await apiRequest(
        `${API_BASE}/community/posts/${postId}/save`,
        { method: "POST" }
      );

      setPosts((previous) =>
        previous.map((post) =>
          post.id === postId
            ? { ...post, is_saved: data.is_saved }
            : post
        )
      );

      setNotice(data.message);
    } catch (error) {
      setNotice(error.message);
    } finally {
      setSavingPost(null);
    }
  }

  // LOAD COMMENTS AND REPLIES
  async function toggleComments(postId) {
    const isOpen = activeComments.includes(postId);

    if (isOpen) {
      setActiveComments((previous) =>
        previous.filter((id) => id !== postId)
      );
      return;
    }

    setActiveComments((previous) => [...previous, postId]);

    if (commentsByPost[postId]) return;

    try {
      const data = await apiRequest(
        `${API_BASE}/community/posts/${postId}/comments`
      );

      setCommentsByPost((previous) => ({
        ...previous,
        [postId]: data.comments || [],
      }));
    } catch (error) {
      setNotice(error.message);
    }
  }

  // ADD COMMENT OR REPLY
  async function addComment(postId, parentCommentId = null) {
    const text = parentCommentId
      ? replyInputs[parentCommentId] || ""
      : commentInputs[postId] || "";

    if (!text.trim()) return;

    try {
      const data = await apiRequest(
        `${API_BASE}/community/posts/${postId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: text.trim(),
            parent_comment_id: parentCommentId,
          }),
        }
      );

      setCommentsByPost((previous) => {
        const currentComments = previous[postId] || [];

        if (parentCommentId) {
          return {
            ...previous,
            [postId]: currentComments.map((comment) =>
              comment.id === parentCommentId
                ? {
                    ...comment,
                    replies: [
                      ...(comment.replies || []),
                      data.comment,
                    ],
                  }
                : comment
            ),
          };
        }

        return {
          ...previous,
          [postId]: [
            ...currentComments,
            {
              ...data.comment,
              replies: [],
            },
          ],
        };
      });

      if (!parentCommentId) {
        setCommentInputs((previous) => ({
          ...previous,
          [postId]: "",
        }));

        setPosts((previous) =>
          previous.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  comments_count: (post.comments_count || 0) + 1,
                }
              : post
          )
        );
      } else {
        setReplyInputs((previous) => ({
          ...previous,
          [parentCommentId]: "",
        }));

        setReplyingTo(null);
      }
    } catch (error) {
      setNotice(error.message);
    }
  }

  // SHARE POST
  async function sharePost(post) {
    const text = `${post.activity}: ${post.description}`;

    try {
      await navigator.clipboard.writeText(text);
      setNotice("Post text copied to clipboard!");
    } catch {
      setNotice(text);
    }
  }

  return (
    <>
      <Header />

      <main>
        {/* COMMUNITY HERO */}
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

              <p className="mt-5 max-w-2xl font-['Inter'] text-base leading-8 text-slate-600 sm:text-lg">
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
          </div>
        </section>

        {/* COMMUNITY FEED */}
        <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div>
              <div className="mb-7">
                <p className="font-bold text-[#69ACD9]">
                  COMMUNITY STORIES
                </p>

                <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">
                  See What We're Doing
                </h2>

                <p className="mt-3 leading-7 text-slate-500">
                  Discover activities and stories shared by community members.
                </p>
              </div>

              {/* SHARE POST SECTION */}
              <div id="share-experience" className="mb-7">
                {checkingMember ? (
                  <div className="rounded-2xl border border-slate-100 bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
                    Checking your account...
                  </div>
                ) : !isLoggedIn ? (
                  <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-bold">
                      Want to share your experience?
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Log in to your Kindora account to share your volunteering
                      activities with the community.
                    </p>

                    <a
                      href="/login"
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#8EC5E9] px-5 py-3 font-bold text-[#183B55] transition hover:bg-[#75B5E0]"
                    >
                      Log In <ArrowRight size={17} />
                    </a>
                  </div>
                ) : !canSharePost ? (
                  <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF5FC] text-[#438FC4]">
                        <Users size={22} />
                      </div>

                      <div>
                        <h3 className="text-lg font-bold">
                          Account Approval Required
                        </h3>

                        <p className="mt-2 text-sm leading-7 text-slate-500">
                          {memberStatus?.toLowerCase() === "pending"
                            ? "Your membership is currently waiting for admin approval. You can browse community posts, but you can share your own posts after your account has been approved."
                            : memberStatus?.toLowerCase() === "suspended"
                            ? "Your account is currently suspended. You can browse community posts, but you cannot share posts at this time. Please contact the administrator for assistance."
                            : "Your account is not currently approved for posting. Please contact the administrator for more information."}
                        </p>

                        <span className="mt-3 inline-flex rounded-full bg-[#EAF5FC] px-3 py-1.5 text-xs font-bold capitalize text-[#397EAD]">
                          Status: {memberStatus || "Unknown"}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form
                    onSubmit={createPost}
                    className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6"
                  >
                    <h3 className="text-lg font-bold">
                      Share your experience
                    </h3>

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
                      maxLength={5000}
                      className="mt-4 w-full resize-y rounded-xl border border-slate-200 bg-[#F7FAFD] p-4 text-sm outline-none transition focus:border-[#8EC5E9] focus:ring-2 focus:ring-[#DDF0FC]"
                    />

                    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <select
                        value={postActivity}
                        onChange={(event) =>
                          setPostActivity(event.target.value)
                        }
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
                        type="submit"
                        disabled={posting}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8EC5E9] px-5 py-3 font-bold text-[#183B55] transition hover:bg-[#75B5E0] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Send size={17} />
                        {posting ? "Submitting..." : "Submit Post"}
                      </button>
                    </div>

                    {/* MEDIA UPLOAD */}
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <label
                        htmlFor="community-media"
                        className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-[#F7FAFD]"
                      >
                        <ImagePlus size={18} className="text-[#438FC4]" />
                        Add Photo or Video
                      </label>

                      <input
                        id="community-media"
                        type="file"
                        accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"
                        onChange={handleMediaChange}
                        className="hidden"
                      />

                      {mediaFile && (
                        <span className="max-w-[200px] truncate text-xs text-slate-500">
                          {mediaFile.name}
                        </span>
                      )}
                    </div>

                    {/* MEDIA PREVIEW */}
                    {mediaPreview && (
                      <div className="relative mt-4 overflow-hidden rounded-xl border border-slate-100 bg-[#F7FAFD]">
                        <button
                          type="button"
                          onClick={removeMedia}
                          aria-label="Remove selected media"
                          className="absolute right-3 top-3 z-10 rounded-full bg-white p-2 text-slate-600 shadow-md hover:text-rose-500"
                        >
                          <X size={17} />
                        </button>

                        {mediaFile?.type.startsWith("image/") ? (
                          <img
                            src={mediaPreview}
                            alt="Selected preview"
                            className="max-h-80 w-full object-contain"
                          />
                        ) : (
                          <video
                            src={mediaPreview}
                            controls
                            className="max-h-80 w-full"
                          />
                        )}
                      </div>
                    )}

                    {/* SUBMISSION NOTICE */}
                    {notice && (
                      <div
                        aria-live="polite"
                        className="mt-4 flex items-start gap-2 rounded-xl border border-[#DDF0FC] bg-[#EAF5FC] p-3 text-sm leading-6 text-[#397EAD]"
                      >
                        <MessageCircle size={18} className="mt-1 shrink-0" />
                        <p className="break-words">{notice}</p>
                      </div>
                    )}

                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                      <ImagePlus size={16} />
                      You can share text only, a photo, or a video with your post.
                    </div>

                    <p className="mt-2 text-xs text-slate-400">
                      Your post will be visible to the community after admin approval.
                    </p>
                  </form>
                )}
              </div>

              {/* POSTS */}
              <div className="space-y-6">
                {loading && (
                  <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center text-sm text-slate-500">
                    Loading community posts...
                  </div>
                )}

                {!loading && posts.length === 0 && (
                  <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center">
                    <MessageCircle
                      size={32}
                      className="mx-auto text-[#8EC5E9]"
                    />
                    <h3 className="mt-3 font-bold">
                      No community posts yet
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Be the first to share your volunteering experience!
                    </p>
                  </div>
                )}

                {posts.map((post) => {
                  const showComments = activeComments.includes(post.id);
                  const comments = commentsByPost[post.id] || [];

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
                            <h3 className="font-bold">
                              {post.member?.name || "Community Member"}
                            </h3>

                            <p className="mt-0.5 text-sm text-slate-500">
                              Community Member
                            </p>

                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-400">
                              <span className="flex items-center gap-1">
                                <MapPin size={14} />
                                Myanmar
                              </span>

                              <span className="flex items-center gap-1">
                                <CalendarDays size={14} />
                                {formatDate(post.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <span className="mt-5 inline-block rounded-full bg-[#EAF5FC] px-3 py-1.5 text-xs font-bold text-[#397EAD]">
                          {post.activity}
                        </span>

                        <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
                          {post.description}
                        </p>
                      </div>

                      {/* POST PHOTO OR VIDEO */}
                      {post.media_url &&
                        (post.media_type === "video" ? (
                          <video
                            src={post.media_url}
                            controls
                            preload="metadata"
                            className="max-h-[480px] w-full bg-black"
                          />
                        ) : (
                          <img
                            src={post.media_url}
                            alt={`${post.activity} activity`}
                            loading="lazy"
                            className="max-h-[420px] w-full object-cover"
                          />
                        ))}

                      <div className="p-5 sm:px-6">
                        <div className="flex items-center justify-between text-sm text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <Heart
                              size={16}
                              className="text-[#69ACD9]"
                            />
                            {post.likes_count || 0} likes
                          </span>

                          <button
                            onClick={() => toggleComments(post.id)}
                            className="hover:text-[#438FC4]"
                          >
                            {post.comments_count || 0} comments
                          </button>
                        </div>

                        {/* POST ACTIONS */}
                        <div className="mt-4 grid grid-cols-4 border-t border-slate-100 pt-3">
                          <button
                            onClick={() => toggleLike(post.id)}
                            className={`flex items-center justify-center gap-1 rounded-lg py-3 text-sm font-semibold transition hover:bg-[#F7FAFD] ${
                              post.is_liked
                                ? "text-rose-500"
                                : "text-slate-500"
                            }`}
                          >
                            <Heart
                              size={18}
                              fill={
                                post.is_liked
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                            <span className="hidden sm:inline">Like</span>
                          </button>

                          <button
                            onClick={() => toggleComments(post.id)}
                            className="flex items-center justify-center gap-1 rounded-lg py-3 text-sm font-semibold text-slate-500 transition hover:bg-[#F7FAFD]"
                          >
                            <MessageCircle size={18} />
                            <span className="hidden sm:inline">Comment</span>
                          </button>

                          <button
                            onClick={() => toggleSave(post.id)}
                            disabled={savingPost === post.id}
                            className={`flex items-center justify-center gap-1 rounded-lg py-3 text-sm font-semibold transition hover:bg-[#F7FAFD] ${
                              post.is_saved
                                ? "text-[#438FC4]"
                                : "text-slate-500"
                            }`}
                          >
                            <Bookmark
                              size={18}
                              fill={
                                post.is_saved
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                            <span className="hidden sm:inline">Save</span>
                          </button>

                          <button
                            onClick={() => sharePost(post)}
                            className="flex items-center justify-center gap-1 rounded-lg py-3 text-sm font-semibold text-slate-500 transition hover:bg-[#F7FAFD]"
                          >
                            <Share2 size={18} />
                            <span className="hidden sm:inline">Share</span>
                          </button>
                        </div>

                        {/* COMMENTS */}
                        {showComments && (
                          <div className="mt-3 border-t border-slate-100 pt-4">
                            <div className="space-y-4">
                              {comments.map((comment) => (
                                <div
                                  key={comment.id}
                                  className="rounded-xl bg-[#F7FAFD] p-3"
                                >
                                  <p className="text-sm font-bold">
                                    {comment.member?.name || "Member"}
                                  </p>

                                  <p className="mt-1 break-words text-sm text-slate-600">
                                    {comment.content}
                                  </p>

                                  <button
                                    onClick={() =>
                                      setReplyingTo(
                                        replyingTo === comment.id
                                          ? null
                                          : comment.id
                                      )
                                    }
                                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#438FC4] hover:underline"
                                  >
                                    <MessageSquareReply size={14} />
                                    Reply
                                  </button>

                                  {/* REPLY INPUT */}
                                  {replyingTo === comment.id && (
                                    <form
                                      className="mt-3 flex gap-2"
                                      onSubmit={(event) => {
                                        event.preventDefault();
                                        addComment(post.id, comment.id);
                                      }}
                                    >
                                      <input
                                        value={replyInputs[comment.id] || ""}
                                        onChange={(event) =>
                                          setReplyInputs((previous) => ({
                                            ...previous,
                                            [comment.id]: event.target.value,
                                          }))
                                        }
                                        placeholder="Write a reply..."
                                        className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#8EC5E9]"
                                      />

                                      <button
                                        type="submit"
                                        aria-label="Send reply"
                                        className="rounded-xl bg-[#8EC5E9] px-3 text-[#183B55]"
                                      >
                                        <Send size={16} />
                                      </button>
                                    </form>
                                  )}

                                  {/* REPLIES */}
                                  {comment.replies?.length > 0 && (
                                    <div className="ml-4 mt-3 space-y-3 border-l-2 border-[#DDF0FC] pl-3">
                                      {comment.replies.map((reply) => (
                                        <div key={reply.id}>
                                          <p className="text-xs font-bold">
                                            {reply.member?.name || "Member"}
                                          </p>

                                          <p className="mt-1 break-words text-sm text-slate-600">
                                            {reply.content}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}

                              {comments.length === 0 && (
                                <p className="text-sm text-slate-400">
                                  No comments yet. Start the conversation!
                                </p>
                              )}
                            </div>

                            {/* ADD COMMENT */}
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

                {/* LOAD MORE */}
                {nextPageUrl && (
                  <button
                    onClick={loadMorePosts}
                    disabled={loadingMore}
                    className="w-full rounded-xl border border-[#DDF0FC] bg-white py-3 font-bold text-[#397EAD] transition hover:bg-[#EAF5FC] disabled:opacity-60"
                  >
                    {loadingMore ? "Loading..." : "Load More Posts"}
                  </button>
                )}
              </div>
            </div>

            {/* SIDEBAR */}
            <aside className="space-y-6 lg:sticky lg:top-28">
              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-bold">
                  Upcoming Activities
                </h3>

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

      {/* FOOTER */}
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
