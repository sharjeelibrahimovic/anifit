"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../components/AuthProvider";
import { supabase } from "../../lib/supabase";

interface Profile {
  id: number;
  username: string;
  goal: string;
  is_public: boolean;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [username, setUsername] = useState("");
  const [goal, setGoal] = useState("maintain");
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user!.id)
      .maybeSingle();

    if (error) console.error(error);

    if (data) {
      setProfile(data);
      setUsername(data.username ?? "");
      setGoal(data.goal ?? "maintain");
      setIsPublic(data.is_public ?? false);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user || saving) return;
    setSaving(true);

    if (profile) {
      const { error } = await supabase
        .from("profiles")
        .update({ username, goal, is_public: isPublic })
        .eq("id", profile.id);
      if (error) console.error(error);
    } else {
      const { error } = await supabase
        .from("profiles")
        .insert([{ user_id: user.id, username, goal, is_public: isPublic }]);
      if (error) console.error(error);
    }

    await fetchProfile();
    setSaving(false);
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center px-6 pb-24">
      <Navbar />

      <h1 className="text-3xl text-purple-400 mt-8 mb-6">Profile</h1>

      {!user ? (
        <p className="text-gray-400">Please log in to set up your profile.</p>
      ) : loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="w-full max-w-xs flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-400">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-zinc-900 border border-purple-500 rounded-lg px-3 py-2 text-white mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Fitness Goal</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full bg-zinc-900 border border-purple-500 rounded-lg px-3 py-2 text-white mt-1"
            >
              <option value="cut">Cut</option>
              <option value="bulk">Bulk</option>
              <option value="maintain">Maintain</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-4 h-4"
            />
            <label className="text-sm text-gray-400">Make profile public</label>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-pink-500 hover:bg-pink-600 rounded-lg px-4 py-2 font-semibold disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      )}
    </main>
  );
}