import { useEffect, useMemo, useState } from 'react';
import { candidateApi } from '../api/candidateApi';
import type { CandidateSearchResponse, FilterDto, SortDirection } from '../types';

type FilterDraft = {
  keyword: string;
  gender: string;
  status: string;
  minExperience: string;
  maxExperience: string;
};

const EMPTY_DRAFT: FilterDraft = {
  keyword: '',
  gender: '',
  status: '',
  minExperience: '',
  maxExperience: '',
};

const buildFilters = (draft: FilterDraft): FilterDto[] => {
  const filters: FilterDto[] = [];

  if (draft.keyword.trim()) {
    filters.push({
      field: 'fullName',
      operator: 'LIKE',
      value: draft.keyword.trim(),
    });
  }

  if (draft.gender) {
    filters.push({
      field: 'gender',
      operator: 'EQ',
      value: draft.gender,
    });
  }

  if (draft.status) {
    filters.push({
      field: 'status',
      operator: 'EQ',
      value: draft.status,
    });
  }

  if (draft.minExperience) {
    filters.push({
      field: 'totalExperienceMonths',
      operator: 'GTE',
      value: Number(draft.minExperience),
    });
  }

  if (draft.maxExperience) {
    filters.push({
      field: 'totalExperienceMonths',
      operator: 'LTE',
      value: Number(draft.maxExperience),
    });
  }

  return filters;
};

export function CandidateSearchPage() {
  const [draftFilters, setDraftFilters] = useState<FilterDraft>(EMPTY_DRAFT);
  const [appliedFilters, setAppliedFilters] = useState<FilterDraft>(EMPTY_DRAFT);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sortField, setSortField] = useState('updatedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('DESC');
  const [data, setData] = useState<CandidateSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useMemo(
    () => ({
      page,
      size,
      filters: buildFilters(appliedFilters),
      sort: [{ field: sortField, direction: sortDirection }],
    }),
    [appliedFilters, page, size, sortDirection, sortField],
  );

  useEffect(() => {
    let cancelled = false;

    const loadCandidates = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await candidateApi.searchCandidates(request);
        if (!cancelled) {
          setData(response);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError instanceof Error ? requestError.message : 'Unable to load candidates.');
          setData(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadCandidates();

    return () => {
      cancelled = true;
    };
  }, [request]);

  const applyFilters = () => {
    setPage(0);
    setAppliedFilters(draftFilters);
  };

  const clearFilters = () => {
    setDraftFilters(EMPTY_DRAFT);
    setAppliedFilters(EMPTY_DRAFT);
    setPage(0);
  };

  const handleSort = (field: string) => {
    const nextDirection: SortDirection = sortField === field && sortDirection === 'ASC' ? 'DESC' : 'ASC';
    setSortField(field);
    setSortDirection(nextDirection);
    setPage(0);
  };

  const totalPages = data?.totalPages ?? 0;
  const candidateRows = data?.content ?? [];

  return (
    <div className="mx-auto max-w-[1440px] text-slate-800">
      <div className="space-y-5">
        <header className="flex items-end justify-between gap-5 px-0.5 py-[3px] max-[620px]:items-start max-[620px]:flex-col max-[620px]:gap-[13px]">
          <div>
            <p className="m-0 text-[.66rem] font-bold tracking-[.14em] text-[#a0782c] uppercase">Talent directory</p>
            <h2 className="mt-[5px] mb-[3px] text-[1.4rem] font-bold tracking-[-.035em] text-[#1c2743]">Find the right people for your team</h2>
            <span className="text-[.82rem] text-[#7b8599]">Search, filter, and review your candidate pipeline.</span>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg bg-[#273985] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#1f2e70]"
          >
            + Add Candidate
          </button>
        </header>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_5px_22px_rgba(25,36,62,0.04)]">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Keyword</span>
              <input
                value={draftFilters.keyword}
                onChange={(event) => setDraftFilters((current) => ({ ...current, keyword: event.target.value }))}
                placeholder="Full name"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Gender</span>
              <select
                value={draftFilters.gender}
                onChange={(event) => setDraftFilters((current) => ({ ...current, gender: event.target.value }))}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              >
                <option value="">Any</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Status</span>
              <input
                value={draftFilters.status}
                onChange={(event) => setDraftFilters((current) => ({ ...current, status: event.target.value }))}
                placeholder="A"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Min experience (months)</span>
              <input
                type="number"
                min="0"
                value={draftFilters.minExperience}
                onChange={(event) => setDraftFilters((current) => ({ ...current, minExperience: event.target.value }))}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Max experience (months)</span>
              <input
                type="number"
                min="0"
                value={draftFilters.maxExperience}
                onChange={(event) => setDraftFilters((current) => ({ ...current, maxExperience: event.target.value }))}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </label>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={applyFilters}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
            >
              Apply Filters
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Clear Filters
            </button>
            <span className="text-sm text-slate-600">
              {data ? `${data.totalElements.toLocaleString()} candidates` : 'No results yet'}
            </span>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_5px_22px_rgba(25,36,62,0.04)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
            <div className="text-sm font-medium text-slate-700">Results</div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <label className="flex items-center gap-2">
                <span>Page size</span>
                <select
                  value={size}
                  onChange={(event) => {
                    setSize(Number(event.target.value));
                    setPage(0);
                  }}
                  className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm"
                >
                  {[10, 25, 50, 100].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {loading && (
            <div className="px-4 py-10 text-center text-sm text-slate-500">Loading candidates…</div>
          )}

          {!loading && error && (
            <div className="px-4 py-10 text-center">
              <p className="text-sm font-medium text-red-600">{error}</p>
              <button
                type="button"
                onClick={applyFilters}
                className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && candidateRows.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-slate-500">No candidates match the current filters.</div>
          )}

          {!loading && !error && candidateRows.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
                <thead className="bg-slate-50">
                  <tr>
                    {[
                      { key: 'fullName', label: 'Name' },
                      { key: 'email', label: 'Email' },
                      { key: 'phone', label: 'Phone' },
                      { key: 'gender', label: 'Gender' },
                      { key: 'totalExperienceMonths', label: 'Experience (months)' },
                      { key: 'currentDesignation', label: 'Current Designation' },
                      { key: 'status', label: 'Status' },
                    ].map((column) => (
                      <th key={column.key} className="px-4 py-3 font-medium text-slate-700">
                        <button
                          type="button"
                          onClick={() => handleSort(column.key)}
                          className="inline-flex items-center gap-1 hover:text-slate-900"
                        >
                          {column.label}
                          {sortField === column.key && (
                            <span aria-label={`Sort ${sortDirection}`}>{sortDirection === 'ASC' ? '↑' : '↓'}</span>
                          )}
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {candidateRows.map((candidate) => (
                    <tr key={candidate.id ?? `${candidate.fullName}-${candidate.email}`} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{candidate.fullName ?? '—'}</td>
                      <td className="px-4 py-3">{candidate.email ?? '—'}</td>
                      <td className="px-4 py-3">{candidate.phone ?? '—'}</td>
                      <td className="px-4 py-3">{candidate.gender ?? '—'}</td>
                      <td className="px-4 py-3">{candidate.totalExperienceMonths ?? '—'}</td>
                      <td className="px-4 py-3">{candidate.currentDesignation ?? '—'}</td>
                      <td className="px-4 py-3">{candidate.status ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && data && data.totalPages > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <span>
                Page {data.page + 1} of {data.totalPages}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage(0)}
                  disabled={page === 0}
                  className="rounded-md border border-slate-300 bg-white px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  First
                </button>
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(0, current - 1))}
                  disabled={page === 0}
                  className="rounded-md border border-slate-300 bg-white px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.min(totalPages - 1, current + 1))}
                  disabled={page >= totalPages - 1}
                  className="rounded-md border border-slate-300 bg-white px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
                <button
                  type="button"
                  onClick={() => setPage(totalPages - 1)}
                  disabled={page >= totalPages - 1}
                  className="rounded-md border border-slate-300 bg-white px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Last
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
