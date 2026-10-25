import { Link, useLocation } from 'react-router-dom';
import { UserCheck, Lock } from 'lucide-react';
import { PROGRAM_DATA } from '../data/programData';

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-[#0e0205]/95 backdrop-blur-xl border-b border-amber-500/20 px-4 py-3 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2.5 group">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-red-800 p-[1.5px] shadow-lg shadow-amber-500/20">
          <div className="w-full h-full bg-[#120306] rounded-[10px] flex items-center justify-center font-cinzel font-bold text-amber-300 text-xs tracking-wider">
            PEC
          </div>
        </div>
        <div className="flex flex-col">
          <span className="font-cinzel font-black text-sm tracking-wider text-amber-200 uppercase leading-none">
            {PROGRAM_DATA.name} 2026
          </span>
          <span className="text-[10px] text-amber-400/80 font-medium tracking-tight">
            THIS SAME JESUS
          </span>
        </div>
      </Link>

      <div className="flex items-center gap-2">
        <Link
          to="/attendance"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            pathname === '/attendance'
              ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30'
              : 'bg-white/5 text-amber-200/90 hover:bg-white/10 border border-amber-500/20'
          }`}
          title="Attendance & Check-in"
        >
          <UserCheck size={14} />
          <span className="hidden sm:inline">Check-in</span>
        </Link>

        <Link
          to="/admin"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            pathname === '/admin'
              ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
              : 'bg-white/5 text-stone-300 hover:bg-white/10 border border-white/10'
          }`}
          title="Admin Portal"
        >
          <Lock size={13} />
          <span className="hidden sm:inline">Admin</span>
        </Link>
      </div>
    </header>
  );
}
