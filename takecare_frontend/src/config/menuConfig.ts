import type { LucideIcon } from 'lucide-react';
import { BriefcaseBusiness, Search, Shield, Upload, Users } from 'lucide-react';

export interface MenuLink {
  label: string;
  to: string;
  icon: LucideIcon;
  access: string[];
}

export interface MenuSection {
  title: string;
  icon: LucideIcon;
  links: MenuLink[];
}

export const menuSections: MenuSection[] = [
  {
    title: 'Admin Control',
    icon: Shield,
    links: [
      {
        label: 'User',
        to: '/app/users',
        icon: Users,
        access: ['USER', 'ADMIN'],
      },
      {
        label: 'Candidate Upload Page',
        to: '/app/candidate-upload',
        icon: Upload,
        access: ['CANDIDATE_UPLOAD', 'ADMIN'],
      },
    ],
  },
  {
    title: 'HR Control',
    icon: BriefcaseBusiness,
    links: [
      {
        label: 'Candidate View Page',
        to: '/app/candidates',
        icon: Search,
        access: ['CANDIDATE_VIEW', 'CANDIDATE', 'ADMIN'],
      },
    ],
  },
];

export function canAccess(access: string[], requiredAccess: string[]): boolean {
  return requiredAccess.some((permission) => access.includes(permission));
}

export function getVisibleMenuSections(access: string[]): MenuSection[] {
  return menuSections
    .map((section) => ({
      ...section,
      links: section.links.filter((link) => canAccess(access, link.access)),
    }))
    .filter((section) => section.links.length > 0);
}
