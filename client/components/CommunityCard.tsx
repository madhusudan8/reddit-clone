import Link from "next/link";
import { formatNumber } from "@/lib/formatters";

interface CommunityCardProps {
  name: string;
  icon: string;
  members: string;
  growth?: string;
  rank?: number;
}

export default function CommunityCard({
  name,
  icon,
  members,
  growth,
  rank,
}: CommunityCardProps) {
  return (
    <Link
      href={`/r/${name}`}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-zinc-800/60"
    >
      {rank && (
        <span className="w-5 text-center text-xs font-bold text-gray-400 dark:text-zinc-500">
          {rank}
        </span>
      )}
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm dark:bg-zinc-800">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900 dark:text-zinc-100">
          r/{name}
        </p>
        <p className="text-xs text-gray-500 dark:text-zinc-400">
          {members} members
        </p>
      </div>
      {growth && (
        <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-600 dark:bg-green-950/40 dark:text-green-400">
          {growth}
        </span>
      )}
    </Link>
  );
}
