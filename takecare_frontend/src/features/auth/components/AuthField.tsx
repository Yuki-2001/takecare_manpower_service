import { useState } from 'react';
import type { InputHTMLAttributes } from 'react';

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function AuthField({ label, error, type = 'text', id, ...inputProps }: AuthFieldProps) {
  const [visible, setVisible] = useState(false);
  const fieldId = id ?? inputProps.name;
  const isPassword = type === 'password';

  return (
    <div className="grid gap-2">
      <label className="text-[.81rem] font-semibold text-[#25314b]" htmlFor={fieldId}>{label}</label>
      <div className={`flex min-h-[49px] items-center rounded-[11px] border bg-white/[.88] transition-[border-color,box-shadow,background-color] duration-150 focus-within:border-[#263b92] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(38,59,146,0.11)] ${
        error ? 'border-[#d75050]' : 'border-[#dce2eb]'
      }`}>
        <input
          {...inputProps}
          id={fieldId}
          type={isPassword && visible ? 'text' : type}
          className="w-full min-w-0 border-0 bg-transparent px-[14px] py-[13px] text-[.9rem] text-[#172344] outline-none placeholder:text-[#a4adbc]"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${fieldId}-error` : undefined}
        />
        {isPassword && (
          <button
            className="mr-3 flex-none cursor-pointer border-0 bg-transparent p-[5px] text-[.74rem] font-semibold text-[#69748b]"
            type="button"
            onClick={() => setVisible((current) => !current)}
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            {visible ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
      {error && <p className="-mt-[3px] m-0 text-[.76rem] text-[#bd3434]" id={`${fieldId}-error`}>{error}</p>}
    </div>
  );
}
