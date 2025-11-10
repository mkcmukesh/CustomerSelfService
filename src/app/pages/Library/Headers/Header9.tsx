
"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { LayoutGrid, ShoppingCart } from "lucide-react";
import ActionsDropdown from "@/components/Panther-CSS/Menu/ActionsDropdown";
export default function Header9(){
return(<motion.header initial={{y:-10,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:0.26}} className="sticky top-0 z-40">
<div className="h-16 bg-white/90 backdrop-blur border-b border-slate-200 flex items-center px-4 sm:px-6 lg:px-10">
<Link href="/" className="flex items-center gap-2"><img src="/images/Panther-CSS/jindal-logo-normal.png" alt="Jindal" className="h-8 w-auto"/><span className="hidden sm:block font-semibold text-slate-700">CSS</span></Link>
<div className="ml-6"><button className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50"><LayoutGrid className="h-4 w-4"/> All Categories</button></div>
<nav className="ml-auto hidden md:flex items-center gap-6 text-[15px] text-slate-600"><Link href="#" className="hover:text-slate-900">Deals</Link><ActionsDropdown/><Link href="#" className="hover:text-slate-900">Support</Link><button className="h-9 w-9 grid place-items-center rounded-full hover:bg-slate-100"><ShoppingCart className="h-5 w-5 text-[#F47C20]"/></button></nav>
</div></motion.header>);}
