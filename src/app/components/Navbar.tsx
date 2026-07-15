import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full flex justify-center gap-8 py-4 border-b border-purple-500 bg-zinc-950 text-purple-300">
      <Link href="/" className="hover:text-pink-400">Home</Link>
      <Link href="/train" className="hover:text-pink-400">Train</Link>
      <Link href="/nutrition" className="hover:text-pink-400">Nutrition</Link>
    </nav>
  );
}