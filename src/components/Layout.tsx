import { Outlet, Link, useLocation } from 'react-router-dom';
import { BookOpen, Activity, LayoutDashboard, Database } from 'lucide-react';
import { cn } from '../lib/utils';

export function Layout() {
  const location = useLocation();

  const links = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/resources', label: 'Study Material', icon: Database },
  ];

  return (
    <div className="flex h-screen bg-[#F5F5F0] text-[#4A4A3A] font-sans p-6 gap-6 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col gap-8 flex-shrink-0">
        <div className="px-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#5A5A40] rounded-xl flex items-center justify-center text-white font-serif text-xl">F</div>
          <h1 className="text-2xl font-serif font-bold text-[#5A5A40] tracking-tight">FocusNEET</h1>
        </div>
        
        <nav className="flex flex-col gap-2 flex-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 font-semibold",
                  isActive 
                    ? "bg-white text-[#5A5A40] shadow-sm" 
                    : "text-[#4A4A3A]/70 hover:bg-white/50 hover:text-[#5A5A40]"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-[#5A5A40]" : "opacity-70")} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 bg-[#E4E3E0] rounded-3xl mt-auto">
          <p className="text-xs uppercase tracking-widest font-bold mb-2 opacity-60">Study Approach</p>
          <p className="text-sm font-serif text-[#5A5A40]">NCERT Grounded</p>
          <p className="text-xs mt-2 opacity-70">Strictly mapped to Class 11/12 biology, physics, and chemistry syllabus.</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pr-2 custom-scrollbar flex flex-col min-h-0">
        <Outlet />
      </main>
    </div>
  );
}
