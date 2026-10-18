import { http } from '../../../lib/http';
import type { CandidateSearchRequest, CandidateSearchResponse } from '../types';

export const candidateApi = {
  searchCandidates: (request: CandidateSearchRequest): Promise<CandidateSearchResponse> =>
    http<CandidateSearchResponse>('/candidate/search', {
      method: 'POST',
      body: request,
    }),
};
