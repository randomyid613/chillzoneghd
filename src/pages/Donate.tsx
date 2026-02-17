import { Heart, ExternalLink } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Donate = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="absolute inset-0 bg-background/70" />
        <div className="relative z-10 text-center">
          <h1 className="animate-fade-up font-heading text-5xl font-bold sm:text-6xl">
            <span className="text-gradient-warm">Donate</span>
          </h1>
          <p className="animate-fade-up-delay-1 mt-4 text-foreground/70 text-lg">
            Your generosity changes lives
          </p>
        </div>
      </section>

      {/* Donate links */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-2xl space-y-8">
            <div className="text-center mb-12">
              <Heart className="mx-auto mb-4 text-coral" size={48} />
              <h2 className="font-heading text-2xl font-bold sm:text-3xl">
                Choose How to <span className="text-gradient-teal">Give</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                Every donation helps us create safe spaces and empower young people. Choose your preferred platform below.
              </p>
            </div>

            <a
              href="https://www.charityextra.com/charity/chillzone"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:-translate-y-1"
            >
              <div>
                <h3 className="font-heading text-xl font-semibold mb-1">Charity Extra</h3>
                <p className="text-sm text-muted-foreground">Donate through Charity Extra platform</p>
              </div>
              <ExternalLink className="text-muted-foreground group-hover:text-primary transition-colors" size={20} />
            </a>

            <a
              href="https://donate.achisomoch.org/7093"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-2xl border border-border bg-card p-8 transition-all hover:border-coral/50 hover:-translate-y-1"
            >
              <div>
                <h3 className="font-heading text-xl font-semibold mb-1">Achisomoch</h3>
                <p className="text-sm text-muted-foreground">Donate through Achisomoch</p>
              </div>
              <ExternalLink className="text-muted-foreground group-hover:text-coral transition-colors" size={20} />
            </a>

            <p className="text-center text-xs text-muted-foreground pt-4">
              ChillZone — Charity number: 1214818
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Donate;
