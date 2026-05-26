"use client";

import type { PublicMessage } from "@/lib/types";

type MessagePopupProps = {
  message: PublicMessage | null;
  onClose: () => void;
};

export function MessagePopup({ message, onClose }: MessagePopupProps) {
  if (!message) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/35 p-4 backdrop-blur-sm md:items-center">
      <div className="panel-strong w-full max-w-xl rounded-[2rem] p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">
              Friend message
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              {message.displayName}
            </h2>
          </div>
          <button
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <p className="mt-5 rounded-[1.4rem] bg-slate-50 px-5 py-4 text-base leading-8 text-slate-700">
          {message.message}
        </p>
      </div>
    </div>
  );
}
