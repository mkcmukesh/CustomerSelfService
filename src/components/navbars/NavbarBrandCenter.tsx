"use client";
import NavLink from "./parts/NavLink";

export default function NavbarBrandCenter() {
  return (
    <header className="sticky top-0 z-50">
      <div className="navbar bg-base-100/90 backdrop-blur border-b">
        <nav className="flex-1 hidden md:flex gap-3">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/about">About</NavLink>
        </nav>
        <div className="flex-none">
          <a className="btn btn-ghost text-xl">CenterBrand</a>
        </div>
        <nav className="flex-1 hidden md:flex gap-3 justify-end">
          <NavLink href="/pricing">Pricing</NavLink>
          <NavLink href="/dashboard">Dashboard</NavLink>
        </nav>
      </div>
    </header>
  );
}
