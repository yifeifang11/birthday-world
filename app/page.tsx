import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(226,244,255,0.94)_38%,_rgba(191,233,221,0.9)_68%,_rgba(255,214,170,0.95))]" />
      <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.8),_transparent_70%)] opacity-70" />
      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-between gap-12 px-6 py-8 md:px-10 lg:px-12">
        <div className="flex items-center justify-between rounded-full border border-white/70 bg-white/55 px-5 py-3 shadow-[0_18px_45px_rgba(44,79,93,0.12)] backdrop-blur">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-slate-600">
              Floating Avatar Message World
            </p>
            <h1 className="text-sm font-semibold text-slate-900">
              A playful 3D guestbook for birthday memories
            </h1>
          </div>
          <div className="hidden gap-3 md:flex">
            <Link
              className="rounded-full border border-slate-300/80 px-4 py-2 text-sm text-slate-700 transition hover:bg-white"
              href="/world"
            >
              Explore World
            </Link>
            <Link
              className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white transition hover:bg-slate-700"
              href="/create"
            >
              Leave a Message
            </Link>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="max-w-2xl">
            <p className="mb-5 inline-flex rounded-full border border-white/70 bg-white/60 px-4 py-2 text-sm text-slate-700 shadow-sm backdrop-blur">
              Friends create floating avatars. The recipient explores a calm
              little world of memories.
            </p>
            <h2 className="max-w-xl text-5xl font-semibold tracking-tight text-slate-950 md:text-7xl">
              Low-poly faces.
              <span className="block text-slate-600">Scattered messages.</span>
              <span className="block text-slate-500">
                Curated memory sites.
              </span>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-700 md:text-xl">
              This app lets visitors build simple floating avatars, leave a
              short note, and place those messages into a bright 3D world
              alongside voice notes, photos, videos, and written memories.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                className="rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white shadow-[0_18px_45px_rgba(15,23,42,0.22)] transition hover:-translate-y-0.5 hover:bg-slate-800"
                href="/create"
              >
                Create an Avatar
              </Link>
              <Link
                className="rounded-full border border-slate-300/90 bg-white/70 px-6 py-3 text-sm font-medium text-slate-800 transition hover:bg-white"
                href="/world"
              >
                Walk the World
              </Link>
            </div>
          </div>

          <div className="grid gap-4 rounded-[2rem] border border-white/70 bg-white/60 p-5 shadow-[0_30px_80px_rgba(44,79,93,0.16)] backdrop-blur">
            <div className="rounded-[1.6rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(208,244,255,0.72))] p-5">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                Phase one
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-950">
                Floating avatars first
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                The first build focuses on a simple avatar creator, a calm
                landing page, and the core message world structure the rest of
                the experience can grow from.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.4rem] border border-slate-200/80 bg-white/75 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Create
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  Name, avatar, message, submit.
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-slate-200/80 bg-white/75 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  World
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  Move, approach, read, explore.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/70 pt-5 text-sm text-slate-700 md:flex-row md:items-center md:justify-between">
          <p>
            Built for a lightweight birthday memory world with simple geometry
            and clear interactions.
          </p>
          <div className="flex gap-4">
            <Link className="transition hover:text-slate-950" href="/admin">
              Admin
            </Link>
            <Link className="transition hover:text-slate-950" href="/world">
              Preview world
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
