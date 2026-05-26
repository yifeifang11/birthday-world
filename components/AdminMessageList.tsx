"use client";

import { useEffect, useState } from "react";
import type { PublicMessage } from "@/lib/types";

export function AdminMessageList() {
  const [secret, setSecret] = useState("");
  const [messages, setMessages] = useState<PublicMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  async function fetchMessages(currentSecret = secret) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/messages", {
        headers: { "x-admin-secret": currentSecret },
      });
      const payload = (await response.json()) as {
        error?: string;
        messages?: PublicMessage[];
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "Could not fetch messages.");
      }

      setMessages(payload.messages ?? []);
      setHasLoaded(true);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load messages.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (secret) {
      void fetchMessages(secret);
    }
  }, [secret]);

  async function updateMessage(id: string, method: "approve" | "delete") {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        method === "approve"
          ? `/api/admin/messages/${id}/approve`
          : `/api/admin/messages/${id}`,
        {
          method: method === "approve" ? "POST" : "DELETE",
          headers: { "x-admin-secret": secret },
        },
      );

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Could not update message.");
      }

      await fetchMessages(secret);
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Could not update message.",
      );
    } finally {
      setLoading(false);
    }
  }

  const approvedCount = messages.filter((message) => message.approved).length;

  return (
    <div className="panel-strong rounded-[2rem] p-6 md:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Admin review
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Submitted messages
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
            Enter the admin secret to inspect, approve, or remove visitor
            submissions.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            className="rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 text-slate-950 outline-none transition focus:border-slate-400"
            value={secret}
            onChange={(event) => setSecret(event.target.value)}
            placeholder="Admin secret"
            type="password"
          />
          <button
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            onClick={() => void fetchMessages(secret)}
          >
            Load messages
          </button>
        </div>
      </div>

      {error ? (
        <p className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      ) : null}
      {loading ? (
        <p className="mt-5 text-sm text-slate-500">Working...</p>
      ) : null}

      <div className="mt-6 grid gap-4">
        {hasLoaded && messages.length === 0 ? (
          <div className="rounded-[1.6rem] border border-dashed border-slate-300 bg-white/70 p-6 text-sm text-slate-500">
            No messages found.
          </div>
        ) : null}

        {messages.map((message) => (
          <article
            key={message.id}
            className="rounded-[1.6rem] border border-slate-200 bg-white/85 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="grid gap-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-semibold text-slate-950">
                    {message.displayName}
                  </h3>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${message.approved ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}
                  >
                    {message.approved ? "Approved" : "Pending"}
                  </span>
                </div>
                <p className="text-sm leading-7 text-slate-600">
                  {message.message}
                </p>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Slug: {message.nameSlug}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {!message.approved ? (
                  <button
                    className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800 transition hover:bg-emerald-100"
                    onClick={() => void updateMessage(message.id, "approve")}
                  >
                    Approve
                  </button>
                ) : null}
                <button
                  className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
                  onClick={() => void updateMessage(message.id, "delete")}
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="mt-4 grid gap-2 text-xs text-slate-500 sm:grid-cols-2 lg:grid-cols-4">
              <p>Approved: {String(message.approved)}</p>
              <p>Created: {new Date(message.createdAt).toLocaleString()}</p>
              <p>
                Position: {message.position.x.toFixed(1)},{" "}
                {message.position.y.toFixed(1)}, {message.position.z.toFixed(1)}
              </p>
              <p>Avatar present: {message.avatar ? "yes" : "no"}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-600">
        <p>Total: {messages.length}</p>
        <p>Approved: {approvedCount}</p>
      </div>
    </div>
  );
}
