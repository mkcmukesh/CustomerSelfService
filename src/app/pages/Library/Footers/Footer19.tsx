"use client";
import React from "react";

// Auto-generated from sample style. Replace the inner markup with your actual footer 24.
// Keep dimensions visually similar to 1600×380 canvas used in the viewer.

export default function Footer24() {
  return (
    <footer className="w-full min-h-[380px] bg-[#111827] text-slate-200 border-t border-white/10">
      <div className="mx-auto max-w-7xl p-8 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="text-lg font-semibold">Your Company</h3>
          <p className="mt-2 text-sm opacity-80">123 Industrial Estate, City, Country</p>
          <p className="text-sm opacity-80">support@company.com · +91 98765 43210</p>
        </div>
        <nav>
          <h4 className="text-sm font-semibold opacity-90">Products</h4>
          <ul className="mt-2 space-y-1 text-sm opacity-85">
            <li>Steel Sheets</li>
            <li>Alloy Bars</li>
            <li>Pipes</li>
            <li>Profiles</li>
          </ul>
        </nav>
        <nav>
          <h4 className="text-sm font-semibold opacity-90">Company</h4>
          <ul className="mt-2 space-y-1 text-sm opacity-85">
            <li>About</li>
            <li>Careers</li>
            <li>Press</li>
            <li>Investors</li>
          </ul>
        </nav>
        <nav>
          <h4 className="text-sm font-semibold opacity-90">Support</h4>
          <ul className="mt-2 space-y-1 text-sm opacity-85">
            <li>Help Center</li>
            <li>Contact</li>
            <li>Privacy</li>
            <li>Terms</li>
          </ul>
        </nav>
      </div>
      <div className="mx-auto max-w-7xl px-8 pb-8 flex items-center justify-between text-sm opacity-75">
        <span>© {new Date().getFullYear()} Your Company</span>
        <div className="flex items-center gap-2">
          <a className="px-2 py-1 rounded-md border border-white/20" href="#quote">Request a Quote</a>
        </div>
      </div>
    </footer>
  );
}
