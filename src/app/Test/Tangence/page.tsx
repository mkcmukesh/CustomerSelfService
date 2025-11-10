'use client';
import React, { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Menu,
  X,
  Sparkles,
  Check,
  Star,
  Play,
  Building2,
  Users2,
  Rocket,
  BadgeCheck,
  Globe2,
  Briefcase,
} from "lucide-react";

// NOTE: This is an original, Tangence-inspired corporate/agency layout.
// Avoid copying Tangence's exact copy, images, or trademarks to respect IP.
// Drop this component into a Vite + React + TypeScript + Tailwind + DaisyUI project.
// Make sure Tailwind + DaisyUI + Framer Motion + lucide-react are installed.
// Example installs:
//   npm i framer-motion lucide-react
//   (DaisyUI via tailwind.config plugin)

// ---- Types ----
type NavItem = { label: string; href: string };
type Service = { icon: ReactNode; title: string; desc: string };
type WorkItem = { title: string; desc: string; img: string; tags: string[] };
type Testimonial = { quote: string; name: string; title: string };
type Stat = { value: string; label: string };

// ---- Mock data (replace with your real content) ----
const NAV_ITEMS: NavItem[] = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Insights", href: "#insights" },
  { label: "Contact", href: "#contact" },
];

const SERVICES: Service[] = [
  {
    icon: <Rocket aria-hidden />,
    title: "Brand Strategy",
    desc: "Positioning, messaging, and identity systems that stand out.",
  },
  {
    icon: <Globe2 aria-hidden />,
    title: "Web & App",
    desc: "Design, build, and optimize high-performance digital experiences.",
  },
  {
    icon: <Users2 aria-hidden />,
    title: "Growth Marketing",
    desc: "Campaigns, SEO/SEM, and analytics to fuel pipeline and revenue.",
  },
  {
    icon: <Briefcase aria-hidden />,
    title: "B2B Content",
    desc: "Case studies, thought leadership, and sales enablement assets.",
  },
  {
    icon: <Building2 aria-hidden />,
    title: "Enterprise UX",
    desc: "Research-driven product UX for complex workflows.",
  },
  {
    icon: <BadgeCheck aria-hidden />,
    title: "Design Ops",
    desc: "Systems, tokens, and component libraries at scale.",
  },
];

const LOGOS: string[] = [
  "https://dummyimage.com/140x48/ebebeb/333333&text=Client+1",
  "https://dummyimage.com/140x48/ebebeb/333333&text=Client+2",
  "https://dummyimage.com/140x48/ebebeb/333333&text=Client+3",
  "https://dummyimage.com/140x48/ebebeb/333333&text=Client+4",
  "https://dummyimage.com/140x48/ebebeb/333333&text=Client+5",
  "https://dummyimage.com/140x48/ebebeb/333333&text=Client+6",
];

const WORK: WorkItem[] = [
  {
    title: "SaaS Revamp",
    desc: "Modernized brand and conversion-focused site. +38% signups.",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400&auto=format&fit=crop",
    tags: ["UX", "Web", "Brand"],
  },
  {
    title: "Fintech Launch",
    desc: "End-to-end go-to-market creative and product storytelling.",
    img: "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1400&auto=format&fit=crop",
    tags: ["Campaign", "Content"],
  },
  {
    title: "B2B Platform",
    desc: "Design system + docs enabling 10+ product squads.",
    img: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1400&auto=format&fit=crop",
    tags: ["Design System", "Docs"],
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "They turned complex ideas into a clean story and a conversion machine.",
    name: "Priya Sharma",
    title: "VP Marketing, CloudSuite",
  },
  {
    quote:
      "Rock-solid partner from strategy to ship. Our team velocity jumped.",
    name: "Amit Verma",
    title: "Head of Product, FinEdge",
  },
];

const STATS: Stat[] = [
  { value: "120+", label: "Projects Delivered" },
  { value: "8.9/10", label: "CSAT" },
  { value: "32%", label: "Avg. CVR Lift" },
  { value: "14", label: "Industries" },
];

const NavBar: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className="navbar bg-base-100 sticky top-0 z-50 border-b border-base-200/60">
      <div className="navbar-start">
        <button className="btn btn-ghost gap-2 text-xl font-bold">
          <Sparkles className="size-5" aria-hidden />
          Jindal Creative
        </button>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {NAV_ITEMS.map((n) => (
            <li key={n.label}>
              <a href={n.href}>{n.label}</a>
            </li>
          ))}
        </ul>
      </div>
      <div className="navbar-end gap-2">
        <a
          href="#contact"
          className="btn btn-primary btn-sm hidden md:inline-flex"
        >
          Start a Project <ArrowRight className="size-4" aria-hidden />
        </a>
        <button
          className="btn btn-ghost lg:hidden"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="size-5" aria-hidden />
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 bg-base-300/50 transition-opacity ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />
      <div
        className={`fixed right-0 top-0 h-full w-80 bg-base-100 shadow-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-base-200">
          <span className="font-semibold">Menu</span>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
        <ul className="menu p-4">
          {NAV_ITEMS.map((n) => (
            <li key={n.label}>
              <a href={n.href} onClick={() => setOpen(false)}>
                {n.label}
              </a>
            </li>
          ))}
          <li className="mt-4">
            <a href="#contact" className="btn btn-primary">
              Start a Project
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="badge badge-primary badge-lg mb-4 gap-2">
            <Star className="size-4" aria-hidden /> B2B Creative Partner
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Crafting brands & websites
            <span className="block text-primary">that drive pipeline.</span>
          </h1>
          <p className="mt-5 text-base md:text-lg text-base-content/70 max-w-xl">
            Strategy, design, and growth under one roof. We turn complexity into
            clarity—and clicks into customers.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#work" className="btn btn-primary">
              See Our Work <ArrowRight className="size-4" aria-hidden />
            </a>
            <a href="#services" className="btn btn-outline">
              Explore Services
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-6 text-sm text-base-content/60">
            <div className="flex items-center gap-2">
              <Check className="size-4" aria-hidden /> Enterprise-ready
            </div>
            <div className="flex items-center gap-2">
              <Check className="size-4" aria-hidden /> Fast turnaround
            </div>
            <div className="flex items-center gap-2">
              <Check className="size-4" aria-hidden /> Results-obsessed
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1600&auto=format&fit=crop"
              alt="Creative agency team at work"
              className="w-full h-[360px] md:h-[520px] object-cover"
              loading="lazy"
            />
            <button className="btn btn-circle btn-primary absolute bottom-4 left-4">
              <Play className="size-4" aria-hidden />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const LogoMarquee: React.FC = () => {
  return (
    <section
      className="py-10 border-y border-base-200/60 bg-base-100"
      aria-label="client logos"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="animate-[scroll_25s_linear_infinite] flex gap-10 min-w-max">
            {LOGOS.concat(LOGOS).map((src, i) => (
              <img
                key={`${src}-${i}`}
                src={src}
                alt="Client logo"
                className="h-10 opacity-70 hover:opacity-100 transition-opacity"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes scroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }`}</style>
    </section>
  );
};

const Services: React.FC = () => {
  return (
    <section id="services" className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-2xl mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold">Services</h2>
        <p className="mt-3 text-base-content/70">
          Pick the pod you need—or go end-to-end.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICES.map((s) => (
          <div
            key={s.title}
            className="card bg-base-100 border border-base-200 hover:shadow-xl transition-shadow"
          >
            <div className="card-body">
              <div className="size-11 rounded-2xl bg-primary/10 text-primary grid place-items-center mb-4">
                {s.icon}
              </div>
              <h3 className="card-title">{s.title}</h3>
              <p className="text-base-content/70">{s.desc}</p>
              <div className="card-actions mt-4">
                <button className="btn btn-link p-0">Learn more</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const Work: React.FC = () => {
  return (
    <section id="work" className="container mx-auto px-4 py-16 md:py-24">
      <div className="flex items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold">Selected Work</h2>
          <p className="mt-3 text-base-content/70">
            Outcomes over outputs. Here are a few highlights.
          </p>
        </div>
        <a href="#" className="btn btn-outline">
          View all
        </a>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {WORK.map((w) => (
          <div
            key={w.title}
            className="card bg-base-100 border border-base-200 hover:shadow-xl group transition-shadow overflow-hidden"
          >
            <figure className="aspect-[4/3] overflow-hidden">
              <img
                src={w.img}
                alt={w.title}
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform"
                loading="lazy"
              />
            </figure>
            <div className="card-body">
              <div className="flex flex-wrap gap-2 text-xs">
                {w.tags.map((t) => (
                  <span key={`${w.title}-${t}`} className="badge badge-ghost">
                    {t}
                  </span>
                ))}
              </div>
              <h3 className="card-title mt-2">{w.title}</h3>
              <p className="text-base-content/70">{w.desc}</p>
              <div className="card-actions mt-2">
                <button className="btn btn-link p-0">Case study</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const Stats: React.FC = () => {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-base-200 p-6 text-center"
          >
            <div className="text-3xl md:text-4xl font-extrabold">{s.value}</div>
            <div className="mt-1 text-sm text-base-content/70">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

const Testimonials: React.FC = () => {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-2xl mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold">
          People say nice things
        </h2>
        <p className="mt-3 text-base-content/70">
          Proof from folks who shipped with us.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {TESTIMONIALS.map((t) => (
          <div key={t.name} className="card bg-base-100 border border-base-200">
            <div className="card-body">
              <p className="text-lg">“{t.quote}”</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="avatar placeholder">
                  <div className="bg-neutral text-neutral-content w-10 rounded-full">
                    <span>
                      <Star className="size-4" aria-hidden />
                    </span>
                  </div>
                </div>
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-xs text-base-content/70">{t.title}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const CTA: React.FC = () => {
  return (
    <section id="contact" className="container mx-auto px-4 py-16 md:py-24">
      <div className="rounded-3xl bg-gradient-to-tr from-primary to-primary/70 text-primary-content p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div>
          <h3 className="text-2xl md:text-3xl font-extrabold">
            Have an ambitious brief?
          </h3>
          <p className="mt-2 opacity-90">
            Let’s co-create something your sales team will love.
          </p>
        </div>
        <a className="btn btn-lg" href="mailto:hello@example.com">
          Book a call
        </a>
      </div>
    </section>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-base-200/60 border-t border-base-300">
      <div className="container mx-auto px-4 py-12 grid md:grid-cols-4 gap-8">
        <div>
          <div className="font-extrabold text-lg">Jindal Creative</div>
          <p className="mt-3 text-sm text-base-content/70 max-w-xs">
            A small, senior team building brands and products that sell.
          </p>
        </div>
        <div>
          <div className="font-semibold mb-3">Company</div>
          <ul className="space-y-2 text-sm">
            <li>
              <a className="link link-hover" href="#about">
                About
              </a>
            </li>
            <li>
              <a className="link link-hover" href="#insights">
                Insights
              </a>
            </li>
            <li>
              <a className="link link-hover" href="#work">
                Our Work
              </a>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">Services</div>
          <ul className="space-y-2 text-sm">
            {SERVICES.slice(0, 5).map((s) => (
              <li key={s.title}>
                <a className="link link-hover" href="#services">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">Stay in the loop</div>
          <div className="join w-full">
            <input
              type="email"
              placeholder="you@company.com"
              className="input input-bordered join-item w-full"
            />
            <button className="btn btn-primary join-item">Subscribe</button>
          </div>
        </div>
      </div>
      <div className="border-t border-base-300">
        <div className="container mx-auto px-4 py-6 text-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            © {new Date().getFullYear()} Jindal Creative. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <a className="link link-hover" href="#">
              Privacy
            </a>
            <a className="link link-hover" href="#">
              Terms
            </a>
            <a className="link link-hover" href="#">
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function AgencyLayoutTangenceInspired(): JSX.Element {
  return (
    <main data-theme="light" className="min-h-dvh bg-base-100">
      <NavBar />
      <Hero />
      <LogoMarquee />
      <Services />
      <Work />
      <Stats />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
