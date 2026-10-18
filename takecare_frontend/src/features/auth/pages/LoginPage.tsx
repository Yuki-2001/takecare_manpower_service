import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { userApi } from '../api/userApi';
import { AuthFeedback } from '../components/AuthFeedback';
import { AuthField } from '../components/AuthField';
import { AuthPageHeading } from '../components/AuthPageHeading';
import { clearAuthSession, saveAuthSession, updateAuthenticatedUser } from '../session';

interface LocationState {
  logoutMessage?: string;
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const logoutMessage = (location.state as LocationState | null)?.logoutMessage;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError('');

    try {
      const session = await authApi.login({ userEmail: email.trim(), password });
      saveAuthSession(session);
      const user = await userApi.getSession();
      updateAuthenticatedUser(user);
      navigate('/app', { replace: true });
    } catch (requestError) {
      clearAuthSession();
      setError(requestError instanceof Error ? requestError.message : 'Unable to sign in. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <AuthPageHeading
        eyebrow="TakeCare workspace"
        title="Welcome back"
        description="Sign in to continue to your manpower operations."
      />
      {logoutMessage && <AuthFeedback message={logoutMessage} tone="success" />}
      <AuthFeedback message={error} />
      <form className="grid gap-[18px]" onSubmit={handleSubmit}>
        <AuthField
          label="Work email"
          name="email"
          type="email"
          autoComplete="username"
          placeholder="you@company.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <AuthField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <div className="-mt-1.5 flex items-center justify-between gap-3 text-[.78rem]">
          <span className="text-[#788298]">
            <span className="mr-1 inline-grid size-[17px] place-items-center rounded-full bg-[#e4f5ed] text-[.68rem] font-extrabold text-[#287557]" aria-hidden="true">✓</span>
            Secure sign in
          </span>
          <Link className="font-semibold text-[#283c91] no-underline hover:underline hover:underline-offset-[3px]" to="/forgot-password">Forgot password?</Link>
        </div>
        <button className="mt-0.5 flex min-h-[50px] items-center justify-center gap-2.5 rounded-[11px] border-0 bg-gradient-to-r from-[#1d2c80] to-[#334aa8] px-[18px] py-3 text-[.9rem] font-semibold text-white shadow-[0_8px_18px_rgba(30,46,125,0.2)] transition duration-150 hover:-translate-y-px hover:brightness-110 hover:shadow-[0_12px_23px_rgba(30,46,125,0.26)] disabled:cursor-wait disabled:opacity-70 motion-reduce:transition-none" type="submit" disabled={busy}>
          {busy ? 'Signing you in…' : 'Sign in'}
          {!busy && <span className="text-[1.1rem]" aria-hidden="true">→</span>}
        </button>
      </form>
      <p className="mt-[22px] text-center text-[.77rem] text-[#7a8497]">
        Need access? Contact your system administrator.
      </p>
    </>
  );
}
