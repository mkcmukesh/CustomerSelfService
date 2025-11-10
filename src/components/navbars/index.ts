import dynamic from "next/dynamic";

const NavbarMinimal = dynamic(() => import("./NavbarMinimal"));
const NavbarBrandCenter = dynamic(() => import("./NavbarBrandCenter"));
const NavbarGlassGradient = dynamic(() => import("./NavbarGlassGradient"));
const NavbarMega = dynamic(() => import("./NavbarMega"));
const NavbarEcommerce = dynamic(() => import("./NavbarEcommerce"));

export const NAVBARS = {
  minimal: NavbarMinimal,
  brandCenter: NavbarBrandCenter,
  glassGradient: NavbarGlassGradient,
  mega: NavbarMega,
  ecommerce: NavbarEcommerce,
} as const;

export type NavbarVariant = keyof typeof NAVBARS;

export function pickNavbar(): NavbarVariant {
  const v = process.env.NEXT_PUBLIC_NAVBAR_VARIANT?.toLowerCase();
  if (v && v in NAVBARS) return v as NavbarVariant;
  return "glassGradient"; // default
}

export function useNavbarComponent() {
  const key = pickNavbar();
  return NAVBARS[key];
}
