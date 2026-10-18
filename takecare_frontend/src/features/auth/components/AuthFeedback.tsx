interface AuthFeedbackProps {
  message: string;
  tone?: 'error' | 'success';
}

export function AuthFeedback({ message, tone = 'error' }: AuthFeedbackProps) {
  if (!message) return null;

  return (
    <p
      className={`-mt-2 mb-[17px] rounded-[9px] border px-3 py-2.5 text-[.8rem] leading-[1.45] ${
        tone === 'error'
          ? 'border-[#f2cccc] bg-[#fff2f2] text-[#a92e37]'
          : 'border-[#cae9d8] bg-[#effaf4] text-[#246c4a]'
      }`}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      {message}
    </p>
  );
}
