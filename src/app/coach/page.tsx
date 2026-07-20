"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../components/AuthProvider";
import { supabase } from "../../lib/supabase";

const DAILY_LIMIT = 5;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function Coach() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Yo! Ready to train? Ask me anything about your fitness journey." },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messagesUsedToday, setMessagesUsedToday] = useState(0);
  const [loadingCount, setLoadingCount] = useState(true);

  useEffect(() => {
    if (user) fetchTodayCount();
  }, [user]);

  const fetchTodayCount = async () => {
    setLoadingCount(true);
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from("chat_logs")
      .select("id")
      .eq("user_id", user!.id)
      .gte("created_at", startOfDay.toISOString());

    if (error) console.error(error);
    setMessagesUsedToday(data?.length ?? 0);
    setLoadingCount(false);
  };

  const handleSend = async () => {
    if (!input.trim() || sending || !user) return;
    if (messagesUsedToday >= DAILY_LIMIT) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setSending(true);

    const { error: logError } = await supabase.from("chat_logs").insert([{ user_id: user.id }]);
    if (!logError) {
      setMessagesUsedToday((prev) => prev + 1);
    } else {
      console.error(logError);
    }

    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, something went wrong. Try again." },
        ]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Try again." },
      ]);
    }

    setSending(false);
  };

  const limitReached = messagesUsedToday >= DAILY_LIMIT;

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center px-6 pb-24">
      <Navbar />

      <h1 className="text-3xl text-purple-400 mt-8 mb-6">AI Coach</h1>
      <p className="text-xs text-gray-500 text-center max-w-xs mb-4">
  AI-generated advice is not a substitute for professional medical or fitness guidance. Use your judgment.
</p>

      {!user ? (
        <p className="text-gray-400">Please log in to chat with your coach.</p>
      ) : loadingCount ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="w-full max-w-md flex flex-col gap-4">
          <p className="text-xs text-purple-300 text-center">
            {messagesUsedToday}/{DAILY_LIMIT} messages used today
          </p>

          <div className="bg-zinc-900 border border-purple-500 rounded-2xl p-4 h-96 overflow-y-auto flex flex-col gap-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`px-3 py-2 rounded-xl max-w-[80%] text-sm ${
                  m.role === "user"
                    ? "bg-pink-500 self-end"
                    : "bg-zinc-800 text-purple-200 self-start"
                }`}
              >
                {m.content}
              </div>
            ))}
            {sending && (
              <div className="bg-zinc-800 text-purple-200 self-start px-3 py-2 rounded-xl text-sm">
                Typing...
              </div>
            )}
          </div>

          {limitReached ? (
            <p className="text-center text-red-400 text-sm">
              Daily limit reached. Come back tomorrow!
            </p>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask your coach..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                disabled={sending}
                className="flex-1 bg-zinc-900 border border-purple-500 rounded-lg px-3 py-2 text-white"
              />
              <button
                onClick={handleSend}
                disabled={sending}
                className="bg-pink-500 hover:bg-pink-600 rounded-lg px-4 py-2 font-semibold disabled:opacity-50"
              >
                Send
              </button>
            </div>
          )}
        </div>
      )}
    </main>
  );
}