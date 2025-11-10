"use client";
import { useMemo, useState, useEffect } from "react";
import PageShell from "@/components/Panther-CSS/Layout/PageShell";

/** Defaults used by Reset */
const DEFAULTS = {
  showHeader: true,
  showFooter: true,
  showLeftSidebar: true,
  showRightSidebar: true, // mount flag
  leftCollapsed: false,
  rightOpen: true,
  rightCollapsed: false,
  leftSidebarWidth: 240,
  rightSidebarWidth: 300,
  rightCollapsedWidth: 72,
  tone: "app" as const,
};

export default function DashboardHome() {
  /** Visibility */
  const [showHeader, setShowHeader] = useState(DEFAULTS.showHeader);
  const [showFooter, setShowFooter] = useState(DEFAULTS.showFooter);
  const [showLeftSidebar, setShowLeftSidebar] = useState(DEFAULTS.showLeftSidebar);
  const [showRightSidebar, setShowRightSidebar] = useState(DEFAULTS.showRightSidebar); // mount flag

  /** Panel state (controlled) */
  const [leftCollapsed, setLeftCollapsed] = useState(DEFAULTS.leftCollapsed);
  const [rightOpen, setRightOpen] = useState(DEFAULTS.rightOpen);            // open/close
  const [rightCollapsed, setRightCollapsed] = useState(DEFAULTS.rightCollapsed); // collapse/expand

  /** Sizes */
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(DEFAULTS.leftSidebarWidth);
  const [rightSidebarWidth, setRightSidebarWidth] = useState(DEFAULTS.rightSidebarWidth);
  const [rightCollapsedWidth, setRightCollapsedWidth] = useState(DEFAULTS.rightCollapsedWidth);

  /** Theme tone */
  const [tone] = useState(DEFAULTS.tone);

  /* Helpers */
  const toggleRight = () => {
    setRightOpen(prev => {
      const next = !prev;
      if (next && !showRightSidebar) setShowRightSidebar(true);
      return next;
    });
  };

  const toggleAll = () => {
    setShowHeader(v => !v);
    setShowFooter(v => !v);
    setShowLeftSidebar(v => !v);
    setShowRightSidebar(v => !v);
    setLeftCollapsed(v => !v);
    setRightCollapsed(v => !v);
    setRightOpen(v => !v);
  };

  const resetLayout = () => {
    try {
      localStorage.removeItem("shell:prefs");
      localStorage.removeItem("rsz:right");
    } catch {}
    setShowHeader(DEFAULTS.showHeader);
    setShowFooter(DEFAULTS.showFooter);
    setShowLeftSidebar(DEFAULTS.showLeftSidebar);
    setShowRightSidebar(DEFAULTS.showRightSidebar);
    setLeftCollapsed(DEFAULTS.leftCollapsed);
    setRightOpen(DEFAULTS.rightOpen);
    setRightCollapsed(DEFAULTS.rightCollapsed);
    setLeftSidebarWidth(DEFAULTS.leftSidebarWidth);
    setRightSidebarWidth(DEFAULTS.rightSidebarWidth);
    setRightCollapsedWidth(DEFAULTS.rightCollapsedWidth);
  };

  /* Code Builder modal */
  const [builderOpen, setBuilderOpen] = useState(false);
  const [builderTab, setBuilderTab] = useState<"code" | "preview">("code");

  const generatedCode = useMemo(() => {
    const b = (x: boolean) => (x ? "true" : "false");
    return `\
"use client";
import { useState } from "react";
import PageShell from "@/components/Panther-CSS/Layout/PageShell";

export default function NewLayoutPage() {
  const [showHeader, setShowHeader] = useState(${b(showHeader)});
  const [showFooter, setShowFooter] = useState(${b(showFooter)});
  const [showLeftSidebar, setShowLeftSidebar] = useState(${b(showLeftSidebar)});
  const [showRightSidebar, setShowRightSidebar] = useState(${b(showRightSidebar)});
  const [leftCollapsed, setLeftCollapsed] = useState(${b(leftCollapsed)});
  const [rightOpen, setRightOpen] = useState(${b(rightOpen)});
  const [rightCollapsed, setRightCollapsed] = useState(${b(rightCollapsed)});

  return (
    <PageShell
      tone="${tone}"
      containerClassName="max-w-7xl mx-auto"
      showHeader={showHeader}
      showFooter={showFooter}
      showLeftSidebar={showLeftSidebar}
      showRightSidebar={showRightSidebar}
      leftSidebarWidth={${leftSidebarWidth}}
      rightSidebarWidth={${rightSidebarWidth}}
      rightCollapsedWidth={${rightCollapsedWidth}}
      leftCollapsed={leftCollapsed}
      onLeftCollapsedChange={setLeftCollapsed}
      rightOpen={rightOpen}
      onRightOpenChange={setRightOpen}
      rightCollapsed={rightCollapsed}
      onRightCollapsedChange={setRightCollapsed}
    >
      <div className="mb-4 flex flex-wrap gap-2">
        <button className="btn btn-sm" onClick={() => setShowHeader(v => !v)}>Toggle Header</button>
        <button className="btn btn-sm" onClick={() => setShowFooter(v => !v)}>Toggle Footer</button>
        <button className="btn btn-sm" onClick={() => setShowLeftSidebar(v => !v)}>Toggle Left</button>
        <button className="btn btn-sm" onClick={() => setRightOpen(v => !v)}>{ rightOpen ? "Close Right" : "Open Right" }</button>
      </div>

      <div className="grid gap-4">
        <div className="card bg-base-100 p-4 shadow">Your content</div>
      </div>
    </PageShell>
  );
}
`;
  }, [
    showHeader,
    showFooter,
    showLeftSidebar,
    showRightSidebar,
    leftCollapsed,
    rightOpen,
    rightCollapsed,
    leftSidebarWidth,
    rightSidebarWidth,
    rightCollapsedWidth,
    tone,
  ]);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      alert("Code copied to clipboard ✅");
    } catch {
      alert("Could not copy. Select the text and copy manually.");
    }
  };

  /* ---------- Save As modal state (UPDATED to parent + subfolder -> page.tsx) ---------- */
  const [saveOpen, setSaveOpen] = useState(false);
  const [folders, setFolders] = useState<string[]>([]);
  const [parentFolder, setParentFolder] = useState(""); // choose existing parent under src/app/pages
  const [subFolder, setSubFolder] = useState("");       // new subfolder name to create inside parent
  const [overwrite, setOverwrite] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<string | null>(null);

  async function refreshFolders() {
    try {
      // New API returns folders via GET (no query string needed)
      const res = await fetch("/api/save-page");
      const json = await res.json();
      setFolders(json.folders ?? []);
    } catch {
      setFolders([]);
    }
  }

  function openSave() {
    setSaveResult(null);
    setOverwrite(false);
    setSaveOpen(true);
    refreshFolders();
  }

  async function doSave() {
    if (!parentFolder.trim() || !subFolder.trim()) return;
    setSaving(true);
    setSaveResult(null);
    try {
      const res = await fetch("/api/save-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parentFolder,   // existing folder (e.g. "DS-VMS")
          subFolder,      // new subfolder to create inside parent (e.g. "Template-Internal")
          content: generatedCode, // your TSX
          overwrite,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Save failed");
      setSaveResult(`✅ Saved: ${json.path}  (route: ${json.route})`);
    } catch (e: any) {
      setSaveResult(`❌ ${e?.message || "Save failed"}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageShell
      tone={tone}
      containerClassName="max-w-7xl mx-auto"
      /* visibility */
      showHeader={showHeader}
      showFooter={showFooter}
      showLeftSidebar={showLeftSidebar}
      showRightSidebar={showRightSidebar}
      /* sizing */
      leftSidebarWidth={leftSidebarWidth}
      rightSidebarWidth={rightSidebarWidth}
      rightCollapsedWidth={rightCollapsedWidth}
      /* controlled state */
      leftCollapsed={leftCollapsed}
      onLeftCollapsedChange={setLeftCollapsed}
      rightOpen={rightOpen}
      onRightOpenChange={setRightOpen}
      rightCollapsed={rightCollapsed}
      onRightCollapsedChange={setRightCollapsed}
    >
      {/* Controls */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button className="btn btn-sm" onClick={() => setShowHeader(v => !v)}>Toggle Header</button>
        <button className="btn btn-sm" onClick={() => setShowFooter(v => !v)}>Toggle Footer</button>
        <button className="btn btn-sm" onClick={() => setShowLeftSidebar(v => !v)}>Toggle Left</button>
        <button className="btn btn-sm" onClick={toggleRight}>Toggle Right</button>

        <button className="btn btn-sm" onClick={() => setLeftCollapsed(v => !v)}>
          {leftCollapsed ? "Expand Left" : "Collapse Left"}
        </button>
        <button className="btn btn-sm" onClick={() => setRightCollapsed(v => !v)}>
          {rightCollapsed ? "Expand Right" : "Collapse Right"}
        </button>
        <button className="btn btn-sm" onClick={() => setRightOpen(v => !v)}>
          {rightOpen ? "Close Right" : "Open Right"}
        </button>

        <button className="btn btn-sm btn-primary" onClick={toggleAll}>Toggle All</button>
        <button className="btn btn-sm btn-warning" onClick={resetLayout}>Reset Layout</button>

        {/* NEW: Save (parent -> subfolder -> page.tsx) */}
        <button className="btn btn-sm btn-success" onClick={openSave}>Save Page…</button>

        {/* Optional: builder */}
        <button
          className="btn btn-sm btn-accent"
          onClick={() => { setBuilderTab("code"); setBuilderOpen(true); }}
        >
          Open Code Builder
        </button>
      </div>

      {/* Page content */}
      <div className="grid gap-4">
        <div className="card bg-base-100 p-4 shadow">Stats card</div>
        <div className="card bg-base-100 p-4 shadow">Recent activity</div>
      </div>

      {/* ===== Save Modal (UPDATED) ===== */}
      {saveOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSaveOpen(false)} />
          <div className="relative z-10 w-full max-w-xl rounded-xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
              <h3 className="font-semibold text-slate-800">Save Page (parent ➝ subfolder/page.tsx)</h3>
              <button className="btn btn-xs btn-neutral" onClick={refreshFolders}>Refresh Folders</button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Parent folder under <code>src/app/pages</code>
                </label>
                <div className="flex gap-2">
                  <select
                    className="select select-sm select-bordered w-full"
                    value={parentFolder}
                    onChange={(e) => setParentFolder(e.target.value)}
                  >
                    <option value="" disabled>Select parent…</option>
                    {folders.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  New subfolder name
                </label>
                <input
                  className="input input-sm input-bordered w-full"
                  placeholder='e.g. "Template-Internal"'
                  value={subFolder}
                  onChange={(e) => setSubFolder(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="overwrite"
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={overwrite}
                  onChange={(e) => setOverwrite(e.target.checked)}
                />
                <label htmlFor="overwrite" className="text-sm text-slate-700">
                  Overwrite existing <code>page.tsx</code> if present
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  Will create: <code>src/app/pages/{parentFolder || "…"} / {subFolder || "…"}/page.tsx</code>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-sm" onClick={() => setSaveOpen(false)}>Cancel</button>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={doSave}
                    disabled={saving || !parentFolder || !subFolder}
                  >
                    {saving ? "Saving…" : "Save"}
                  </button>
                </div>
              </div>

              {saveResult && (
                <div className="rounded-md border p-2 text-xs mt-2 border-slate-200 bg-slate-50 text-slate-700">
                  {saveResult}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== Code Builder Modal (unchanged; includes Save shortcut) ===== */}
      {builderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40" onClick={() => setBuilderOpen(false)} />
          <div className="relative z-10 w-full max-w-6xl rounded-xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-800">Code Builder & Preview</h3>
                <span className="text-xs text-slate-500">(reflects your current toggles)</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="btn btn-xs" onClick={() => setBuilderTab("code")} aria-pressed={builderTab === "code"}>Code</button>
                <button className="btn btn-xs" onClick={() => setBuilderTab("preview")} aria-pressed={builderTab === "preview"}>Preview</button>
                <button className="btn btn-xs btn-neutral" onClick={copyCode}>Copy</button>
                <button className="btn btn-xs btn-success" onClick={() => { setBuilderOpen(false); openSave(); }}>
                  Save…
                </button>
                <button className="btn btn-xs btn-error" onClick={() => setBuilderOpen(false)}>Close</button>
              </div>
            </div>

            <div className="h-[72vh]">
              {builderTab === "code" ? (
                <pre className="h-full w-full overflow-auto p-4 text-sm leading-6 bg-white text-slate-800">
{generatedCode}
                </pre>
              ) : (
                <div className="h-full w-full overflow-hidden bg-slate-50 p-3">
                  <div className="h-full rounded-lg border border-slate-200 bg-white overflow-hidden">
                    <PageShell
                      tone={tone}
                      containerClassName="max-w-5xl mx-auto"
                      enablePersistence={false}
                      enableShortcuts={false}
                      showHeader={showHeader}
                      showFooter={showFooter}
                      showLeftSidebar={showLeftSidebar}
                      showRightSidebar={showRightSidebar}
                      leftSidebarWidth={leftSidebarWidth}
                      rightSidebarWidth={rightSidebarWidth}
                      rightCollapsedWidth={rightCollapsedWidth}
                      leftCollapsed={leftCollapsed}
                      onLeftCollapsedChange={setLeftCollapsed}
                      rightOpen={rightOpen}
                      onRightOpenChange={setRightOpen}
                      rightCollapsed={rightCollapsed}
                      onRightCollapsedChange={setRightCollapsed}
                    >
                      <div className="p-4 grid gap-3">
                        <div className="card bg-base-100 p-3 shadow">Preview card A</div>
                        <div className="card bg-base-100 p-3 shadow">Preview card B</div>
                      </div>
                    </PageShell>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
