"use client";

import type { MemorySite } from "@/lib/types";

type MemorySiteModalProps = {
  site: MemorySite | null;
  onClose: () => void;
};

export function MemorySiteModal({ site, onClose }: MemorySiteModalProps) {
  if (!site) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-4 backdrop-blur-sm md:items-center">
      <div className="panel-strong w-full max-w-3xl rounded-[2rem] p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">
              Memory site
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              {site.title}
            </h2>
            {site.description ? (
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                {site.description}
              </p>
            ) : null}
          </div>
          <button
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="mt-6 rounded-[1.8rem] border border-slate-200 bg-white/90 p-4 md:p-5">
          {site.type === "voice" ? (
            <audio
              controls
              src={site.mediaUrl ?? undefined}
              className="w-full"
            />
          ) : null}

          {site.type === "photo" ? (
            <div className="grid gap-4 md:grid-cols-[1fr_0.85fr] md:items-start">
              <div className="rounded-[1.6rem] bg-[linear-gradient(180deg,#fdfdfd,#fff2d7)] p-4 shadow-inner">
                <div className="overflow-hidden rounded-[1.1rem] border-[10px] border-white bg-white shadow-[0_20px_50px_rgba(15,23,42,0.14)]">
                  <img
                    src={site.thumbnailUrl ?? site.mediaUrl ?? ""}
                    alt={site.title}
                    className="h-auto w-full object-cover"
                  />
                </div>
              </div>
              <div className="rounded-[1.4rem] bg-slate-50 px-4 py-5 text-sm leading-7 text-slate-700">
                {site.noteText ?? "No note attached to this memory site."}
              </div>
            </div>
          ) : null}

          {site.type === "video" ? (
            <video
              controls
              src={site.mediaUrl ?? undefined}
              className="aspect-video w-full rounded-[1.3rem] bg-black"
            />
          ) : null}

          {site.type === "note" ? (
            <div className="rounded-[1.6rem] border border-amber-200 bg-[linear-gradient(180deg,#fffdf5,#fff3cf)] px-5 py-6 text-base leading-8 text-slate-700">
              {site.noteText ?? "No note text provided."}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
