interface AuthPageHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function AuthPageHeading({
  eyebrow,
  title,
  description,
}: AuthPageHeadingProps) {
  return (
    <div className="mb-2 text-center">
      {/* <p className="m-0 text-xs font-bold tracking-[.16em] text-[#9a6b19] uppercase">
        {eyebrow}
      </p> */}

      <h1 className="my-2 text-xl sm:text-3xl leading-[1.15] font-bold tracking-[-.045em] text-[#172344]">
        {title}
      </h1>

      <p className="mx-auto my-0 max-w-[350px] text-sm leading-[1.55] text-[#69748b]">
        {description}
      </p>
    </div>
  );
}
