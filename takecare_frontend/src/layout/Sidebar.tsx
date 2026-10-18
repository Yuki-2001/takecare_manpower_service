import { NavLink } from 'react-router-dom';
import { Icon, type IconName } from '../components/Icon';

interface MenuLink {
  label: string;
  to: string;
  icon: IconName;
}

interface SidebarProps {
  open: boolean;
  onNavigate: () => void;
}

const menuSections: { title: string; links: MenuLink[] }[] = [
  {
    title: 'User',
    links: [{ label: 'My profile', to: '/app/profile', icon: 'user' }],
  },
  {
    title: 'Admin Control',
    links: [{ label: 'Access management', to: '/app/admin', icon: 'shield' }],
  },
  {
    title: 'HR Control',
    links: [{ label: 'Candidate search', to: '/app/candidates', icon: 'briefcase' }],
  },
];

export function Sidebar({ open, onNavigate }: SidebarProps) {
  return (
    <>
      {open && <button className="fixed inset-0 z-[19] border-0 bg-[rgba(17,25,44,0.34)] min-[901px]:hidden" aria-label="Close navigation" onClick={onNavigate} />}
      <aside className={`sticky top-0 flex h-screen w-[264px] flex-[0_0_264px] flex-col border-r border-[#e8ebf1] bg-white px-4 pt-[29px] pb-[18px] max-[900px]:fixed max-[900px]:z-20 max-[900px]:left-0 max-[900px]:shadow-[15px_0_35px_rgba(25,36,62,0.08)] max-[900px]:transition-transform ${
        open ? 'max-[900px]:translate-x-0' : 'max-[900px]:-translate-x-[102%]'
      }`}>
        <div className="mt-1 mx-[10px] mb-[26px]">
          <span className="m-0 text-[.62rem] font-bold tracking-[.17em] text-[#a0a8b7] uppercase">WORKSPACE</span>
          <p className="mt-2 mb-0 text-[.8rem] text-[#768096]">Manage your people and operations.</p>
        </div>
        <nav aria-label="Main navigation">
          {menuSections.map((section) => (
            <div className="mb-[22px]" key={section.title}>
              <h2 className="mt-0 mx-[10px] mb-2 text-[.69rem] font-bold tracking-[.035em] text-[#8992a3]">{section.title}</h2>
              {section.links.map((link) => (
                <NavLink
                  className={({ isActive }) => `flex min-h-[43px] items-center gap-[11px] rounded-[9px] px-[10px] text-[.83rem] no-underline transition-colors duration-150 [&_svg:last-child]:ml-auto [&_svg:last-child]:text-[#aab1be] ${
                    isActive
                      ? 'bg-[#eef1fb] font-semibold text-[#273985] [&_svg:first-child]:text-[#334aa8]'
                      : 'font-medium text-[#606b81] hover:bg-[#f5f6fb] hover:text-[#263982]'
                  }`}
                  to={link.to}
                  key={link.to}
                  onClick={onNavigate}
                >
                  <Icon name={link.icon} />
                  <span>{link.label}</span>
                  <Icon name="chevron" size={15} />
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="mt-auto flex items-center gap-[11px] rounded-xl border border-[#edf0f4] bg-[#fafbfc] px-[10px] py-[13px]">
          <span className="grid size-[34px] flex-none place-items-center rounded-[10px] bg-[#283b8e] text-[.78rem] font-bold tracking-[-.07em] text-white">tc</span>
          <div className="text-[.72rem]">
            <strong className="block font-semibold text-[#303b53]">Need a hand?</strong>
            <span className="mt-[3px] block text-[#778197]">Contact your administrator</span>
          </div>
        </div>
      </aside>
    </>
  );
}
