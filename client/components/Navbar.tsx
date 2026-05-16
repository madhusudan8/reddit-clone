"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Bell, Menu, X } from "lucide-react";
import SearchBar from "./SearchBar";
import UserDropdown from "./UserDropdown";
import { useAuth, useClerk } from "@clerk/nextjs";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-4 px-4">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2" id="logo">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-600">
            <svg
              viewBox="0 0 20 20"
              className="h-5 w-5 text-white"
              fill="currentColor"
            >
              <circle cx="10" cy="7" r="3" />
              <circle cx="5" cy="13" r="1.5" />
              <circle cx="15" cy="13" r="1.5" />
              <path d="M10 10c-3 0-6 2-6 4v2h12v-2c0-2-3-4-6-4z" />
            </svg>
          </div>
          <span className="hidden text-xl font-bold text-gray-900 sm:block dark:text-white">
            reddit
          </span>
        </Link>

        {/* Search - hidden on mobile */}
        <div className="hidden flex-1 md:flex">
          <SearchBar />
        </div>

        {/* Right side actions */}
        <div className="ml-auto flex items-center gap-1">
          {/* Create Post */}
          <button
            onClick={() => {
              if (!isSignedIn) {
                openSignIn();
              } else {
                window.location.href = "/submit";
              }
            }}
            className="hidden cursor-pointer items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md hover:brightness-110 sm:flex"
            id="create-post-btn"
          >
            <Plus className="h-4 w-4" />
            <span>Create</span>
          </button>

          {/* Notifications */}
          <button
            className="relative cursor-pointer rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            id="notifications-btn"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
            </span>
          </button>

          {/* User Dropdown */}
          <UserDropdown />

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="cursor-pointer rounded-lg p-2 text-gray-600 md:hidden dark:text-zinc-400"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-100 px-4 py-3 md:hidden dark:border-zinc-800">
          <SearchBar />
        </div>
      )}
    </nav>
  );
}
