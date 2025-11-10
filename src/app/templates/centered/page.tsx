"use client";

import PageShell from "@/components/layouts/PageShell";


export default function CenteredTemplatePage() {
  return (
    <PageShell layout="contentFullHeightCenter">

      
      <div className="mx-auto max-w-[1100px] w-full text-center space-y-4 px-6">
        <h1 className="text-5xl font-extrabold text-slate-900">
          All eyes here 👀
        </h1>
        <p className="text-lg text-slate-700">
          Centered copy with a clean halo vibe.
        </p>
        <button className="btn btn-primary mt-4">Primary Action</button>
      </div>
    </PageShell>
  );
}
