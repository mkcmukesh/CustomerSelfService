"use client";

import React, { useEffect } from "react";

export type CardProps = {
  name?: string;
  role?: string;
  avatarId?: number;
  leftId?: number;
  rightTopId?: number;
  rightBottomId?: number;
  eyebrow?: string;
  title?: string;
  body?: string;
};

const IconChevronRight: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
       fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round"
       className={className} aria-hidden="true">
    <path d="M9 18l6-6-6-6"/>
  </svg>
);

const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "outline" | "solid"; label: string }
> = ({ variant = "outline", label, className = "", ...props }) => {
  const base = "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-transform active:scale-[0.98] focus:outline-none focus:ring-4";
  const styles = variant === "outline"
    ? "border border-neutral-300 hover:border-neutral-400 bg-white hover:bg-neutral-50 text-neutral-900 focus:ring-neutral-200"
    : "bg-neutral-900 text-white hover:bg-black focus:ring-neutral-300";
  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {label}
    </button>
  );
};

const Avatar: React.FC<{ src: string; alt: string }> = ({ src, alt }) => (
  <img src={src} alt={alt} loading="lazy" className="h-14 w-14 rounded-full object-cover ring-2 ring-white shadow-sm" />
);

const PhotoMosaic: React.FC<{ leftId: number; rightTopId: number; rightBottomId: number }> = ({
  leftId, rightTopId, rightBottomId
}) => (
  <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden">
    <img src={`https://picsum.photos/id/${leftId}/800/900`} alt="Art image" loading="lazy" className="col-span-1 row-span-2 h-full w-full object-cover" />
    <img src={`https://picsum.photos/id/${rightTopId}/800/450`} alt="Art image" loading="lazy" className="h-full w-full object-cover" />
    <img src={`https://picsum.photos/id/${rightBottomId}/800/450`} alt="Art image" loading="lazy" className="h-full w-full object-cover" />
  </div>
);

const SectionHeader: React.FC<{ eyebrow: string; title: string; body: string }> = ({ eyebrow, title, body }) => (
  <div className="space-y-2">
    <p className="text-neutral-400 text-lg">{eyebrow}</p>
    <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900">{title}</h2>
    <p className="text-neutral-600 text-base leading-relaxed max-w-prose">{body}</p>
  </div>
);

const Card1: React.FC<CardProps> = ({
  name = "Jerome Bell",
  role = "Photographer",
  avatarId = 1005,
  leftId = 1060,
  rightTopId = 1069,
  rightBottomId = 1070,
  eyebrow = "Photographs",
  title = "Lorem ipsun",
  body = "Minim dolor in amet nulla laboris enim dolore consequatt...",
}) => {
  // Load Inter + Poppins on the client
  useEffect(() => {
    const link1 = document.createElement("link");
    link1.rel = "preconnect";
    link1.href = "https://fonts.googleapis.com";
    const link2 = document.createElement("link");
    link2.rel = "preconnect";
    link2.href = "https://fonts.gstatic.com";
    link2.crossOrigin = "anonymous";
    const link3 = document.createElement("link");
    link3.rel = "stylesheet";
    link3.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap";
    document.head.append(link1, link2, link3);
    return () => { link1.remove(); link2.remove(); link3.remove(); };
  }, []);

  return (
    <div
      className="w-full bg-white rounded-3xl shadow-lg ring-1 ring-black/5 overflow-hidden"
      style={{ fontFamily: '"Inter","Poppins",ui-sans-serif,system-ui,-apple-system' }}
    >
      <div className="grid grid-cols-[auto,1fr,auto] items-center gap-4 p-4 md:p-6">
        <Avatar src={`https://picsum.photos/id/${avatarId}/200/200`} alt={name} />
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-semibold text-neutral-900 leading-tight">{name}</h1>
          <p className="text-neutral-500 text-base md:text-lg">{role}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button label="PROFILE" onClick={() => alert(`${name} — Profile clicked`)} className="tracking-wide" />
        </div>
      </div>

      <div className="px-4 md:px-6">
        <PhotoMosaic leftId={leftId!} rightTopId={rightTopId!} rightBottomId={rightBottomId!} />
      </div>

      <div className="p-4 md:p-6">
        <SectionHeader eyebrow={eyebrow!} title={title!} body={body!} />
        <div className="mt-4">
          <Button variant="solid" label="View Gallery" onClick={() => alert(`${name} — View Gallery`)} />
          <a
            href="#"
            className="inline-flex items-center gap-2 ml-4 text-neutral-700 hover:text-neutral-900 text-sm font-medium"
            onClick={(e) => { e.preventDefault(); alert(`${name} — Learn more`); }}
          >
            Learn more <IconChevronRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Card1;
