import { Link, Outlet } from 'react-router-dom';
import logo from '../../../assets/logo.png';

export function AuthLayout() {
  return (
    <main className="relative isolate grid min-h-full overflow-hidden place-items-center bg-[#111a38] px-6 pt-12 pb-[70px] max-[620px]:px-[15px] max-[620px]:pt-[26px] max-[620px]:pb-[55px]">
      <div
        className="absolute -z-10 inset-0 scale-[1.025] bg-cover bg-[center_42%]"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2200&q=88")' }}
        aria-hidden="true"
      />
      <div
        className="absolute -z-10 inset-0 bg-[radial-gradient(ellipse_at_50%_44%,rgba(18,35,74,0.25)_0%,rgba(6,16,42,0.62)_68%),linear-gradient(115deg,rgba(8,19,48,0.74),rgba(8,16,38,0.5)_48%,rgba(8,18,42,0.73))] backdrop-saturate-[.75]"
        aria-hidden="true"
      />
      <div className="relative w-full max-w-[472px]">
        <section className="w-full rounded-2xl border border-white/75 bg-white/[.93] px-6 pt-6 pb-4 shadow-[0_34px_90px_rgba(3,13,39,0.34),0_2px_10px_rgba(4,15,38,0.08)] backdrop-blur-[18px] max-[620px]:rounded-[20px] max-[620px]:px-[22px] max-[620px]:pt-[29px] max-[620px]:pb-[21px]" aria-label="TakeCare account access">
          <Link className="mx-auto -mt-[5px] mb-[25px] flex justify-center max-[620px]:mb-[21px]" to="/login" aria-label="TakeCare home">
            <img className="block h-auto w-44 max-[620px]:w-[156px]" src={logo} alt="TakeCare Manpower Services" />
          </Link>
          <Outlet />
          <p className="mt-6 border-t border-[#e8ebf1] pt-4 text-center text-[.7rem] text-[#8b94a5]">
            Secure access for the people who make work happen.
          </p>
        </section>
        <p className="absolute top-[calc(100%+24px)] m-0 w-full text-center text-[.82rem] tracking-[.035em] text-white/75">
          Connecting people. Building stronger teams.
        </p>
      </div>
    </main>
  );
}
