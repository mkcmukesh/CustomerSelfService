
"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, ShoppingCart } from "lucide-react";
import ActionsDropdown from "@/components/Panther-CSS/Menu/ActionsDropdown";
type Props={cartCount?:number};
export default function Header4({cartCount=3}:Props){
return(<motion.header initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.25}} className="sticky top-0 z-40 bg-white">
<div className="h-9 bg-slate-900 text-slate-100 text-xs px-4 sm:px-6 lg:px-10 flex items-center gap-6">
<span className="hidden sm:flex items-center gap-1.5 opacity-80"><MapPin className="h-3.5 w-3.5"/> Pan-India</span>
<a href="tel:+911234567890" className="flex items-center gap-1.5 hover:opacity-100 opacity-80"><Phone className="h-3.5 w-3.5"/> +91-123-456-7890</a>
<a href="mailto:support@jindalsteel.com" className="ml-auto flex items-center gap-1.5 hover:opacity-100 opacity-80"><Mail className="h-3.5 w-3.5"/> support@jindalsteel.com</a>
</div>
<div className="h-14 border-b border-slate-200 flex items-center px-4 sm:px-6 lg:px-10">
<Link href="/" className="flex items-center gap-3"><img src="/images/Panther-CSS/jindal-logo-normal.png" alt="Jindal" className="h-8 w-auto"/><span className="font-semibold text-slate-700 hidden sm:block">Customer Self Service</span></Link>
<nav className="ml-auto hidden md:flex items-center gap-8 text-[15px] text-slate-600"><Link href="#" className="hover:text-slate-900">Home</Link><Link href="#" className="hover:text-slate-900">About</Link><ActionsDropdown/><Link href="#" className="hover:text-slate-900">Contact</Link></nav>
<button aria-label="Cart" className="ml-3 relative h-9 w-9 grid place-items-center rounded-full hover:bg-slate-100"><ShoppingCart className="h-5 w-5 text-[#F47C20]"/><span className="absolute -top-1 -right-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold text-white">{cartCount}</span></button>
</div></motion.header>);}
