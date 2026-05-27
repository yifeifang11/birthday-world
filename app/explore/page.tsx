"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function ExplorePage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/explore/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const json = await res.json();

      if (res.ok && json.ok) {
        router.push("/customize");
        return;
      }

      setError(json?.error || "Invalid password");
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-slate-900/60 rounded-md shadow-md w-full max-w-sm"
      >
        <h2 className="text-xl font-semibold mb-4">Explore World</h2>
        <label className="block text-sm mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 rounded bg-slate-800 border border-slate-700 mb-4"
        />
        {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
        <button
          type="submit"
          className="w-full bg-amber-500 text-black py-2 rounded font-medium disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Checking…" : "Enter"}
        </button>
      </form>
    </div>
  );
}
