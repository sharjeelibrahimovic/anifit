"use client";

import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { useAuth } from "./components/AuthProvider";
import { supabase } from "../lib/supabase";

const CALORIE_TARGET = 2000;

interface MealEntry {
  id: number;
  food: string;
  calories: number;
  created_at: string;
}

interface WorkoutEntry {
  id: number;
  exercise: string;
  sets: number;
  reps: number;
  created_at: string;
}

export default function Home() {
  const { user } = useAuth();
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>([]);
  const [allMeals, setAllMeals] = useState<MealEntry[]>([]);
  const [allWorkouts, setAllWorkouts] = useState<WorkoutEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const { data: mealsToday } = await supabase
      .from("meals")
      .select("*")
      .eq("user_id", user!.id)
      .gte("created_at", startOfDay.toISOString());

    const { data: workoutsToday } = await supabase
      .from("workouts")
      .select("*")
      .eq("user_id", user!.id)
      .gte("created_at", startOfDay.toISOString());

    const { data: mealsAll } = await supabase
      .from("meals")
      .select("*")
      .eq("user_id", user!.id);

    const { data: workoutsAll } = await supabase
      .from("workouts")
      .select("*")
      .eq("user_id", user!.id);

    setMeals(mealsToday ?? []);
    setWorkouts(workoutsToday ?? []);
    setAllMeals(mealsAll ?? []);
    setAllWorkouts(workoutsAll ?? []);
    setLoading(false);
  };

  const getStreak = () => {
    let streak = 0;
    const day = new Date();
    day.setHours(0, 0, 0, 0);

    while (true) {
      const dayStart = new Date(day);
      const dayEnd = new Date(day);
      dayEnd.setHours(23, 59, 59, 999);

      const hasMeal = allMeals.some((m) => {
        const t = new Date(m.created_at).getTime();
        return t >= dayStart.getTime() && t <= dayEnd.getTime();
      });
      const hasWorkout = allWorkouts.some((w) => {
        const t = new Date(w.created_at).getTime();
        return t >= dayStart.getTime() && t <= dayEnd.getTime();
      });

      if (hasMeal && hasWorkout) {
        streak++;
        day.setDate(day.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
  const caloriePct = Math.min((totalCalories / CALORIE_TARGET) * 100, 100);
  const mealDone = meals.length > 0;
  const trainDone = workouts.length > 0;
  const questsDone = [mealDone, trainDone].filter(Boolean).length;
  const streak = loading ? 0 : getStreak();

  const rank =
    streak >= 7 ? "A-Rank" : streak >= 3 ? "C-Rank" : streak >= 1 ? "D-Rank" : "E-Rank";

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center px-6 pb-24">
      <Navbar />

      <section className="text-center mb-8 mt-8">
        <h1 className="text-5xl font-bold text-purple-400">AniFit</h1>
        <p className="text-lg text-gray-400 mt-2">Your training arc begins</p>
      </section>

      {!user ? (
        <p className="text-gray-400">Please log in to view your dashboard.</p>
      ) : loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="w-full max-w-md flex flex-col gap-6">
          <div className="bg-zinc-900 border border-purple-500 rounded-2xl p-5 text-center">
            <p className="text-pink-400 font-semibold">🔥 {streak}-Day Streak</p>
            <p className="text-xs text-gray-400 mt-1">{rank} · {questsDone}/2 quests today</p>
          </div>

          <div className="bg-zinc-900 border border-purple-500 rounded-2xl p-5">
            <div className="flex justify-between text-sm mb-2">
              <span>Calories</span>
              <span className="text-purple-300">
                {totalCalories} / {CALORIE_TARGET} kcal
              </span>
            </div>
            <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-pink-500 transition-all"
                style={{ width: `${caloriePct}%` }}
              />
            </div>
          </div>

          <div className="bg-zinc-900 border border-purple-500 rounded-2xl p-5">
            <p className="text-sm mb-2">Today's Workout</p>
            {workouts.length === 0 ? (
              <p className="text-gray-500 text-sm">No workout logged yet.</p>
            ) : (
              workouts.map((w) => (
                <div key={w.id} className="flex justify-between text-sm text-gray-300 py-1">
                  <span>{w.exercise}</span>
                  <span className="text-purple-300">{w.sets} x {w.reps}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </main>
  );
}