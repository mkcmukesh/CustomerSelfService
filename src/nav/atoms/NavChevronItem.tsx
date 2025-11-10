import SafeLink from "@/nav/SafeLink";
import { useIsActive } from "@/nav/helpers";

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 opacity-70">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}

type Props = {
  href: string;
  label: string;
  external?: boolean;
  onHoverPreview?: (href: string) => void;
  onHoverCancel?: () => void;
};

export default function NavChevronItem({ href, label, external, onHoverPreview, onHoverCancel }: Props) {
  const isActive = useIsActive();
  const cls = [
    "flex items-center justify-between px-2 py-2 rounded",
    isActive(href) ? "bg-base-300/60 text-base-content" : "hover:bg-base-200/80",
  ].join(" ");

  return (
    <SafeLink
      href={href}
      external={external}
      className={cls}
      onHoverPreview={onHoverPreview}
      onHoverCancel={onHoverCancel}
    >
      <span>{label}</span>
      <Chevron />
    </SafeLink>
  );
}
