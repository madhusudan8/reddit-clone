"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
  ChevronDown,
  Bookmark,
  Shield,
  Loader2,
} from "lucide-react";
import { useAuth, useUser, SignInButton, SignUpButton, useClerk } from "@clerk/nextjs";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  if (!isLoaded) {
    return (
      <div className="flex h-10 w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800">
        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex items-center gap-2">
        <SignInButton mode="modal">
          <button className="rounded-full px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
            Log In
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="hidden rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-orange-600 sm:block">
            Sign Up
          </button>
        </SignUpButton>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex cursor-pointer items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800"
        id="user-dropdown-trigger"
        aria-label="User menu"
      >
        <div className="h-8 w-8 overflow-hidden rounded-full border border-gray-200 dark:border-zinc-700">
          <img src={user?.imageUrl} alt={user?.username || "User"} className="h-full w-full object-cover" />
        </div>
        <div className="hidden items-start md:flex md:flex-col text-left">
          <span className="text-xs font-semibold text-gray-900 dark:text-zinc-100 max-w-[100px] truncate">
            u/{user?.username}
          </span>
          <span className="text-[10px] text-gray-500 dark:text-zinc-400">
            {/* Karma goes here eventually */}
            1 karma
          </span>
        </div>
        <ChevronDown className="hidden h-3.5 w-3.5 text-gray-500 md:block dark:text-zinc-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
          {/* User info header */}
          <div className="border-b border-gray-100 px-4 py-3 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-gray-200 dark:border-zinc-700">
                <img src={user?.imageUrl} alt={user?.username || "User"} className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900 dark:text-zinc-100">
                  u/{user?.username}
                </p>
                <p className="truncate text-xs text-gray-500 dark:text-zinc-400">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <Link
              href={`/u/${user?.username}`}
              onClick={() => setIsOpen(false)}
              className="flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
            <Link
              href="/saved"
              onClick={() => setIsOpen(false)}
              className="flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Bookmark className="h-4 w-4" />
              Saved Posts
            </Link>
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
            <Link
              href="/communities/create"
              onClick={() => setIsOpen(false)}
              className="flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Shield className="h-4 w-4" />
              Create Community
            </Link>
          </div>

          {/* Dark mode toggle */}
          <div className="border-t border-gray-100 px-4 py-2 dark:border-zinc-800">
            <button
              onClick={toggleDarkMode}
              className="flex w-full cursor-pointer items-center justify-between rounded-lg px-0 py-2 text-sm text-gray-700 transition-colors hover:text-gray-900 dark:text-zinc-300 dark:hover:text-zinc-100"
            >
              <span className="flex items-center gap-3">
                {darkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                {darkMode ? "Light Mode" : "Dark Mode"}
              </span>
              <div
                className={`relative h-5 w-9 rounded-full transition-colors ${
                  darkMode ? "bg-orange-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                    darkMode ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 py-1 dark:border-zinc-800">
            <button
              className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
              onClick={() => {
                setIsOpen(false);
                signOut();
              }}
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
