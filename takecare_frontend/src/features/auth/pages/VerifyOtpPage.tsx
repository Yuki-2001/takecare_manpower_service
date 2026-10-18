import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { AuthFeedback } from '../components/AuthFeedback';
import { AuthField } from '../components/AuthField';
import { AuthPageHeading } from '../components/AuthPageHeading';

export function VerifyOtpPage() {
  const navigate = useNavigate();
  const email = sessionStorage.getItem('takecare.resetEmail');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!email) return <Navigate to="/forgot-password" replace />;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError('');

    try {
      const response = await authApi.verifyOtp(email, otp.trim());
      sessionStorage.setItem('takecare.resetToken', response.resetToken);
      navigate('/reset-password');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'That code could not be verified.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <AuthPageHeading
        eyebrow="Check your inbox"
        title="Verify your email"
        description={`Enter the six-digit code we sent to ${email}. The code expires after six minutes.`}
      />
      <AuthFeedback message={error} />
      <form className="grid gap-[18px]" onSubmit={handleSubmit}>
        <AuthField
          label="Verification code"
          name="otp"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="000000"
          maxLength={6}
          pattern="[0-9]{6}"
          value={otp}
          onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
          required
        />
        <button className="mt-0.5 flex min-h-[50px] items-center justify-center gap-2.5 rounded-[11px] border-0 bg-gradient-to-r from-[#1d2c80] to-[#334aa8] px-[18px] py-3 text-[.9rem] font-semibold text-white shadow-[0_8px_18px_rgba(30,46,125,0.2)] transition duration-150 hover:-translate-y-px hover:brightness-110 hover:shadow-[0_12px_23px_rgba(30,46,125,0.26)] disabled:cursor-wait disabled:opacity-70 motion-reduce:transition-none" type="submit" disabled={busy || otp.length !== 6}>
          {busy ? 'Verifying code…' : 'Verify and continue'}
          {!busy && <span className="text-[1.1rem]" aria-hidden="true">→</span>}
        </button>
      </form>
      <div className="flex items-center justify-between gap-[14px]">
        <Link className="mt-[23px] inline-flex items-center gap-[7px] text-[.82rem] font-semibold text-[#4a5670] no-underline hover:text-[#263b92]" to="/forgot-password"><span aria-hidden="true">←</span> Change email</Link>
        <Link className="mt-[23px] text-[.78rem] font-semibold text-[#283c91] no-underline hover:underline hover:underline-offset-[3px]" to="/forgot-password">Send a new code</Link>
      </div>
    </>
  );
}
