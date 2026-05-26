import { AdminMessageList } from "@/components/AdminMessageList";

export default function AdminPage() {
  return (
    <main className="min-h-screen px-4 py-6 md:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 rounded-[2rem] border border-white/70 bg-white/70 px-6 py-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
          <p className="text-xs uppercase tracking-[0.32em] text-slate-500">
            Moderation
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Review submitted messages
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
            Use the admin secret to load submissions, approve good ones, and
            remove any that should not appear in the world.
          </p>
        </div>
        <AdminMessageList />
      </div>
    </main>
  );
}
