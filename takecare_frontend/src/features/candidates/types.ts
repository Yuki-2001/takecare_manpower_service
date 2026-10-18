export type SortDirection = 'ASC' | 'DESC';
export type FilterOperator =
  | 'EQ'
  | 'NE'
  | 'LIKE'
  | 'GT'
  | 'LT'
  | 'GTE'
  | 'LTE'
  | 'IN'
  | 'BETWEEN'
  | 'IS_NULL'
  | 'IS_NOT_NULL';

export interface FilterDto {
  field: string;
  operator: FilterOperator;
  value: string | number | boolean | Array<string | number | boolean> | [string | number, string | number];
}

export interface SortDto {
  field: string;
  direction: SortDirection;
}

export interface CandidateSearchRequest {
  page?: number;
  size?: number;
  filters?: FilterDto[];
  sort?: SortDto[];
}

export interface CandidateRecord {
  id?: number;
  fullName?: string;
  email?: string;
  phone?: string;
  gender?: string;
  maritalStatus?: string;
  dateOfBirth?: string;
  totalExperienceMonths?: number;
  currentDesignation?: string;
  department?: string;
  role?: string;
  currentSalaryAmount?: number | string;
  salaryCurrency?: string;
  availabilityStatus?: string;
  noticePeriodDays?: number;
  status?: string;
  updatedAt?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export interface CandidateSearchResponse {
  content: CandidateRecord[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
