import Link from "next/link";
import { ArrowRight, ShieldCheck, Eye, Zap, Star } from "lucide-react";
import { getTenantConfig } from "@/lib/tenant";

export function RepStandingHero() {
  const config = getTenantConfig("repstanding");

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-x-hidden">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-border/40">
        <span className="font-serif font-black tracking-tight text-lg text-foreground">
          {config.title}
        </span>
        <Link
          href="/login"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Sign In &rarr;
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-28 md:py-40 relative">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <span className="relative inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary border border-primary/20 bg-primary/10 rounded-full px-4 py-1.5 mb-8">
          <Star className="w-3 h-3 animate-pulse" /> Master Your Reputation
        </span>

        <h1 className="relative text-5xl md:text-7xl font-serif font-black tracking-tight leading-none mb-6 max-w-4xl text-foreground">
          {config.vocabulary.heroTitle}
        </h1>

        <p className="relative text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed mb-10">
          {config.vocabulary.heroSubtitle}
        </p>

        <div className="relative flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/login"
            className="group flex items-center gap-2 bg-primary text-primary-foreground font-bold px-8 py-4 rounded-full hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20 hover:shadow-2xl text-base"
          >
            {config.vocabulary.ctaButton}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 md:px-12 py-20 max-w-5xl mx-auto w-full">
        <h2 className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-12">
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <Zap className="w-5 h-5 text-primary" />,
              step: "01",
              title: "Nominate your raters",
              desc: "Choose up to 20 people who know you best. Colleagues, clients, or managers. We generate secure, anonymous links so they can speak freely.",
            },
            {
              icon: <Eye className="w-5 h-5 text-primary" />,
              step: "02",
              title: "Collect candid honesty",
              desc: "Raters submit candid feedback anonymously. Our AI sanitizes responses to remove identifying language while preserving hard truths.",
            },
            {
              icon: <ShieldCheck className="w-5 h-5 text-primary" />,
              step: "03",
              title: "Receive your growth roadmap",
              desc: "Unlock your synthesized report. A forensic reputation audit that shows you exactly how you are perceived and provides a clear roadmap for self improvement.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 hover:bg-secondary/40 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 rounded-lg p-2">{item.icon}</div>
                <span className="text-xs font-bold text-muted-foreground tracking-widest">{item.step}</span>
              </div>
              <h3 className="text-lg font-serif font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-6 md:px-12 pb-24 max-w-4xl mx-auto w-full">
        <div className="relative bg-card border border-border rounded-3xl p-10 md:p-16 text-center overflow-hidden">
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <h2 className="relative text-3xl md:text-4xl font-serif font-black tracking-tight mb-4 text-foreground">
            Ready to master your reputation?
          </h2>
          <p className="relative text-muted-foreground max-w-md mx-auto mb-8">
            Gain the competitive advantage of knowing exactly how you are perceived by those who matter most.
          </p>
          <Link
            href="/login"
            className="relative inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-4 rounded-full transition-colors text-base"
          >
            {config.vocabulary.ctaButton} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border/40 py-6 text-center text-muted-foreground text-sm">
        &copy; {new Date().getFullYear()} {config.title}. All rights reserved.
      </footer>
    </div>
  );
}
