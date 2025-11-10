
"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import ActionsDropdown from "@/components/Panther-CSS/Menu/ActionsDropdown";
export default function Header8(){
return(<motion.header initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.25}} className="sticky top-0 z-40">
<div className="h-1.5 bg-gradient-to-r from-[#F47C20] via-amber-400 to-emerald-500"/>
<div className="h-14 bg-white border-b border-slate-200 flex items-center px-4 sm:px-6 lg:px-10">
<Link href="/" className="font-semibold text-slate-700">Jindal CSS</Link>
<nav className="ml-auto hidden md:flex items-center gap-6 text-[15px] text-slate-600"><Link href="#" className="hover:text-slate-900 flex items-center gap-1">Solutions <ChevronRight className="h-4 w-4"/></Link><ActionsDropdown/><Link href="#" className="hover:text-slate-900">Pricing</Link><Link href="#" className="hover:text-slate-900">Docs</Link></nav>
</div></motion.header>);}
