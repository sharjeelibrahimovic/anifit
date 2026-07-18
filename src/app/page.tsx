"use client";

import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { useAuth } from "./components/AuthProvider";
import { supabase } from "../lib/supabase";

export default function Home() {
  const { user } = useAuth();
  const [mealDone, setMealDone] = useState(false);
  const [trainDone, setTrainDone] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) checkToday();
  }, [user]);

  const checkToday = async () => {
    setLoading(true);
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const { data: meals } = await supabase
      .from("meals")
      .select("id")
      .eq("user_id", user!.id)
      .gte("created_at", startOfDay.toISOString());

    const { data: workouts } = await supabase
      .from("workouts")
      .select("id")
      .eq("user_id", user!.id)
      .gte("created_at", startOfDay.toISOString());

    setMealDone((meals?.length ?? 0) > 0);
    setTrainDone((workouts?.length ?? 0) > 0);
    setLoading(false);
  };

  const streak = [mealDone, trainDone].filter(Boolean).length;

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <Navbar />

      <section className="text-center mb-8 mt-8">
        <h1 className="text-5xl font-bold text-purple-400">AniFit</h1>
        <p className="text-lg text-gray-400 mt-2">Your training arc begins</p>
      </section>

      {!user ? (
        <p className="text-gray-400">Please log in to track your quests.</p>
      ) : loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <>
          <p className="text-2xl text-pink-400 mb-10">
            🔥 Today's quests: {streak}/2
          </p>

          <section className="flex flex-col md:flex-row gap-6">
            <div
              className={`rounded-2xl p-6 w-64 border ${
                mealDone
                  ? "bg-purple-900 border-pink-400"
                  : "bg-zinc-900 border-purple-500"
              }`}
            >
              <h2 className="text-xl font-semibold text-pink-400">Log Meal</h2>
              <p className="text-sm text-gray-400 mt-2">Track today's intake</p>
              <p className="text-xs text-purple-300 mt-3">
                {mealDone ? "✓ Completed" : "Not logged today"}
              </p>
            </div>

            <div
              className={`rounded-2xl p-6 w-64 border ${
                trainDone
                  ? "bg-purple-900 border-pink-400"
                  : "bg-zinc-900 border-purple-500"
              }`}
            >
              <h2 className="text-xl font-semibold text-pink-400">Train</h2>
              <p className="text-sm text-gray-400 mt-2">Log your workout</p>
              <p className="text-xs text-purple-300 mt-3">
                {trainDone ? "✓ Completed" : "Not logged today"}
              </p>
            </div>

            <div
              className={`rounded-2xl p-6 w-64 border ${
                mealDone && trainDone
                  ? "bg-purple-900 border-pink-400"
                  : "bg-zinc-900 border-purple-500"
              }`}
            >
              <h2 className="text-xl font-semibold text-pink-400">Keep Streak</h2>
              <p className="text-sm text-gray-400 mt-2">Complete both to hold streak</p>
              <p className="text-xs text-purple-300 mt-3">
                {mealDone && trainDone ? "✓ Completed" : "In progress"}
              </p>
            </div>
          </section>
        </>
      )}
    </main>
  );
}