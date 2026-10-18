import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { AuthFeedback } from '../components/AuthFeedback';
import { AuthField } from '../components/AuthField';
import { AuthPageHeading } from '../components/AuthPageHeading';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const resetToken = sessionStorage.getItem('takecare.resetToken');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!resetToken) return <Navigate to="/forgot-password" replace />;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('Your passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Use at least 8 characters for your new password.');
      return;
    }

    setBusy(true);
    setError('');

    try {
      await authApi.resetPassword(resetToken, password);
      sessionStorage.removeItem('takecare.resetEmail');
      sessionStorage.removeItem('takecare.resetToken');
      navigate('/login', { replace: true });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to reset your password.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <AuthPageHeading
        eyebrow="Almost there"
        title="Create a new password"
        description="Choose a strong password you haven’t used for this account before."
      />
      <AuthFeedback message={error} />
      <form className="grid gap-[18px]" onSubmit={handleSubmit}>
        <AuthField
          label="New password"
          name="new-password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={8}
          required
        />
        <AuthField
          label="Confirm new password"
          name="confirm-password"
          type="password"
          autoComplete="new-password"
          placeholder="Enter your new password again"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          minLength={8}
          required
        />
        <button className="mt-0.5 flex min-h-[50px] items-center justify-center gap-2.5 rounded-[11px] border-0 bg-gradient-to-r from-[#1d2c80] to-[#334aa8] px-[18px] py-3 text-[.9rem] font-semibold text-white shadow-[0_8px_18px_rgba(30,46,125,0.2)] transition duration-150 hover:-translate-y-px hover:brightness-110 hover:shadow-[0_12px_23px_rgba(30,46,125,0.26)] disabled:cursor-wait disabled:opacity-70 motion-reduce:transition-none" type="submit" disabled={busy}>
          {busy ? 'Updating password…' : 'Update password'}
          {!busy && <span className="text-[1.1rem]" aria-hidden="true">→</span>}
        </button>
      </form>
      <Link className="mt-[23px] inline-flex items-center gap-[7px] text-[.82rem] font-semibold text-[#4a5670] no-underline hover:text-[#263b92]" to="/login"><span aria-hidden="true">←</span> Back to sign in</Link>
    </>
  );
}
