"use client";

import { AlertCircle, RefreshCw, WifiOff } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export default function ErrorState({
  title = "Trouble reaching the servers",
  message = "Please check your connection and try again. If the issue persists, the backend server might be offline.",
  onRetry,
  isRetrying = false,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200/80 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900 animate-fade-in">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-950/30 dark:text-red-400">
        <WifiOff className="h-7 w-7" />
      </div>
      
      <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-zinc-50">
        {title}
      </h2>
      
      <p className="mx-auto mb-6 max-w-md text-sm leading-relaxed text-gray-500 dark:text-zinc-400">
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          disabled={isRetrying}
          className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:brightness-110 active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 transition-transform group-hover:rotate-180 duration-500 ${isRetrying ? "animate-spin" : ""}`} />
          <span>{isRetrying ? "Trying again..." : "Try again"}</span>
        </button>
      )}
    </div>
  );
}
