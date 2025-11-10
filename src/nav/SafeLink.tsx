"use client";

import Link from "next/link";
import * as React from "react";
import { isSafeHref } from "./helpers";

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  external?: boolean;
  className?: string;
  children: React.ReactNode;
  onHoverPreview?: (href: string) => void;
  onHoverCancel?: () => void;
};

export default function SafeLink({
  href,
  external,
  className,
  children,
  onHoverPreview,
  onHoverCancel,
  ...rest
}: Props) {
  if (!isSafeHref(href)) {
    return <span className={className} aria-disabled>{children}</span>;
  }

  if (!external && href.startsWith("/")) {
    return (
      <Link
        href={href}
        className={className}
        onMouseEnter={onHoverPreview ? () => onHoverPreview(href) : undefined}
        onMouseLeave={onHoverCancel}
        {...rest}
      >
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={onHoverPreview ? () => onHoverPreview(href) : undefined}
      onMouseLeave={onHoverCancel}
      {...rest}
    >
      {children}
    </a>
  );
}
