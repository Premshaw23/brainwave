import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-20 bg-white border-b">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/brain.png"
              alt="BrainWave Logo"
              width={40}
              height={40}
            />
            <span className="text-2xl font-bold tracking-tight">
              BrainWave
            </span>
          </div>

          <nav className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-indigo-50 via-purple-50 to-white" />
        <div className="relative max-w-7xl mx-auto px-8 py-28 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-5xl font-extrabold leading-tight mb-6">
              Learn Faster with
              <span className="text-indigo-600"> AI</span><br />
              That Actually Helps
            </h1>

            <p className="text-lg text-gray-600 max-w-xl mb-10">
              Turn notes into smart flashcards, quizzes, and insights.
              Track mastery, stay consistent, and study together — all in one place.
            </p>

            <div className="flex gap-4">
              <Link
                href="/signup"
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Start Free
              </Link>
              <Link
                href="/community"
                className="px-8 py-3 rounded-lg font-semibold text-indigo-600 hover:bg-indigo-50 transition"
              >
                Explore Community
              </Link>
            </div>
          </div>

          <div className="hidden md:block">
            <Image
              src="/dashboard-screenshot.png"
              alt="BrainWave Dashboard"
              width={520}
              height={360}
              className="rounded-2xl shadow-2xl border"
            />
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-center mb-16">
            Everything you need to learn smarter
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl border hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-3">
                AI Flashcards & Quizzes
              </h3>
              <p className="text-gray-600">
                Upload notes or PDFs and instantly generate
                adaptive flashcards and MCQs.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl border hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-3">
                Progress Analytics
              </h3>
              <p className="text-gray-600">
                Track streaks, accuracy, and topic mastery
                with clean visual analytics.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl border hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-3">
                Study Groups
              </h3>
              <p className="text-gray-600">
                Collaborate with friends, chat in real time,
                and stay accountable together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-indigo-600 text-white">
        <div className="max-w-5xl mx-auto px-8 py-20 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to level up your learning?
          </h2>
          <p className="text-indigo-100 mb-10 text-lg">
            Join BrainWave and experience AI-powered studying today.
          </p>
          <Link
            href="/signup"
            className="bg-white text-indigo-700 px-10 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-900 text-gray-400 text-sm">
        <div className="max-w-7xl mx-auto px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <span>© {new Date().getFullYear()} BrainWave</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/contact" className="hover:text-white">
              Contact
            </Link>
            <a
              href="https://github.com/Premshaw23/brainwave"
              target="_blank"
              className="hover:text-white"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
