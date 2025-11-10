"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Check, UserRound } from "lucide-react";

export type VisitorPageProps = {
  videoUrl?: string;
  onRegister?: () => void;
  title?: string;
  ctaText?: string;
  subtitle?: string;
  toggleShortcutHint?: string;
};

const DEFAULT_VIDEO =
  "https://videos.pexels.com/video-files/5439436/5439436-uhd_2560_1440_24fps.mp4";

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

export default function VisitorCircle({
  videoUrl = DEFAULT_VIDEO,
  onRegister,
  title = "Visitor",
  subtitle = "New Visitor?",
  ctaText = "Register Now",
  toggleShortcutHint = "Ctrl + Shift + H",
}: VisitorPageProps) {
  const [showHeader, setShowHeader] = useState(false);

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
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-sky-400 via-sky-500 to-sky-600" />
      <div aria-hidden className="absolute inset-0 -z-10 opacity-40" style={dotBg} />

      <header
        className={[
          "fixed top-0 left-0 right-0 z-20 flex items-center justify-center",
          "transition-all duration-500 ease-out",
          showHeader ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none",
        ].join(" ")}
      >
        <div className="w-full max-w-4xl">
          <div className="mx-4 mt-4 rounded-2xl bg-base-100/90 backdrop-blur border border-white/10 shadow-lg px-5 py-3 flex items-center justify-between">
            <h2 className="text-lg sm:text-2xl font-semibold">Reception Kiosk</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm opacity-70 hidden sm:inline">
                Toggle header: {toggleShortcutHint}
              </span>
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

      <section className="w-full max-w-md">
        <div className="flex flex-col items-center text-center">
          <h1 className="sr-only">{title}</h1>

          <div className="relative mt-4">
            <div className="rounded-full p-[10px] bg-gradient-to-br from-sky-700/60 to-sky-300/60 shadow-xl">
              <div className="avatar">
                <div className="w-96 h-96 rounded-full ring ring-offset-2 ring-sky-800/40 ring-offset-sky-500/30 overflow-hidden">
                  <video
                    src={videoUrl}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls={false}
                    aria-label="Lobby / reception reflection video"
                  />
                </div>
              </div>
            </div>

            <span className="absolute -right-2 -top-2 inline-flex items-center justify-center rounded-full bg-success text-success-content shadow-lg w-12 h-12 ring-2 ring-white/70">
              <Check className="w-7 h-7" aria-hidden />
            </span>

            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 rounded-full" style={haloStyle} />
          </div>

          <div className="mt-6" />

          <p className="text-white/90 text-lg mb-2">{subtitle}</p>

          <button className="btn btn-neutral rounded-full px-6 shadow-lg" onClick={onRegister} aria-label="Register now">
            <UserRound className="w-5 h-5" />
            {ctaText}
          </button>

          <p className="mt-4 text-white/80 text-sm">
            Press <kbd className="kbd kbd-sm">Ctrl</kbd> + <kbd className="kbd kbd-sm">Shift</kbd> +{" "}
            <kbd className="kbd kbd-sm">H</kbd> to toggle the top header.
          </p>
        </div>
      </section>
    </main>
  );
}
