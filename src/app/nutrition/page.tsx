"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../components/AuthProvider";
import { supabase } from "../../lib/supabase";

interface MealEntry {
  id: number;
  food: string;
  calories: number;
}

export default function Nutrition() {
  const { user } = useAuth();
  const [food, setFood] = useState("");
  const [calories, setCalories] = useState("");
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) fetchMeals();
  }, [user]);

  const fetchMeals = async () => {
    const { data, error } = await supabase
      .from("meals")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });

    if (error) console.error(error);
    else setMeals(data as MealEntry[]);
  };

  const handleSubmit = async () => {
    if (!food || !calories || submitting || !user) return;
    setSubmitting(true);

    const { error } = await supabase
      .from("meals")
      .insert([{ food, calories: Number(calories), user_id: user.id }]);

    if (error) {
      console.error(error);
      setSubmitting(false);
      return;
    }

    setFood("");
    setCalories("");
    await fetchMeals();
    setSubmitting(false);
  };

  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center px-6">
      <Navbar />

      <h1 className="text-3xl text-purple-400 mt-8 mb-6">Nutrition Log</h1>

      {!user ? (
        <p className="text-gray-400 mt-8">Please log in to track meals.</p>
      ) : (
        <>
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              placeholder="Food name"
              value={food}
              onChange={(e) => setFood(e.target.value)}
              className="bg-zinc-900 border border-purple-500 rounded-lg px-3 py-2 text-white"
            />
            <input
              type="number"
              placeholder="Calories"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="bg-zinc-900 border border-purple-500 rounded-lg px-3 py-2 text-white w-32"
            />
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-pink-500 hover:bg-pink-600 rounded-lg px-4 py-2 font-semibold disabled:opacity-50"
            >
              Add
            </button>
          </div>

          <p className="text-pink-400 mb-4">Total: {totalCalories} kcal</p>

          <div className="w-full max-w-md">
            {meals.length === 0 ? (
              <p className="text-gray-500 text-center">No meals logged yet.</p>
            ) : (
              meals.map((m) => (
                <div
                  key={m.id}
                  className="flex justify-between bg-zinc-900 border border-purple-500 rounded-lg px-4 py-2 mb-2"
                >
                  <span>{m.food}</span>
                  <span className="text-purple-300">{m.calories} kcal</span>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </main>
  );
}