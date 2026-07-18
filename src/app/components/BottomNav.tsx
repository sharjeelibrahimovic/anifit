"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Home" },
  { href: "/train", label: "Train" },
  { href: "/nutrition", label: "Fuel" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-purple-500 flex justify-around py-3 md:hidden">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`text-sm ${
            pathname === tab.href ? "text-pink-400 font-semibold" : "text-purple-300"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}