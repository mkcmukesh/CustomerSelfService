"use client";

import { usePathname, useRouter } from "next/navigation";

export function useIsActive() {
  const pathname = usePathname();
  return (href: string) => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };
}

export function isSafeHref(href: string) {
  try {
    if (href.startsWith("/")) return true;
    const u = new URL(href);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

export function useHoverPreview(delay = 250) {
  const router = useRouter();
  let timer: ReturnType<typeof setTimeout> | null = null;

  const isFinePointer =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(pointer: fine)").matches;

  function start(href: string) {
    if (!isFinePointer) return;
    stop();
    timer = setTimeout(() => router.push(href), delay);
  }

  function stop() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  return { start, stop };
}
