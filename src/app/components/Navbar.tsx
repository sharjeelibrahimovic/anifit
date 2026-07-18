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
    <nav className="w-full flex justify-center items-center gap-8 py-4 border-b border-purple-500 bg-zinc-950 text-purple-300">
      <Link href="/" className="hover:text-pink-400">Home</Link>
      <Link href="/train" className="hover:text-pink-400">Train</Link>
      <Link href="/nutrition" className="hover:text-pink-400">Nutrition</Link>

      {!loading && (
        user ? (
          <div className="flex items-center gap-3 ml-4">
            <span className="text-sm text-gray-400">{user.email}</span>
            <button
              onClick={handleLogout}
              className="text-pink-400 hover:text-pink-300 text-sm"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link href="/login" className="hover:text-pink-400 ml-4">
            Login
          </Link>
        )
      )}
    </nav>
  );
}