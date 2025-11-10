export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
  icon?: React.ReactNode;
};

export type NavSection = {
  id: string;
  title: string;
  items: NavItem[];
};
