// src/app/nav-gallery/page.tsx
import "./gallery.css"; // optional styles (see below)
import type { Metadata } from "next";
import dynamic from "next/dynamic";

// Lazy-load each variant so page stays fast
const NavbarMinimal       = dynamic(() => import("@/components/navbars/NavbarMinimal"), { ssr: false });
const NavbarBrandCenter   = dynamic(() => import("@/components/navbars/NavbarBrandCenter"), { ssr: false });
const NavbarGlassGradient = dynamic(() => import("@/components/navbars/NavbarGlassGradient"), { ssr: false });
const NavbarMega          = dynamic(() => import("@/components/navbars/NavbarMega"), { ssr: false });
const NavbarEcommerce     = dynamic(() => import("@/components/navbars/NavbarEcommerce"), { ssr: false });

export const metadata: Metadata = {
  title: "Navbar Gallery",
  description: "Preview all navbar variants",
};

export default function NavGalleryPage() {
  return (
    <div className="min-h-screen bg-base-200">
      <header className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">Navbar Gallery</h1>
        <p className="opacity-70">Click through to compare styles. These navbars are the same components your app uses.</p>
      </header>

      <section className="space-y-12">

        <VariantBlock title="Glass Gradient">
          <NavbarGlassGradient />
          <DemoContent />
        </VariantBlock>

        <VariantBlock title="Brand Center">
          <NavbarBrandCenter />
          <DemoContent />
        </VariantBlock>

        <VariantBlock title="Minimal">
          <NavbarMinimal />
          <DemoContent />
        </VariantBlock>

        <VariantBlock title="Mega Menu">
          <NavbarMega />
          <DemoContent />
        </VariantBlock>

        <VariantBlock title="E-commerce">
          <NavbarEcommerce />
          <DemoContent />
        </VariantBlock>

      </section>
    </div>
  );
}

/** Simple frame around each navbar + body content so you can see it in context */
function VariantBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="gallery-frame">
      <div className="container mx-auto px-4 pb-8">
        <div className="flex items-center justify-between pt-6 pb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          {/* Quick action: set this navbar as the global one in dev via query param */}
          <a
            href={`/?variant=${encodeURIComponent(title.toLowerCase().split(" ")[0])}`}
            className="btn btn-sm"
          >
            Use this
          </a>
        </div>
      </div>
      {children}
    </div>
  );
}

/** Placeholder content shown under each navbar so spacing/contrast is visible */
function DemoContent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Card title</h3>
            <p>Some example content to preview the navbar against a page.</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary btn-sm">Action</button>
            </div>
          </div>
        </div>
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Card title</h3>
            <p>Use this page to compare spacing, elevation and readability.</p>
            <div className="card-actions justify-end">
              <button className="btn btn-outline btn-sm">Action</button>
            </div>
          </div>
        </div>
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Card title</h3>
            <p>All components are your real navbars—no mocks.</p>
            <div className="card-actions justify-end">
              <button className="btn btn-neutral btn-sm">Action</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
