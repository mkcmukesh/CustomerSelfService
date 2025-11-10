
"use client";

import React, { useEffect, useState } from "react";
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

const Card17: React.FC<CardProps> = ({ 
  name = "Newsletter",
  role = "Weekly",
  leftId = 1020,
  eyebrow = "Subscribe",
  title = "Stay in the loop",
  body = "Design news, handpicked resources, and small wins — every Friday."
}) => {

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => { link.remove(); };
  }, []);

      const [email, setEmail] = useState("");
      const submit = () => alert(`Subscribed: ${email || "user@example.com"}`);
      return (
        <div className="w-full overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-black/5"
          style={{ fontFamily: '"Inter","Poppins",ui-sans-serif,system-ui,-apple-system' }}>
          <img src={`https://picsum.photos/id/${leftId}/1200/800`} alt="" className="h-32 w-full object-cover" />
          <div className="p-5">
            <p className="text-[11px] uppercase tracking-wide text-neutral-500">{eyebrow}</p>
            <h3 className="text-xl font-semibold text-neutral-900">{title}</h3>
            <p className="mt-1 text-neutral-600">{body}</p>
            <div className="mt-4 flex items-center gap-2">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@company.com"
                className="h-10 flex-1 rounded-xl border border-neutral-300 px-3 text-sm outline-none ring-0 placeholder:text-neutral-400 focus:border-neutral-400"
              />
              <button className="h-10 rounded-xl bg-neutral-900 px-4 text-sm font-medium text-white hover:bg-black focus:outline-none focus:ring-4 focus:ring-neutral-300 active:scale-[0.98]"
                onClick={submit}>
                Subscribe
              </button>
            </div>
          </div>
        </div>
      );
    };

    export default Card17;
    