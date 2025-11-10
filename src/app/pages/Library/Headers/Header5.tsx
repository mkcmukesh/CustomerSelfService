
"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import ActionsDropdown from "@/components/Panther-CSS/Menu/ActionsDropdown";
export default function Header5(){
return(<motion.header initial={{y:-12,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:0.28}} className="sticky top-0 z-40">
<div className="h-16 bg-white/90 backdrop-blur border-b border-slate-200 flex items-center px-4 sm:px-6 lg:px-10">
<nav className="hidden md:flex items-center gap-6 text-[15px] text-slate-600"><Link href="#" className="hover:text-slate-900">Overview</Link><Link href="#" className="hover:text-slate-900">Docs</Link><ActionsDropdown/></nav>
<Link href="/" className="mx-auto flex items-center gap-2"><img src="/images/Panther-CSS/jindal-logo-icon.png" alt="Jindal" className="h-8 w-8"/><span className="font-semibold text-slate-700 hidden sm:block">Jindal CSS</span></Link>
<div className="ml-auto flex items-center"><button className="h-9 w-9 grid place-items-center rounded-full hover:bg-slate-100"><ShoppingCart className="h-5 w-5 text-[#F47C20]"/></button></div>
</div></motion.header>);}
