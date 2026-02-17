import { Heart, Users, Shield, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";
import logo from "@/assets/chillzone-logo.png";

const features = [
  {
    icon: Shield,
    title: "Safe Space",
    description: "A therapeutic environment where young people can talk openly and receive guidance from experienced professionals.",
    color: "text-primary",
  },
  {
    icon: Users,
    title: "Community & Connection",
    description: "Leisure programmes, workshops, and group activities designed to build confidence and foster lasting friendships.",
    color: "text-coral",
  },
  {
    icon: Sparkles,
    title: "Personal Growth",
    description: "Nurturing life skills and emotional resilience, equipping young people with the tools to navigate adulthood.",
    color: "text-sunshine",
  },
  {
    icon: Heart,
    title: "Empowerment",
    description: "Supporting young people to take an active role in society as mature, engaged, and empowered individuals.",
    color: "text-pink",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-background/60" />
        <div className="relative z-10 container mx-auto px-6 text-center">
          <img src={logo} alt="ChillZone" className="animate-fade-up mx-auto h-40 sm:h-56 lg:h-64 w-auto drop-shadow-2xl" />
          <p className="animate-fade-up-delay-1 mx-auto mt-6 max-w-2xl text-lg text-foreground/80 sm:text-xl">
            Creating a safe, welcoming, and empowering space for young people within the Jewish community.
          </p>
          <div className="animate-fade-up-delay-2 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://www.charityextra.com/charity/chillzone"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-primary px-8 py-3 font-heading text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 shadow-lg shadow-primary/25"
            >
              Donate Now
            </a>
            <Link
              to="/contact"
              className="rounded-full border border-foreground/20 px-8 py-3 font-heading text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">
              Our <span className="text-gradient-teal">Mission</span>
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
              We recognise that growing up can bring unique challenges, and we're here to offer
              meaningful support every step of the way. ChillZone provides a therapeutic environment
              where young people can talk openly, receive guidance from experienced professionals, and
              build the emotional resilience they need to thrive.
            </p>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-24 bg-card/50">
        <div className="container mx-auto px-6">
          <h2 className="text-center font-heading text-3xl font-bold sm:text-4xl mb-16">
            What We <span className="text-gradient-warm">Do</span>
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className={`animate-fade-up-delay-${i > 2 ? 3 : i} group rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/30 hover:-translate-y-1`}
              >
                <feature.icon className={`${feature.color} mb-4`} size={32} />
                <h3 className="font-heading text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="rounded-3xl bg-muted p-12 sm:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-coral to-sunshine" />
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">
              Help Us Make a <span className="text-gradient-teal">Difference</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Your support helps us create a ripple effect that benefits both the individual and the wider community. Every donation counts.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://www.charityextra.com/charity/chillzone"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-primary px-8 py-3 font-heading text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
              >
                Donate via Charity Extra
              </a>
              <a
                href="https://donate.achisomoch.org/7093"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-primary/30 px-8 py-3 font-heading text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Donate via Achisomoch
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
