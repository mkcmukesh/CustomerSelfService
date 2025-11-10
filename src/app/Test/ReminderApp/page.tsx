"use client";

import React, {
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  ReactNode,
} from "react";

import PageShell from "@/components/layouts/PageShell";
import HamburgerMenu from "@/nav/HamburgerMenu";

/** ---------- Types ---------- */
export type Priority = "low" | "medium" | "high";
export type Status = "todo" | "in_progress" | "done";

export type Task = {
  id: string;
  title: string;
  notes?: string;
  status: Status;
  priority: Priority;
  dueAt?: string; // ISO
  remindAt?: string; // ISO
  tags: string[];
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

type Template = {
  title: string;
  priority: Priority;
  tags: string[];
  status?: Status;
  dueInHours?: number; // quick due offset
  remindInMinutes?: number; // quick remind offset
  icon?: ReactNode;
};
type TemplateCategory = {
  name: string;
  templates: Template[];
};

/** ---------- Utilities ---------- */
const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
const nowIso = () => new Date().toISOString();
const plusMinutes = (min: number) => new Date(Date.now() + min * 60_000);
const plusHours = (h: number) => new Date(Date.now() + h * 3_600_000);

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem("tmgr_v1");
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Task[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveTasks(tasks: Task[]) {
  localStorage.setItem("tmgr_v1", JSON.stringify(tasks));
}

/** ---------- Reducer ---------- */
type Action =
  | { type: "add"; task: Task }
  | { type: "update"; id: string; patch: Partial<Task> }
  | { type: "remove"; id: string }
  | { type: "bulk_set"; tasks: Task[] };

function reducer(state: Task[], action: Action): Task[] {
  switch (action.type) {
    case "bulk_set":
      return action.tasks.slice();
    case "add":
      return [action.task, ...state];
    case "update":
      return state.map((t) =>
        t.id === action.id ? { ...t, ...action.patch, updatedAt: nowIso() } : t
      );
    case "remove":
      return state.filter((t) => t.id !== action.id);
    default:
      return state;
  }
}

/** ---------- Add/Edit Modal ---------- */
type ModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (
    task: Omit<Task, "id" | "createdAt" | "updatedAt">,
    existingId?: string
  ) => void;
  existing?: Task | null;
  /** optional prefill for creating */
  prefill?: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">> | null;
};

const AddEditTaskModal: React.FC<ModalProps> = ({
  open,
  onClose,
  onSave,
  existing,
  prefill,
}) => {
  const [title, setTitle] = useState(existing?.title ?? prefill?.title ?? "");
  const [notes, setNotes] = useState(existing?.notes ?? prefill?.notes ?? "");
  const [priority, setPriority] = useState<Priority>(
    existing?.priority ?? (prefill?.priority as Priority) ?? "medium"
  );
  const [status, setStatus] = useState<Status>(
    existing?.status ?? (prefill?.status as Status) ?? "todo"
  );
  const [dueAt, setDueAt] = useState<string>(
    existing?.dueAt
      ? existing!.dueAt.slice(0, 16)
      : prefill?.dueAt
      ? prefill.dueAt.slice(0, 16)
      : ""
  );
  const [remindAt, setRemindAt] = useState<string>(
    existing?.remindAt
      ? existing!.remindAt.slice(0, 16)
      : prefill?.remindAt
      ? prefill.remindAt.slice(0, 16)
      : ""
  );
  const [tags, setTags] = useState<string>(
    existing?.tags.join(", ") ?? prefill?.tags?.join(", ") ?? ""
  );

  useEffect(() => {
    if (open) {
      setTitle(existing?.title ?? prefill?.title ?? "");
      setNotes(existing?.notes ?? prefill?.notes ?? "");
      setPriority(
        existing?.priority ?? (prefill?.priority as Priority) ?? "medium"
      );
      setStatus(existing?.status ?? (prefill?.status as Status) ?? "todo");
      setDueAt(
        existing?.dueAt
          ? existing!.dueAt.slice(0, 16)
          : prefill?.dueAt
          ? prefill.dueAt.slice(0, 16)
          : ""
      );
      setRemindAt(
        existing?.remindAt
          ? existing!.remindAt.slice(0, 16)
          : prefill?.remindAt
          ? prefill.remindAt.slice(0, 16)
          : ""
      );
      setTags(existing?.tags.join(", ") ?? prefill?.tags?.join(", ") ?? "");
    }
  }, [open, existing, prefill]);

  const canSave = title.trim().length > 0;

  function handleSave() {
    if (!canSave) return;
    const payload: Omit<Task, "id" | "createdAt" | "updatedAt"> = {
      title: title.trim(),
      notes: notes.trim() || undefined,
      status,
      priority,
      dueAt: dueAt ? new Date(dueAt).toISOString() : undefined,
      remindAt: remindAt ? new Date(remindAt).toISOString() : undefined,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      createdAt: nowIso(), // ignored when editing
      updatedAt: nowIso(),
    } as any;
    onSave(payload, existing?.id);
  }

  return (
    <dialog className={`modal ${open ? "modal-open" : ""}`}>
      <div className="bg-slate-100 modal-box max-w-2xl">
        <h3 className="font-bold text-lg">
          {existing ? "Edit Task" : "Add Task"}
        </h3>
        <div className="mt-4 grid gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input input-bordered"
              placeholder="e.g., Call supplier about PO"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Notes</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="textarea textarea-bordered"
              rows={3}
              placeholder="Details, links, phone numbers..."
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Priority</span>
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="select select-bordered"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Status</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className="select select-bordered"
              >
                <option value="todo">To do</option>
                <option value="in_progress">In progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Due date</span>
              </label>
              <input
                type="datetime-local"
                value={dueAt}
                onChange={(e) => setDueAt(e.target.value)}
                className="input input-bordered"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Remind at</span>
              </label>
              <input
                type="datetime-local"
                value={remindAt}
                onChange={(e) => setRemindAt(e.target.value)}
                className="input input-bordered"
              />
            </div>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Tags</span>
              <span className="label-text-alt">comma separated</span>
            </label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="input input-bordered"
              placeholder="work, home, urgent"
            />
          </div>
        </div>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={!canSave}
          >
            {existing ? "Save changes" : "Add task"}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop" onSubmit={onClose}>
        <button>close</button>
      </form>
    </dialog>
  );
};

/** ---------- Toasts ---------- */
type Toast = {
  id: string;
  kind: "success" | "info" | "warning" | "error";
  text: string;
};

const Toasts: React.FC<{ list: Toast[]; onDismiss: (id: string) => void }> = ({
  list,
  onDismiss,
}) => (
  <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 space-y-2 w-[min(95vw,680px)]">
    {list.map((t) => (
      <div
        key={t.id}
        className={`alert shadow ${
          t.kind === "success"
            ? "alert-success"
            : t.kind === "warning"
            ? "alert-warning"
            : t.kind === "error"
            ? "alert-error"
            : "alert-info"
        }`}
      >
        <span>{t.text}</span>
        <button className="btn btn-sm" onClick={() => onDismiss(t.id)}>
          Dismiss
        </button>
      </div>
    ))}
  </div>
);

/** ---------- Filters ---------- */
type Filters = {
  q: string;
  status: "all" | Status;
  tag: string;
  sort: "created" | "due" | "priority";
};

function applyFilters(tasks: Task[], f: Filters): Task[] {
  let out = tasks.slice();
  if (f.q.trim()) {
    const q = f.q.toLowerCase();
    out = out.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.notes || "").toLowerCase().includes(q)
    );
  }
  if (f.status !== "all") out = out.filter((t) => t.status === f.status);
  if (f.tag.trim()) {
    const tag = f.tag.toLowerCase();
    out = out.filter((t) => t.tags.some((tt) => tt.toLowerCase() === tag));
  }
  out.sort((a, b) => {
    switch (f.sort) {
      case "due":
        return (
          (a.dueAt ? Date.parse(a.dueAt) : Infinity) -
          (b.dueAt ? Date.parse(b.dueAt) : Infinity)
        );
      case "priority": {
        const rank = { high: 0, medium: 1, low: 2 } as const;
        return rank[a.priority] - rank[b.priority];
      }
      default:
        return Date.parse(b.createdAt) - Date.parse(a.createdAt);
    }
  });
  return out;
}

/** ---------- Quick Templates ---------- */
const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  {
    name: "Work",
    templates: [
      { title: "Daily standup notes", priority: "low", tags: ["work", "standup"], remindInMinutes: 10 },
      { title: "Review PRs", priority: "medium", tags: ["work", "code"], dueInHours: 4 },
      { title: "Prepare meeting agenda", priority: "high", tags: ["work", "meeting"], dueInHours: 24, remindInMinutes: 60 },
    ],
  },
  {
    name: "Follow-up",
    templates: [
      { title: "Call back vendor", priority: "medium", tags: ["followup", "vendor"], remindInMinutes: 30 },
      { title: "Email client update", priority: "medium", tags: ["client", "email"], dueInHours: 6 },
      { title: "Payment confirmation", priority: "high", tags: ["finance"], dueInHours: 12 },
    ],
  },
  {
    name: "Personal",
    templates: [
      { title: "Workout", priority: "low", tags: ["health"], remindInMinutes: 15 },
      { title: "Pay utility bill", priority: "high", tags: ["home", "finance"], dueInHours: 48 },
      { title: "Medicine refill", priority: "medium", tags: ["health"], dueInHours: 72 },
    ],
  },
  {
    name: "Study",
    templates: [
      { title: "Read 20 pages", priority: "low", tags: ["study"], remindInMinutes: 120 },
      { title: "Practice React hooks", priority: "medium", tags: ["study", "react"], dueInHours: 24 },
      { title: "Revise TypeScript types", priority: "medium", tags: ["study", "ts"], dueInHours: 24 },
    ],
  },
];

/** ---------- Page ---------- */
export default function CenteredTemplatePage(): JSX.Element {
  const [tasks, dispatch] = useReducer(
    reducer,
    [],
    () => (typeof window === "undefined" ? [] : loadTasks())
  );
  const [filters, setFilters] = useState<Filters>({
    q: "",
    status: "all",
    tag: "",
    sort: "created",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [prefill, setPrefill] =
    useState<Partial<Omit<Task, "id" | "createdAt" | "updatedAt">> | null>(
      null
    );
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [activeCat, setActiveCat] = useState(0);

  // Persist
  useEffect(() => saveTasks(tasks), [tasks]);

  // Reminder checker
  const lastCheckRef = useRef<number>(Date.now());
  useEffect(() => {
    const iv = setInterval(() => {
      const now = Date.now();
      tasks.forEach((t) => {
        if (!t.remindAt) return;
        const ts = Date.parse(t.remindAt);
        if (ts >= lastCheckRef.current && ts <= now) {
          pushToast("info", `Reminder: ${t.title}`);
        }
      });
      lastCheckRef.current = now;
    }, 60000);
    return () => clearInterval(iv);
  }, [tasks]);

  function pushToast(kind: Toast["kind"], text: string) {
    const id = uid();
    setToasts((prev) => [...prev, { id, kind, text }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
  }

  const filtered = useMemo(() => applyFilters(tasks, filters), [tasks, filters]);

  function handleSave(
    newData: Omit<Task, "id" | "createdAt" | "updatedAt">,
    existingId?: string
  ) {
    if (existingId) {
      dispatch({ type: "update", id: existingId, patch: { ...newData } });
      pushToast("success", "Task updated");
    } else {
      dispatch({
        type: "add",
        task: { ...newData, id: uid(), createdAt: nowIso(), updatedAt: nowIso() },
      });
      pushToast("success", "Task added");
    }
    setModalOpen(false);
    setEditing(null);
    setPrefill(null);
  }

  function quickAdd(tpl: Template) {
    const data: Omit<Task, "id" | "createdAt" | "updatedAt"> = {
      title: tpl.title,
      notes: undefined,
      status: tpl.status ?? "todo",
      priority: tpl.priority,
      dueAt: tpl.dueInHours ? plusHours(tpl.dueInHours).toISOString() : undefined,
      remindAt: tpl.remindInMinutes
        ? plusMinutes(tpl.remindInMinutes).toISOString()
        : undefined,
      tags: tpl.tags,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    } as any;
    handleSave(data);
  }

  function openPrefilled(tpl: Template) {
    setEditing(null);
    setPrefill({
      title: tpl.title,
      priority: tpl.priority,
      status: tpl.status ?? "todo",
      tags: tpl.tags,
      dueAt: tpl.dueInHours ? plusHours(tpl.dueInHours).toISOString() : undefined,
      remindAt: tpl.remindInMinutes
        ? plusMinutes(tpl.remindInMinutes).toISOString()
        : undefined,
    });
    setModalOpen(true);
  }

  function toggleDone(t: Task) {
    dispatch({
      type: "update",
      id: t.id,
      patch: { status: t.status === "done" ? "todo" : "done" },
    });
  }

  function quickEdit(t: Task, patch: Partial<Task>) {
    dispatch({ type: "update", id: t.id, patch });
  }

  function remove(id: string) {
    dispatch({ type: "remove", id });
    pushToast("warning", "Task deleted");
  }

  // Hydration-safe initial load
  useEffect(() => {
    if (tasks.length === 0) {
      const seed = loadTasks();
      if (seed.length) dispatch({ type: "bulk_set", tasks: seed });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Derived stats
  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === "done").length;
    const overdue = tasks.filter(
      (t) => t.dueAt && Date.parse(t.dueAt) < Date.now() && t.status !== "done"
    ).length;
    return { total, done, overdue };
  }, [tasks]);

  return (
    <PageShell layout="contentFullHeightCenter">
      {/* Left rail / header area from your template */}
      <div className="border border-red-500">
        {/* <HamburgerMenu /> */}
      </div>

      {/* Centered content */}
      <div className="space-y-6 w-[min(1200px,95vw)]">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900">
            Tasks & Reminders
          </h1>
          <p className="text-lg text-slate-700">
            Quick templates at the top. Add, sort, and track—fast.
          </p>
        </div>

        {/* Quick Add Templates */}
        <div className="card bg-slate-100  border border-base-200">
          <div className="card-body gap-4">
            <div role="tablist" className="tabs tabs-boxed">
              {TEMPLATE_CATEGORIES.map((c, i) => (
                <a
                  key={c.name}
                  role="tab"
                  className={`tab ${i === activeCat ? "tab-active" : ""}`}
                  onClick={() => setActiveCat(i)}
                >
                  {c.name}
                </a>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {TEMPLATE_CATEGORIES[activeCat].templates.map((tpl, idx) => (
                <div key={`${TEMPLATE_CATEGORIES[activeCat].name}-${idx}`} className="join">
                  <button
                    className={`btn join-item ${tpl.priority === "high"
                        ? "btn-error"
                        : tpl.priority === "medium"
                        ? "btn-warning"
                        : "btn-ghost"
                      }`}
                    onClick={() => quickAdd(tpl)}
                    title="Quick add"
                  >
                    {tpl.title}
                  </button>
                  <button
                    className="btn join-item btn-outline"
                    onClick={() => openPrefilled(tpl)}
                    title="Customize before adding"
                  >
                    ✎
                  </button>
                </div>
              ))}
            </div>

            <div className="text-xs opacity-70">
              Tip: Click a colored button to add immediately, or click ✎ to
              customize details first.
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Total</div>
            <div className="stat-value">{stats.total}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Completed</div>
            <div className="stat-value">{stats.done}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Overdue</div>
            <div className={`stat-value ${stats.overdue ? "text-error" : ""}`}>
              {stats.overdue}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-100 card border border-base-200">
          <div className="card-body grid md:grid-cols-5 gap-3 items-end">
            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text">Search</span>
              </label>
              <input
                value={filters.q}
                onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
                className="input input-bordered"
                placeholder="Find tasks..."
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Status</span>
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, status: e.target.value as any }))
                }
                className="select select-bordered"
              >
                <option value="all">All</option>
                <option value="todo">To do</option>
                <option value="in_progress">In progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Tag</span>
              </label>
              <input
                value={filters.tag}
                onChange={(e) => setFilters((f) => ({ ...f, tag: e.target.value }))}
                className="input input-bordered"
                placeholder="e.g., work"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Sort by</span>
              </label>
              <select
                value={filters.sort}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, sort: e.target.value as any }))
                }
                className="select select-bordered"
              >
                <option value="created">Created</option>
                <option value="due">Due date</option>
                <option value="priority">Priority</option>
              </select>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="grid gap-3">
          {filtered.length === 0 && (
            <div className="alert">
              <span>
                No tasks yet. Use the templates above or click{" "}
                <b>Customize</b> (✎) to create your first one.
              </span>
            </div>
          )}
          {filtered.map((t) => (
            <div key={t.id} className="bg-yellow-800 bg-[#f6f6e4] card border border-base-200 hover:shadow">
              <div className="card-body grid md:grid-cols-[auto_1fr_auto] items-start gap-4">
                <div className="pt-2">
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={t.status === "done"}
                    onChange={() => toggleDone(t)}
                  />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3
                      className={`card-title ${
                        t.status === "done" ? "line-through opacity-60" : ""
                      }`}
                    >
                      {t.title}
                    </h3>
                    <span
                      className={`badge ${
                        t.priority === "high"
                          ? "badge-error"
                          : t.priority === "medium"
                          ? "badge-warning"
                          : "badge-ghost"
                      }`}
                    >
                      {t.priority}
                    </span>
                    {t.tags.map((tag) => (
                      <span key={tag} className="badge badge-ghost">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {t.notes && (
                    <p className="text-sm opacity-80 mt-1 whitespace-pre-wrap">
                      {t.notes}
                    </p>
                  )}
                  <div className="mt-2 text-xs opacity-70 flex flex-wrap gap-3">
                    {t.dueAt && <span>Due: {new Date(t.dueAt).toLocaleString()}</span>}
                    {t.remindAt && (
                      <span>Remind: {new Date(t.remindAt).toLocaleString()}</span>
                    )}
                    <span>Created: {new Date(t.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      setEditing(t);
                      setModalOpen(true);
                      setPrefill(null);
                    }}
                  >
                    Edit
                  </button>
                  <div className="dropdown dropdown-end">
                    <button tabIndex={0} className="btn btn-ghost btn-sm">
                      Quick
                    </button>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu bg-base-100 rounded-box z-[1] w-44 p-2 shadow"
                    >
                      <li>
                        <button onClick={() => quickEdit(t, { status: "todo" })}>
                          Mark To do
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => quickEdit(t, { status: "in_progress" })}
                        >
                          Mark In progress
                        </button>
                      </li>
                      <li>
                        <button onClick={() => quickEdit(t, { status: "done" })}>
                          Mark Done
                        </button>
                      </li>
                      <li>
                        <button onClick={() => quickEdit(t, { priority: "high" })}>
                          Priority High
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => quickEdit(t, { priority: "medium" })}
                        >
                          Priority Medium
                        </button>
                      </li>
                      <li>
                        <button onClick={() => quickEdit(t, { priority: "low" })}>
                          Priority Low
                        </button>
                      </li>
                    </ul>
                  </div>
                  <button className="btn btn-error btn-sm" onClick={() => remove(t.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditing(null);
              setPrefill(null);
              setModalOpen(true);
            }}
          >
            Add custom task
          </button>
        </div>
      </div>

      <AddEditTaskModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
          setPrefill(null);
        }}
        onSave={handleSave}
        existing={editing}
        prefill={prefill}
      />

      <Toasts
        list={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />
    </PageShell>
  );
}
