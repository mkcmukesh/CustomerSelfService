"use client";

import { about } from "./sections/about";
import { businesses } from "./sections/businesses";
import { people } from "./sections/people";
import { investorMedia } from "./sections/investorMedia";
import { otherLinks } from "./sections/otherLinks";
import { legalPolicies } from "./sections/legalPolicies";
// import { templates } from "./sections/templates";

export const NAV_SECTIONS = {
  about,
  businesses,
  people,
  investorMedia,
  otherLinks,
  legalPolicies,
  // templates,
  
};

export type SectionKey = keyof typeof NAV_SECTIONS;

export function getSection(key: SectionKey) {
  return NAV_SECTIONS[key];
}

export const ORDERED_KEYS: SectionKey[] = [
  "about",
  "businesses",
  "people",
  "investorMedia",
  "otherLinks",
  "legalPolicies",
  // "templates",
];
