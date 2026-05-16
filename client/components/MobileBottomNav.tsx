"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Plus, Bell, User } from "lucide-react";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Search", href: "/search", icon: Search },
  { label: "Create", href: "/submit", icon: Plus, isSpecial: true },
  { label: "Alerts", href: "/notifications", icon: Bell },
  { label: "Profile", href: "/profile", icon: User },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur-xl lg:hidden dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex cursor-pointer flex-col items-center gap-0.5 rounded-xl px-3 py-2 text-[10px] font-medium transition-all ${
                item.isSpecial
                  ? ""
                  : isActive
                  ? "text-orange-500 dark:text-orange-400"
                  : "text-gray-500 dark:text-zinc-400"
              }`}
            >
              {item.isSpecial ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30">
                  <item.icon className="h-5 w-5" />
                </div>
              ) : (
                <>
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="h-0.5 w-4 rounded-full bg-orange-500" />
                  )}
                </>
              )}
            </Link>
          );
        })}
      </div>
      {/* Safe area spacer for iPhones */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
