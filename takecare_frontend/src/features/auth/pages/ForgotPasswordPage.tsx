import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { AuthFeedback } from '../components/AuthFeedback';
import { AuthField } from '../components/AuthField';
import { AuthPageHeading } from '../components/AuthPageHeading';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    sessionStorage.removeItem('takecare.resetToken');

    try {
      await authApi.forgotPassword(email.trim());
      sessionStorage.setItem('takecare.resetEmail', email.trim());
      navigate('/verify-otp');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to send a verification code.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <AuthPageHeading
        eyebrow="Account recovery"
        title="Reset your password"
        description="Enter your work email and we’ll send you a one-time verification code."
      />
      <AuthFeedback message={error} />
      <form className="grid gap-[18px]" onSubmit={handleSubmit}>
        <AuthField
          label="Work email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <button className="mt-0.5 flex min-h-[50px] items-center justify-center gap-2.5 rounded-[11px] border-0 bg-gradient-to-r from-[#1d2c80] to-[#334aa8] px-[18px] py-3 text-[.9rem] font-semibold text-white shadow-[0_8px_18px_rgba(30,46,125,0.2)] transition duration-150 hover:-translate-y-px hover:brightness-110 hover:shadow-[0_12px_23px_rgba(30,46,125,0.26)] disabled:cursor-wait disabled:opacity-70 motion-reduce:transition-none" type="submit" disabled={busy}>
          {busy ? 'Sending code…' : 'Send verification code'}
          {!busy && <span className="text-[1.1rem]" aria-hidden="true">→</span>}
        </button>
      </form>
      <Link className="mt-[23px] inline-flex items-center gap-[7px] text-[.82rem] font-semibold text-[#4a5670] no-underline hover:text-[#263b92]" to="/login"><span aria-hidden="true">←</span> Back to sign in</Link>
    </>
  );
}
