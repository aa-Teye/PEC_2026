import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { Home, Calendar, Share2, UserPlus, Shield, UserCheck, Lock } from 'lucide-react';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Program from './pages/Program';
import Attendance from './pages/Attendance';
import Admin from './pages/Admin';
import Social from './pages/Social';
import { STORAGE_KEY, getLocalRegistrations } from './data/programData';

const NAV_ITEMS = [
  { to: '/',         label: 'Home',     icon: Home },
  { to: '/register', label: 'Register', icon: UserPlus },
  { to: '/program',  label: 'Program',  icon: Calendar },
  { to: '/social',   label: 'Connect',  icon: Share2 },
];

function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="bottom-nav safe-bottom">
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link key={to} to={to} className={`bottom-nav-item${active ? ' active' : ''}`}>
            <Icon size={20} className="nav-icon" />
            <span className="nav-label">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function AppLayout() {
  const { pathname } = useLocation();
  const isAdmin = pathname === '/admin';
  const isAttendance = pathname === '/attendance';
  const isFullscreen = isAdmin;

  // Background auto-sync of un-synced offline registrations to Neon DB
  useEffect(() => {
    const syncOffline = async () => {
      try {
        const local = getLocalRegistrations();
        if (!Array.isArray(local) || local.length === 0) return;

        let hasUpdates = false;
        for (let i = 0; i < local.length; i++) {
          if (!local[i].synced) {
            try {
              const res = await fetch('/api/registrations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(local[i])
              });
              if (res.ok) {
                local[i].synced = true;
                hasUpdates = true;
              }
            } catch (err) {
              // Network offline
            }
          }
        }
        if (hasUpdates) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(local));
        }
      } catch (e) {
        console.error("Auto-sync error:", e);
      }
    };

    const timer = setTimeout(syncOffline, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdmin && <Navbar />}
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/"           element={<Landing />} />
          <Route path="/register"   element={<Register />} />
          <Route path="/program"    element={<Program />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/admin"      element={<Admin />} />
          <Route path="/social"     element={<Social />} />
          <Route path="*"           element={<Landing />} />
        </Routes>
      </main>
      {!isFullscreen && <BottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
