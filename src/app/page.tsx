"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import QuestCard from "./components/QuestCard";

export default function Home() {
  const [streak, setStreak] = useState(0);

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <Navbar />

      <section className="text-center mb-8 mt-8">
        <h1 className="text-5xl font-bold text-purple-400">AniFit</h1>
        <p className="text-lg text-gray-400 mt-2">Your training arc begins</p>
      </section>

      <p className="text-2xl text-pink-400 mb-10">🔥 Streak: {streak}</p>

      <section className="flex flex-col md:flex-row gap-6">
        <QuestCard
          title="Log Meal"
          description="Track today's intake"
          onComplete={() => setStreak((s) => s + 1)}
        />
        <QuestCard
          title="Train"
          description="Log your workout"
          onComplete={() => setStreak((s) => s + 1)}
        />
        <QuestCard
          title="Keep Streak"
          description="Don't break the chain"
          onComplete={() => setStreak((s) => s + 1)}
        />
      </section>
    </main>
  );
} 