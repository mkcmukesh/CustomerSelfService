"use client";
import NavLink from "./parts/NavLink";

export default function NavbarMinimal() {
  return (
    <header className="sticky top-0 z-50">
      <div className="navbar bg-base-100/90 backdrop-blur border-b">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">Brand</a>
        </div>
        <nav className="flex-none hidden md:flex gap-3">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/features">Features</NavLink>
          <NavLink href="/pricing">Pricing</NavLink>
          <NavLink href="/contact">Contact</NavLink>
        </nav>
      </div>
    </header>
  );
}
