import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown, ChevronRight, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { getVisibleMenuSections } from '../config/menuConfig';

interface SidebarProps {
  access: string[];
  open: boolean;
  collapsed: boolean;
  onNavigate: () => void;
  onToggleCollapsed: () => void;
}

export function Sidebar({ access, open, collapsed, onNavigate, onToggleCollapsed }: SidebarProps) {
  const sections = getVisibleMenuSections(access);
  const [collapsedSections, setCollapsedSections] = useState<string[]>([]);

  const toggleSection = (title: string) => {
    setCollapsedSections((current) => current.includes(title)
      ? current.filter((section) => section !== title)
      : [...current, title]);
  };

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
        className={`fixed inset-y-0 left-0 z-40 flex w-[264px] flex-col border-r border-slate-200/80 bg-white px-3 py-4 shadow-[0_18px_55px_rgba(23,35,63,0.08)] transition-[width,transform] duration-200 min-[901px]:sticky min-[901px]:z-10 min-[901px]:h-screen min-[901px]:translate-x-0 min-[901px]:shadow-none ${
          collapsed ? 'min-[901px]:w-[76px]' : 'min-[901px]:w-[264px]'
        } ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className={`mb-5 flex h-10 items-center ${collapsed ? 'justify-end min-[901px]:justify-center' : 'justify-end'}`}>
          <button
            className="grid size-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-[#344995] max-[900px]:hidden"
            type="button"
            onClick={onToggleCollapsed}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        <nav className="space-y-5" aria-label="Main navigation">
          {sections.map((section) => {
            const SectionIcon = section.icon;
            const isExpanded = !collapsedSections.includes(section.title);

            return (
              <section key={section.title} aria-label={section.title}>
                <button
                  className={`flex min-h-9 w-full items-center rounded-lg border-0 bg-transparent text-[.67rem] font-bold tracking-[.1em] text-slate-400 uppercase transition hover:bg-slate-50 hover:text-slate-600 ${
                    collapsed ? 'gap-2 px-2 min-[901px]:justify-center' : 'gap-2 px-2'
                  }`}
                  type="button"
                  onClick={() => toggleSection(section.title)}
                  aria-expanded={isExpanded}
                  title={collapsed ? section.title : undefined}
                >
                  <SectionIcon size={16} />
                  <span className={collapsed ? 'flex-1 text-left min-[901px]:hidden' : 'flex-1 text-left'}>{section.title}</span>
                  <span className={collapsed ? 'min-[901px]:hidden' : ''}>
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </span>
                </button>
                {isExpanded && (
                  <div className={`mt-1 space-y-1 ${collapsed ? 'px-0' : 'px-1'}`}>
                    {section.links.map((link) => {
                      const LinkIcon = link.icon;
                      return (
                        <NavLink
                          className={({ isActive }) =>
                            `group relative flex min-h-11 items-center rounded-xl text-[.82rem] no-underline transition-colors ${
                              collapsed ? 'gap-3 px-2 min-[901px]:justify-center' : 'gap-3 px-2'
                            } ${
                              isActive
                                ? 'bg-[#eef1fb] font-semibold text-[#263b8f] shadow-[inset_0_0_0_1px_rgba(45,65,153,0.07)]'
                                : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`
                          }
                          to={link.to}
                          key={link.to}
                          onClick={onNavigate}
                          title={collapsed ? link.label : undefined}
                        >
                          <span className={`grid size-8 flex-none place-items-center rounded-lg ${
                            collapsed ? 'bg-white shadow-[0_1px_3px_rgba(15,23,42,0.08)] min-[901px]:bg-transparent min-[901px]:shadow-none' : 'bg-white shadow-[0_1px_3px_rgba(15,23,42,0.08)]'
                          }`}>
                            <LinkIcon size={17} strokeWidth={1.8} />
                          </span>
                          <span className={collapsed ? 'flex-1 min-[901px]:hidden' : 'flex-1'}>{link.label}</span>
                          <ChevronRight className={`text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#354a9a] ${collapsed ? 'min-[901px]:hidden' : ''}`} size={15} />
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
