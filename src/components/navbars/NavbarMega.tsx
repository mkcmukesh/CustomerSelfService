"use client";
import Link from "next/link";
import NavLink from "./parts/NavLink";

export default function NavbarMega() {
  return (
    <header className="sticky top-0 z-50">
      <div className="navbar bg-base-100/90 backdrop-blur border-b">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">MegaBrand</a>
        </div>

        <nav className="hidden lg:flex gap-3">
          <NavLink href="/">Home</NavLink>
          <details className="dropdown dropdown-end">
            <summary className="btn btn-ghost px-2">Products ▾</summary>
            <div className="dropdown-content mt-2 w-[600px] p-4 bg-base-100 text-base-content rounded-box shadow grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="font-semibold mb-2">Design</p>
                <ul className="menu">
                  <li><Link href="/design/ui">UI Kit</Link></li>
                  <li><Link href="/design/figma">Figma Lib</Link></li>
                  <li><Link href="/design/icons">Icons</Link></li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">Dev</p>
                <ul className="menu">
                  <li><Link href="/dev/components">Components</Link></li>
                  <li><Link href="/dev/templates">Templates</Link></li>
                  <li><Link href="/dev/cli">CLI Tools</Link></li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">Cloud</p>
                <ul className="menu">
                  <li><Link href="/cloud/compute">Compute</Link></li>
                  <li><Link href="/cloud/db">Database</Link></li>
                  <li><Link href="/cloud/kv">KV Store</Link></li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">Learn</p>
                <ul className="menu">
                  <li><Link href="/learn/blog">Blog</Link></li>
                  <li><Link href="/learn/courses">Courses</Link></li>
                  <li><Link href="/learn/changelog">Changelog</Link></li>
                </ul>
              </div>
            </div>
          </details>
          <NavLink href="/pricing">Pricing</NavLink>
          <NavLink href="/dashboard">Dashboard</NavLink>
        </nav>
      </div>
    </header>
  );
}
