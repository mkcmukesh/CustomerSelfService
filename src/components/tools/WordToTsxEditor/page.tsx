'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import prettier from "prettier/standalone";
import parserTypescript from "prettier/plugins/typescript";
import parserBabel from "prettier/plugins/babel";

/**
 * Word → TSX Editor (DaisyUI version)
 * - No shadcn/ui imports. Pure Tailwind + DaisyUI classes.
 * - Paste from Word → clean → edit → generate TSX.
 * - Toolbar is UL/LI with active bullet style.
 */
export default function WordToTsxEditor() {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [tsx, setTsx] = useState<string>("");
  const [html, setHtml] = useState<string>("");
  const [active, setActive] = useState<Record<string, boolean>>({});
  const [selectedTab, setSelectedTab] = useState<"editor" | "html" | "tsx">("editor");

  // --- Toolbar definition (UL/LI buttons) ---------------------------------
  const toolbar = useMemo(
    () => [
      { id: "bold", label: "Bold", cmd: "bold" },
      { id: "italic", label: "Italic", cmd: "italic" },
      { id: "underline", label: "Underline", cmd: "underline" },
      { id: "sep1", label: "|", cmd: null },
      { id: "h1", label: "H1", cmd: "formatBlock", arg: "<h1>" },
      { id: "h2", label: "H2", cmd: "formatBlock", arg: "<h2>" },
      { id: "p", label: "P", cmd: "formatBlock", arg: "<p>" },
      { id: "sep2", label: "|", cmd: null },
      { id: "ul", label: "UL", cmd: "insertUnorderedList" },
      { id: "ol", label: "OL", cmd: "insertOrderedList" },
      { id: "quote", label: "Quote", cmd: "formatBlock", arg: "<blockquote>" },
      { id: "code", label: "Code", cmd: "formatBlock", arg: "<pre>" },
      { id: "clear", label: "Clear", cmd: "removeFormat" },
    ],
    []
  );

  // --- Paste handling / Word cleanup -------------------------------------
  const onPaste = useCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();

    const htmlData = e.clipboardData.getData("text/html");
    const textData = e.clipboardData.getData("text/plain");
    const raw = htmlData || textData || "";

    const cleaned = cleanWordHtml(raw);
    insertHtmlAtCursor(cleaned);

    // Sync state after paste
    setTimeout(() => {
      setHtml(editorRef.current?.innerHTML || "");
    }, 0);
  }, []);

  // --- Selection state → active toolbar bullets --------------------------
  useEffect(() => {
    const handler = () => {
      try {
        const get = (cmd: string) => document.queryCommandState(cmd);
        setActive({
          bold: get("bold"),
          italic: get("italic"),
          underline: get("underline"),
          ul: get("insertUnorderedList"),
          ol: get("insertOrderedList"),
        });
      } catch {/* noop */}
    };
    document.addEventListener("selectionchange", handler);
    return () => document.removeEventListener("selectionchange", handler);
  }, []);

  // --- Commands -----------------------------------------------------------
  const runCmd = (cmd: string | null, arg?: string) => {
    if (!cmd) return;
    editorRef.current?.focus();
    document.execCommand(cmd, false, arg);
    setHtml(editorRef.current?.innerHTML || "");
  };

  // --- Generate TSX -------------------------------------------------------
  const generateTsx = async () => {
    const editorHtml = editorRef.current?.innerHTML || "";
    setHtml(editorHtml);

    const jsx = htmlToJsx(editorHtml);
    try {
      const formatted = await prettier.format(jsx, {
        parser: "babel" as any,
        plugins: [parserBabel, parserTypescript],
        semi: false,
      });
      setTsx(formatted);
      setSelectedTab("tsx");
      toast.success("TSX generated and formatted");
    } catch (err: any) {
      setTsx(jsx);
      toast.error("Prettier failed – showing unformatted JSX");
    }
  };

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="mx-auto max-w-6xl p-4 space-y-4">
      {/* Card */}
      <div className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body gap-4">
          <h2 className="card-title text-2xl">Word → TSX Editor</h2>

          {/* UL/LI Toolbar with active bullet style */}
          <nav aria-label="Editor toolbar" className="w-full">
            <ul className="flex flex-wrap items-center gap-2 list-disc ps-6 bg-base-200 rounded-2xl p-2">
              {toolbar.map((item, idx) => (
                <li
                  key={idx}
                  className={
                    item.cmd
                      ? `${active[item.id as keyof typeof active] ? "marker:text-primary" : ""}`
                      : "opacity-60 select-none"
                  }
                  style={{ listStyleType: item.cmd ? "disc" : "none" }}
                >
                  {item.cmd ? (
                    <button
                      type="button"
                      onClick={() => runCmd(item.cmd, item.arg)}
                      className={`btn btn-sm ${
                        active[item.id as keyof typeof active] ? "btn-outline border-primary" : "btn-ghost"
                      }`}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <span className="px-2 text-base-content/60">{item.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Tabs */}
          <div className="tabs tabs-boxed w-fit">
            <a className={`tab ${selectedTab === "editor" ? "tab-active" : ""}`} onClick={() => setSelectedTab("editor")}>Editor</a>
            <a className={`tab ${selectedTab === "html" ? "tab-active" : ""}`} onClick={() => setSelectedTab("html")}>HTML</a>
            <a className={`tab ${selectedTab === "tsx" ? "tab-active" : ""}`} onClick={() => setSelectedTab("tsx")}>TSX</a>
          </div>

          {selectedTab === "editor" && (
            <>
              <div
                ref={editorRef}
                onPaste={onPaste}
                contentEditable
                suppressContentEditableWarning
                className="min-h-[300px] rounded-2xl border border-base-300 p-4 prose max-w-none focus:outline-none focus:ring-2 ring-primary"
                onInput={() => setHtml(editorRef.current?.innerHTML || "")}
              />
              <div className="flex gap-2">
                <button className="btn btn-primary" type="button" onClick={generateTsx}>Generate TSX</button>
                <button className="btn" type="button" onClick={() => copy(editorRef.current?.innerHTML || "")}>Copy HTML</button>
              </div>
            </>
          )}

          {selectedTab === "html" && (
            <>
              <pre className="rounded-2xl border border-base-300 p-4 overflow-auto text-sm">
                {html || "<!-- Paste or type in the editor to see HTML -->"}
              </pre>
              <button className="btn" onClick={() => copy(html)}>Copy HTML</button>
            </>
          )}

          {selectedTab === "tsx" && (
            <>
              <pre className="rounded-2xl border border-base-300 p-4 overflow-auto text-sm">
                {tsx || "// Click 'Generate TSX' to see JSX output"}
              </pre>
              <button className="btn btn-primary" onClick={() => copy(tsx)} disabled={!tsx}>Copy TSX</button>
            </>
          )}
        </div>
      </div>

      {/* Help card */}
      <div className="card bg-base-100 shadow-md border border-base-300">
        <div className="card-body">
          <h3 className="card-title text-lg">How it works</h3>
          <ul className="list-disc ps-6 text-sm space-y-1">
            <li><strong>Paste from Word</strong>: Strips MSO markup and normalizes semantic tags.</li>
            <li><strong>UL/LI toolbar</strong>: Buttons are <code>li &gt; button</code>, with an active bullet style.</li>
            <li><strong>TSX conversion</strong>: Converts attributes (class→className), self-closes void tags, camel-cases inline styles, then runs Prettier.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ---------------------- Helpers ----------------------

function cleanWordHtml(raw: string): string {
  if (!raw.trim().startsWith("<")) {
    return textToParagraphs(raw);
  }
  const doc = new DOMParser().parseFromString(raw, "text/html");

  // Remove comments
  const walker = document.createTreeWalker(doc, NodeFilter.SHOW_COMMENT);
  const comments: Comment[] = [] as any;
  // @ts-ignore
  while (walker.nextNode()) comments.push(walker.currentNode);
  comments.forEach((c) => c.remove());

  // Remove style/script and office-specific tags
  doc.querySelectorAll("style, script, xml, o\\:p, w\\:*").forEach((el) => el.remove());

  // Strip MSO classes & inline styles
  doc.querySelectorAll("*").forEach((el) => {
    const cls = (el.getAttribute("class") || "")
      .split(/\s+/)
      .filter((c) => c && !c.toLowerCase().startsWith("mso"))
      .join(" ");
    if (cls) el.setAttribute("class", cls); else el.removeAttribute("class");

    el.removeAttribute("style");

    if (el.tagName === "B") replaceTag(el, "strong");
    if (el.tagName === "I") replaceTag(el, "em");
    if (el.tagName === "U") replaceTag(el, "span");

    if (el.tagName === "SPAN" && !el.getAttributeNames().length && !el.textContent?.trim()) {
      el.remove();
    }
  });

  doc.querySelectorAll("p").forEach((p) => {
    if (p.innerHTML.replace(/&nbsp;|\s+/g, "").length === 0) p.remove();
  });

  const body = doc.body.innerHTML
    .replace(/\s?class=""/g, "")
    .replace(/<!--.*?-->/gs, "")
    .trim();

  return body || "<p></p>";
}

function textToParagraphs(text: string): string {
  const lines = text.split(/\r?\n/).map((l) => l.trim());
  const chunks = lines
    .reduce<string[]>((acc, line) => {
      if (!line) return acc;
      acc.push(`<p>${escapeHtml(line)}</p>`);
      return acc;
    }, []);
  return chunks.join("\n");
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function replaceTag(el: Element, newTag: string) {
  const replacement = el.ownerDocument!.createElement(newTag);
  while (el.firstChild) replacement.appendChild(el.firstChild);
  for (const attr of el.getAttributeNames()) {
    if (attr !== "style") replacement.setAttribute(attr, el.getAttribute(attr) || "");
  }
  el.replaceWith(replacement);
}

function insertHtmlAtCursor(html: string) {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;
  const range = sel.getRangeAt(0);
  range.deleteContents();

  const frag = range.createContextualFragment(html);
  range.insertNode(frag);
  sel.collapseToEnd();
}

function htmlToJsx(rawHtml: string): string {
  const jsxBody = toJsx(rawHtml);
  return `export default function PastedContent(){\n  return (\n    <div className=\"prose max-w-none\">\n${indent(jsxBody, 6)}\n    </div>\n  )\n}`;
}

function toJsx(html: string): string {
  let out = html
    .replace(/\sclass=/g, " className=")
    .replace(/\sfor=/g, " htmlFor=")
    .replace(/\son([a-z]+)=/gi, (m) => ` data-${m.slice(1).toLowerCase()}`)
    .replace(/<br\s*>/gi, "<br />")
    .replace(/<hr\s*>/gi, "<hr />")
    .replace(/<img(\b[^>]*)>/gi, (m, attrs) => `<img${attrs} />`)
    .replace(/<input(\b[^>]*)>(?!\s*<\/input>)/gi, (m, attrs) => `<input${attrs} />`)
    .replace(/contenteditable/gi, "data-contenteditable")
    .replace(/style=\"([^\"]*)\"/gi, (_, s) => `style={${inlineStyleToObject(s)}}`);

  out = out.replace(/=([^\"'\s>]+)/g, '="$1"');
  out = normalizeRoot(out);
  return out;
}

function inlineStyleToObject(s: string) {
  const pairs = s
    .split(";")
    .map((x) => x.trim())
    .filter(Boolean)
    .map((kv) => {
      const [k, v] = kv.split(":").map((x) => x.trim());
      const camel = k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      return `${JSON.stringify(camel)}: ${JSON.stringify(v)}`;
    });
  return `{ ${pairs.join(", ")} }`;
}

function normalizeRoot(html: string) {
  const trimmed = html.trim();
  const startsWithTag = /^</.test(trimmed);
  if (!startsWithTag) return `<p>${trimmed}</p>`;
  return trimmed;
}

function indent(s: string, n: number) {
  const pad = " ".repeat(n);
  return s
    .split("\n")
    .map((line) => (line.length ? pad + line : line))
    .join("\n");
}
