"use client";
import PageShell from "@/components/layouts/PageShell";

export default function websitePage() {
  return (
    <PageShell layout="site">
      <section className="max-w-7xl mx-auto p-0 space-y-4">
        <h1 className="text-3xl font-bold">Website Default</h1>
        <p>Company info, mission, etc.</p>
      </section>
    </PageShell>
  );
}
