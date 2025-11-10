"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import PageShell from "@/components/Dev-Tools/Layout/PageShell";

/* ============================ Types & Helpers ============================ */

type Item = {
  file: File;
  originalName: string;
  newName: string;
  link?: string;
  objectUrl: string;
  selected: boolean;
};

function slugifyForWeb(name: string) {
  const lastDot = name.lastIndexOf(".");
  const base = lastDot > 0 ? name.slice(0, lastDot) : name;
  const ext = lastDot > 0 ? name.slice(lastDot).toLowerCase() : "";
  const sanitizedBase = base
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return (sanitizedBase || "image") + ext;
}

function makeUnique(names: string[]) {
  const used = new Map<string, number>();
  return names.map((n) => {
    const base = n.replace(/(\.[^.]+)$/i, "");
    const ext = n.match(/(\.[^.]+)$/i)?.[0] || "";
    let c = n;
    let i = used.get(n) ?? 0;
    while (used.has(c)) {
      i += 1;
      c = `${base}-${i}${ext}`;
    }
    used.set(c, 1);
    return c;
  });
}

/** Build one table row for an item. Use objectUrl only when previewing (to avoid 404s). */
function rowHTML(item: Item, opts?: { preview?: boolean }) {
  const src = opts?.preview ? item.objectUrl : item.newName;

  const img = `
    <div class="image-wrapper shuttle-border shadow">
      <img class="responsive" src='${src}' style="width: 794px;">
    </div>`.trim();

  const content = item.link
    ? `<a href="${item.link}" target="_blank" rel="noopener noreferrer">\n${img}\n</a>`
    : img;

  return `
  <tr style="text-align: center;">
    <td style='background-color:rgb(255,255,255);'>
${content}
    </td>
  </tr>`.trim();
}

function wrapHTML(bodyRows: string) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Emailer</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    .responsive{ width: 100%; height: auto;}
    table{ margin: auto;}
    .image-wrapper{ position: relative; display: inline-block; border: 1px solid rgb(226, 226, 226);}
    .image-wrapper.shuttle-border::before{ content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; clip-path: inset(8px); z-index: 1;}
    img{ display: block; margin: auto; position: relative; z-index: 2;}
    table tr td{ padding: 0; background-color: #ffffff !important;}
    body{ margin: 0; background: #fff;}
  </style>
</head>
<body>
  <table>
${bodyRows}
  </table>
</body>
</html>`;
}

/* ============================ Page Component ============================ */

export default function Page() {
  // page shell toggles (kept simple)
  const [leftCollapsed, setLeftCollapsed] = useState(true);
  const [rightOpen, setRightOpen] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(true);

  // emailer state
  const [items, setItems] = useState<Item[]>([]);
  const [dirHandle, setDirHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [chosenDirName, setChosenDirName] = useState<string>("");
  const [pickError, setPickError] = useState<string | null>(null);

  // selection helpers
  const selectedItems = useMemo(() => items.filter((it) => it.selected), [items]);
  const allSelected = items.length > 0 && selectedItems.length === items.length;

  // preview hover
  const [hoverImg, setHoverImg] = useState<string>("");
  const hoverTimerRef = useRef<number | null>(null);

  // HTML editor modal (per-item only)
  const [htmlEditorOpen, setHtmlEditorOpen] = useState(false);
  const [htmlEditorTitle, setHtmlEditorTitle] = useState<string>("");
  const [htmlEditorFilename, setHtmlEditorFilename] = useState<string>("");
  const [htmlEditorValue, setHtmlEditorValue] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportsDirectoryPicker =
    typeof window !== "undefined" && "showDirectoryPicker" in window;

  const defaultFolderHint = "C:\\Users\\designer_jindalsteel\\Downloads\\Emailers";

  /* ----------------------------- Folder & Files ----------------------------- */

  async function chooseFolder() {
    setPickError(null);
    try {
      // @ts-ignore
      const handle: FileSystemDirectoryHandle = await (window as any).showDirectoryPicker({
        mode: "readwrite",
        startIn: "downloads",
      });
      setDirHandle(handle);
      try {
        // @ts-ignore
        setChosenDirName(handle.name || "Selected folder");
      } catch {
        setChosenDirName("Selected folder");
      }

      const files: File[] = [];
      // @ts-ignore
      for await (const entry of handle.values()) {
        if (entry.kind === "file") {
          const f: File = await entry.getFile();
          if (/\.(png|jpe?g|gif|webp)$/i.test(f.name)) files.push(f);
        }
      }
      ingestFiles(files);
    } catch (e: any) {
      if (e?.name !== "AbortError") setPickError(e?.message || "Could not open folder.");
    }
  }

  function handleUseThisFolderClick() {
    chooseFolder();
  }

  function handleFileUpload(ev: React.ChangeEvent<HTMLInputElement>) {
    const list = ev.target.files;
    if (!list) return;
    const files = Array.from(list).filter((f) => /\.(png|jpe?g|gif|webp)$/i.test(f.name));
    ingestFiles(files);
  }

  function ingestFiles(files: File[]) {
    const proposed = files.map((f) => slugifyForWeb(f.name));
    const unique = makeUnique(proposed);
    const prepared: Item[] = files.map((f, i) => ({
      file: f,
      originalName: f.name,
      newName: unique[i],
      objectUrl: URL.createObjectURL(f),
      link: "",
      selected: false,
    }));
    setItems(prepared);
  }

  /* ----------------------------- Save operations ----------------------------- */

  async function writeFile(handle: FileSystemDirectoryHandle, name: string, data: Blob | string) {
    const fileHandle = await handle.getFileHandle(name, { create: true });
    // @ts-ignore
    const writable = await fileHandle.createWritable();
    await writable.write(data);
    await writable.close();
  }

  async function saveRenamedCopiesToFolder(forItems?: Item[]) {
    if (!dirHandle) return;
    const list = forItems && forItems.length ? forItems : items;
    for (const it of list) {
      await writeFile(dirHandle, it.newName, await it.file.arrayBuffer());
    }
    alert(`Saved ${list.length} renamed file(s) to the selected folder.`);
  }

  /* ----------------------------- HTML (per-item only) ----------------------------- */

  function previewHTML(html: string) {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
  }

  // Save HTML for ALL items (no combined)
  async function saveAllItemHTMLFiles() {
    if (!dirHandle) {
      alert("Please choose a folder first.");
      return;
    }
    for (const it of items) {
      const base = it.newName.replace(/(\.[^.]+)$/i, "");
      const filename = `${base}.html`;
      const html = wrapHTML(rowHTML(it)); // file names for disk
      await writeFile(dirHandle, filename, new Blob([html], { type: "text/html;charset=utf-8" }));
    }
    alert("Saved per-image HTML for all items.");
  }

  // Save HTML for SELECTED items
  async function saveSelectedHTMLFiles() {
    if (!dirHandle) {
      alert("Please choose a folder first.");
      return;
    }
    if (!selectedItems.length) {
      alert("Select at least one row.");
      return;
    }
    for (const it of selectedItems) {
      const base = it.newName.replace(/(\.[^.]+)$/i, "");
      const filename = `${base}.html`;
      const html = wrapHTML(rowHTML(it)); // file names for disk
      await writeFile(dirHandle, filename, new Blob([html], { type: "text/html;charset=utf-8" }));
    }
    alert(`Saved ${selectedItems.length} HTML file(s) for selected rows.`);
  }

  // Open per-item HTML for SELECTED rows (preview uses object URLs)
  function openSelectedPerItemHTML() {
    if (!selectedItems.length) {
      alert("Select at least one row.");
      return;
    }
    for (const it of selectedItems) {
      previewHTML(wrapHTML(rowHTML(it, { preview: true })));
    }
  }

  /* ----------------------------- Hover preview ----------------------------- */

  function scheduleShow(url: string) {
    if (hoverTimerRef.current) window.clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = window.setTimeout(() => setHoverImg(url), 120);
  }
  function scheduleHide() {
    if (hoverTimerRef.current) window.clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = window.setTimeout(() => setHoverImg(""), 180);
  }
  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) window.clearTimeout(hoverTimerRef.current);
    };
  }, []);

  /* ----------------------------- Light UI helpers ----------------------------- */

  const lightBtn =
    "btn btn-sm !bg-white !text-slate-800 !border !border-slate-300 hover:!bg-slate-100";
  const lightGhost = "btn btn-ghost btn-xs !text-slate-700";
  const lightInput = "input input-sm input-bordered !bg-white !text-slate-800 !border-slate-300";
  const card = "rounded-md border border-slate-200 bg-white shadow";

  /* --------------------------------- Render --------------------------------- */

  return (
    <PageShell
      tone="app"
      containerClassName="max-w-7xl mx-auto"
      showHeader={false}
      showFooter={false}
      showLeftSidebar={false}
      showRightSidebar={false}
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
      <div id="content" className="grid gap-4">
        <h1 className="card text-1xl bg-slate-50 p-4 shadow m-3 rounded-md">Content</h1>

        <div className={`${card} p-4 m-3`}>
          {/* Top controls */}
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center mb-3">
            <div className="text-sm text-slate-700 flex flex-wrap items-center gap-2">
              <span>Default path hint:</span>
              <code className="bg-slate-100 px-1 py-0.5 rounded">{defaultFolderHint}</code>
              <button className={lightBtn} onClick={chooseFolder}>
                Use this folder
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {supportsDirectoryPicker && (
                <button className={lightBtn} onClick={chooseFolder}>
                  Choose Folder (Chrome/Edge)
                </button>
              )}
              <label className={`${lightBtn} cursor-pointer`}>
                CHOOSE FILES
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".png,.jpg,.jpeg,.gif,.webp"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>

              {/* Bulk actions for SELECTED rows */}
              {dirHandle && (
                <>
                  <button
                    className={lightBtn}
                    onClick={() => saveRenamedCopiesToFolder(selectedItems)}
                    disabled={!selectedItems.length}
                    title="Copy selected images using the new web-safe names"
                  >
                    Save Renamed Copies (Selected)
                  </button>
                  <button
                    className={lightBtn}
                    onClick={saveSelectedHTMLFiles}
                    disabled={!selectedItems.length}
                    title="Generate & save per-image HTML for selected rows"
                  >
                    Save HTML (Selected)
                  </button>
                  <button
                    className={lightBtn}
                    onClick={openSelectedPerItemHTML}
                    disabled={!selectedItems.length}
                    title="Open a preview tab per selected row"
                  >
                    Open HTML (Selected)
                  </button>
                </>
              )}

              {/* Global (all items) */}
              {dirHandle && (
                <>
                  <button
                    className={lightBtn}
                    onClick={() => saveRenamedCopiesToFolder(items)}
                    disabled={!items.length}
                    title="Copy ALL images using their new filenames"
                  >
                    Save Renamed Copies (All Items)
                  </button>
                  <button
                    className={lightBtn}
                    onClick={saveAllItemHTMLFiles}
                    disabled={!items.length}
                    title="Generate & save per-image HTML for ALL items"
                  >
                    Save HTML (All Items)
                  </button>
                </>
              )}
            </div>
          </div>

          {chosenDirName && (
            <div className="text-xs text-slate-600 mb-3">
              Selected: <span className="font-medium">{chosenDirName}</span>
            </div>
          )}
          {pickError && <div className="text-red-600 text-sm mb-2">{pickError}</div>}

          {!items.length ? (
            <div className="text-sm text-slate-600">Pick a folder (preferred) or choose files to begin.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-slate-200 rounded-md">
                <thead className="bg-slate-50">
                  <tr className="text-slate-600">
                    <th className="px-3 py-2 text-left text-xs font-semibold">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm align-middle"
                        checked={allSelected}
                        onChange={(e) =>
                          setItems((arr) => arr.map((it) => ({ ...it, selected: e.target.checked })))
                        }
                        title="Select / deselect all"
                      />
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold">#</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold">Preview</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold">Original File</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold">New Web Name</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold">Click Link (optional)</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold">Check / Edit HTML</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {items.map((it, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-3 py-2 align-top">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm"
                          checked={!!it.selected}
                          onChange={(e) =>
                            setItems((arr) => {
                              const copy = [...arr];
                              copy[idx] = { ...copy[idx], selected: e.target.checked };
                              return copy;
                            })
                          }
                          aria-label={`Select row ${idx + 1}`}
                        />
                      </td>
                      <td className="px-3 py-2 align-top">{idx + 1}</td>
                      <td
                        className="px-3 py-2 align-top"
                        onMouseEnter={() => scheduleShow(it.objectUrl)}
                        onMouseLeave={scheduleHide}
                      >
                        <img src={it.objectUrl} alt="" className="h-16 w-auto rounded border border-slate-200" />
                      </td>
                      <td className="px-3 py-2 align-top">
                        <div className="font-mono text-xs">{it.originalName}</div>
                      </td>
                      <td className="px-3 py-2 align-top">
                        <input
                          className={`${lightInput} w-64 font-mono`}
                          value={it.newName}
                          onChange={(e) =>
                            setItems((arr) => {
                              const copy = [...arr];
                              copy[idx] = { ...copy[idx], newName: slugifyForWeb(e.target.value) };
                              return copy;
                            })
                          }
                          title="sanitized automatically"
                        />
                      </td>
                      <td className="px-3 py-2 align-top">
                        <input
                          className={`${lightInput} w-80`}
                          placeholder="https://example.com (leave blank to disable link)"
                          value={it.link || ""}
                          onChange={(e) =>
                            setItems((arr) => {
                              const copy = [...arr];
                              copy[idx] = { ...copy[idx], link: e.target.value.trim() };
                              return copy;
                            })
                          }
                        />
                      </td>
                      <td className="px-3 py-2 align-top space-x-2">
                        <button
                          className={lightGhost}
                          onClick={() => {
                            const singleHtml = wrapHTML(rowHTML(it, { preview: true }));
                            const w = window.open("", "_blank");
                            if (!w) return;
                            w.document.open();
                            w.document.write(singleHtml);
                            w.document.close();
                          }}
                        >
                          Open
                        </button>
                        <button
                          className={lightGhost}
                          onClick={() => {
                            const base = it.newName.replace(/(\.[^.]+)$/i, "");
                            setHtmlEditorTitle(`Edit ${base}.html`);
                            setHtmlEditorFilename(`${base}.html`);
                            setHtmlEditorValue(wrapHTML(rowHTML(it)));
                            setHtmlEditorOpen(true);
                          }}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ===== Hover preview (anti-flicker) ===== */}
      {hoverImg && (
        <div className="fixed inset-0 z-[60] pointer-events-none">
          <div className="absolute right-6 bottom-6 bg-white/95 border border-slate-300 rounded-lg shadow-lg p-2">
            <img src={hoverImg} alt="" className="max-h-[60vh] max-w-[60vw] rounded" />
          </div>
        </div>
      )}

      {/* ===== HTML editor modal (per-item) ===== */}
      {htmlEditorOpen && (
        <div className="fixed inset-0 z-[70] bg-black/40 flex items-center justify-center">
          <div className="w-[min(1100px,96vw)] max-h-[94vh] bg-white rounded-md shadow-xl border border-slate-200 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-slate-800">{htmlEditorTitle}</h3>
              <div className="space-x-2">
                <button
                  className={lightBtn}
                  onClick={async () => {
                    if (!dirHandle) {
                      alert("Please choose a folder first.");
                      return;
                    }
                    await writeFile(
                      dirHandle,
                      htmlEditorFilename,
                      new Blob([htmlEditorValue], { type: "text/html;charset=utf-8" })
                    );
                    setHtmlEditorOpen(false);
                    alert(`Saved ${htmlEditorFilename}`);
                  }}
                >
                  Save
                </button>
                <button className={lightBtn} onClick={() => setHtmlEditorOpen(false)}>
                  Close
                </button>
              </div>
            </div>
            <textarea
              className="textarea textarea-bordered font-mono text-xs w-full flex-1 min-h-[55vh] md:min-h-[65vh] resize-y !bg-white !text-slate-800 !border-slate-300"
              value={htmlEditorValue}
              onChange={(e) => setHtmlEditorValue(e.target.value)}
            />
            <div className="mt-3 text-right text-xs text-slate-500">
              Saving overwrites <span className="font-mono">{htmlEditorFilename}</span> in the chosen folder.
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
  