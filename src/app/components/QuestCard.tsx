"use client";

import { useState } from "react";

interface QuestCardProps {
  title: string;
  description: string;
  onComplete: () => void;
}

export default function QuestCard({ title, description, onComplete }: QuestCardProps) {
  const [completed, setCompleted] = useState(false);

  const handleClick = () => {
    if (!completed) onComplete();
    setCompleted(!completed);
  };

  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer rounded-2xl p-6 w-64 border transition-colors ${
        completed
          ? "bg-purple-900 border-pink-400"
          : "bg-zinc-900 border-purple-500"
      }`}
    >
      <h2 className="text-xl font-semibold text-pink-400">{title}</h2>
      <p className="text-sm text-gray-400 mt-2">{description}</p>
      <p className="text-xs text-purple-300 mt-3">
        {completed ? "✓ Completed" : "Tap to complete"}
      </p>
    </div>
  );
}