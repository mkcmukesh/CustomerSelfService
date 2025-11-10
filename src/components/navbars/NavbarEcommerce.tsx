"use client";
import NavLink from "./parts/NavLink";
import Link from "next/link";

export default function NavbarEcommerce() {
  return (
    <header className="sticky top-0 z-50">
      <div className="navbar bg-base-100/90 backdrop-blur border-b">
        <div className="flex-1 gap-2">
          <Link href="/" className="btn btn-ghost text-xl">Shoply</Link>
          <div className="hidden md:block">
            <input type="text" placeholder="Search products…" className="input input-bordered w-80" />
          </div>
        </div>
        <nav className="flex-none hidden md:flex gap-3">
          <NavLink href="/shop">Shop</NavLink>
          <NavLink href="/deals">Deals</NavLink>
          <NavLink href="/orders">Orders</NavLink>
        </nav>
        <div className="flex-none">
          <div className="indicator">
            <span className="indicator-item badge badge-primary">3</span>
            <Link href="/cart" className="btn btn-ghost">🛒</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
