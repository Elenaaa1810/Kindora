
import { useEffect, useState } from "react";
import {
    MessageSquare,
    Heart,
    CalendarDays,
    CheckCircle,
    XCircle,
    Clock,
    Image as ImageIcon,
    Video,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000/api";

const tabs = [
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
];

function CommunityPostManagement() {
    const [posts, setPosts] = useState([]);
    const [activeTab, setActiveTab] = useState("pending");
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        nextPageUrl: null,
        previousPageUrl: null,
    });

    const getHeaders = () => {
        const token = localStorage.getItem("adminToken");

        return {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        };
    };

    // ========================================
    // LOAD COMMUNITY POSTS
    // ========================================

    const loadPosts = async (url = null) => {
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const requestUrl =
                url || `${API_URL}/admin/community-posts?status=${activeTab}`;

            const response = await fetch(requestUrl, {
                method: "GET",
                headers: getHeaders(),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Unable to load community posts."
                );
            }

            const postList = Array.isArray(result.data)
                ? result.data
                : Array.isArray(result)
                    ? result
                    : [];

            setPosts(postList);

            setPagination({
                currentPage: result.current_page || 1,
                lastPage: result.last_page || 1,
                nextPageUrl: result.next_page_url || null,
                previousPageUrl: result.prev_page_url || null,
            });
        } catch (err) {
            setError(err.message || "Something went wrong.");
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPosts();
    }, [activeTab]);

    // ========================================
    // APPROVE OR REJECT POST
    // ========================================

    const updatePostStatus = async (postId, status) => {
        const action = status === "approved" ? "approve" : "reject";

        const confirmed = window.confirm(
            `Are you sure you want to ${action} this post?`
        );

        if (!confirmed) return;

        setProcessingId(postId);
        setError("");
        setSuccess("");

        try {
            const response = await fetch(
                `${API_URL}/admin/community-posts/${postId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        ...getHeaders(),
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || `Unable to ${action} this post.`
                );
            }

            setSuccess(
                status === "approved"
                    ? "Post approved successfully."
                    : "Post rejected successfully."
            );

            // Reload the current tab.
            await loadPosts();
        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setProcessingId(null);
        }
    };

    // ========================================
    // MEDIA URL
    // ========================================

    const getMediaUrl = (post) => {
        if (post.media_url) {
            return post.media_url;
        }

        if (!post.media_path) {
            return null;
        }

        if (post.media_path.startsWith("http")) {
            return post.media_path;
        }

        const path = post.media_path.replace(/^\/+/, "");

        if (path.startsWith("storage/")) {
            return `http://127.0.0.1:8000/${path}`;
        }

        return `http://127.0.0.1:8000/storage/${path}`;
    };

    // ========================================
    // DATE FORMAT
    // ========================================

    const formatDate = (date) => {
        if (!date) return "Unknown date";

        return new Date(date).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    // ========================================
    // STATUS STYLE
    // ========================================

    const getStatusStyle = (status) => {
        switch (status) {
            case "approved":
                return "bg-green-50 text-green-700";

            case "rejected":
                return "bg-red-50 text-red-700";

            default:
                return "bg-amber-50 text-amber-700";
        }
    };

    return (
        <div className="space-y-6">

            {/* PAGE HEADER */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[#24364B]">
                        Community Posts
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Review and manage posts submitted by community members.
                    </p>
                </div>

                <button
                    onClick={() => loadPosts()}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#DCEAF5] bg-white px-4 py-2.5 text-sm font-medium text-[#438FC4] transition hover:bg-[#F4F9FD] disabled:opacity-50"
                >
                    <RefreshCw
                        size={16}
                        className={loading ? "animate-spin" : ""}
                    />
                    Refresh
                </button>
            </div>

            {/* STATUS TABS */}
            <div className="flex flex-wrap gap-2 rounded-2xl border border-[#E4EFF7] bg-white p-2 shadow-sm">
                {tabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setActiveTab(tab.value)}
                        className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                            activeTab === tab.value
                                ? "bg-[#438FC4] text-white shadow-sm"
                                : "text-gray-500 hover:bg-[#F2F8FC] hover:text-[#438FC4]"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* SUCCESS MESSAGE */}
            {success && (
                <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                    <CheckCircle size={18} />
                    {success}
                </div>
            )}

            {/* ERROR MESSAGE */}
            {error && (
                <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <XCircle size={18} />
                    {error}
                </div>
            )}

            {/* POST LIST */}
            {loading ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-[#E4EFF7] bg-white py-16">
                    <RefreshCw
                        size={28}
                        className="animate-spin text-[#438FC4]"
                    />
                    <p className="mt-3 text-sm text-gray-500">
                        Loading community posts...
                    </p>
                </div>
            ) : posts.length === 0 ? (
                <div className="rounded-2xl border border-[#E4EFF7] bg-white px-6 py-16 text-center shadow-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF5FC]">
                        <MessageSquare
                            size={25}
                            className="text-[#438FC4]"
                        />
                    </div>

                    <h3 className="mt-4 font-semibold text-[#24364B]">
                        No {activeTab} posts
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                        There are currently no posts in this section.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {posts.map((post) => {
                        const mediaUrl = getMediaUrl(post);
                        const isProcessing = processingId === post.id;

                        return (
                            <div
                                key={post.id}
                                className="overflow-hidden rounded-2xl border border-[#E4EFF7] bg-white shadow-sm transition hover:shadow-md"
                            >
                                <div className="p-5 sm:p-6">

                                    {/* MEMBER AND STATUS */}
                                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#DDF0FC] font-bold text-[#438FC4]">
                                                {(
                                                    post.member_name ||
                                                    post.member?.name ||
                                                    "M"
                                                )
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>

                                            <div>
                                                <h3 className="font-semibold text-[#24364B]">
                                                    {post.member_name ||
                                                        post.member?.name ||
                                                        "Unknown Member"}
                                                </h3>

                                                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-400">
                                                    <span className="flex items-center gap-1">
                                                        <CalendarDays size={13} />
                                                        {formatDate(post.created_at)}
                                                    </span>

                                                    {post.activity && (
                                                        <>
                                                            <span>•</span>
                                                            <span>{post.activity}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <span
                                            className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(
                                                post.status
                                            )}`}
                                        >
                                            {post.status === "approved" ? (
                                                <CheckCircle size={13} />
                                            ) : post.status === "rejected" ? (
                                                <XCircle size={13} />
                                            ) : (
                                                <Clock size={13} />
                                            )}

                                            {post.status || "pending"}
                                        </span>
                                    </div>

                                    {/* POST DESCRIPTION */}
                                    <div className="mt-5">
                                        <p className="whitespace-pre-wrap text-sm leading-7 text-gray-600">
                                            {post.description}
                                        </p>
                                    </div>

                                    {/* POST MEDIA */}
                                    {mediaUrl && (
                                        <div className="mt-4 overflow-hidden rounded-xl border border-[#E4EFF7] bg-[#F7FAFD]">
                                            {post.media_type === "video" ? (
                                                <div>
                                                    <div className="flex items-center gap-2 border-b border-[#E4EFF7] px-3 py-2 text-xs font-medium text-gray-500">
                                                        <Video size={15} />
                                                        Video attachment
                                                    </div>

                                                    <video
                                                        src={mediaUrl}
                                                        controls
                                                        className="max-h-[420px] w-full bg-black object-contain"
                                                    />
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className="flex items-center gap-2 border-b border-[#E4EFF7] px-3 py-2 text-xs font-medium text-gray-500">
                                                        <ImageIcon size={15} />
                                                        Image attachment
                                                    </div>

                                                    <img
                                                        src={mediaUrl}
                                                        alt="Community post"
                                                        className="max-h-[420px] w-full object-contain"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* POST INFORMATION */}
                                    <div className="mt-4 flex flex-wrap items-center gap-5 border-t border-[#EEF3F7] pt-4 text-xs text-gray-400">
                                        <span className="flex items-center gap-1.5">
                                            <Heart size={15} />
                                            {post.likes_count ?? 0} Likes
                                        </span>

                                        <span className="flex items-center gap-1.5">
                                            <MessageSquare size={15} />
                                            {post.comments_count ?? 0} Comments
                                        </span>
                                    </div>

                                    {/* APPROVE / REJECT ACTIONS */}
                                    {activeTab === "pending" && (
                                        <div className="mt-5 flex flex-col gap-3 border-t border-[#EEF3F7] pt-4 sm:flex-row sm:justify-end">
                                            <button
                                                onClick={() =>
                                                    updatePostStatus(
                                                        post.id,
                                                        "rejected"
                                                    )
                                                }
                                                disabled={isProcessing}
                                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <XCircle size={16} />
                                                Reject
                                            </button>

                                            <button
                                                onClick={() =>
                                                    updatePostStatus(
                                                        post.id,
                                                        "approved"
                                                    )
                                                }
                                                disabled={isProcessing}
                                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#438FC4] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#347EAF] disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {isProcessing ? (
                                                    <>
                                                        <RefreshCw
                                                            size={16}
                                                            className="animate-spin"
                                                        />
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle size={16} />
                                                        Approve Post
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* PAGINATION */}
            {!loading && posts.length > 0 && (
                <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-[#E4EFF7] bg-white px-5 py-4 sm:flex-row">
                    <p className="text-sm text-gray-500">
                        Page {pagination.currentPage} of {pagination.lastPage}
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() =>
                                loadPosts(pagination.previousPageUrl)
                            }
                            disabled={!pagination.previousPageUrl || loading}
                            className="inline-flex items-center gap-1 rounded-lg border border-[#DCEAF5] px-3 py-2 text-sm font-medium text-[#438FC4] transition hover:bg-[#F4F9FD] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronLeft size={16} />
                            Previous
                        </button>

                        <button
                            onClick={() =>
                                loadPosts(pagination.nextPageUrl)
                            }
                            disabled={!pagination.nextPageUrl || loading}
                            className="inline-flex items-center gap-1 rounded-lg border border-[#DCEAF5] px-3 py-2 text-sm font-medium text-[#438FC4] transition hover:bg-[#F4F9FD] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CommunityPostManagement;
