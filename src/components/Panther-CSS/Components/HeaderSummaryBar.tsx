import React from "react";

export type Metric = {
  label: string;
  value: number | string;
  hint?: string; // optional small helper text
};

type HeaderSummaryBarProps = {
  title: string;
  subtitle?: string;
  metrics?: Metric[]; // right-side tiles
  className?: string; // extra classes for the outer wrapper
  bleed?: boolean;    // allow edge-to-edge (removes default x-padding)
};

const HeaderSummaryBar: React.FC<HeaderSummaryBarProps> = ({
  title,
  subtitle,
  metrics = [],
  className = "",
  bleed = false,
}) => {
  return (
    <section
      className={[
        "relative w-full",
        "bg-neutral-100",               // light gray like the screenshot
        bleed ? "" : "px-4 sm:px-6",    // container padding unless bleeding
        "py-5 px-5 sm:py-6",                 // vertical space
        className,
      ].join(" ")}
    >
      {/* subtle decorative background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-40"
        // You can swap this gradient with an image if you like
        style={{
          background:
            "radial-gradient(1200px 300px at 75% 0%, rgba(0,0,0,0.06), transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-7xl">
        <div className="flex items-start justify-between gap-6">
          {/* Left: title + subtitle */}
          <div className="min-w-0">
            <h1 className="text-3xl font-semibold leading-tight text-neutral-700">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-1 text-base text-neutral-500">
                {subtitle}
              </p>
            ) : null}
          </div>

          {/* Right: metric tiles */}
          {metrics?.length ? (
            <div className="flex shrink-0 items-stretch gap-4">
              {metrics.map((m, i) => (
                <div
                  key={`${m.label}-${i}`}
                  className="flex w-[164px] flex-col justify-center rounded-xl border border-neutral-300 bg-white px-4 py-3 shadow-sm"
                >
                  <span className="text-xs font-semibold tracking-wide text-neutral-500">
                    {m.label.toUpperCase()}
                  </span>
                  <span className="mt-1 text-4xl font-medium leading-none text-orange-500">
                    {m.value}
                  </span>
                  {m.hint ? (
                    <span className="mt-1 text-[11px] text-neutral-400">
                      {m.hint}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default HeaderSummaryBar;
