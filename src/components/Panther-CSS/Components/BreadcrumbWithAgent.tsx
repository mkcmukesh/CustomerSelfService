import React from "react";

type BreadcrumbItem = {
  label: string;
  href?: string;
  onClick?: () => void;
  ariaLabel?: string;
};

type AgentBadgeProps = {
  name: string;
  phone?: string; // digits only or formatted; will render a tel: link if present
  role?: string;  // defaults to "Agent"
  className?: string;
};

type BreadcrumbWithAgentProps = {
  items: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
  agent: AgentBadgeProps;
};

/** Small Home icon (outline) */
const HomeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 11.5 12 4l9 7.5" />
    <path d="M5 10.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9.5" />
  </svg>
);

/** Tiny user icon for agent badge */
const UserBadgeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-5 0-9 2.5-9 5.5A1.5 1.5 0 0 0 4.5 21h15A1.5 1.5 0 0 0 21 19.5C21 16.5 17 14 12 14Z" />
  </svg>
);

const Separator: React.FC = () => (
  <span aria-hidden="true" className="mx-2 text-neutral-500">›</span>
);

/** Right-side agent pill */
export const AgentBadge: React.FC<AgentBadgeProps> = ({
  name,
  phone,
  role = "Agent",
  className = "",
}) => {
  // Basic phone normalization for tel: (keeps + and digits)
  const tel = phone?.replace(/[^+\d]/g, "");

  return (
    <div
      className={
        "inline-flex items-center gap-3 rounded-full bg-white px-3 py-2 shadow-sm ring-1 ring-black/5 " +
        className
      }
      role="group"
      aria-label={`${role}: ${name}${phone ? ` (${phone})` : ""}`}
    >
      <div className="flex flex-col items-center justify-center">
        <UserBadgeIcon className="h-5 w-5 text-neutral-900" />
        <span className="mt-0.5 text-[10px] leading-none text-neutral-500">{role}</span>
      </div>

      <div className="h-8 w-px self-stretch bg-neutral-200" />

      <div className="flex flex-col leading-tight">
        <span className="text-sm font-medium text-neutral-800">{name}</span>
        {phone ? (
          <a
            href={`tel:${tel}`}
            className="text-xs text-neutral-600 hover:text-neutral-800"
          >
            (Mob: {phone})
          </a>
        ) : null}
      </div>
    </div>
  );
};

/** Left-side breadcrumb */
export const Breadcrumb: React.FC<{
  items: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}> = ({ items, showHome = true, className = "" }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={
        "max-w-full overflow-x-auto whitespace-nowrap [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden " +
        className
      }
    >
      <ol className="flex items-center text-sm text-neutral-300">
        {showHome && (
          <>
            <li className="flex items-center">
              <HomeIcon className="mr-2 h-4 w-4 text-orange-400" />
              <span className="sr-only">Home</span>
            </li>
            {items.length > 0 && <Separator />}
          </>
        )}

        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          const content = item.href || item.onClick ? (
            <a
              href={item.href}
              onClick={item.onClick}
              aria-label={item.ariaLabel ?? item.label}
              className={
                "transition-colors hover:text-white " +
                (isLast ? "text-neutral-100" : "text-neutral-300")
              }
            >
              {item.label}
            </a>
          ) : (
            <span
              aria-current={isLast ? "page" : undefined}
              className={isLast ? "text-neutral-100" : "text-neutral-300"}
            >
              {item.label}
            </span>
          );

          return (
            <li key={`${item.label}-${idx}`} className="flex items-center">
              {content}
              {!isLast && <Separator />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

/** Full component composing Breadcrumb + AgentBadge (matches your screenshot) */
const BreadcrumbWithAgent: React.FC<BreadcrumbWithAgentProps> = ({
  items,
  showHome = true,
  agent,
  className = "",
}) => {
  return (
    <div
      className={
        "flex w-full items-center justify-between gap-4 bg-black px-2 py-1 sm:px-4 sm:py-2 " +
        className
      }
    >
      <Breadcrumb items={items} showHome={showHome} />
      <AgentBadge {...agent} />
    </div>
  );
};

export default BreadcrumbWithAgent;
