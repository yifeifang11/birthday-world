type InteractionPromptProps = { prompt: string | null };

export function InteractionPrompt({ prompt }: InteractionPromptProps) {
  if (!prompt) return null;

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full border border-white/80 bg-white/85 px-5 py-3 text-sm font-medium text-slate-800 shadow-[0_18px_50px_rgba(15,23,42,0.18)] backdrop-blur">
      {prompt}
    </div>
  );
}
