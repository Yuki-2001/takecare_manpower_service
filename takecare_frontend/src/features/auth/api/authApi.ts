import { http } from '../../../lib/http';

export interface LoginRequest {
  userEmail: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  userName: string;
}

interface MessageResponse {
  message: string;
}

interface VerifyOtpResponse {
  resetToken: string;
}

export const authApi = {
  login: (request: LoginRequest) =>
    http<LoginResponse>('/auth/login', { method: 'POST', body: request }),

  forgotPassword: (email: string) =>
    http<MessageResponse>('/auth/forgot-password', {
      method: 'POST',
      body: { email },
    }),

  verifyOtp: (email: string, otp: string) =>
    http<VerifyOtpResponse>('/auth/verify-otp', {
      method: 'POST',
      body: { email, otp },
    }),

  resetPassword: (resetToken: string, newPassword: string) =>
    http<MessageResponse>('/auth/reset-password', {
      method: 'POST',
      body: { resetToken, newPassword },
    }),

  logout: () => http<string>('/auth/logout', { method: 'POST' }),
};
