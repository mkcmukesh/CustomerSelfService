"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ORDERED_KEYS, getSection } from "@/nav";

/* ---------- Icons ---------- */
function IconMenu({ className = "w-8 h-8" }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function IconClose({ className = "w-8 h-8" }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

/* ---------- Component ---------- */
export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  const toggleMenu = () => setOpen((prev) => !prev);
  const closeMenu = () => setOpen(false);

  return (
    <>

      <div></div>
      {/* ---------- Top-left Button ---------- */}
      <button
        onClick={toggleMenu}
        className="fixed top-[30px] left-[30px] z-[12000] flex items-center justify-center w-12 h-12 rounded-full bg-white text-black shadow-lg hover:scale-105 transition-transform"
        aria-label="Toggle menu"
      >
        {open ? <IconClose className="w-8 h-8" /> : <IconMenu className="w-8 h-8" />}
      </button>

      {/* ---------- Fullscreen Overlay ---------- */}
      <div
        className={`fixed inset-0 transition-all duration-500 ease-in-out ${open
            ? "opacity-100 pointer-events-auto z-[11000]"
            : "opacity-0 pointer-events-none z-[-1]"
          }`}
      >
        {/* ---------- Gradient Backdrop ---------- */}
        <div
          className={`absolute inset-0 bg-gradient-to-br from-[#0a0c1d]/95 via-[#1b2044]/95 to-[#282c54]/95 backdrop-blur-xl transition-all duration-700`}
          onClick={closeMenu}
        ></div>

        {/* ---------- Menu Content ---------- */}
        <div className="relative z-[11005] w-full h-full flex flex-col justify-center items-center px-10 py-20">

        {/* ---------- Close Button ---------- */}
<button
  onClick={toggleMenu}
  className="
    fixed top-[30px] right-[30px]
    z-[12000]
    flex items-center justify-center
    w-12 h-12 rounded-full
    bg-white text-black
    shadow-lg hover:scale-105 transition-transform
  "
  aria-label="Toggle menu"
>
  {open ? <IconClose className="w-8 h-8" /> : <IconMenu className="w-8 h-8" />}
</button>


          {/* ---------- Grid Menu ---------- */}
          <div className="p-10">
            <div
              className=" 
              menu-grid
              grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
              w-full h-full
              max-w-[120rem]
              gap-12
              text-left
              text-white
              p-10
            "
            >
              {ORDERED_KEYS.map((key, i) => {
                const section = getSection(key);
                return (
                  <div
                    key={section.id}
                    style={{
                      animation: `fadeSlideIn 0.6s ease ${i * 0.15}s both`,
                    }}
                    className="border-t border-white/20 p-6"
                  >
                    <h3 className="text-2xl md:text-2xl font-extrabold uppercase mb-6 tracking-wide text-white/90 pb-2">
                      {section.title}
                    </h3>

                    <ul className="space-y-3 ">
                      {section.items.map((item, j) => (
                        <li 
                          key={item.href}
                          style={{
                            animation: `linkFade 0.5s ease ${i * 0.15 + j * 0.05}s both`,
                          }}
                        >
                          <Link
                            href={item.href}
                            onClick={closeMenu}
                            className={`group flex items-center gap-3 text-sm md:text-xl transition duration-200 ${isActive(item.href)
                                ? "text-primary font-semibold"
                                : "text-white/80 hover:text-primary"
                              }`}
                          >
                            {/* Glowing bullet */}
                            <span
                              className="
    inline-block w-2.5 h-2.5 rounded-full bg-slate-100
    shadow-[0_0_10px_#38bdf8]
    group-hover:shadow-[0_0_20px_#38bdf8]
    group-hover:scale-125
    transition-all duration-300
  "
                            ></span>
                            <span>{item.label}</span>

                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>


          {/* ---------- Footer ---------- */}
          <div className="absolute bottom-6 left-0 right-0 text-center text-xs text-white/60">
            © 2025 YourBrand · All rights reserved
          </div>
        </div>
      </div>

      {/* ---------- Global Animations ---------- */}
      <style jsx global>{`
        @keyframes fadeSlideIn {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes linkFade {
          0% {
            opacity: 0;
            transform: translateX(-10px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Divider between menu columns */
        .menu-grid > div:not(:last-child) {
          border-right: 1px solid rgba(255, 255, 255, 0.15);
          padding-right: 2rem;
        }
      `}</style>
    </>
  );
}
