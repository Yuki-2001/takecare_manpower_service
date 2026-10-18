import { http } from '../../../lib/http';
import type { AuthenticatedUser } from '../session';

export const userApi = {
  getSession: () => http<AuthenticatedUser>('/user/session'),
};
