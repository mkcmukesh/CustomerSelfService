"use client";

import React, {
  useState,
  useEffect,
  PropsWithChildren,
  CSSProperties,
  ReactNode,
  createContext,
  useContext,
} from "react";

import DashboardHeader from "@/components/Panther-CSS/Header/Header-1";
import LeftSidebar from "@/components/Panther-CSS/Sidebar/LeftSidebar-1";
import RightSidebar from "@/components/Panther-CSS/Sidebar/RightSidebar-1";
import DashboardFooter from "@/components/Panther-CSS/Footer/Footer-1";

/* ---------- Utilities ---------- */

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

const dotBg: CSSProperties = {
  backgroundImage: "radial-gradient(white 1px, transparent 1px)",
  backgroundSize: "14px 14px",
  backgroundPosition: "0 0",
};

type Tone = "site" | "content" | "app";
const GRADIENTS: Record<Tone, string> = {
  site: "from-sky-400 via-sky-500 to-sky-600",
  content: "from-sky-400 via-sky-500 to-sky-600",
  app: "from-sky-400 via-sky-500 to-sky-600",
};

function ThemedBack({ tone }: { tone: Tone }) {
  return (
    <>
      <div className={cn("absolute inset-0 -z-10 bg-gradient-to-b", GRADIENTS[tone])} />
      <div aria-hidden className="absolute inset-0 -z-10 opacity-40" style={dotBg} />
    </>
  );
}

/* ---------- Shell Context (optional consumer control) ---------- */

type ShellCtx = {
  leftCollapsed: boolean;
  setLeftCollapsed: (v: boolean) => void;
  rightOpen: boolean;
  setRightOpen: (v: boolean) => void;
  rightCollapsed: boolean;
  setRightCollapsed: (v: boolean) => void;
  setRightWidth: (px: number) => void;
};
const PageShellContext = createContext<ShellCtx | null>(null);
export const usePageShell = () => {
  const ctx = useContext(PageShellContext);
  if (!ctx) throw new Error("usePageShell must be used within PageShell");
  return ctx;
};

/* ---------- Props ---------- */

type PageShellProps = PropsWithChildren<{
  tone?: Tone;
  containerClassName?: string;

  /* Regions (visibility) */
  showHeader?: boolean;
  showFooter?: boolean;
  showLeftSidebar?: boolean;
  showRightSidebar?: boolean; // initial mount flag for the right column

  /* Overrides */
  header?: ReactNode;
  footer?: ReactNode;
  leftSidebar?: ReactNode;
  rightSidebar?: (controls: {
    collapsed: boolean;
    onToggleCollapse: () => void;
    onClose: () => void;
  }) => ReactNode;

  /* Footer behavior */
  fixedFooter?: boolean;
  footerHeightPx?: number;

  /* Sizing */
  leftSidebarWidth?: number;
  rightSidebarWidth?: number;      // expanded width (px)
  rightCollapsedWidth?: number;    // collapsed width (px)

  /* Controlled state (optional) */
  leftCollapsed?: boolean;
  onLeftCollapsedChange?: (v: boolean) => void;

  rightOpen?: boolean;
  onRightOpenChange?: (v: boolean) => void;

  rightCollapsed?: boolean;
  onRightCollapsedChange?: (v: boolean) => void;

  /* NEW: flags for nested shells (e.g., preview) */
  enablePersistence?: boolean; // default true
  enableShortcuts?: boolean;   // default true
}>;

/* ---------- Component ---------- */

export default function PageShell({
  children,
  tone = "app",
  containerClassName = "max-w-7xl mx-auto",
  showHeader = true,
  showFooter = true,
  showLeftSidebar = true,
  showRightSidebar = false, // initial mount flag
  header,
  footer,
  leftSidebar,
  rightSidebar,
  fixedFooter = true,
  footerHeightPx = 48,
  leftSidebarWidth = 256,
  rightSidebarWidth = 320,
  rightCollapsedWidth = 64,

  /* controlled */
  leftCollapsed: leftCollapsedProp,
  onLeftCollapsedChange,
  rightOpen: rightOpenProp,
  onRightOpenChange,
  rightCollapsed: rightCollapsedProp,
  onRightCollapsedChange,

  /* nested shell guards */
  enablePersistence = true,
  enableShortcuts = true,
}: PageShellProps) {
  /* ----- State (controlled with internal fallbacks) ----- */
  const [leftCollapsedState, setLeftCollapsedState] = useState(false);
  const [rightOpenState, setRightOpenState] = useState(showRightSidebar);
  const [rightCollapsedState, setRightCollapsedState] = useState(false);

  const leftCollapsed = leftCollapsedProp ?? leftCollapsedState;
  const setLeftCollapsed = (v: boolean) =>
    onLeftCollapsedChange ? onLeftCollapsedChange(v) : setLeftCollapsedState(v);

  const rightOpen = rightOpenProp ?? rightOpenState;
  const setRightOpen = (v: boolean) =>
    onRightOpenChange ? onRightOpenChange(v) : setRightOpenState(v);

  const rightCollapsed = rightCollapsedProp ?? rightCollapsedState;
  const setRightCollapsed = (v: boolean) =>
    onRightCollapsedChange ? onRightCollapsedChange(v) : setRightCollapsedState(v);

  /* ----- Keep uncontrolled rightOpen in sync with mount flag ----- */
  useEffect(() => {
    if (rightOpenProp === undefined) {
      setRightOpenState((prev) => (prev === showRightSidebar ? prev : showRightSidebar));
    }
  }, [showRightSidebar, rightOpenProp]);

  /* ----- Resizable right width (persisted) ----- */
  const [rightWidth, setRightWidth] = useState<number>(rightSidebarWidth);
  useEffect(() => {
    if (!enablePersistence) return;
    try {
      const saved = Number(localStorage.getItem("rsz:right") || "");
      if (saved) setRightWidth(saved);
    } catch {}
  }, [enablePersistence]);
  useEffect(() => {
    if (!enablePersistence) return;
    try {
      localStorage.setItem("rsz:right", String(rightWidth));
    } catch {}
  }, [enablePersistence, rightWidth]);

  function startRightDrag(e: React.MouseEvent) {
    if (rightCollapsed) return; // ignore while collapsed
    e.preventDefault();
    const startX = e.clientX;
    const startW = rightWidth;
    function move(ev: MouseEvent) {
      const dx = startX - ev.clientX; // drag left increases width
      const next = Math.max(240, Math.min(640, startW + dx)); // clamp range
      setRightWidth(next);
    }
    function up() {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    }
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  }

  /* ----- Persist preferences (non-breaking) ----- */
  useEffect(() => {
    if (!enablePersistence) return;
    try {
      const snapshot = { leftCollapsed, rightOpen, rightCollapsed, tone };
      localStorage.setItem("shell:prefs", JSON.stringify(snapshot));
    } catch {}
  }, [enablePersistence, leftCollapsed, rightOpen, rightCollapsed, tone]);

  useEffect(() => {
    if (!enablePersistence) return;
    try {
      const raw = localStorage.getItem("shell:prefs");
      if (!raw) return;
      const s = JSON.parse(raw);
      if (typeof s.leftCollapsed === "boolean") setLeftCollapsed(s.leftCollapsed);
      if (typeof s.rightOpen === "boolean") setRightOpen(s.rightOpen);
      if (typeof s.rightCollapsed === "boolean") setRightCollapsed(s.rightCollapsed);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enablePersistence]);

  /* ----- Keyboard shortcuts (guarded) ----- */
  useEffect(() => {
    if (!enableShortcuts) return;
    function onKey(e: KeyboardEvent) {
      const ctrl = e.ctrlKey || e.metaKey;
      if (!ctrl) return;
      if (e.key === "`") { e.preventDefault(); setRightOpen(!rightOpen); }
      if (e.key === "[") { e.preventDefault(); setLeftCollapsed(!leftCollapsed); }
      if (e.key === "]") { e.preventDefault(); setRightCollapsed(!rightCollapsed); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enableShortcuts, rightOpen, leftCollapsed, rightCollapsed, setRightOpen, setLeftCollapsed, setRightCollapsed]);

  /* ----- Defaults for overridable regions ----- */
  const HeaderEl = header ?? <DashboardHeader />;
  const FooterEl = footer ?? <DashboardFooter left="Panther CSS · v1.0" />;
  const LeftSidebarEl =
    leftSidebar ?? <LeftSidebar collapsed={leftCollapsed} setCollapsed={setLeftCollapsed} />;

  const RightSidebarEl =
    rightSidebar
      ? rightSidebar({
          collapsed: rightCollapsed,
          onToggleCollapse: () => setRightCollapsed(!rightCollapsed),
          onClose: () => setRightOpen(false),
        })
      : (
        <RightSidebar
          title="Actions & Updates"
          footerOffsetPx={footerHeightPx}
          collapsed={rightCollapsed}
          onToggleCollapse={() => setRightCollapsed(!rightCollapsed)}
          onClose={() => setRightOpen(false)}
        />
      );

  /* ----- Grid columns adapt to open/collapse state ----- */
  const cols =
    showLeftSidebar && rightOpen
      ? `${leftCollapsed ? 64 : leftSidebarWidth}px 1fr ${rightCollapsed ? rightCollapsedWidth : rightWidth}px`
      : showLeftSidebar && !rightOpen
      ? `${leftCollapsed ? 64 : leftSidebarWidth}px 1fr`
      : !showLeftSidebar && rightOpen
      ? `1fr ${rightCollapsed ? rightCollapsedWidth : rightWidth}px`
      : "1fr";

  const mainBottomPad = fixedFooter && showFooter ? { paddingBottom: `${footerHeightPx}px` } : {};

  const ctxValue = React.useMemo(() => ({
    leftCollapsed, setLeftCollapsed,
    rightOpen, setRightOpen,
    rightCollapsed, setRightCollapsed,
    setRightWidth,
  }), [leftCollapsed, rightOpen, rightCollapsed]);

  /* ---------- Render ---------- */
  return (
    <PageShellContext.Provider value={ctxValue}>
      <div className="relative min-h-dvh overflow-hidden">
        <ThemedBack tone={tone} />

        {/* Accessible skip link */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 bg-sky-600  px-3 py-1 rounded"
        >
          Skip to content
        </a>

        {/* Header */}
        {showHeader ? <div className="sticky top-0 z-40">{HeaderEl}</div> : null}

        {/* Body grid */}
        <div
          className="grid"
          style={{ gridTemplateRows: "1fr", gridTemplateColumns: cols }}
        >
          {/* Left sidebar */}
          {showLeftSidebar ? (
            <div
              style={{ width: leftCollapsed ? 64 : leftSidebarWidth }}
              className="min-h-[calc(100dvh-var(--header-offset,0px))]"
            >
              {LeftSidebarEl}
            </div>
          ) : null}

          {/* Main */}
          <main id="main" tabIndex={-1} className="p-0" style={mainBottomPad}>
            <div className={cn(containerClassName, "text-slate-800")}>{children}</div>
          </main>

          {/* Right sidebar */}
          {rightOpen ? (
            <div
              style={{ width: rightCollapsed ? rightCollapsedWidth : rightWidth }}
              className="relative transition-[width] duration-300 ease-in-out"
            >
              {/* Drag handle (hidden when collapsed) */}
              {!rightCollapsed && (
                <div
                  onMouseDown={startRightDrag}
                  className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize bg-transparent hover:bg-slate-300/40"
                  aria-hidden
                />
              )}
              {RightSidebarEl}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        {showFooter ? (
          fixedFooter ? (
            <div
              style={{ height: footerHeightPx }}
              className="fixed bottom-0 left-0 right-0 z-40"
            >
              {FooterEl}
            </div>
          ) : (
            <div>{FooterEl}</div>
          )
        ) : null}

        {/* Floating "Open Panel" button when right is closed */}
        {!rightOpen && (
          <button
            onClick={() => setRightOpen(true)}
            className="fixed bottom-16 right-4 z-40 rounded-full px-4 py-2 bg-sky-600 text-white shadow-lg hover:shadow-xl"
            aria-label="Open right panel"
          >
            Open Panel
          </button>
        )}
      </div>
    </PageShellContext.Provider>
  );
}
