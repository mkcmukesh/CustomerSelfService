
"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Phone } from "lucide-react";
import ActionsDropdown from "@/components/Panther-CSS/Menu/ActionsDropdown";
type Props={cartCount?:number;};
export default function Header3({cartCount=0}:Props){
return(<motion.header initial={{y:-8,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:0.25}} className="sticky top-0 z-40">
<div className="h-14 bg-white border-b border-slate-200 flex items-center px-4 sm:px-6 lg:px-10">
<Link href="/" className="flex items-center gap-2 mr-6"><img src="/images/Panther-CSS/jindal-logo-icon.png" className="h-7 w-7" alt="Jindal"/><span className="font-semibold text-slate-700 hidden sm:block">Jindal CSS</span></Link>
<nav className="flex items-center gap-6 text-[14.5px] text-slate-600">
<Link href="#" className="hover:text-slate-900">Catalog</Link><ActionsDropdown/><Link href="#" className="hover:text-slate-900">Pricing</Link><Link href="#" className="hover:text-slate-900">FAQ</Link>
</nav>
<div className="ml-auto flex items-center gap-3">
<button className="relative h-9 w-9 grid place-items-center rounded-full hover:bg-slate-100"><ShoppingCart className="h-5 w-5 text-[#F47C20]"/>{
cartCount>0&&(<span className="absolute -top-1 -right-1 h-4 min-w-[16px] rounded-full bg-emerald-500 px-1 text-[10px] font-bold text-white grid place-items-center">{cartCount}</span>)}</button>
<a href="tel:+911234567890" className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[#F47C20] px-3 py-1.5 text-white text-sm font-medium hover:brightness-95"><Phone className="h-4 w-4"/> Call Sales</a>
</div></div></motion.header>);}
