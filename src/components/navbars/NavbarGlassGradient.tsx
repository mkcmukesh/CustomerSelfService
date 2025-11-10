// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href
      ? "text-white/95 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-white/70"
      : "text-white/70 hover:text-white/95";

  return (
    <header className="sticky top-0 z-50">
      <div
        className="
          navbar
          bg-gradient-to-r from-cyan-600 via-blue-700 to-indigo-800
          text-white/90
          backdrop-blur-xl
          border-b border-white/10
          shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)]
        "
      >
        {/* Left: Brand + Mobile menu button */}
        <div className="flex flex-1 items-center gap-2">
          <button
            onClick={() => setMenuOpen((s) => !s)}
            className="lg:hidden btn btn-ghost btn-sm text-white/90"
            aria-label="Toggle navigation"
            title="Menu"
          >
            {/* hamburger */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          {/* Logo + brand (linked to home) */}
          <Link
            href="/"
            className="btn btn-ghost px-2 normal-case text-xl tracking-wide flex items-center gap-2"
            aria-label="Go to homepage"
          >
            {/* Inline dummy logo (edit colors/shape as you like) */}
            <span className="relative inline-flex h-8 w-8 items-center justify-center">
              <span className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-300 via-sky-400 to-indigo-500" />
              <span className="absolute inset-[3px] rounded-md bg-white/15 backdrop-blur-[2px]" />
              <svg className="relative h-4 w-4 text-white/90" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 3l7 5-7 5-7-5 7-5Zm0 8l7 5-7 5-7-5 7-5Z" />
              </svg>
            </span>

            <span className="font-semibold">
              Aero<span className="opacity-80">UI</span>
            </span>
          </Link>

          {/* Desktop nav */}
 {/* Desktop nav */}
<nav className="ml-2 hidden lg:flex">
  <ul className="menu menu-horizontal gap-2 relative">
    <li>
      <Link href="/" className={`relative px-2 ${isActive("/")}`}>Home</Link>
    </li>

    <li>
      <Link href="/about" className={`relative px-2 ${isActive("/about")}`}>About</Link>
    </li>

    {/* Submenu (4 links) */}
    <li className="relative">
      <details>
        <summary className={`relative px-2 ${isActive("/services")}`}>Services</summary>
        <ul className="p-2 bg-base-100 text-base-content rounded-box min-w-48 absolute top-full left-0 mt-2 shadow z-50">
          <li><Link href="/services/design">Design</Link></li>
          <li><Link href="/services/development">Development</Link></li>
          <li><Link href="/services/hosting">Hosting</Link></li>
          <li><Link href="/services/support">Support</Link></li>
        </ul>
      </details>
    </li>

    {/* Tools Submenu*/}
    <li className="relative">
      <details>
        <summary className={`relative px-2 ${isActive("/services")}`}>Tools</summary>
        <ul className="p-2 bg-base-100 text-base-content rounded-box min-w-48 absolute top-full left-0 mt-2 shadow z-50">
          <li><Link href="/tools/library1">Library</Link></li>
          <li><Link href="/tools/html-to-tsx">html-to-tsx</Link></li>
          <li><Link href="/tools/WordToTsxEditor">Word To TsxEditor</Link></li>
          <li><Link href="/tools/BoxStyleDesigner">Box Style Designer</Link></li>
          {/* <li><Link href="/services/development">Link2</Link></li>
          <li><Link href="/services/hosting">Link2</Link></li>
          <li><Link href="/services/support">Link2</Link></li> */}
        </ul>
      </details>
    </li>

    {/* DS Submenu*/}
    <li className="relative">
      <details>
        <summary className={`relative px-2 ${isActive("/services")}`}>DS</summary>
        <ul className="p-2 bg-base-100 text-base-content rounded-box min-w-48 absolute top-full left-0 mt-2 shadow z-50">
          <li><Link href="/pages/DsAMS/CameraCapture">Camera Capture</Link></li>
        </ul>
      </details>
    </li>

    <li>
      <Link href="/pricing" className={`relative px-2 ${isActive("/pricing")}`}>Pricing</Link>
    </li>

    <li>
      <Link href="/dashboard" className={`relative px-2 ${isActive("/dashboard")}`}>Dashboard</Link>
    </li>
  </ul>
</nav>

        </div>

        {/* Center: Search (desktop) */}
        {/* <div className="hidden lg:flex flex-[0.6] justify-center">
          <label className="input input-bordered input-sm flex items-center gap-2 w-full max-w-md bg-white/10 border-white/20 text-white placeholder:text-white/60">
            <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-90" aria-hidden="true">
              <path d="M21 21l-4.35-4.35M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <input type="text" className="grow text-white placeholder:text-white/70" placeholder="Search…" aria-label="Search" />
          </label>
        </div> */}

        {/* Right: Actions */}
        <div className="flex flex-1 justify-end items-center gap-1">
          {/* Theme toggle (DaisyUI theme-controller) */}
          <label className="swap swap-rotate btn btn-ghost btn-sm">
            <input type="checkbox" className="theme-controller" value="dark" aria-label="Toggle dark mode" />
            {/* sun */}
            <svg className="swap-off fill-current" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12a7 7 0 1 0 14 0A7 7 0 0 0 5 12Zm7-9v3M7.22 7.22 5 5m12.78 2.22L19 5M3 12h3m12 0h3m-2.22 4.78L19 19m-9.78 0L5 19m7 2v-3" />
            </svg>
            {/* moon */}
            <svg className="swap-on fill-current" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
            </svg>
          </label>

          {/* Notifications */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-sm" aria-label="Open notifications">
              <span className="indicator">
                <svg width="18" height="18" viewBox="0 0 24 24" className="opacity-90" aria-hidden="true">
                  <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2c0 .53-.21 1.04-.59 1.41L4 17h5m6 0a3 3 0 1 1-6 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <span className="badge badge-error badge-xs indicator-item" aria-hidden="true"></span>
              </span>
            </div>
            <ul tabIndex={0} className="menu dropdown-content bg-base-100 text-base-content rounded-box w-72 p-2 shadow">
              <li className="menu-title">Notifications</li>
              <li><a>Welcome aboard! 🎉</a></li>
              <li><a>New user registered</a></li>
              <li><a>Server deploy finished</a></li>
            </ul>
          </div>

          {/* Profile */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar placeholder" aria-label="Open profile menu">
              <div className="bg-white/20 text-white rounded-full w-8">
                <span>DJ</span>
              </div>
            </div>
            <ul tabIndex={0} className="menu dropdown-content bg-base-100 text-base-content rounded-box w-52 p-2 shadow">
              <li><Link href="/dashboard">Dashboard</Link></li>
              <li><a>Settings</a></li>
              <li><a>Sign out</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile menu (drawer-style) */}
      {menuOpen && (
        <div className="lg:hidden border-b border-white/10 bg-gradient-to-r from-cyan-700 via-blue-800 to-indigo-900 text-white/90">
          <nav className="container mx-auto px-4 py-3">
            <ul className="flex flex-col gap-2">
              <li><Link onClick={() => setMenuOpen(false)} className={`block ${isActive("/")}`} href="/">Home</Link></li>
              <li><Link onClick={() => setMenuOpen(false)} className={`block ${isActive("/about")}`} href="/about">About</Link></li>
              <li><Link onClick={() => setMenuOpen(false)} className={`block ${isActive("/pricing")}`} href="/pricing">Pricing</Link></li>
              <li><Link onClick={() => setMenuOpen(false)} className={`block ${isActive("/dashboard")}`} href="/dashboard">Dashboard</Link></li>
            </ul>
            <div className="mt-3">
              <label className="input input-bordered input-sm flex items-center gap-2 w-full bg-white/10 border-white/20 text-white placeholder:text-white/70">
                <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-90" aria-hidden="true">
                  <path d="M21 21l-4.35-4.35M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <input type="text" className="grow text-white placeholder:text-white/70" placeholder="Search…" aria-label="Search (mobile)" />
              </label>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
