import Link from "next/link";
import { ArrowRight, ShieldCheck, Eye, Zap, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col overflow-x-hidden">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/5">
        <span className="font-black tracking-tighter text-lg">
          The Reputation Audit
        </span>
        <Link
          href="/login"
          className="text-sm text-zinc-400 hover:text-white transition-colors"
        >
          Sign In &rarr;
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-28 md:py-40 relative">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <span className="relative inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-indigo-400 border border-indigo-500/30 bg-indigo-500/10 rounded-full px-4 py-1.5 mb-8">
          <Star className="w-3 h-3" /> Master Your Reputation
        </span>

        <h1 className="relative text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6 max-w-4xl bg-gradient-to-br from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
          The Shortcut to <em className="not-italic text-indigo-400">Strategic</em> Self Improvement
        </h1>

        <p className="relative text-lg md:text-xl text-zinc-400 max-w-xl leading-relaxed mb-10">
          Gain the deep, anonymous insights you need to grow in every area of life. From your career to your closest relationships. Collect honest and effective feedback from colleagues, family, and friends.
        </p>

        <div className="relative flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/login"
            className="group flex items-center gap-2 bg-white text-black font-bold px-8 py-4 rounded-full hover:bg-zinc-100 transition-all shadow-lg hover:shadow-indigo-500/20 hover:shadow-2xl text-base"
          >
            Start Your Audit
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 md:px-12 py-20 max-w-5xl mx-auto w-full">
        <h2 className="text-center text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-12">
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <Zap className="w-5 h-5 text-indigo-400" />,
              step: "01",
              title: "Nominate your raters",
              desc: "Choose up to 20 people who know you best. Colleagues, close friends, family members, or even your toughest clients. We generate secure, anonymous links so they can speak freely.",
            },
            {
              icon: <Eye className="w-5 h-5 text-indigo-400" />,
              step: "02",
              title: "Collect candid honesty",
              desc: "Raters submit candid feedback anonymously. Our AI sanitizes responses to remove identifying language while preserving hard truths.",
            },
            {
              icon: <ShieldCheck className="w-5 h-5 text-indigo-400" />,
              step: "03",
              title: "Receive Your Growth Roadmap",
              desc: "Unlock your AI synthesized report. A forensic reputation audit that shows you exactly how you are perceived and provides a clear roadmap for self improvement.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-indigo-500/30 hover:bg-white/[0.07] transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-indigo-500/10 rounded-lg p-2">{item.icon}</div>
                <span className="text-xs font-bold text-zinc-500 tracking-widest">{item.step}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-6 md:px-12 pb-24 max-w-4xl mx-auto w-full">
        <div className="relative bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-3xl p-10 md:p-16 text-center overflow-hidden">
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
          <h2 className="relative text-3xl md:text-4xl font-black tracking-tight mb-4">
            Ready to master your reputation?
          </h2>
          <p className="relative text-zinc-400 max-w-md mx-auto mb-8">
            Gain the competitive advantage of knowing exactly how you are perceived by those who matter most.
          </p>
          <Link
            href="/login"
            className="relative inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-8 py-4 rounded-full transition-colors text-base"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/5 py-6 text-center text-zinc-600 text-sm">
        &copy; {new Date().getFullYear()} The Reputation Audit. All rights reserved.
      </footer>
    </div>
  );
}
