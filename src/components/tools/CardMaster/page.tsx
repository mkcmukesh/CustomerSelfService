"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { fadeInUp, hoverLift, tapPress, imgZoom } from "@/lib/motion";

export type CardVariant =
  | "basic"
  | "mediaTop"
  | "mediaSide"
  | "profile"
  | "stats"
  | "product"
  | "list";

export type CardAction = {
  label: string;
  onClick?: () => void;
  href?: string;
  color?: "primary" | "secondary" | "accent" | "neutral" | "ghost" | "info" | "success" | "warning" | "error";
  size?: "sm" | "md" | "lg";
  outline?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  cpy?: boolean; // adds class "cpy" so your copy handler strips it
};

export type CardBadge = { text: string; color?: "primary" | "secondary" | "accent" | "neutral" | "info" | "success" | "warning" | "error" | "outline" };

export interface CardMasterProps {
  variant?: CardVariant;
  className?: string;

  // Common
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  description?: React.ReactNode;
  badges?: CardBadge[];
  actions?: CardAction[];
  footer?: React.ReactNode;

  // Media / avatar
  mediaSrc?: string;
  mediaAlt?: string;
  mediaHeight?: number;
  mediaRatio?: "16/9" | "4/3" | "1/1";
  avatarSrc?: string;
  avatarAlt?: string;

  // Product / price / rating
  price?: string;
  rating?: number;         // 0..5
  ratingCount?: number;

  // Stats
  stats?: Array<{ label: string; value: string; helper?: string; icon?: React.ReactNode }>;

  // List
  items?: Array<{ title: string; meta?: string; right?: React.ReactNode }>;

  // Custom slot
  children?: React.ReactNode;
}

const ratioToClass: Record<NonNullable<CardMasterProps["mediaRatio"]>, string> = {
  "16/9": "aspect-[16/9]",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
};

function ActionsRow({ actions }: { actions?: CardAction[] }) {
  if (!actions?.length) return null;

  return (
    <div className="card-actions justify-end">
      {actions.map((a, i) => {
        const color = a.color ? `btn-${a.color}` : "";
        const size = a.size === "sm" ? "btn-sm" : a.size === "lg" ? "btn-lg" : "";
        const outline = a.outline ? "btn-outline" : "";
        const cpy = a.cpy ? "cpy" : "";
        const cls = ["btn", color, size, outline, cpy].filter(Boolean).join(" ");

        const inner = (
          <>
            {a.leftIcon ? <motion.span whileHover={{ scale: 1.08 }} className="shrink-0">{a.leftIcon}</motion.span> : null}
            {a.label}
            {a.rightIcon ? <motion.span whileHover={{ x: 2 }} className="shrink-0">{a.rightIcon}</motion.span> : null}
          </>
        );

        // motion button/anchor
        const MBtn: any = a.href ? motion.a : motion.button;
        return (
          <MBtn
            key={i}
            className={cls}
            href={a.href}
            onClick={a.onClick}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.12 }}
          >
            {inner}
          </MBtn>
        );
      })}
    </div>
  );
}

function BadgesRow({ badges }: { badges?: CardBadge[] }) {
  if (!badges?.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((b, i) => {
        const color = b.color ? `badge-${b.color}` : "";
        return <div key={i} className={["badge", color].filter(Boolean).join(" ")}>{b.text}</div>;
      })}
    </div>
  );
}

function RatingStars({ rating = 0 }: { rating?: number }) {
  const r = Math.max(0, Math.min(5, rating));
  return (
    <div className="rating rating-sm">
      {[0,1,2,3,4].map(i => (
        <input key={i} type="radio" className="mask mask-star-2 bg-yellow-400" readOnly checked={i < Math.round(r)} />
      ))}
    </div>
  );
}

// Helper to wrap outer card with motion props
function CardShell({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <motion.div
      className={className}
      variants={fadeInUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      whileHover={hoverLift}
      whileTap={tapPress}
    >
      {children}
    </motion.div>
  );
}

export default function CardMaster(props: CardMasterProps) {
  const {
    variant = "basic",
    className,
    title, subtitle, description, badges, actions, footer,
    mediaSrc, mediaAlt, mediaHeight = 180, mediaRatio = "16/9",
    avatarSrc, avatarAlt, price, rating, ratingCount,
    stats, items, children
  } = props;

  const cardCls = ["card bg-base-100 shadow", className].filter(Boolean).join(" ");

  if (variant === "mediaTop") {
    return (
      <CardShell className={cardCls}>
        {mediaSrc && (
          <figure className={["w-full", ratioToClass[mediaRatio], "overflow-hidden"].join(" ")}>
            {/* @ts-ignore */}
            <motion.img
              src={mediaSrc}
              alt={mediaAlt || ""}
              className="w-full h-full object-cover"
              whileHover={imgZoom}
              transition={{ duration: 0.25 }}
            />
          </figure>
        )}
        <div className="card-body">
          {badges && <BadgesRow badges={badges} />}
          {title && <h3 className="card-title">{title}</h3>}
          {subtitle && <p className="text-sm opacity-70">{subtitle}</p>}
          {description && <p>{description}</p>}
          {children}
          <ActionsRow actions={actions} />
          {footer && <div className="pt-2 border-t border-base-300">{footer}</div>}
        </div>
      </CardShell>
    );
  }

  if (variant === "mediaSide") {
    return (
      <CardShell className={["card lg:card-side bg-base-100 shadow", className].join(" ")}>
        {mediaSrc && (
          <figure className="lg:w-1/3 overflow-hidden">
            {/* @ts-ignore */}
            <motion.img
              src={mediaSrc}
              alt={mediaAlt || ""}
              className="h-full w-full object-cover"
              style={{ maxHeight: mediaHeight }}
              whileHover={imgZoom}
            />
          </figure>
        )}
        <div className="card-body">
          {badges && <BadgesRow badges={badges} />}
          {title && <h3 className="card-title">{title}</h3>}
          {subtitle && <p className="text-sm opacity-70">{subtitle}</p>}
          {description && <p>{description}</p>}
          {children}
          <ActionsRow actions={actions} />
          {footer && <div className="pt-2 border-t border-base-300">{footer}</div>}
        </div>
      </CardShell>
    );
  }

  if (variant === "profile") {
    return (
      <CardShell className={cardCls}>
        <div className="card-body">
          <div className="flex items-center gap-3">
            {avatarSrc ? (
              <div className="avatar">
                <div className="w-12 rounded-full">
                  {/* @ts-ignore */}
                  <img src={avatarSrc} alt={avatarAlt || ""} />
                </div>
              </div>
            ) : null}
            <div>
              {title && <h3 className="card-title">{title}</h3>}
              {subtitle && <p className="text-sm opacity-70">{subtitle}</p>}
            </div>
          </div>
          {badges && <BadgesRow badges={badges} />}
          {description && <p className="mt-2">{description}</p>}
          {children}
          <ActionsRow actions={actions} />
          {footer && <div className="pt-2 border-t border-base-300">{footer}</div>}
        </div>
      </CardShell>
    );
  }

  if (variant === "product") {
    return (
      <CardShell className={cardCls}>
        {mediaSrc && (
          <figure className={["w-full", ratioToClass[mediaRatio], "overflow-hidden"].join(" ")}>
            {/* @ts-ignore */}
            <motion.img
              src={mediaSrc}
              alt={mediaAlt || ""}
              className="w-full h-full object-cover"
              whileHover={imgZoom}
            />
          </figure>
        )}
        <div className="card-body">
          <div className="flex items-start justify-between gap-2">
            <div>
              {title && <h3 className="card-title">{title}</h3>}
              {subtitle && <p className="text-sm opacity-70">{subtitle}</p>}
            </div>
            {price && <div className="text-lg font-semibold">{price}</div>}
          </div>
          <div className="flex items-center gap-2">
            {typeof rating === "number" && <RatingStars rating={rating} />}
            {typeof ratingCount === "number" && <span className="text-xs opacity-60">({ratingCount})</span>}
          </div>
          {badges && <BadgesRow badges={badges} />}
          {description && <p>{description}</p>}
          {children}
          <ActionsRow actions={actions} />
        </div>
      </CardShell>
    );
  }

  if (variant === "stats") {
    return (
      <CardShell className={cardCls}>
        <div className="card-body">
          {title && <h3 className="card-title">{title}</h3>}
          {subtitle && <p className="text-sm opacity-70">{subtitle}</p>}
          {!!stats?.length && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((s, i) => (
                <div key={i} className="rounded-box bg-base-200 p-3">
                  <div className="flex items-center gap-2">
                    {s.icon ? <span className="text-base-content/70 shrink-0">{s.icon}</span> : null}
                    <div className="text-xs opacity-70">{s.label}</div>
                  </div>
                  <div className="text-xl font-semibold">{s.value}</div>
                  {s.helper && <div className="text-xs opacity-70">{s.helper}</div>}
                </div>
              ))}
            </div>
          )}
          {children}
          <ActionsRow actions={actions} />
          {footer && <div className="pt-2 border-t border-base-300">{footer}</div>}
        </div>
      </CardShell>
    );
  }

  if (variant === "list") {
    return (
      <CardShell className={cardCls}>
        <div className="card-body">
          {title && <h3 className="card-title">{title}</h3>}
          {subtitle && <p className="text-sm opacity-70">{subtitle}</p>}
          {!!items?.length && (
            <ul className="divide-y divide-base-300">
              {items.map((it, i) => (
                <li key={i} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{it.title}</div>
                    {it.meta && <div className="text-xs opacity-60">{it.meta}</div>}
                  </div>
                  {it.right}
                </li>
              ))}
            </ul>
          )}
          {children}
          <ActionsRow actions={actions} />
        </div>
      </CardShell>
    );
  }

  // default: basic
  return (
    <CardShell className={cardCls}>
      <div className="card-body">
        {badges && <BadgesRow badges={badges} />}
        {title && <h3 className="card-title">{title}</h3>}
        {subtitle && <p className="text-sm opacity-70">{subtitle}</p>}
        {description && <p>{description}</p>}
        {children}
        <ActionsRow actions={actions} />
        {footer && <div className="pt-2 border-t border-base-300">{footer}</div>}
      </div>
    </CardShell>
  );
}
