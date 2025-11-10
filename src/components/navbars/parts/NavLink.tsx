"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({
  href,
  children,
  className = "",
}: { href: string; children: React.ReactNode; className?: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={[
        "relative px-2",
        isActive
          ? "text-primary-content after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-current"
          : "opacity-80 hover:opacity-100",
        className,
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
