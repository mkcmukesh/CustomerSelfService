import { NavSection } from "@/nav/types";

export const templates: NavSection = {
  id: "templates",
  title: "Templates",
  items: [
    { href: "/templates/centered", label: "Content-FullHeight-Center" },
    { href: "/templates/split5050", label: "Content-fullWidth-5050" },
    { href: "/templates/website", label: "Website (Site Layout)" },
    { href: "/templates/dashboard", label: "Dashboard (Sidebar)" },
    { href: "/templates/legal", label: "Content Only (Legal)" },
    { href: "/templates/login", label: "Login" },
  ],
};
