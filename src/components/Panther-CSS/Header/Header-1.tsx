// src\components\Panther-CSS\Header\Header-1.tsx

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import ActionsDropdown from "../Menu/ActionsDropdown";

type Props = {
  cartCount?: number;
  userName?: string;
  userRole?: string;
  avatarSrc?: string;
};

export default function DashboardHeader({
  cartCount = 8,
  userName = "Ashish Kumar",
  userRole = "Dealer & Retailer",
  // avatarSrc = "/images/avatars/ashish-kumar.jpg",
  avatarSrc = "https://www.shutterstock.com/image-photo/image-handsome-smiling-young-african-600nw-722913181.jpg",
}: Props) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="sticky top-0 z-40"
    >
      <div className="h-16 border-b border-slate-200 bg-white/90 backdrop-blur flex items-center px-4 sm:px-6 lg:px-10">
        {/* Left: Logo + Title */}
        <Link
          href="/"
          className="flex items-center gap-3 rounded-md px-2 py-1 hover:bg-slate-100/60 transition-colors"
          aria-label="Jindal Steel - Customer Self Service"
        >
          <img
            src="/images/Panther-CSS/jindal-logo-normal.png"
            alt="Jindal Steel"
            className="h-8 w-auto"
          />
          <span className="hidden sm:flex items-baseline gap-2 font-semibold tracking-tight">
            <span className="text-[20px] leading-none text-[#F47C20]">Customer</span>
            <span className="text-[20px] leading-none text-slate-600">Self Service</span>
          </span>
        </Link>

        {/* Right: Nav + Cart + Profile */}
        <div className="ml-auto flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-slate-600">
            <Link href="#" className="hover:text-slate-900 transition-colors">
              Find Products
            </Link>

            {/* Actions dropdown */}
            <ActionsDropdown />

            <Link href="#" className="hover:text-slate-900 transition-colors">
              Support
            </Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Cart with badge */}
          <button
            type="button"
            aria-label={`Open cart (${cartCount} items)`}
            className="relative inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 transition"
          >
            <ShoppingCart className="w-5 h-5 text-[#F47C20]" />
            <span className="absolute -right-1 -top-1 inline-flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full
                             bg-[#22C55E] text-white text-[10px] font-bold">
              {cartCount}
            </span>
          </button>

          {/* Profile: avatar + name + role */}
          <button
            type="button"
            className="flex items-center gap-2 hover:bg-slate-100/60 rounded-full pl-1 pr-3 py-1 transition"
            aria-label="Open profile menu"
          >
            <img
              src={avatarSrc}
              alt={userName}
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="text-left leading-tight">
              <span className="block text-[15px] font-medium text-slate-700">{userName}</span>
              <span className="block text-[12px] text-slate-400 -mt-0.5">{userRole}</span>
            </span>
          </button>
        </div>
      </div>
    </motion.header>
  );
}
