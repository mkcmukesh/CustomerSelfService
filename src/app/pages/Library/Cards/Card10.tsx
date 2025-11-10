"use client";

import React, { useEffect } from "react";


export type CardProps = {
  name?: string;
  role?: string;
  avatarId?: number;
  leftId?: number;     // kept since it's in your props (even if unused here)
  eyebrow?: string;
  title?: string;      // kept for parity with your original props
  body?: string;
};

const Quote = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M7 7h5v5H9v5H4v-6a4 4 0 0 1 3-4zM17 7h5v5h-3v5h-5v-6a4 4 0 0 1 3-4z"/>
  </svg>
);

const Card10: React.FC<CardProps> = ({
  name = "Savannah Nguyen",
  role = "Client",
  avatarId = 1050,
  leftId = 1062,
  eyebrow = "Testimonial",
  title = "What our client says",
  body = "They delivered on time with immaculate attention to detail.",
}) => {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => {
      link.remove();
    };
  }, []);

  return (
    <div
      className="w-full overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-black/5 p-5"
      style={{
        fontFamily:
          '"Inter","Poppins",ui-sans-serif,system-ui,-apple-system',
      }}
    >
      <div className="flex items-center gap-3">
        <img
          src={`https://picsum.photos/id/${avatarId}/200/200`}
          alt={name}
          className="h-12 w-12 rounded-full object-cover ring-2 ring-white shadow"
        />
        <div>
          <p className="text-[11px] uppercase tracking-wide text-neutral-500">
            {eyebrow}
          </p>
          <h3 className="text-base font-semibold text-neutral-900">{name}</h3>
          <p className="text-sm text-neutral-500">{role}</p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-neutral-50 p-4 ring-1 ring-neutral-200">
        <Quote className="h-5 w-5 text-neutral-400" />
        <p className="mt-2 text-neutral-700">{body}</p>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-black focus:outline-none focus:ring-4 focus:ring-neutral-300 active:scale-[0.98]"
          onClick={() => alert("Read case study")}
        >
          Read case study
        </button>
      </div>
    </div>
  );
};

export default Card10;
