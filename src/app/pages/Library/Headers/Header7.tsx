
"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Command, User } from "lucide-react";
import ActionsDropdown from "@/components/Panther-CSS/Menu/ActionsDropdown";
type Props={placeholder?:string};
export default function Header7({placeholder="Search orders, invoices, customers…"}:Props){
return(<motion.header initial={{y:-8,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:0.24}} className="sticky top-0 z-40">
<div className="h-16 bg-white border-b border-slate-200 flex items-center px-4 sm:px-6 lg:px-10">
<Link href="/" className="font-semibold text-slate-700 hidden sm:block">Admin</Link>
<label className="mx-4 sm:mx-8 flex-1 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2">
<Search className="h-4 w-4 text-slate-400"/><input className="w-full bg-transparent text-[14px] outline-none placeholder:text-slate-400" placeholder={placeholder}/>
<span className="hidden sm:flex items-center gap-1 text-[12px] text-slate-400"><Command className="h-3.5 w-3.5"/> K</span></label>
<nav className="hidden md:flex items-center gap-6 text-[14.5px] text-slate-600"><ActionsDropdown/><Link href="#" className="hover:text-slate-900">Logs</Link><Link href="#" className="hover:text-slate-900 flex items-center gap-1"><User className="h-4 w-4"/> Profile</Link></nav>
</div></motion.header>);}
