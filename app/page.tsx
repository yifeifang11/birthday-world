import Link from "next/link";

export default function Home() {
  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ fontFamily: "Comic Sans MS, Comic Sans, cursive" }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,_#ffd700_0%,_#ff69b4_25%,_#87ceeb_50%,_#98fb98_75%,_#ffa500_100%)]" />
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-300 rounded-full transform -rotate-12" />
        <div className="absolute top-32 right-20 w-48 h-48 bg-pink-200 rounded-full transform rotate-45" />
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-blue-300 rounded-full transform rotate-12" />
        <div className="absolute bottom-32 right-10 w-36 h-36 bg-green-300 rounded-full transform -rotate-45" />
        <div className="absolute top-1/2 right-1/4 w-28 h-28 bg-orange-300 rounded-full transform rotate-20" />
      </div>
      <section className="relative flex min-h-screen w-full flex-col items-center justify-center gap-8 px-6 py-8">
        <div className="max-w-2xl text-center">
          <h1
            className="text-6xl md:text-7xl font-black tracking-tight text-slate-950 drop-shadow-lg transform -rotate-2"
            style={{
              textShadow:
                "4px 4px 0px rgba(255,192,203,0.8), 8px 8px 0px rgba(173,216,230,0.6)",
            }}
          >
            WELCOME!
          </h1>
          <div className="mt-12 space-y-6 text-xl md:text-2xl leading-relaxed text-slate-900 font-bold">
            <p className="transform rotate-1 bg-white/80 rounded-3xl p-4 inline-block">
              First,{" "}
              <span className="text-pink-600">customize your avatar</span> to
              make it uniquely yours! ✨
            </p>
            <p className="transform -rotate-2 bg-white/80 rounded-3xl p-4 inline-block">
              Then <span className="text-blue-600">explore the world</span>{" "}
              using the{" "}
              <span className="bg-yellow-300 px-2 rounded font-mono text-lg">
                W
              </span>
              ,{" "}
              <span className="bg-green-300 px-2 rounded font-mono text-lg">
                A
              </span>
              ,{" "}
              <span className="bg-orange-300 px-2 rounded font-mono text-lg">
                S
              </span>
              ,{" "}
              <span className="bg-pink-300 px-2 rounded font-mono text-lg">
                D
              </span>{" "}
              keys! 🎮
            </p>
          </div>
        </div>

        <Link
          className="mt-12 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 px-12 py-5 text-2xl font-black text-white shadow-[8px_8px_0px_rgba(0,0,0,0.3)] transition transform hover:scale-110 hover:-rotate-1 border-4 border-white"
          href="/explore"
        >
          🎉 ENTER 🎉
        </Link>
      </section>
    </main>
  );
}
