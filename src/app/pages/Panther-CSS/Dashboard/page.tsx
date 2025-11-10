"use client";
// src/app/(fullscreen)/DsAMS/CameraCapture/page.tsx

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, UserRound, Camera } from "lucide-react";

type VisitorPageProps = {
  videoUrl?: string;
  onRegister?: () => void;
  title?: string;
  ctaText?: string;
  subtitle?: string;
  toggleShortcutHint?: string;
};

const DEFAULT_VIDEO =
  "https://media.istockphoto.com/id/2202520278/video/modern-large-open-plan-creative-office-space.mp4?s=mp4-640x640-is&k=20&c=zgIwPiBNgxjvs0R1QeK0QIZQWokvM_SRjUi3xOfDpWc=";

const dotBg: React.CSSProperties = {
  backgroundImage: "radial-gradient(white 1px, transparent 1px)",
  backgroundSize: "14px 14px",
  backgroundPosition: "0 0",
};

const haloStyle: React.CSSProperties = {
  padding: "36px",
  background:
    "radial-gradient(circle at center, rgba(255,255,255,0.35) 1px, transparent 1px)",
  backgroundSize: "10px 10px",
  maskImage: "radial-gradient(circle, black 64%, transparent 66%)",
  WebkitMaskImage: "radial-gradient(circle, black 64%, transparent 66%)",
};

function VisitorCircle({
  videoUrl = DEFAULT_VIDEO,
  onRegister,
  title = "Panther-CSS",
  subtitle = "New Visitor",
  ctaText = "Register Now",
  toggleShortcutHint = "Ctrl + Shift + H",
}: VisitorPageProps) {
  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (e.ctrlKey && e.shiftKey && key === "h") {
        e.preventDefault();
        setShowHeader((v) => !v);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const toggleAria = useMemo(
    () =>
      showHeader
        ? `Hide header (${toggleShortcutHint})`
        : `Show header (${toggleShortcutHint})`,
    [showHeader, toggleShortcutHint]
  );

  return (
    <main className="relative min-h-screen w-full overflow-hidden flex items-center justify-center p-6">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-sky-400 via-sky-500 to-sky-600" />
      {/* Dot pattern overlay */}
      <div aria-hidden className="absolute inset-0 -z-10 opacity-40" style={dotBg} />

      {/* Top banner with links */}
      <header
        className={[
          "fixed top-0 left-0 right-0 z-20 flex items-center justify-center",
          "transition-all duration-500 ease-out",
          showHeader
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none",
        ].join(" ")}
      >
        <div className="w-full max-w-4xl">
          <div className="mx-4 mt-4 rounded-2xl bg-base-100/80 backdrop-blur border border-white/10 shadow-lg px-5 py-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-2xl font-semibold">
                Visitor Management System
              </h2>

              {/* Quick links */}
              <nav className="hidden sm:flex items-center gap-5">
                <Link href="/pages/DS-VMS/EmployeeDashboard" className="link link-hover">
                  Employee
                </Link>
                <Link href="/pages/DS-VMS/EmployeeDashboard" className="link link-hover">
                  Visitor
                </Link>
              </nav>

              <button
                className="btn btn-sm btn-outline"
                onClick={() => setShowHeader((v) => !v)}
                aria-label={toggleAria}
                title={toggleAria}
              >
                {showHeader ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="w-full max-w-md pt-16">
        <div className="flex flex-col items-center text-center">
          <h1 className="sr-only">{title}</h1>

          {/* Circle with video */}
          <div className="relative mt-4">
            {/* Soft gradient ring wrapper */}
            <div className="rounded-full p-[10px] bg-gradient-to-br from-sky-700/60 to-sky-300/60 shadow-xl">
              <div className="avatar">
                <div className="relative w-96 h-96 rounded-full ring ring-offset-2 ring-sky-800/40 ring-offset-sky-500/30 overflow-hidden">
                  <video
                    src={videoUrl}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls={false}
                    preload="auto"
                    aria-label="Lobby / reception reflection video"
                  />
                  <div
                    aria-hidden
                    className="
                      pointer-events-none absolute inset-0 rounded-full
                      bg-white/8 backdrop-blur-xs
                      border border-white/10
                      shadow-[inset_0_1px_6px_rgba(255,255,255,0.25)]
                      mix-blend-luminosity
                    "
                  />
                </div>
              </div>
            </div>

            {/* ✅ Badge now clickable */}
            <Link
              href="#"
              className="absolute right-6 top-16 z-20 inline-flex items-center justify-center rounded-full bg-success text-success-content shadow-lg w-12 h-12 ring-2 ring-white/80 focus:outline-none focus:ring-4 focus:ring-success/40"
              aria-label="Open Employee Camera Capture"
              title="Open Employee Camera Capture"
            >
              <Camera className="w-7 h-7" aria-hidden />
            </Link>

            {/* Circular dot halo behind avatar */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 rounded-full"
              style={haloStyle}
            />
          </div>

          <div className="mt-6" />

          <p className="text-white/90 text-lg mb-2">{subtitle}</p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              className="btn btn-neutral rounded-full px-6 shadow-lg"
              onClick={onRegister}
              aria-label="Register now"
            >
              <UserRound className="w-5 h-5" />
              {ctaText}
            </button>

            <Link
              href="#"
              className="btn btn-accent rounded-full px-6 shadow-lg"
            >
              <Camera className="w-5 h-5" />
              Camera Capture
            </Link>
          </div>

          <p className="mt-4 text-white/80 text-sm">
            Press <kbd className="kbd kbd-sm">Ctrl</kbd> +{" "}
            <kbd className="kbd kbd-sm">Shift</kbd> +{" "}
            <kbd className="kbd kbd-sm">H</kbd> to toggle the top header.
          </p>
        </div>
      </section>
    </main>
  );
}

export default function Page() {
  return <VisitorCircle onRegister={() => console.log("Go to registration")} />;
}
