"use client";
import { useState } from "react";
import PageShell from "@/components/Panther-CSS/Layout/PageShell";

export default function NewLayoutPage() {
  const [showHeader, setShowHeader] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [leftCollapsed, setLeftCollapsed] = useState(true);
  const [rightOpen, setRightOpen] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(true);

  return (
    <PageShell
      tone="app"
      containerClassName="max-w-7xl mx-auto"
      showHeader={showHeader}
      showFooter={showFooter}
      showLeftSidebar={showLeftSidebar}
      showRightSidebar={showRightSidebar}
      leftSidebarWidth={240}
      rightSidebarWidth={300}
      rightCollapsedWidth={72}
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
