
"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import ActionsDropdown from "@/components/Panther-CSS/Menu/ActionsDropdown";
export default function Header6(){
return(<motion.header initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.22}} className="sticky top-0 z-40">
<div className="h-16 bg-slate-900 text-slate-100 flex items-center px-4 sm:px-6 lg:px-10">
<Link href="/" className="flex items-center gap-2"><img src="/images/Panther-CSS/jindal-logo-invert.png" alt="Jindal" className="h-7 w-auto"/><span className="hidden sm:block font-semibold">Jindal CSS</span></Link>
<nav className="ml-8 hidden md:flex items-center gap-6 text-[15px]"><Link href="#" className="text-white border-b-2 border-white/90 pb-0.5">Dashboard</Link><ActionsDropdown/><Link href="#" className="hover:text-white/90">Reports</Link><Link href="#" className="hover:text-white/90">Settings</Link></nav>
<button className="ml-auto h-9 w-9 grid place-items-center rounded-full hover:bg-white/10" aria-label="Cart"><ShoppingCart className="h-5 w-5 text-[#F47C20]"/></button>
</div></motion.header>);}
