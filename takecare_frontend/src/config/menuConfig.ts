import type { IconName } from '../components/Icon';

export interface MenuLink {
  label: string;
  to: string;
  icon: IconName;
  access: string[];
}

export interface MenuSection {
  title: string;
  icon: IconName;
  links: MenuLink[];
}

export const menuSections: MenuSection[] = [
  {
    title: 'Admin Control',
    icon: 'shield',
    links: [
      {
        label: 'User',
        to: '/app/users',
        icon: 'users',
        access: ['USER', 'ADMIN'],
      },
      {
        label: 'Candidate Upload Page',
        to: '/app/candidate-upload',
        icon: 'upload',
        access: ['CANDIDATE_UPLOAD', 'ADMIN'],
      },
    ],
  },
  {
    title: 'HR Control',
    icon: 'briefcase',
    links: [
      {
        label: 'Candidate View Page',
        to: '/app/candidates',
        icon: 'search',
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
