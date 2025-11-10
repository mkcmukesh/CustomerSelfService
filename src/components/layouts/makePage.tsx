import React from "react";
import PageShell, { LayoutKind } from "./PageShell";

export function makePage(layout: LayoutKind, Content: React.ComponentType) {
  return function WrappedPage() {
    return (
      <PageShell layout={layout}>
        <Content />
      </PageShell>
    );
  };
}
