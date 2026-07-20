"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { supabase } from "../../lib/supabase";

export default function Navbar() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <nav className="w-full flex flex-wrap justify-center items-center gap-6 py-4 border-b border-purple-500 bg-zinc-950 text-purple-300">
      <div className="hidden md:flex gap-6">
        <Link href="/" className="hover:text-pink-400">Home</Link>
        <Link href="/train" className="hover:text-pink-400">Train</Link>
        <Link href="/nutrition" className="hover:text-pink-400">Nutrition</Link>
        <Link href="/coach" className="hover:text-pink-400">Coach</Link>
        <Link href="/profile" className="hover:text-pink-400">Profile</Link>
      </div>

      {!loading && (
        user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">{user.email}</span>
            <button
              onClick={handleLogout}
              className="text-pink-400 hover:text-pink-300 text-sm"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link href="/login" className="hover:text-pink-400">
            Login
          </Link>
        )
      )}
    </nav>
  );
}