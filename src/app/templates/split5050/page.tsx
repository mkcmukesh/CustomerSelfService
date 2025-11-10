"use client";

import PageShell from "@/components/layouts/PageShell";

export default function SplitTemplatePage() {
  return (
    <PageShell layout="contentFullWidth5050">
      {/* left column */}
      <div className="prose">
        <h2 className="text-3xl font-bold">Left Column</h2>
        <p>Use this for copy, forms, etc.</p>
      </div>

      {/* right column */}
      <div className="card bg-white shadow p-6">
        <h3 className="text-xl font-semibold mb-2">Right Column</h3>
        <ul className="list-disc ml-5 space-y-1">
          <li>Stats or CTA</li>
          <li>Feature bullets</li>
          <li>Secondary content</li>
        </ul>
      </div>
    </PageShell>
  );
}
