
"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, ShoppingCart, Bell } from "lucide-react";
import ActionsDropdown from "@/components/Panther-CSS/Menu/ActionsDropdown";

type Props={cartCount?:number;userName?:string;userRole?:string;avatarSrc?:string;};
export default function Header2({cartCount=2,userName="Priya Sharma",userRole="Distributor",avatarSrc="/images/avatars/priya-sharma.jpg"}:Props){
return(<motion.header initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} transition={{duration:0.3}} className="sticky top-0 z-40">
<div className="h-16 border-b border-slate-200/70 bg-white/70 backdrop-blur-xl flex items-center px-4 sm:px-6 lg:px-10">
<Link href="/" className="flex items-center gap-2"><img src="/images/Panther-CSS/jindal-logo-normal.png" alt="Jindal" className="h-8 w-auto"/><span className="hidden sm:block font-semibold text-slate-700">CSS Portal</span></Link>
<nav className="mx-auto hidden md:flex items-center gap-8 text-[15px] font-medium text-slate-600">
<Link href="#" className="hover:text-slate-900">Products</Link><ActionsDropdown/><Link href="#" className="hover:text-slate-900">Orders</Link><Link href="#" className="hover:text-slate-900">Help</Link>
</nav>
<div className="ml-auto flex items-center gap-2 sm:gap-4">
<label className="hidden sm:flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5">
<Search className="h-4 w-4 text-slate-400"/><input placeholder="Search" className="w-36 bg-transparent text-[14px] outline-none placeholder:text-slate-400"/></label>
<button className="relative h-9 w-9 grid place-items-center rounded-full hover:bg-slate-100" aria-label="Notifications"><Bell className="h-5 w-5 text-slate-500"/><span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white"/></button>
<button className="relative h-9 w-9 grid place-items-center rounded-full hover:bg-slate-100" aria-label="Open cart"><ShoppingCart className="h-5 w-5 text-[#F47C20]"/><span className="absolute -top-1 -right-1 h-4 min-w-[16px] rounded-full bg-emerald-500 px-1 text-[10px] font-bold text-white grid place-items-center">{cartCount}</span></button>
<button className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-slate-100"><img src={avatarSrc} alt={userName} className="h-8 w-8 rounded-full object-cover"/><span className="hidden sm:block text-left leading-tight"><span className="block text-[14px] font-medium text-slate-700">{userName}</span><span className="block text-[12px] text-slate-400 -mt-0.5">{userRole}</span></span></button>
</div></div></motion.header>);}
