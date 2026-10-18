import { BriefcaseBusiness, Shield, Upload, UserRound, Users, type LucideIcon } from 'lucide-react';
import { getAuthSession } from '../features/auth/session';

interface WorkspacePageProps {
  section: string;
}

const pageContent: Record<string, { eyebrow: string; description: string; icon: LucideIcon }> = {
  'User management': {
    eyebrow: 'ADMIN CONTROL',
    description: 'Manage workspace users and their access to TakeCare.',
    icon: Users,
  },
  'Candidate upload': {
    eyebrow: 'ADMIN CONTROL',
    description: 'Prepare candidate information for your recruitment pipeline.',
    icon: Upload,
  },
  'Access unavailable': {
    eyebrow: 'PERMISSIONS',
    description: 'Your account does not currently have access to this section.',
    icon: Shield,
  },
  'No workspace modules available': {
    eyebrow: 'WORKSPACE',
    description: 'No sections are assigned to your account yet.',
    icon: BriefcaseBusiness,
  },
};

export function WorkspacePage({ section }: WorkspacePageProps) {
  const session = getAuthSession();
  const isProfile = section === 'My profile';
  const page = pageContent[section] ?? {
    eyebrow: 'TAKECARE WORKSPACE',
    description: 'Review your account details and workspace access.',
    icon: UserRound,
  };
  const PageIcon = page.icon;
  const access = session?.access ?? [];
  const roles = session?.user?.roles ?? [];

  return (
    <div className="space-y-5">
      {isProfile && (
        <header className="flex items-end justify-between gap-4 px-1 max-[620px]:items-start max-[620px]:flex-col">
          <div>
            <p className="m-0 text-[.66rem] font-bold tracking-[.15em] text-[#9a742e] uppercase">ACCOUNT</p>
            <h2 className="mt-1.5 mb-1 text-[1.45rem] font-semibold tracking-[-.035em] text-slate-900">{section}</h2>
            <p className="m-0 text-sm text-slate-500">Your TakeCare workspace identity and permissions.</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            {session?.user?.status ?? 'Active'}
          </span>
        </header>
      )}

      {isProfile ? (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(28,39,67,0.04)]">
          <div className="flex items-center gap-4 bg-gradient-to-r from-[#f5f7ff] via-white to-white px-6 py-6 max-[620px]:px-4">
            {session?.user?.profileImg ? (
              <img className="size-[60px] rounded-2xl object-cover ring-1 ring-slate-200" src={session.user.profileImg} alt="" />
            ) : (
              <span className="grid size-[60px] place-items-center rounded-2xl bg-[#e9edff] text-lg font-bold text-[#304593]">
                {(session?.userName ?? 'TC').split(/\s+/).map((word) => word[0]).slice(0, 2).join('').toUpperCase()}
              </span>
            )}
            <div className="min-w-0">
              <h3 className="m-0 overflow-hidden text-ellipsis whitespace-nowrap text-lg font-semibold text-slate-900">{session?.userName}</h3>
              <p className="mt-1 mb-0 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-slate-500">{session?.user?.userEmail ?? 'Email not available'}</p>
            </div>
          </div>
          <div className="grid gap-x-8 gap-y-6 border-t border-slate-100 px-6 py-6 sm:grid-cols-2 max-[620px]:px-4">
            <ProfileDetail label="Designation" value={session?.user?.designationName} />
            <ProfileDetail label="Account status" value={session?.user?.status} />
            <ProfileDetail label="Assigned roles" value={roles.map((role) => role.roleName).filter(Boolean).join(', ')} />
            <ProfileDetail label="User ID" value={session?.user?.userIdPk} />
          </div>
          <div className="border-t border-slate-100 px-6 py-5 max-[620px]:px-4">
            <h4 className="mb-3 mt-0 text-sm font-semibold text-slate-800">Workspace access</h4>
            <div className="flex flex-wrap gap-2">
              {access.length ? access.map((item) => (
                <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600" key={item}>{item}</span>
              )) : <span className="text-sm text-slate-500">No access groups assigned.</span>}
            </div>
          </div>
        </section>
      ) : (
        <section className="grid min-h-[320px] content-center justify-items-center rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-[0_8px_30px_rgba(28,39,67,0.04)]">
          <span className="mb-5 grid size-14 place-items-center rounded-2xl bg-[#eef1fb] text-[#344995]">
            <PageIcon size={24} />
          </span>
          <p className="m-0 text-[.65rem] font-bold tracking-[.16em] text-[#9a742e] uppercase">{page.eyebrow}</p>
          <h3 className="mt-2 mb-2 text-lg font-semibold tracking-[-.02em] text-slate-900">{section}</h3>
          <p className="m-0 max-w-md text-sm leading-relaxed text-slate-500">{page.description}</p>
          {section === 'Candidate upload' && (
            <p className="mt-5 max-w-md rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-left text-xs leading-relaxed text-amber-800">
              Candidate upload is not available yet because the backend does not currently expose an upload endpoint.
            </p>
          )}
          {section === 'User management' && (
            <p className="mt-5 max-w-md rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-600">
              The current backend provides your signed-in profile and access list. User-directory management will be connected when its API is available.
            </p>
          )}
        </section>
      )}
    </div>
  );
}

function ProfileDetail({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="m-0 text-xs font-medium text-slate-400">{label}</p>
      <p className="mt-1.5 mb-0 break-words text-sm font-medium text-slate-700">{value || '—'}</p>
    </div>
  );
}
