import { AvatarCreator } from "@/components/AvatarCreator";

export default function CreatePage() {
  return (
    <main className="min-h-screen px-4 py-6 md:px-6 lg:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl items-center">
        <AvatarCreator />
      </div>
    </main>
  );
}
