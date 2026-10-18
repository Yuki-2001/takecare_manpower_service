import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-full bg-[#f4f6f9]">
      <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Header onMenuClick={() => setSidebarOpen((current) => !current)} />
        <main className="w-full flex-1 px-8 pt-[30px] pb-10 max-[900px]:px-[22px] max-[900px]:pt-[25px] max-[900px]:pb-8 max-[620px]:px-[13px] max-[620px]:pt-5 max-[620px]:pb-[26px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
