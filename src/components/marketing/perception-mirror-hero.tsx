import Link from "next/link";
import { ArrowRight, Compass, Eye, Sparkles, Sun } from "lucide-react";
import { getTenantConfig } from "@/lib/tenant";

export function PerceptionMirrorHero() {
  const config = getTenantConfig("perception_mirror");

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-x-hidden font-sans">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-6 border-b border-border/30">
        <span className="font-serif font-semibold tracking-wide text-2xl text-foreground italic">
          {config.title}
        </span>
        <Link
          href="/login"
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors tracking-wide"
        >
          Sign In &rarr;
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-32 md:py-48 relative max-w-5xl mx-auto w-full">
        {/* Calm Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-primary/10 rounded-full blur-[120px] pointer-events-none opacity-60 animate-pulse duration-[8000ms]" />

        <span className="relative inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-primary border border-primary/20 bg-primary/5 rounded-full px-5 py-2 mb-10 shadow-sm">
          <Sun className="w-3.5 h-3.5 animate-pulse text-primary" /> Shadow Work & Self-Alignment
        </span>

        <h1 className="relative text-5xl md:text-7xl font-serif font-normal tracking-tight leading-tight mb-8 max-w-4xl text-foreground">
          {config.vocabulary.heroTitle}
        </h1>

        <p className="relative text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-12 font-light">
          {config.vocabulary.heroSubtitle}
        </p>

        <div className="relative flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/login"
            className="group flex items-center gap-3 bg-primary text-primary-foreground font-medium px-10 py-5 rounded-full hover:bg-primary/95 transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] text-base tracking-wide"
          >
            {config.vocabulary.ctaButton}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 md:px-12 py-24 border-t border-border/20 bg-secondary/10 w-full">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-16">
            The Path of Reflection
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Compass className="w-6 h-6 text-primary" />,
                step: "I",
                title: "Nominate your inner circle",
                desc: "Choose up to 20 people who know you best. Friends, family, or mentors. We generate secure, anonymous links so they can share gentle, honest reflections.",
              },
              {
                icon: <Eye className="w-6 h-6 text-primary" />,
                step: "II",
                title: "Gather gentle reflections",
                desc: "Evaluators submit reflections anonymously. Our AI sanitizes responses to remove identifying details while preserving the authentic essence.",
              },
              {
                icon: <Sparkles className="w-6 h-6 text-primary" />,
                step: "III",
                title: "Reveal your true self",
                desc: "Unlock your synthesized report. A gentle, clear reflection of how you are experienced, offering a path for personal alignment and growth.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-card border border-border/60 rounded-3xl p-8 hover:border-primary/40 hover:bg-card/80 transition-all duration-500 shadow-sm hover:shadow-md hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="bg-primary/10 rounded-2xl p-3">{item.icon}</div>
                  <span className="font-serif italic text-lg text-primary/60 tracking-wider">{item.step}</span>
                </div>
                <h3 className="text-xl font-serif font-medium text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-6 md:px-12 py-28 max-w-4xl mx-auto w-full">
        <div className="relative bg-card border border-border/80 rounded-3xl p-12 md:p-20 text-center overflow-hidden shadow-md">
          {/* Subtle Accent Glow */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
          
          <h2 className="relative text-3.5xl md:text-5xl font-serif font-normal tracking-tight mb-6 text-foreground">
            Ready to align your growth?
          </h2>
          <p className="relative text-muted-foreground max-w-lg mx-auto mb-10 font-light leading-relaxed font-sans">
            Uncover how you are experienced by those who matter most in your life.
          </p>
          <Link
            href="/login"
            className="relative inline-flex items-center gap-3 bg-primary hover:bg-primary/95 text-primary-foreground font-medium px-10 py-5 rounded-full transition-all hover:scale-[1.02] shadow-sm hover:shadow text-base tracking-wide"
          >
            {config.vocabulary.ctaButton} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border/20 py-8 text-center text-muted-foreground text-xs tracking-wider font-light uppercase">
        &copy; {new Date().getFullYear()} {config.title}. All rights reserved.
      </footer>
    </div>
  );
}
