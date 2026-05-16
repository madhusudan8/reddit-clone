"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Image as ImageIcon,
  Link2,
  ChevronDown,
  X,
  Send,
  Loader2,
} from "lucide-react";
import { useCommunitiesList, useCreatePostMutation } from "@/hooks/useApi";

const tabs = [
  { id: "text", label: "Text", icon: FileText },
  { id: "image", label: "Image", icon: ImageIcon },
  { id: "link", label: "Link", icon: Link2 },
] as const;

type TabType = (typeof tabs)[number]["id"];

export default function CreatePostForm() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("text");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState<any>(null);
  const [showCommunityDropdown, setShowCommunityDropdown] = useState(false);

  const { data: communities = [], isLoading: isLoadingCommunities } = useCommunitiesList();
  const createPostMutation = useCreatePostMutation();

  const handleSubmit = () => {
    if (!title.trim() || !selectedCommunity) return;

    let postType: "TEXT" | "IMAGE" | "LINK" = "TEXT";
    if (activeTab === "image") postType = "IMAGE";
    if (activeTab === "link") postType = "LINK";

    createPostMutation.mutate(
      {
        title,
        content: activeTab === "text" ? content : undefined,
        imageUrl: activeTab === "image" ? linkUrl : undefined, // Assuming image tab just takes a URL for now
        linkUrl: activeTab === "link" ? linkUrl : undefined,
        type: postType,
        communityId: selectedCommunity.id,
      },
      {
        onSuccess: (newPost) => {
          router.push(`/r/${newPost.community.name}/comments/${newPost.id}`);
        },
      }
    );
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-zinc-50">
        Create a Post
      </h1>

      {/* Community Selector */}
      <div className="relative mb-4">
        <button
          onClick={() => setShowCommunityDropdown(!showCommunityDropdown)}
          className="flex w-full items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-colors hover:border-gray-300 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600"
          id="community-selector"
        >
          {selectedCommunity ? (
            <>
              {selectedCommunity.avatarUrl ? (
                <img src={selectedCommunity.avatarUrl} alt={selectedCommunity.name} className="h-6 w-6 rounded-full object-cover" />
              ) : (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs dark:bg-zinc-800">
                  {selectedCommunity.name.substring(0, 1).toUpperCase()}
                </span>
              )}
              <span className="font-medium text-gray-900 dark:text-zinc-100">
                r/{selectedCommunity.name}
              </span>
            </>
          ) : (
            <span className="text-gray-400 dark:text-zinc-500">
              Choose a community
            </span>
          )}
          <ChevronDown className="ml-auto h-4 w-4 text-gray-400" />
        </button>

        {showCommunityDropdown && (
          <div className="absolute top-full z-10 mt-1 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
            {isLoadingCommunities ? (
              <div className="p-4 text-center text-sm text-gray-500">Loading communities...</div>
            ) : communities.length > 0 ? (
              communities.map((community: any) => (
                <button
                  key={community.id}
                  onClick={() => {
                    setSelectedCommunity(community);
                    setShowCommunityDropdown(false);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  {community.avatarUrl ? (
                    <img src={community.avatarUrl} alt={community.name} className="h-7 w-7 rounded-full object-cover" />
                  ) : (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-sm dark:bg-zinc-800">
                      {community.name.substring(0, 1).toUpperCase()}
                    </span>
                  )}
                  r/{community.name}
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">No communities found.</div>
            )}
          </div>
        )}
      </div>

      {/* Tab selector */}
      <div className="mb-4 flex overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-1 items-center justify-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "border-orange-500 bg-orange-50/50 text-orange-600 dark:bg-orange-950/20 dark:text-orange-400"
                : "border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form content */}
      <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
        {/* Title input */}
        <div>
          <input
            type="text"
            placeholder="Post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={300}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-orange-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-orange-500 dark:focus:bg-zinc-900"
            id="post-title-input"
          />
          <p className="mt-1 text-right text-xs text-gray-400 dark:text-zinc-500">
            {title.length}/300
          </p>
        </div>

        {/* Text content */}
        {activeTab === "text" && (
          <textarea
            placeholder="What are your thoughts?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-relaxed text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-orange-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-orange-500 dark:focus:bg-zinc-900"
            id="post-content-input"
          />
        )}

        {/* Image upload / url */}
        {activeTab === "image" && (
          <input
            type="url"
            placeholder="Paste an image URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-orange-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-orange-500 dark:focus:bg-zinc-900"
            id="post-image-url-input"
          />
        )}

        {/* Link input */}
        {activeTab === "link" && (
          <input
            type="url"
            placeholder="Paste a URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-orange-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-orange-500 dark:focus:bg-zinc-900"
            id="post-link-input"
          />
        )}

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button 
            onClick={() => router.back()}
            className="rounded-full px-6 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !selectedCommunity || createPostMutation.isPending}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-2 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-sm disabled:hover:brightness-100"
            id="submit-post-btn"
          >
            {createPostMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {createPostMutation.isPending ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
