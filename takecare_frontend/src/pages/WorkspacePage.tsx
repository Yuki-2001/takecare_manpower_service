import { Icon } from '../components/Icon';

interface WorkspacePageProps {
  section: string;
}

export function WorkspacePage({ section }: WorkspacePageProps) {
  return (
    <section className="grid min-h-[390px] content-center justify-items-center rounded-2xl border border-[#e8ebf0] bg-white p-[35px] text-center">
      <div className="mb-5 grid size-14 place-items-center rounded-2xl bg-[#eef1fb] text-[#344995]"><Icon name={section === 'User profile' ? 'user' : 'shield'} size={24} /></div>
      <p className="m-0 text-[.68rem] font-bold tracking-[.16em] text-[#9a6b19] uppercase">TAKECARE WORKSPACE</p>
      <h2 className="mt-2 mb-[6px] text-[1.4rem] tracking-[-.03em] text-[#1c2743]">{section}</h2>
      <p className="m-0 text-[.86rem] text-[#7b8599]">This area is ready for the next workforce management module.</p>
    </section>
  );
}
