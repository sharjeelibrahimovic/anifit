"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    setError("");

    if (isSignup) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) return setError(error.message);
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return setError(error.message);
    }

    router.push("/");
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setEmail("");
    setPassword("");
    setError("");
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <h1 className="text-3xl font-bold text-purple-400 mb-6">
        {isSignup ? "Create Account" : "Log In"}
      </h1>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-zinc-900 border border-purple-500 rounded-lg px-3 py-2 text-white"
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-zinc-900 border border-purple-500 rounded-lg px-3 py-2 text-white w-full pr-16"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-purple-300"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          onClick={handleSubmit}
          className="bg-pink-500 hover:bg-pink-600 rounded-lg px-4 py-2 font-semibold"
        >
          {isSignup ? "Sign Up" : "Log In"}
        </button>

        <button onClick={toggleMode} className="text-purple-300 text-sm underline">
          {isSignup ? "Already have an account? Log in" : "No account? Sign up"}
        </button>
      </div>
    </main>
  );
}