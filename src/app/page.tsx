export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold text-purple-400">AniFit</h1>
        <p className="text-lg text-gray-400 mt-2">Your training arc begins</p>
      </section>

      <section className="flex flex-col md:flex-row gap-6">
        <div className="bg-zinc-900 border border-purple-500 rounded-2xl p-6 w-64">
          <h2 className="text-xl font-semibold text-pink-400">Log Meal</h2>
          <p className="text-sm text-gray-400 mt-2">Track today's intake</p>
        </div>

        <div className="bg-zinc-900 border border-purple-500 rounded-2xl p-6 w-64">
          <h2 className="text-xl font-semibold text-pink-400">Train</h2>
          <p className="text-sm text-gray-400 mt-2">Log your workout</p>
        </div>

        <div className="bg-zinc-900 border border-purple-500 rounded-2xl p-6 w-64">
          <h2 className="text-xl font-semibold text-pink-400">Keep Streak</h2>
          <p className="text-sm text-gray-400 mt-2">Don't break the chain</p>
        </div>
      </section>
    </main>
  );
}