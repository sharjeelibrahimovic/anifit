"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../components/AuthProvider";
import { supabase } from "../../lib/supabase";

interface WorkoutEntry {
  id: number;
  exercise: string;
  sets: number;
  reps: number;
}

export default function Train() {
  const { user } = useAuth();
  const [exercise, setExercise] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) fetchWorkouts();
  }, [user]);

  const fetchWorkouts = async () => {
    const { data, error } = await supabase
      .from("workouts")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });

    if (error) console.error(error);
    else setWorkouts(data as WorkoutEntry[]);
  };

  const handleSubmit = async () => {
    if (!exercise || !sets || !reps || submitting || !user) return;
    setSubmitting(true);

    const { error } = await supabase
      .from("workouts")
      .insert([{ exercise, sets: Number(sets), reps: Number(reps), user_id: user.id }]);

    if (error) {
      console.error(error);
      setSubmitting(false);
      return;
    }

    setExercise("");
    setSets("");
    setReps("");
    await fetchWorkouts();
    setSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center px-6">
      <Navbar />

      <h1 className="text-3xl text-purple-400 mt-8 mb-6">Workout Log</h1>

      {!user ? (
        <p className="text-gray-400 mt-8">Please log in to track workouts.</p>
      ) : (
        <>
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              placeholder="Exercise"
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
              className="bg-zinc-900 border border-purple-500 rounded-lg px-3 py-2 text-white"
            />
            <input
              type="number"
              placeholder="Sets"
              value={sets}
              onChange={(e) => setSets(e.target.value)}
              className="bg-zinc-900 border border-purple-500 rounded-lg px-3 py-2 text-white w-24"
            />
            <input
              type="number"
              placeholder="Reps"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              className="bg-zinc-900 border border-purple-500 rounded-lg px-3 py-2 text-white w-24"
            />
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-pink-500 hover:bg-pink-600 rounded-lg px-4 py-2 font-semibold disabled:opacity-50"
            >
              Add
            </button>
          </div>

          <div className="w-full max-w-md">
            {workouts.length === 0 ? (
              <p className="text-gray-500 text-center">No exercises logged yet.</p>
            ) : (
              workouts.map((w) => (
                <div
                  key={w.id}
                  className="flex justify-between bg-zinc-900 border border-purple-500 rounded-lg px-4 py-2 mb-2"
                >
                  <span>{w.exercise}</span>
                  <span className="text-purple-300">
                    {w.sets} x {w.reps}
                  </span>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </main>
  );
}