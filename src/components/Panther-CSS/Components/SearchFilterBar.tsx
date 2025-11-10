import React, { useMemo, useState } from "react";

export type StatusOption = { value: string; label: string };

export type SearchFilter = {
  query: string;
  status: string;
  from?: string; // "YYYY-MM-DD"
  to?: string;   // "YYYY-MM-DD"
};

type Props = {
  title?: string;                         // default: "Search"
  statusOptions?: StatusOption[];         // default: All
  defaultValue?: Partial<SearchFilter>;   // initial values
  onSearch?: (filters: SearchFilter) => void;
  onReset?: () => void;
  className?: string;
};

const MagnifierIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path
      d="M10.5 18a7.5 7.5 0 1 1 5.3-12.8A7.5 7.5 0 0 1 10.5 18Zm7.7 1.5L16 17.3"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronDown = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const CalendarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <rect x="3" y="4" width="18" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="2"/>
    <path d="M3 10h18M8 2v4M16 2v4" fill="none" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const ResetIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path
      d="M4 7V3m0 0h4M4 3l5 5a7 7 0 1 1-2.05 6.73"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const baseInput =
  "h-11 w-full rounded-lg border border-neutral-300 bg-white px-3 text-sm text-neutral-800 placeholder-neutral-400 shadow-sm outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200";

const labelCls = "mb-1 block text-xs font-semibold tracking-wide text-neutral-300";

const SearchFilterBar: React.FC<Props> = ({
  title = "Search",
  statusOptions,
  defaultValue,
  onSearch,
  onReset,
  className = "",
}) => {
  const options = useMemo<StatusOption[]>(
    () =>
      statusOptions?.length
        ? statusOptions
        : [
            { value: "", label: "All" },
            { value: "pending", label: "Pending" },
            { value: "inprocess", label: "In Process" },
            { value: "completed", label: "Completed" },
          ],
    [statusOptions]
  );

  const [filters, setFilters] = useState<SearchFilter>({
    query: defaultValue?.query ?? "",
    status: defaultValue?.status ?? options[0].value,
    from: defaultValue?.from,
    to: defaultValue?.to,
  });

  const submit = () => onSearch?.(filters);

  const reset = () => {
    const resetVal: SearchFilter = { query: "", status: options[0].value, from: undefined, to: undefined };
    setFilters(resetVal);
    onReset?.();
    onSearch?.(resetVal);
  };

  return (
    <section
      className={[
        "w-full bg-neutral-700 px-4 py-4 sm:px-6",
        className,
      ].join(" ")}
      role="search"
      aria-label={`${title} filters`}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-12 items-end gap-3">
          {/* Title */}
          <div className="col-span-12">
            <span className="text-sm font-semibold uppercase tracking-wide text-neutral-200">
              {title}
            </span>
          </div>

          {/* Search input + button */}
          <div className="col-span-12 md:col-span-6 lg:col-span-6">
            <label className={labelCls} htmlFor="q">
              {/* hidden text label for a11y but keep layout like screenshot */}
              <span className="sr-only">Search by</span>
            </label>
            <div className="flex">
              <input
                id="q"
                className={`${baseInput} rounded-r-none`}
                placeholder="Search by"
                value={filters.query}
                onChange={(e) => setFilters((f) => ({ ...f, query: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && submit()}
              />
              <button
                type="button"
                onClick={submit}
                className="inline-flex items-center justify-center rounded-r-lg bg-orange-500 px-4 text-white shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300"
                aria-label="Search"
                title="Search"
              >
                <MagnifierIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Status */}
          <div className="col-span-6 md:col-span-3 lg:col-span-2">
            <label className={labelCls} htmlFor="status">
              Status
            </label>
            <div className="relative">
              <select
                id="status"
                className={`${baseInput} appearance-none pr-9`}
                value={filters.status}
                onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
              >
                {options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500" />
            </div>
          </div>

          {/* From */}
          <div className="col-span-6 md:col-span-3 lg:col-span-2">
            <label className={labelCls} htmlFor="from">
              From
            </label>
            <div className="relative">
              <input
                id="from"
                type="date"
                className={`${baseInput} pr-10`}
                value={filters.from ?? ""}
                onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))}
              />
              <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500" />
            </div>
          </div>

          {/* To */}
          <div className="col-span-6 md:col-span-3 lg:col-span-2">
            <label className={labelCls} htmlFor="to">
              To
            </label>
            <div className="relative">
              <input
                id="to"
                type="date"
                className={`${baseInput} pr-10`}
                value={filters.to ?? ""}
                onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))}
              />
              <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500" />
            </div>
          </div>

          {/* Reset button */}
          <div className="col-span-6 md:col-span-3 lg:col-span-1">
            <label className="sr-only" htmlFor="reset">
              Reset
            </label>
            <button
              id="reset"
              type="button"
              onClick={reset}
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-orange-500 text-white shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300"
              title="Reset filters"
            >
              <ResetIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchFilterBar;
