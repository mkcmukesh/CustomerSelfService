// src/components/CopyBadge.tsx
"use client";
import { useState, useRef } from "react";
import { htmlToTsx } from "@/components/tools/htmlToTsx"; // your converter

export default function CopyBadge({ targetId, label = "Copy", stripClasses = ["cpy"] }: {
  targetId: string; label?: string; stripClasses?: string[];
}) {
  const [ok, setOk] = useState(false);
  const copying = useRef(false);
  const onCopy = async () => {
    if (copying.current) return;
    copying.current = true;
    try {
      const node = document.getElementById(targetId);
      if (!node) return;
      let html = node.innerHTML.trim();
      for (const cls of stripClasses) {
        html = html.replace(new RegExp(`\\b${cls}\\b`, "g"), "").replace(/\s+/g, " ");
      }
      const tsx = htmlToTsx(html);
      await navigator.clipboard.writeText(tsx);
      setOk(true); setTimeout(() => setOk(false), 900);
    } finally { copying.current = false; }
  };
  return (
    <button
      type="button"
      onClick={onCopy}
      className="btn btn-ghost btn-xs absolute right-2 top-2 z-10 bg-base-100/80 backdrop-blur rounded-full"
      title="Copy snippet"
      aria-label="Copy snippet"
    >
      {ok ? "Copied" : label}
    </button>
  );
}
