import { NavSection } from "@/nav/types";

export const legalPolicies: NavSection = {
  id: "legalPolicies",
  title: "Legal",
  items: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/cookies", label: "Cookie Policy" },
  ],
};
