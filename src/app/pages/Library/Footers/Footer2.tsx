
"use client";
import React from "react";

// --- Add below your imports or near the bottom of the file ---

function BadgeIcon({
  kind,
  label, // not used here but handy if you later brand per label
}: {
  kind: "cert" | "pay" | "app";
  label: string;
}) {
  // Generic brand-agnostic glyphs; swap with your logos as needed
  if (kind === "cert") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="currentColor" />
        <path d="M8 12l2 2 4-4" stroke="#0B0F19" strokeWidth="2" fill="none" />
      </svg>
    );
  }
  if (kind === "pay") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="6" width="18" height="12" rx="3" fill="currentColor" />
        <rect x="6" y="10" width="5" height="2" fill="#0B0F19" />
        <rect x="13" y="10" width="5" height="2" fill="#0B0F19" />
      </svg>
    );
  }
  // kind === "app"
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="4" width="14" height="16" rx="3" fill="currentColor" />
      <circle cx="12" cy="18" r="1.2" fill="#0B0F19" />
    </svg>
  );
}

function QuickRFQ() {
  return (
    <form onSubmit={(e)=>e.preventDefault()}
      className="rounded-2xl border border-white/10 bg-white/5 p-3 grid gap-2 sm:grid-cols-5">
      <input className="rounded-lg bg-slate-900/60 px-3 py-2 text-sm" placeholder="Material / Grade" />
      <input className="rounded-lg bg-slate-900/60 px-3 py-2 text-sm" placeholder="Thickness (mm)" />
      <input className="rounded-lg bg-slate-900/60 px-3 py-2 text-sm" placeholder="Width (mm)" />
      <input className="rounded-lg bg-slate-900/60 px-3 py-2 text-sm" placeholder="Quantity" />
      <button className="rounded-lg border border-cyan-300/30 bg-cyan-400/10 px-3 py-2 text-sm hover:bg-cyan-400/15">
        Get Quote
      </button>
    </form>
  );
}

function OrdersReturns() {
  const links = [
    {label:"Track Order", href:"#"},
    {label:"Start a Return (RMA)", href:"#"},
    {label:"Exchange an Item", href:"#"},
    {label:"Warranty Claim", href:"#"},
    {label:"GST Invoice Download", href:"#"},
  ];
  return (
    <div>
      <h4 className="text-sm font-semibold opacity-90">Orders & Returns</h4>
      <ul className="mt-2 list-disc list-outside pl-5 marker:text-slate-500/70 text-sm space-y-1">
        {links.map(l=>(
          <li key={l.label}><a className="hover:underline" href={l.href}>{l.label}</a></li>
        ))}
      </ul>
      <p className="mt-2 text-xs opacity-70">Free returns within 30 days. COD available on eligible orders.</p>
    </div>
  );
}

function TechnicalLibrary() {
  const docs = [
    {label:"Datasheets", href:"#"},
    {label:"Material Safety (MSDS)", href:"#"},
    {label:"TDS & Specs", href:"#"},
    {label:"QA Certificates (ISO/BIS)", href:"#"},
    {label:"CAD/STEP Drawings", href:"#"},
  ];
  return (
    <div>
      <h4 className="text-sm font-semibold opacity-90">Technical Library</h4>
      <ul className="mt-2 list-disc list-outside pl-5 marker:text-slate-500/70 text-sm space-y-1">
        {docs.map(d=>(
          <li key={d.label}><a className="hover:underline" href={d.href}>{d.label}</a></li>
        ))}
      </ul>
    </div>
  );
}

function LocatorCTA() {
  return (
    <a href="#locator"
      className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10">
      Find a Store / Distributor
      <svg width="14" height="14" viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
    </a>
  );
}



/**
 * Footer07 – Mega Footer with Bullets + Icons
 * - Bullets: list-disc + marker color
 * - Icons: per-item icons for each section (inline SVG; no external deps)
 */

type LinkItem = { label: string; href: string; external?: boolean; badge?: string };
type Address = { label: string; lines: string[]; maps?: string };

const YEAR = new Date().getFullYear();

const PRODUCTS: LinkItem[] = [
  { label: "Steel Sheets", href: "#" },
  { label: "Alloy Bars", href: "#" },
  { label: "Pipes & Tubes", href: "#" },
  { label: "Profiles & Beams", href: "#" },
  { label: "Coils", href: "#" },
];

const SOLUTIONS: LinkItem[] = [
  { label: "Custom Fabrication", href: "#" },
  { label: "Supply Chain & Logistics", href: "#" },
  { label: "QA / Testing", href: "#" },
  { label: "Cut-to-Length", href: "#" },
  { label: "Surface Treatment", href: "#" },
];

const RESOURCES: LinkItem[] = [
  { label: "Datasheets", href: "#" },
  { label: "Specifications", href: "#" },
  { label: "Certificates", href: "#" },
  { label: "Case Studies", href: "#" },
  { label: "Blog", href: "#" },
];

const COMPANY: LinkItem[] = [
  { label: "About Us", href: "#" },
  { label: "Leadership", href: "#" },
  { label: "Careers", href: "#", badge: "Hiring" },
  { label: "Newsroom", href: "#" },
  { label: "CSR", href: "#" },
];

const SUPPORT: LinkItem[] = [
  { label: "Help Center", href: "#" },
  { label: "Contact Support", href: "#" },
  { label: "Order Tracking", href: "#" },
  { label: "Warranty", href: "#" },
  { label: "API Status", href: "#" },
];

const LEGAL: LinkItem[] = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Use", href: "#" },
  { label: "Compliance", href: "#" },
  { label: "Cookies", href: "#" },
  { label: "Sustainability", href: "#" },
];

const INDUSTRIES: LinkItem[] = [
  { label: "Construction", href: "#" },
  { label: "Automotive", href: "#" },
  { label: "Energy & Power", href: "#" },
  { label: "Aerospace", href: "#" },
  { label: "Infrastructure", href: "#" },
];

const ADDRESSES: Address[] = [
  {
    label: "Headquarters",
    lines: [
      "Unit 501, Industrial Estate",
      "City, State 400001",
      "India",
    ],
    maps: "#",
  },
  {
    label: "Plant – East",
    lines: ["Plot 12, SEZ Zone", "Eastern City 700091", "India"],
    maps: "#",
  },
  {
    label: "Plant – West",
    lines: ["Block C, Logistics Park", "Western City 380015", "India"],
    maps: "#",
  },
];

const SOCIAL: LinkItem[] = [
  { label: "LinkedIn", href: "#" },
  { label: "X", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "YouTube", href: "#" },
  { label: "WhatsApp", href: "#" },
];

const CERTS: LinkItem[] = [
  { label: "ISO 9001", href: "#" },
  { label: "ISO 14001", href: "#" },
  { label: "OHSAS 18001", href: "#" },
];

const PAYMENTS: LinkItem[] = [
  { label: "Visa", href: "#" },
  { label: "Mastercard", href: "#" },
  { label: "Amex", href: "#" },
  { label: "UPI", href: "#" },
  { label: "NetBanking", href: "#" },
];

const APPS: LinkItem[] = [
  { label: "App Store", href: "#" },
  { label: "Google Play", href: "#" },
];

const LANGUAGES = ["English", "हिन्दी", "தமிழ்", "বাংলা", "मराठी"];
const REGIONS = ["India", "Middle East", "Europe", "North America", "APAC"];

export default function Footer07() {
  return (
    <footer
      className="w-full text-slate-200 border-t border-white/10 bg-[#0F1422]"
      role="contentinfo"
    >
      {/* Top CTA strip */}
      <div className="bg-gradient-to-r from-cyan-600/20 via-sky-500/10 to-emerald-500/20 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold">
              Looking for a reliable steel partner?
            </h3>
            <p className="text-sm opacity-80">
              Talk to our experts for quotes, specs, or a tailored supply plan.
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="#quote"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
            >
              Request a Quote
              <ArrowDownIcon />
            </a>
            <a
              href="#contact-sales"
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-300/30 bg-emerald-400/10 px-4 py-2 text-sm hover:bg-emerald-400/15"
            >
              Contact Sales
              <ChatIcon />
            </a>
          </div>
        </div>
      </div>

      {/* Main mega grid */}
      <div className="mx-auto max-w-7xl px-6 py-10 grid gap-10 lg:gap-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand & mission */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <LogoIcon />
              <div>
                <div className="text-xl font-bold tracking-wide">Your Company</div>
                <div className="text-xs uppercase tracking-widest opacity-70">
                  Steel • Alloys • Engineering
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm opacity-85">
              We design, manufacture, and deliver high-performance steel products
              and end-to-end supply solutions for infrastructure and industry.
            </p>

            {/* Newsletter */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-3"
              aria-label="Newsletter signup"
            >
              <label htmlFor="nl-email" className="text-sm font-medium">
                Subscribe to updates
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  id="nl-email"
                  type="email"
                  required
                  placeholder="you@company.com"
                  className="w-full rounded-xl border border-white/15 bg-slate-900/60 px-3 py-2 text-sm outline-none placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  className="rounded-xl border border-cyan-300/30 bg-cyan-400/10 px-3 py-2 text-sm hover:bg-cyan-400/15"
                >
                  Join
                </button>
              </div>
              <p className="mt-2 text-xs opacity-70">
                By subscribing, you agree to our{" "}
                <a className="underline" href="#">
                  privacy policy
                </a>
                .
              </p>
            </form>

            {/* Social */}
            <div className="mt-5">
              <div className="text-sm font-semibold opacity-90">Follow us</div>
              <ul className="mt-2 flex flex-wrap gap-2">
                {SOCIAL.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      aria-label={s.label}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
                    >
                      <SocialIcon name={s.label} />
                      <span className="hidden sm:inline">{s.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Link clusters with bullets + icons */}
          <div className="lg:col-span-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <LinkCluster title="Products" items={PRODUCTS} icon={<CubeIcon />} />
            <LinkCluster title="Solutions" items={SOLUTIONS} icon={<WrenchIcon />} />
            <LinkCluster title="Resources" items={RESOURCES} icon={<BookIcon />} />
            <LinkCluster title="Company" items={COMPANY} icon={<BuildingIcon />} />
            <LinkCluster title="Support" items={SUPPORT} icon={<LifeBuoyIcon />} />
            <LinkCluster title="Legal" items={LEGAL} icon={<ShieldIcon />} />
            <LinkCluster title="Industries" items={INDUSTRIES} icon={<FactoryIcon />} />
            {/* Contact cluster (already has icons) */}
            <div>
              <h4 className="text-sm font-semibold opacity-90">Contact</h4>
              <ul className="mt-2 space-y-1 text-sm opacity-85 list-disc list-outside pl-5 marker:text-slate-500/70">
                <li className="flex items-center gap-2">
                  <MailIcon />
                  <a href="mailto:support@company.com">support@company.com</a>
                </li>
                <li className="flex items-center gap-2">
                  <PhoneIcon />
                  <a href="tel:+919876543210">+91 98765 43210</a>
                </li>
                <li className="flex items-center gap-2">
                  <ClockIcon />
                  Mon–Sat, 9:00–18:00 IST
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Locations */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ADDRESSES.map((addr) => (
            <address
              key={addr.label}
              className="not-italic rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <div className="flex items-center gap-2 text-sm font-semibold">
                <MapPinIcon />
                {addr.label}
              </div>
              <div className="mt-2 text-sm opacity-85">
                {addr.lines.map((l, i) => (
                  <div key={i}>{l}</div>
                ))}
              </div>
              {addr.maps && (
                <a
                  href={addr.maps}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10"
                >
                  Open in Maps
                  <ExternalIcon />
                </a>
              )}
            </address>
          ))}
        </div>

        {/* Certifications / Payments / Apps */}
        <div className="grid gap-6 md:grid-cols-3">
          <BadgeBar title="Certifications" items={CERTS} kind="cert" />
          <BadgeBar title="Payment Methods" items={PAYMENTS} kind="pay" />
          <BadgeBar title="Get the App" items={APPS} kind="app" />
        </div>

        {/* Language & Region */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <Selector label="Language" options={LANGUAGES} />
            <Selector label="Region" options={REGIONS} />
          </div>
          <div className="text-xs opacity-70">
            GSTIN: 22AAAAA0000A1Z5 · CIN: L00000AA0000PLC000000
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm">
          <div className="opacity-80">
            © {YEAR} Your Company. All rights reserved.
          </div>
          <ul className="flex flex-wrap gap-x-4 gap-y-2 opacity-85 list-disc list-outside pl-5 marker:text-slate-500/70">
            <li><a className="hover:underline" href="#">Privacy</a></li>
            <li><a className="hover:underline" href="#">Terms</a></li>
            <li><a className="hover:underline" href="#">Sitemap</a></li>
            <li><a className="hover:underline" href="#">Accessibility</a></li>
            <li><a className="hover:underline" href="#">Security</a></li>
          </ul>
          <a
            href="#top"
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 hover:bg-white/10"
            aria-label="Back to top"
          >
            <ArrowUpIcon />
            Top
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ---------- UI Subcomponents ---------- */

function LinkCluster({
  title,
  items,
  icon,
}: {
  title: string;
  items: LinkItem[];
  icon: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="flex items-center gap-2 text-sm font-semibold opacity-90">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-white/20 bg-white/10">
          {icon}
        </span>
        {title}
      </h4>
      <ul className="mt-2 space-y-1 text-sm list-disc list-outside pl-5 marker:text-slate-500/70">
        {items.map((it) => (
          <li key={it.label} className="opacity-85">
            <a
              href={it.href}
              target={it.external ? "_blank" : undefined}
              rel={it.external ? "noopener noreferrer" : undefined}
              className="inline-flex items-center gap-2 hover:underline"
            >
              {/* Per-item icon (smaller) */}
              <ItemIcon section={title} />
              <span>{it.label}</span>
            </a>
            {it.badge && (
              <span className="ml-2 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-2 py-0.5 text-[11px]">
                {it.badge}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function BadgeBar({
  title,
  items,
  kind,
}: {
  title: string;
  items: LinkItem[];
  kind: "cert" | "pay" | "app";
}) {
  return (
    <section aria-label={title}>
      <div className="text-sm font-semibold opacity-90">{title}</div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {items.map((b) => (
          <a
            key={b.label}
            href={b.href}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
          >
            <BadgeIcon kind={kind} label={b.label} />
            <span>{b.label}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

function Selector({ label, options }: { label: string; options: string[] }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <span className="opacity-80">{label}</span>
      <select className="h-9 rounded-lg border border-white/20 bg-slate-900 px-2">
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

/* ---------- Icons (inline, no dependencies) ---------- */

function LogoIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#22d3ee" />
          <stop offset="1" stopColor="#34d399" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="36" height="36" rx="9" fill="url(#g1)" />
      <path
        d="M10 24 L18 8 L26 24 Z"
        fill="none"
        stroke="white"
        strokeWidth="2.2"
      />
    </svg>
  );
}

/** Section header icons */
function CubeIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2l9 5-9 5-9-5 9-5zM3 12l9 5 9-5" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}
function WrenchIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22 2l-6 6 2 2 6-6a5 5 0 0 1-7 7l-9 9H4v-4l9-9a5 5 0 0 1 7-7z" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}
function BookIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 4h14a2 2 0 0 1 2 2v13H6a2 2 0 0 0-2 2V4z" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M6 18h14" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function BuildingIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 22h18V8L12 2 3 8v14zM8 22v-6h8v6" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}
function LifeBuoyIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M12 3v6M21 12h-6M12 21v-6M3 12h6" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}
function FactoryIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 21V9l6 3V9l6 3V9l6 3v9H3z" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M6 21v-3M10 21v-3M14 21v-3M18 21v-3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

/** Per-item small icons (to appear next to bullet labels) */
function ItemIcon({ section }: { section: string }) {
  const commonProps = { width: 14, height: 14, viewBox: "0 0 24 24", "aria-hidden": true } as any;
  switch (section) {
    case "Products":
      return (
        <svg {...commonProps}>
          <path d="M3 12l9-6 9 6-9 6-9-6z" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      );
    case "Solutions":
      return (
        <svg {...commonProps}>
          <path d="M20 14l-8 8-4-4 8-8M18 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      );
    case "Resources":
      return (
        <svg {...commonProps}>
          <path d="M4 4h14a2 2 0 0 1 2 2v13H6a2 2 0 0 0-2 2V4z" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      );
    case "Company":
      return (
        <svg {...commonProps}>
          <path d="M3 22h18V8L12 2 3 8v14z" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      );
    case "Support":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M9 10a3 3 0 1 1 6 0c0 3-3 3-3 5M12 18h0" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      );
    case "Legal":
      return (
        <svg {...commonProps}>
          <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      );
    case "Industries":
      return (
        <svg {...commonProps}>
          <path d="M3 21V9l6 3V9l6 3V9l6 3v9H3z" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      );
    default:
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      );
  }
}

/** Misc icons already present */
function ArrowDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5v14m0 0l-6-6m6 6l6-6" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}
function ArrowUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 19V5m0 0l6 6m-6-6l-6 6" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}
function ChatIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 16l-1 4 4-1h9a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v9z" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22 16.92V21a1 1 0 0 1-1.1 1 19 19 0 0 1-8.29-3.07A18.91 18.91 0 0 1 3.07 11.39 19 19 0 0 1 0 3.1 1 1 0 0 1 1 2h4.09a1 1 0 0 1 1 .75 12.44 12.44 0 0 0 .7 2.22 1 1 0 0 1-.23 1L5.91 7.09a16 16 0 0 0 7 7l1.12-.65a1 1 0 0 1 1 0 12.44 12.44 0 0 0 2.22.7 1 1 0 0 1 .75 1V21z" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}
function MapPinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s7-5.4 7-11a7 7 0 0 0-14 0c0 5.6 7 11 7 11z" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="12" cy="10" r="2.5" fill="currentColor" />
    </svg>
  );
}
function ExternalIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 3h7v7m0-7L10 14" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M21 14v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}

/** Social icons (unchanged) */
function SocialIcon({ name }: { name: string }) {
  if (name === "LinkedIn")
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="3" fill="currentColor" />
        <rect x="6.5" y="9.5" width="2.5" height="8" fill="#0B0F19" />
        <rect x="6.5" y="6.5" width="2.5" height="2" fill="#0B0F19" />
        <path d="M11 9.5h2.4v1.1c.5-.8 1.2-1.3 2.5-1.3 2 0 3.1 1.1 3.1 3.4V17.5h-2.5v-3.8c0-1-.4-1.5-1.3-1.5-1 0-1.6.7-1.6 2v3.3H11V9.5z" fill="#0B0F19" />
      </svg>
    );
  if (name === "Instagram")
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" fill="currentColor" />
        <circle cx="12" cy="12" r="4" fill="#0B0F19" />
        <circle cx="17.5" cy="6.5" r="1.2" fill="#0B0F19" />
      </svg>
    );
  if (name === "Facebook")
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="3" fill="currentColor" />
        <path d="M13.5 10H15V8h-1.5c-1.3 0-2.5.8-2.5 2.6V12H9v2h2v4h2v-4h1.7l.3-2H13v-1c0-.6.2-1 .5-1z" fill="#0B0F19" />
      </svg>
    );
  if (name === "YouTube")
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="7" width="18" height="10" rx="3" fill="currentColor" />
        <path d="M11 10l4 3-4 3v-6z" fill="#0B0F19" />
      </svg>
    );
  if (name === "WhatsApp")
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="currentColor" />
        <path d="M9.5 8.5c.4-1 1.7-1 1.9-.1.2.5.3 1.2-.2 1.8 0 0 1 .8 1.7 1 .7.1 1.5 0 1.9.6.4.7-.1 1.8-1.1 2.2-1.7.7-4.2-.2-5.7-1.6C6.9 12 6 9.8 6.7 8.1c.4-1 .9-.9 1.2-.8.4.1.9.6 1.6 1.2z" fill="#0B0F19" />
      </svg>
    );
  // X (Twitter)
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" fill="currentColor" />
      <path d="M8 8l8 8m0-8l-8 8" stroke="#0B0F19" strokeWidth="2" />
    </svg>
  );
}
