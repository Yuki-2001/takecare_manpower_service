import { NavLink } from 'react-router-dom';
import { getVisibleMenuSections } from '../config/menuConfig';
import { Icon } from '../components/Icon';

interface SidebarProps {
  access: string[];
  open: boolean;
  onNavigate: () => void;
}

export function Sidebar({ access, open, onNavigate }: SidebarProps) {
  const sections = getVisibleMenuSections(access);

  return (
    <>
      {open && (
        <button
          className="fixed inset-0 z-30 border-0 bg-slate-950/40 backdrop-blur-[2px] min-[901px]:hidden"
          aria-label="Close navigation"
          onClick={onNavigate}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[264px] flex-col border-r border-slate-200/80 bg-white px-4 py-5 shadow-[0_18px_55px_rgba(23,35,63,0.08)] transition-transform duration-200 min-[901px]:sticky min-[901px]:z-10 min-[901px]:h-screen min-[901px]:translate-x-0 min-[901px]:shadow-none ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-8 rounded-2xl bg-gradient-to-br from-[#f4f6ff] to-white px-4 py-4">
          <div className="mb-2 flex items-center gap-2 text-[.65rem] font-bold tracking-[.15em] text-[#6673a8] uppercase">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            TakeCare workspace
          </div>
          <p className="m-0 text-[.78rem] leading-relaxed text-slate-500">
            Your people operations, organized in one place.
          </p>
        </div>

        <nav className="space-y-7" aria-label="Main navigation">
          {sections.map((section) => (
            <section key={section.title} aria-label={section.title}>
              <div className="mb-2 flex items-center gap-2 px-2 text-[.67rem] font-bold tracking-[.12em] text-slate-400 uppercase">
                <Icon name={section.icon} size={15} />
                {section.title}
              </div>
              <div className="space-y-1">
                {section.links.map((link) => (
                  <NavLink
                    className={({ isActive }) =>
                      `group relative flex min-h-11 items-center gap-3 rounded-xl px-3 text-[.83rem] no-underline transition-colors ${
                        isActive
                          ? 'bg-[#eef1fb] font-semibold text-[#263b8f] shadow-[inset_0_0_0_1px_rgba(45,65,153,0.07)]'
                          : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`
                    }
                    to={link.to}
                    key={link.to}
                    onClick={onNavigate}
                  >
                    <span className="grid size-8 place-items-center rounded-lg bg-white text-slate-500 shadow-[0_1px_3px_rgba(15,23,42,0.08)] group-hover:text-[#354a9a]">
                      <Icon name={link.icon} size={17} />
                    </span>
                    <span className="flex-1">{link.label}</span>
                    <Icon name="chevron" size={15} />
                  </NavLink>
                ))}
              </div>
            </section>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-[#263b8f] text-white">
              <Icon name="users" size={17} />
            </span>
            <div className="min-w-0">
              <p className="m-0 text-[.75rem] font-semibold text-slate-700">Need a hand?</p>
              <p className="mt-0.5 mb-0 text-[.68rem] text-slate-500">Contact your administrator</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
