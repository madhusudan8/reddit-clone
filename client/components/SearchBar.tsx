"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative flex-1 max-w-xl">
      <div
        className={`flex items-center gap-2 rounded-full border bg-gray-50 px-4 py-2 transition-all duration-200 dark:bg-zinc-800 ${
          isFocused
            ? "border-orange-500 shadow-sm shadow-orange-500/20 bg-white dark:bg-zinc-700"
            : "border-gray-200 hover:border-gray-300 dark:border-zinc-700 dark:hover:border-zinc-600"
        }`}
      >
        <Search className="h-4 w-4 shrink-0 text-gray-400 dark:text-zinc-500" />
        <input
          type="text"
          placeholder="Search Reddit"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-zinc-100 dark:placeholder:text-zinc-500"
          id="search-bar"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="shrink-0 rounded-full p-0.5 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-zinc-600 dark:hover:text-zinc-300"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
