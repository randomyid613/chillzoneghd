import { useEffect, useRef, useState } from "react";
import {
  Palette,
  HeartHandshake,
  Globe2,
  Coffee,
  ChevronLeft,
  ChevronRight,
  Quote,
  ArrowDown,
} from "lucide-react";
import SEO from "@/components/SEO";
import logo from "@/assets/chillzone-logo.webp";
import lotteryLogo from "@/assets/national-lottery-logo.png";
import heroImage from "@/assets/lottery-impact-hero.jpg";

/* ---------- Editable content ---------- */

const deliverables = [
  {
    icon: Palette,
    title: "Creative Workshops",
    color: "text-sunshine",
    items: ["Painting", "Jewellery making", "Gem art", "Clay modelling", "Baking"],
  },
  {
    icon: HeartHandshake,
    title: "Wellbeing Support",
    color: "text-pink",
    items: [
      "Partnership with a local NHS chaplain",
      "Mental health framework",
      "Round-table discussions",
      "Access to professional support",
    ],
  },
  {
    icon: Globe2,
    title: "Community Activities",
    color: "text-primary",
    items: [
      "Bowling",
      "Beach BBQs",
      "Dance evenings",
      "CPR training",
      "Gym sessions",
      "Seasonal events",
    ],
  },
  {
    icon: Coffee,
    title: "Safe Drop-in Space",
    color: "text-coral",
    items: ["Hot drinks", "Games", "Quiet spaces", "Trusted adults", "Peer friendships"],
  },
];

// Edit these numbers as the project grows.
const stats = [
  { value: 40, suffix: "+", label: "Weekly drop-in sessions" },
  { value: 65, suffix: "+", label: "Girls supported" },
  { value: 120, suffix: "+", label: "Creative activities delivered" },
  { value: 25, suffix: "+", label: "Community events" },
  { value: 30, suffix: "+", label: "Professional wellbeing sessions" },
  { value: 12, suffix: "", label: "Volunteer mentors" },
];

const testimonials = [
  {
    quote:
      "Before I found Chill Zone, I spent most evenings at home and didn't really have anyone outside of school to talk to. Coming to the sessions gave me something to look forward to every week… Chill Zone has helped me become more confident and now I encourage other girls to come along too.",
    author: "Participant, aged 17",
  },
  {
    quote:
      "Since joining Chill Zone I've seen a real change in my daughter's confidence and happiness. She has made genuine friendships and finally feels she belongs somewhere. We're incredibly grateful to Chill Zone and The National Lottery Community Fund.",
    author: "Parent of a participant",
  },
];

const timeline = [
  { title: "Funding awarded", text: "The National Lottery Community Fund backed our vision for young women in Gateshead." },
  { title: "Project launched", text: "Our safe, welcoming space opened its doors to girls aged 15–22." },
  { title: "Weekly sessions began", text: "Regular after-school drop-ins became a fixture of the week." },
  { title: "Mental wellbeing programme introduced", text: "Developed in partnership with a local NHS chaplain." },
  { title: "Community trips expanded", text: "Bowling, beach BBQs, gym sessions and seasonal celebrations." },
  { title: "Project successfully completed", text: "Lasting friendships, greater confidence and a real sense of belonging." },
];

/* ---------- Helpers ---------- */

const useInView = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
};

const StatCounter = ({ value, suffix, label }: { value: number; suffix: string; label: string }) => {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value]);

  return (
    <div
      ref={ref}
      className="rounded-2xl border border-border bg-card p-8 text-center transition-all hover:-translate-y-1 hover:border-primary/30"
    >
      <p className="font-heading text-4xl font-bold text-gradient-teal sm:text-5xl">
        {count}
        {suffix}
      </p>
      <p className="mt-3 text-sm text-muted-foreground">{label}</p>
    </div>
  );
};

const LotteryImpact = () => {
  const [active, setActive] = useState(0);
  const total = testimonials.length;
  const go = (dir: number) => setActive((i) => (i + dir + total) % total);

  return (
    <div className="min-h-screen">
      <SEO
        title="National Lottery Community Fund Impact | ChillZone Gateshead"
        description="How National Lottery Community Fund funding helps ChillZone give girls aged 15–22 in Gateshead a safe space to socialise, build confidence and belong."
        path="/impact"
        image="/impact-og.jpg"
        imageAlt="Girls enjoying creative activities together at a ChillZone session in Gateshead"
        twitterCard="summary_large_image"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "The National Lottery Community Fund Impact — ChillZone",
          url: "https://chillzone.org.uk/impact",
          description:
            "How National Lottery Community Fund funding helps ChillZone give girls aged 15–22 in Gateshead a safe space to socialise, build confidence and belong.",
          primaryImageOfPage: "https://chillzone.org.uk/impact-og.jpg",
          about: {
            "@type": "Project",
            name: "Helping Teenage Girls in Gateshead Socialise and Develop Together",
            funder: { "@type": "Organization", name: "The National Lottery Community Fund" },
            areaServed: "Gateshead, United Kingdom",
          },
          publisher: { "@type": "NGO", name: "ChillZone", url: "https://chillzone.org.uk" },
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 opacity-70" style={{ background: "var(--gradient-hero)" }} />
        <div className="relative container mx-auto grid items-center gap-12 px-6 lg:grid-cols-2">
          <div>
            <div className="animate-fade-up flex flex-wrap items-center gap-5">
              <img src={logo} alt="ChillZone" width={600} height={600} className="h-16 w-auto" />
              <img
                src={lotteryLogo}
                alt="The National Lottery Community Fund"
                className="h-16 w-auto rounded bg-foreground/90 p-2"
              />
            </div>
            <h1 className="animate-fade-up-delay-1 mt-8 font-heading text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Helping Teenage Girls in Gateshead{" "}
              <span className="text-gradient-warm">Socialise and Develop Together</span>
            </h1>
            <p className="animate-fade-up-delay-2 mt-6 max-w-xl text-lg leading-relaxed text-foreground/80">
              Thanks to funding from The National Lottery Community Fund, Chill Zone has created a safe,
              welcoming space where girls aged 15–22 can socialise, build confidence, improve their
              wellbeing and develop lasting friendships.
            </p>
            <a
              href="#our-journey"
              className="animate-fade-up-delay-3 mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-heading text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-105"
            >
              View Our Journey <ArrowDown size={16} />
            </a>
          </div>

          <div className="animate-fade-up-delay-2 relative">
            <div className="absolute -inset-3 rounded-[2rem] opacity-60 blur-2xl" style={{ background: "var(--gradient-warm)" }} />
            <img
              src={heroImage}
              alt="Girls enjoying creative activities together at a ChillZone session"
              width={1600}
              height={1008}
              className="relative rounded-3xl border border-border object-cover shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* About the project */}
      <section className="py-24">
        <div className="container mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-heading text-3xl font-bold sm:text-4xl">
            About the <span className="text-gradient-teal">Project</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Funding from The National Lottery Community Fund enabled Chill Zone to deliver regular
            after-school drop-in sessions, creative workshops, wellbeing activities, community trips and
            peer support for young women in Gateshead.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            The project removed financial barriers by providing free activities, refreshments and support,
            ensuring every young person could participate regardless of their circumstances.
          </p>
        </div>
      </section>

      {/* What we delivered */}
      <section className="bg-card/50 py-24">
        <div className="container mx-auto px-6">
          <h2 className="mb-16 text-center font-heading text-3xl font-bold sm:text-4xl">
            What We <span className="text-gradient-warm">Delivered</span>
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {deliverables.map((d) => (
              <div
                key={d.title}
                className="group rounded-2xl border border-border bg-card p-8 transition-all hover:-translate-y-1 hover:border-primary/30"
              >
                <d.icon className={`${d.color} mb-4 transition-transform group-hover:scale-110`} size={32} />
                <h3 className="font-heading text-lg font-semibold">{d.title}</h3>
                <ul className="mt-4 space-y-2">
                  {d.items.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-center font-heading text-3xl font-bold sm:text-4xl">
            Our <span className="text-gradient-teal">Impact</span>
          </h2>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((s) => (
              <StatCounter key={s.label} {...s} />
            ))}
          </div>
          <p className="mt-10 text-center text-sm italic text-muted-foreground">
            Figures are updated as the project grows.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-card/50 py-24">
        <div className="container mx-auto max-w-3xl px-6">
          <h2 className="text-center font-heading text-3xl font-bold sm:text-4xl">
            Participant <span className="text-gradient-warm">Voices</span>
          </h2>

          <div className="mt-12 rounded-3xl border border-border bg-card p-8 sm:p-12">
            <Quote className="text-coral" size={32} />
            <blockquote key={active} className="animate-fade-up mt-6 text-lg leading-relaxed text-foreground/90">
              “{testimonials[active].quote}”
            </blockquote>
            <p className="mt-6 font-heading text-sm font-semibold text-primary">
              {testimonials[active].author}
            </p>

            <div className="mt-8 flex items-center justify-between">
              <div className="flex gap-2">
                {testimonials.map((t, i) => (
                  <button
                    key={t.author}
                    onClick={() => setActive(i)}
                    aria-label={`Show testimonial ${i + 1}`}
                    aria-current={i === active}
                    className={`h-2 rounded-full transition-all ${i === active ? "w-8 bg-primary" : "w-2 bg-border"}`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => go(-1)}
                  aria-label="Previous testimonial"
                  className="rounded-full border border-border p-2 text-foreground/70 transition-colors hover:border-primary hover:text-primary"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => go(1)}
                  aria-label="Next testimonial"
                  className="rounded-full border border-border p-2 text-foreground/70 transition-colors hover:border-primary hover:text-primary"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section id="our-journey" className="scroll-mt-24 py-24">
        <div className="container mx-auto max-w-3xl px-6">
          <h2 className="text-center font-heading text-3xl font-bold sm:text-4xl">
            How the <span className="text-gradient-teal">Funding Helped</span>
          </h2>
          <ol className="relative mt-16 space-y-10 border-l border-border pl-8">
            {timeline.map((step) => (
              <li key={step.title} className="relative">
                <span className="absolute -left-[2.55rem] mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/20">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                </span>
                <h3 className="font-heading text-lg font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Thank you */}
      <section className="relative overflow-hidden py-28">
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="relative container mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-heading text-4xl font-bold sm:text-5xl">
            Thank <span className="text-gradient-warm">You</span>
          </h2>
          <p className="mx-auto mt-6 text-lg leading-relaxed text-foreground/80">
            We are incredibly grateful to The National Lottery Community Fund for believing in our vision
            and investing in the wellbeing of young women in Gateshead. This funding has enabled us to
            create a safe place where girls can connect, grow in confidence and feel that they truly belong.
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
            <img src={logo} alt="ChillZone" width={600} height={600} className="h-20 w-auto" />
            <img
              src={lotteryLogo}
              alt="The National Lottery Community Fund"
              className="h-20 w-auto rounded bg-foreground/90 p-3"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default LotteryImpact;
