import { useState, useEffect } from 'react';
import {
  Lock, Users, UserCheck, Car, Heart, Search, X, BarChart3,
  Download, FileSpreadsheet, FileText, Trash2, RefreshCw, Eye,
  CheckCircle2, XCircle, MessageSquare, Baby
} from 'lucide-react';
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, LabelList
} from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PROGRAM_DATA, DAYS_OF_CONVENTION, fetchAllRegistrations } from '../data/programData';
import BadgeModal from '../components/BadgeModal';

const CHART_GOLD = '#f59e0b';
const CHART_GRID = 'rgba(255,255,255,0.06)';
const CHART_TICK = { fill: '#a8a29e', fontSize: 10 };
const CHART_TOOLTIP_STYLE = {
  background: '#1c0712',
  border: '1px solid rgba(245,158,11,0.3)',
  borderRadius: 10,
  fontSize: 12,
  color: '#fff'
};

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(() => {
    return sessionStorage.getItem('PEC_ADMIN_AUTH') === 'true';
  });
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState({ connected: false, message: 'Checking...' });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [transportFilter, setTransportFilter] = useState('ALL');
  const [firstTimerFilter, setFirstTimerFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [attendanceSummary, setAttendanceSummary] = useState([]);
  const [rosterDay, setRosterDay] = useState(DAYS_OF_CONVENTION[0]?.id || '');
  const [rosterLogs, setRosterLogs] = useState([]);
  const [rosterSearch, setRosterSearch] = useState('');
  const [loadingRoster, setLoadingRoster] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [prayerTabSearch, setPrayerTabSearch] = useState('');

  const [selectedAttendee, setSelectedAttendee] = useState(null);
  const [selectedPrayer, setSelectedPrayer] = useState(null);

  const checkDb = async () => {
    try {
      const res = await fetch('/api/init');
      if (res.ok) {
        const json = await res.json();
        if (json.status === 'connected') {
          setDbStatus({ connected: true, message: 'Neon DB Connected' });
        } else {
          setDbStatus({ connected: false, message: 'Neon Pending Connection' });
        }
      } else {
        setDbStatus({ connected: false, message: 'Local Storage Mode' });
      }
    } catch {
      setDbStatus({ connected: false, message: 'Local Storage Mode' });
    }
  };

  const loadData = async () => {
    setLoading(true);
    await checkDb();
    try {
      const list = await fetchAllRegistrations();
      setRegistrations(list);
    } catch (e) {
      console.error(e);
    }

    try {
      const res = await fetch('/api/attendance');
      if (res.ok) {
        const json = await res.json();
        setAttendanceSummary(json.summary || []);
      }
    } catch (e) {
      console.error('Could not load attendance summary:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated) {
      document.body.classList.add('full-width-page');
      loadData();
    } else {
      document.body.classList.remove('full-width-page');
    }
    return () => document.body.classList.remove('full-width-page');
  }, [authenticated]);

  useEffect(() => {
    if (!authenticated || !rosterDay) return;
    const loadRosterLogs = async () => {
      setLoadingRoster(true);
      try {
        const res = await fetch(`/api/attendance?day=${encodeURIComponent(rosterDay)}`);
        if (res.ok) {
          const json = await res.json();
          setRosterLogs(json.logs || []);
        }
      } catch (e) {
        console.error('Could not load day roster:', e);
      } finally {
        setLoadingRoster(false);
      }
    };
    loadRosterLogs();
  }, [authenticated, rosterDay]);

  const handleLogin = (e) => {
    e.preventDefault();
    const cleanPin = pin.trim();
    if (cleanPin === '2500' || cleanPin === 'admin2026' || cleanPin === 'eom2026' || cleanPin === (import.meta.env.VITE_ADMIN_PASSWORD || '2500')) {
      sessionStorage.setItem('PEC_ADMIN_AUTH', 'true');
      setAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('PEC_ADMIN_AUTH');
    setAuthenticated(false);
  };

  const handleDelete = async (reg) => {
    if (!window.confirm(`Delete registration for ${reg.fullName}?`)) return;

    try {
      await fetch(`/api/registrations?ticket_code=${reg.ticketCode}`, { method: 'DELETE' });
    } catch {}

    const updated = registrations.filter(r => r.ticketCode !== reg.ticketCode);
    setRegistrations(updated);
    localStorage.setItem('PEC_REGISTRATIONS_DATA', JSON.stringify(updated));
  };

  // Export to CSV
  const exportCsv = () => {
    if (registrations.length === 0) return alert('No registrations to export');

    const headers = [
      'Ticket Code', 'Attendee Type', 'Title', 'Full Name', 'Age', 'Guardian Name', 'Phone', 'Email',
      'Gender', 'Member Status', 'First Timer',
      'Days Attending', 'Mode', 'Needs Transport', 'Location',
      'Invited By', 'Prayer Request', 'Registered At'
    ];

    const rows = registrations.map(r => [
      `"${r.ticketCode || ''}"`,
      `"${r.attendeeType || 'Adult'}"`,
      `"${r.title || ''}"`,
      `"${(r.fullName || '').replace(/"/g, '""')}"`,
      `"${r.ageGroup || ''}"`,
      `"${(r.guardianName || '').replace(/"/g, '""')}"`,
      `"${r.phone || ''}"`,
      `"${r.email || ''}"`,
      `"${r.gender || ''}"`,
      `"${r.memberStatus || ''}"`,
      `"${r.firstTimer || ''}"`,
      `"${(Array.isArray(r.attendanceDays) ? r.attendanceDays.join('; ') : r.attendanceDays || '').replace(/"/g, '""')}"`,
      `"${r.attendanceMode || ''}"`,
      `"${r.needsTransport || ''}"`,
      `"${(r.location || '').replace(/"/g, '""')}"`,
      `"${(r.invitedBy || '').replace(/"/g, '""')}"`,
      `"${(r.prayerRequest || '').replace(/"/g, '""')}"`,
      `"${r.created_at || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PEC_2026_Registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to PDF
  const exportPdf = () => {
    if (registrations.length === 0) return alert('No registrations to export');

    const doc = new jsPDF('landscape');
    doc.setFontSize(16);
    doc.setTextColor(184, 20, 39);
    doc.text('PEC: THIS SAME JESUS — REGISTRATION ROSTER', 14, 15);
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(`Generated on ${new Date().toLocaleString()} • Total: ${registrations.length} Delegates`, 14, 22);

    const bodyData = registrations.map((r, i) => [
      i + 1,
      r.ticketCode || '-',
      `${r.title || ''} ${r.fullName || ''}`.trim(),
      r.phone || '-',
      r.memberStatus || '-',
      r.firstTimer === 'yes' ? 'Yes' : 'No',
      r.needsTransport === 'yes' ? 'Yes' : 'No',
      r.location || '-'
    ]);

    autoTable(doc, {
      startY: 28,
      head: [['#', 'Ticket Code', 'Name', 'Phone', 'Category', '1st Timer', 'Transport', 'Location']],
      body: bodyData,
      theme: 'grid',
      headStyles: { fillColor: [184, 20, 39], textColor: [255, 255, 255] },
      styles: { fontSize: 8 }
    });

    doc.save(`PEC_Registrations_Roster_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const filtered = registrations.filter(r => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      (r.fullName || '').toLowerCase().includes(term) ||
      (r.phone || '').includes(term) ||
      (r.ticketCode || '').toLowerCase().includes(term) ||
      (r.location || '').toLowerCase().includes(term) ||
      (r.prayerRequest || '').toLowerCase().includes(term);

    const matchStatus = statusFilter === 'ALL' || r.memberStatus === statusFilter;
    const matchTransport = transportFilter === 'ALL' || r.needsTransport === transportFilter;
    const matchFirstTimer = firstTimerFilter === 'ALL' || r.firstTimer === firstTimerFilter;
    const matchType = typeFilter === 'ALL' || (r.attendeeType || 'Adult') === typeFilter;

    return matchSearch && matchStatus && matchTransport && matchFirstTimer && matchType;
  });

  const totalCount = registrations.length;
  const firstTimersCount = registrations.filter(r => r.firstTimer === 'yes').length;
  const transportCount = registrations.filter(r => r.needsTransport === 'yes').length;
  const membersCount = registrations.filter(r => (r.memberStatus || '').includes('Member')).length;
  const childrenCount = registrations.filter(r => r.attendeeType === 'Child').length;

  const prayerRegs = registrations
    .filter(r => (r.prayerRequest || '').trim().length > 0)
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

  // Check-ins per conference day, in program order (not just the days that have logs)
  const dayShortLabelCounts = {};
  const dailyAttendanceData = DAYS_OF_CONVENTION.map(d => {
    const found = attendanceSummary.find(s => s.day_label === d.id);
    const base = d.id.split(':')[0].replace('Day ', 'D');
    // Some days (e.g. Day 7 service + Day 7 concert) share the same number -
    // suffix a/b so duplicate sessions aren't shown as identical bars.
    dayShortLabelCounts[base] = (dayShortLabelCounts[base] || 0) + 1;
    const occurrence = dayShortLabelCounts[base];
    const isDuplicated = DAYS_OF_CONVENTION.filter(x => x.id.split(':')[0].replace('Day ', 'D') === base).length > 1;
    return {
      day: isDuplicated ? `${base}${String.fromCharCode(96 + occurrence)}` : base,
      fullLabel: d.label,
      count: Number(found?.count || 0)
    };
  });

  // Cumulative registrations by calendar date
  const regByDate = {};
  registrations.forEach(r => {
    if (!r.created_at) return;
    const key = new Date(r.created_at).toISOString().slice(0, 10);
    regByDate[key] = (regByDate[key] || 0) + 1;
  });
  let runningTotal = 0;
  const registrationTrendData = Object.keys(regByDate).sort().map(key => {
    runningTotal += regByDate[key];
    return {
      date: new Date(key).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      total: runningTotal
    };
  });

  // Registrants ranked by category (member status), largest first
  const statusCounts = {};
  registrations.forEach(r => {
    const key = r.memberStatus || 'Unspecified';
    statusCounts[key] = (statusCounts[key] || 0) + 1;
  });
  const memberStatusData = Object.entries(statusCounts)
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => b.count - a.count);

  // Everyone who registered to attend the selected day, cross-checked against who actually checked in
  const checkedInTicketsForRosterDay = new Set(rosterLogs.map(l => l.ticket_code));
  const rosterTerm = rosterSearch.trim().toLowerCase();
  const dayRoster = registrations
    .filter(r => Array.isArray(r.attendanceDays) && r.attendanceDays.includes(rosterDay))
    .filter(r =>
      !rosterTerm ||
      (r.fullName || '').toLowerCase().includes(rosterTerm) ||
      (r.phone || '').includes(rosterTerm)
    )
    .map(r => {
      const log = rosterLogs.find(l => l.ticket_code === r.ticketCode);
      return { ...r, dayCheckedIn: Boolean(log), dayCheckinTime: log?.checkin_time || null };
    })
    .sort((a, b) => {
      if (a.dayCheckedIn !== b.dayCheckedIn) return a.dayCheckedIn ? 1 : -1;
      return (a.fullName || '').localeCompare(b.fullName || '');
    });

  const rosterExpectedCount = registrations.filter(r => Array.isArray(r.attendanceDays) && r.attendanceDays.includes(rosterDay)).length;
  const rosterCheckedInCount = registrations.filter(r => Array.isArray(r.attendanceDays) && r.attendanceDays.includes(rosterDay) && checkedInTicketsForRosterDay.has(r.ticketCode)).length;
  const rosterNoShowCount = rosterExpectedCount - rosterCheckedInCount;

  const recentRegistrations = [...registrations]
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
    .slice(0, 5);

  const prayerTabTerm = prayerTabSearch.trim().toLowerCase();
  const filteredPrayerRegs = prayerRegs.filter(r =>
    !prayerTabTerm ||
    (r.fullName || '').toLowerCase().includes(prayerTabTerm) ||
    (r.prayerRequest || '').toLowerCase().includes(prayerTabTerm)
  );

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0103]">
        <div className="w-full max-w-sm bg-[#160408] border border-amber-500/30 rounded-3xl p-6 shadow-2xl text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-red-600 p-0.5 mb-4 shadow-lg shadow-red-900/50">
            <div className="w-full h-full bg-[#120306] rounded-[14px] flex items-center justify-center text-amber-400">
              <Lock size={24} />
            </div>
          </div>

          <h2 className="font-cinzel font-black text-xl text-white">PEC Admin Portal</h2>
          <p className="text-xs text-stone-400 mt-1 mb-6">
            Enter passcode to manage PEC registrations & attendance.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter Admin PIN"
                value={pin}
                onChange={e => setPin(e.target.value)}
                autoFocus
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-center text-lg tracking-widest text-white focus:outline-none focus:border-amber-400 font-mono"
              />
              {pinError && (
                <p className="text-xs text-red-400 mt-2 font-medium">
                  Invalid PIN. Please enter correct passcode (2500).
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20"
            >
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090204] text-white p-4 sm:p-6 lg:p-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-cinzel font-black text-xl sm:text-2xl gold-gradient-text">
              PEC 2026 ADMIN
            </span>
          </div>
          <p className="text-xs text-stone-400">
            THIS SAME JESUS (Acts 1:11) • Registration Roster & SMS Delivery Center
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            onClick={loadData}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Sync</span>
          </button>

          <button
            onClick={exportCsv}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/40 hover:bg-emerald-600/30 text-emerald-200 text-xs font-semibold"
          >
            <FileSpreadsheet size={14} />
            <span>Excel/CSV</span>
          </button>

          <button
            onClick={exportPdf}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-600/20 border border-red-500/40 hover:bg-red-600/30 text-red-200 text-xs font-semibold"
          >
            <FileText size={14} />
            <span>PDF Roster</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-stone-400 hover:text-white text-xs font-semibold"
            title="Lock Portal"
          >
            <Lock size={14} />
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-1 mt-5 mb-1 scrollbar-none">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'roster', label: 'Day Roster', icon: UserCheck },
          { id: 'prayer', label: 'Prayer Requests', icon: Heart },
          { id: 'registrations', label: 'Registrations', icon: Users }
        ].map(tab => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/30'
                  : 'bg-black/30 text-stone-300 border-white/10 hover:border-amber-500/30'
              }`}
            >
              <TabIcon size={13} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'overview' && (
      <>
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 my-6">
        <div className="bg-[#150407] border border-amber-500/20 rounded-2xl p-4 shadow-lg">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
            Total Registered
          </span>
          <span className="text-3xl font-mono font-black text-amber-300 mt-1 block">
            {totalCount}
          </span>
          <span className="text-[10px] text-stone-500 mt-1 block">Confirmed Delegates</span>
        </div>

        <div className="bg-[#150407] border border-amber-500/20 rounded-2xl p-4 shadow-lg">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
            First-Timers
          </span>
          <span className="text-3xl font-mono font-black text-red-400 mt-1 block">
            {firstTimersCount}
          </span>
          <span className="text-[10px] text-stone-500 mt-1 block">New Guests to Church</span>
        </div>

        <div className="bg-[#150407] border border-amber-500/20 rounded-2xl p-4 shadow-lg">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
            Needs Transport
          </span>
          <span className="text-3xl font-mono font-black text-amber-400 mt-1 block">
            {transportCount}
          </span>
          <span className="text-[10px] text-stone-500 mt-1 block">Bus / Ride Requests</span>
        </div>

        <div className="bg-[#150407] border border-amber-500/20 rounded-2xl p-4 shadow-lg">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
            Church Members
          </span>
          <span className="text-3xl font-mono font-black text-white mt-1 block">
            {membersCount}
          </span>
          <span className="text-[10px] text-stone-500 mt-1 block">Overcomers Nation</span>
        </div>

        <div className="bg-[#150407] border border-amber-500/20 rounded-2xl p-4 shadow-lg">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
            <Heart size={11} className="text-pink-400" /> Prayer Requests
          </span>
          <span className="text-3xl font-mono font-black text-pink-300 mt-1 block">
            {prayerRegs.length}
          </span>
          <span className="text-[10px] text-stone-500 mt-1 block">Intercessory Queue</span>
        </div>

        <div className="bg-[#150407] border border-amber-500/20 rounded-2xl p-4 shadow-lg">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
            <Baby size={11} className="text-sky-400" /> Children
          </span>
          <span className="text-3xl font-mono font-black text-sky-300 mt-1 block">
            {childrenCount}
          </span>
          <span className="text-[10px] text-stone-500 mt-1 block">Registered as Child</span>
        </div>
      </div>

      {/* Analytics & Insights */}
      <div className="flex items-center gap-2 mb-3 mt-2">
        <BarChart3 size={15} className="text-amber-400" />
        <h2 className="font-cinzel font-black text-sm text-white uppercase tracking-wider">Analytics & Insights</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 mb-3.5">
        <div className="bg-[#150407] border border-amber-500/20 rounded-2xl p-4 shadow-lg">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
            Daily Check-Ins (All 7 Days)
          </span>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={dailyAttendanceData} margin={{ top: 16, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={CHART_GRID} />
                <XAxis dataKey="day" tick={CHART_TICK} axisLine={{ stroke: CHART_GRID }} tickLine={false} />
                <YAxis allowDecimals={false} tick={CHART_TICK} axisLine={false} tickLine={false} width={28} />
                <Tooltip
                  cursor={{ fill: 'rgba(245,158,11,0.08)' }}
                  contentStyle={CHART_TOOLTIP_STYLE}
                  labelFormatter={(_, payload) => payload?.[0]?.payload?.fullLabel || ''}
                />
                <Bar dataKey="count" name="Checked In" fill={CHART_GOLD} radius={[4, 4, 0, 0]} maxBarSize={36}>
                  <LabelList dataKey="count" position="top" fill="#fde68a" fontSize={11} fontWeight={700} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#150407] border border-amber-500/20 rounded-2xl p-4 shadow-lg">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
            Registration Trend (Cumulative)
          </span>
          {registrationTrendData.length === 0 ? (
            <div className="h-[220px] flex items-center justify-center text-xs text-stone-500 italic">
              Not enough data yet.
            </div>
          ) : (
            <div style={{ width: '100%', height: 220 }}>
              <ResponsiveContainer>
                <AreaChart data={registrationTrendData} margin={{ top: 16, right: 8, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="regTrendFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_GOLD} stopOpacity={0.35} />
                      <stop offset="95%" stopColor={CHART_GOLD} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke={CHART_GRID} />
                  <XAxis dataKey="date" tick={CHART_TICK} axisLine={{ stroke: CHART_GRID }} tickLine={false} minTickGap={24} />
                  <YAxis allowDecimals={false} tick={CHART_TICK} axisLine={false} tickLine={false} width={28} />
                  <Tooltip cursor={{ stroke: CHART_GOLD, strokeWidth: 1 }} contentStyle={CHART_TOOLTIP_STYLE} />
                  <Area
                    type="monotone" dataKey="total" name="Total Registered"
                    stroke={CHART_GOLD} strokeWidth={2} fill="url(#regTrendFill)"
                    dot={{ r: 2, fill: CHART_GOLD, strokeWidth: 0 }}
                    activeDot={{ r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 mb-6">
        <div className="bg-[#150407] border border-amber-500/20 rounded-2xl p-4 shadow-lg">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
            Delegates by Category
          </span>
          <div style={{ width: '100%', height: Math.max(160, memberStatusData.length * 50) }}>
            <ResponsiveContainer>
              <BarChart data={memberStatusData} layout="vertical" margin={{ top: 4, right: 36, left: 0, bottom: 4 }}>
                <CartesianGrid horizontal={false} stroke={CHART_GRID} />
                <XAxis type="number" allowDecimals={false} tick={CHART_TICK} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="status" tick={CHART_TICK} axisLine={false} tickLine={false} width={120} />
                <Tooltip cursor={{ fill: 'rgba(245,158,11,0.08)' }} contentStyle={CHART_TOOLTIP_STYLE} />
                <Bar dataKey="count" fill={CHART_GOLD} radius={[0, 4, 4, 0]} maxBarSize={22}>
                  <LabelList dataKey="count" position="right" fill="#fde68a" fontSize={11} fontWeight={700} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#150407] border border-amber-500/20 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
              <Heart size={12} className="text-pink-400" /> Recent Prayer Points & Petitions
            </span>
            {prayerRegs.length > 0 && (
              <span className="text-[10px] font-bold text-pink-300 bg-pink-500/10 border border-pink-500/30 px-2 py-0.5 rounded-full">
                {prayerRegs.length} total
              </span>
            )}
          </div>

          {prayerRegs.length === 0 ? (
            <p className="text-xs text-stone-500 py-8 text-center italic">No prayer requests submitted yet.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {prayerRegs.slice(0, 5).map((r) => {
                  const initials = (r.fullName || '??').split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase();
                  return (
                    <button
                      key={r.ticketCode}
                      onClick={() => setSelectedPrayer(r)}
                      className="text-left bg-black/30 hover:bg-pink-500/5 border border-white/10 hover:border-pink-500/30 rounded-xl p-3 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-200 flex items-center justify-center text-[9px] font-black shrink-0">
                          {initials}
                        </div>
                        <span className="text-[11px] font-bold text-white truncate">{r.fullName}</span>
                      </div>
                      <p className="text-[11px] text-stone-400 italic leading-relaxed line-clamp-2">
                        "{r.prayerRequest}"
                      </p>
                    </button>
                  );
                })}
              </div>
              {prayerRegs.length > 5 && (
                <button
                  onClick={() => setActiveTab('prayer')}
                  className="mt-3 w-full py-2 rounded-xl bg-pink-500/10 border border-pink-500/30 hover:bg-pink-500/20 text-pink-200 text-[11px] font-bold uppercase tracking-wider"
                >
                  View All {prayerRegs.length} Prayer Requests →
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Recent Registrations preview */}
      <div className="bg-[#150407] border border-amber-500/20 rounded-2xl p-4 shadow-lg mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
            <Users size={12} className="text-amber-400" /> Recent Registrations
          </span>
          <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
            {totalCount} total
          </span>
        </div>

        {recentRegistrations.length === 0 ? (
          <p className="text-xs text-stone-500 py-8 text-center italic">No registrations yet.</p>
        ) : (
          <div className="divide-y divide-white/5 border border-white/10 rounded-xl mb-3">
            {recentRegistrations.map(r => (
              <div key={r.ticketCode} className="flex items-center justify-between gap-2 px-3 py-2.5 text-xs">
                <div className="min-w-0">
                  <p className="font-bold text-white truncate flex items-center gap-1.5">
                    {r.title ? `${r.title} ` : ''}{r.fullName}
                    {r.attendeeType === 'Child' && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-sky-300 bg-sky-500/10 border border-sky-500/30 px-1.5 py-0.5 rounded-full shrink-0">
                        <Baby size={9} /> Child
                      </span>
                    )}
                  </p>
                  <p className="text-[10px] text-stone-400 font-mono">{r.phone}</p>
                </div>
                <span className="font-mono font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] shrink-0">
                  {r.ticketCode}
                </span>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => setActiveTab('registrations')}
          className="w-full py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-200 text-[11px] font-bold uppercase tracking-wider"
        >
          View All {totalCount} Registrations →
        </button>
      </div>
      </>
      )}

      {activeTab === 'roster' && (
      <>
      {/* Day Roster - who's expected each day vs who actually checked in */}
      <div className="bg-[#150407] border border-amber-500/20 rounded-2xl p-4 shadow-lg mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Users size={15} className="text-amber-400" />
          <h2 className="font-cinzel font-black text-sm text-white uppercase tracking-wider">Day Roster</h2>
          <span className="text-[10px] text-stone-500">Who's coming &amp; who showed</span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 mb-3.5 scrollbar-none">
          {DAYS_OF_CONVENTION.map(d => (
            <button
              key={d.id}
              type="button"
              onClick={() => setRosterDay(d.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                rosterDay === d.id
                  ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/30'
                  : 'bg-black/40 text-stone-300 border-white/10 hover:border-amber-500/30'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2.5 mb-3.5">
          <div className="bg-black/30 border border-white/10 rounded-xl p-3 text-center">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Expected</span>
            <span className="text-xl font-mono font-black text-white mt-0.5 block">{rosterExpectedCount}</span>
          </div>
          <div className="bg-black/30 border border-emerald-500/20 rounded-xl p-3 text-center">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Checked In</span>
            <span className="text-xl font-mono font-black text-emerald-400 mt-0.5 block">{rosterCheckedInCount}</span>
          </div>
          <div className="bg-black/30 border border-red-500/20 rounded-xl p-3 text-center">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">No-Show (so far)</span>
            <span className="text-xl font-mono font-black text-red-400 mt-0.5 block">{rosterNoShowCount}</span>
          </div>
        </div>

        <div className="relative mb-3">
          <Search size={14} className="absolute left-3 top-2.5 text-stone-400" />
          <input
            type="text"
            placeholder="Search this day's roster by name or phone..."
            value={rosterSearch}
            onChange={e => setRosterSearch(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {loadingRoster ? (
          <p className="text-xs text-stone-500 py-6 text-center italic">Loading check-ins for this day...</p>
        ) : dayRoster.length === 0 ? (
          <p className="text-xs text-stone-500 py-6 text-center italic">
            {rosterExpectedCount === 0 ? 'No one registered to attend this day.' : 'No matches in this day\'s roster.'}
          </p>
        ) : (
          <div className="divide-y divide-white/5 max-h-80 overflow-y-auto border border-white/10 rounded-xl">
            {dayRoster.map(r => (
              <div key={r.ticketCode} className="flex items-center justify-between gap-2 px-3 py-2.5 text-xs">
                <div className="min-w-0">
                  <p className="font-bold text-white truncate flex items-center gap-1.5">
                    {r.title ? `${r.title} ` : ''}{r.fullName}
                    {r.attendeeType === 'Child' && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-sky-300 bg-sky-500/10 border border-sky-500/30 px-1.5 py-0.5 rounded-full shrink-0">
                        <Baby size={9} /> Child
                      </span>
                    )}
                  </p>
                  <p className="text-[10px] text-stone-400 font-mono">{r.phone} &bull; {r.ticketCode}</p>
                </div>
                {r.dayCheckedIn ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 rounded-full shrink-0">
                    <CheckCircle2 size={11} />
                    Checked In{r.dayCheckinTime ? ` ${new Date(r.dayCheckinTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-red-300 bg-red-500/10 border border-red-500/30 px-2 py-1 rounded-full shrink-0">
                    <XCircle size={11} />
                    Not Checked In
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      </>
      )}

      {activeTab === 'prayer' && (
      <div className="bg-[#150407] border border-amber-500/20 rounded-2xl p-4 shadow-lg mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-stone-200 uppercase tracking-wider flex items-center gap-1.5">
            <Heart size={14} className="text-pink-400" /> All Prayer Points & Petitions
          </span>
          <span className="text-[10px] font-bold text-pink-300 bg-pink-500/10 border border-pink-500/30 px-2 py-0.5 rounded-full">
            {prayerRegs.length} total
          </span>
        </div>

        <div className="relative mb-3.5">
          <Search size={14} className="absolute left-3 top-2.5 text-stone-400" />
          <input
            type="text"
            placeholder="Search prayer requests by name or keyword..."
            value={prayerTabSearch}
            onChange={e => setPrayerTabSearch(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {filteredPrayerRegs.length === 0 ? (
          <p className="text-xs text-stone-500 py-10 text-center italic">
            {prayerRegs.length === 0 ? 'No prayer requests submitted yet.' : 'No prayer requests match your search.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {filteredPrayerRegs.map((r) => {
              const initials = (r.fullName || '??').split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase();
              return (
                <button
                  key={r.ticketCode}
                  onClick={() => setSelectedPrayer(r)}
                  className="text-left bg-black/30 hover:bg-pink-500/5 border border-white/10 hover:border-pink-500/30 rounded-xl p-3 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-200 flex items-center justify-center text-[9px] font-black shrink-0">
                      {initials}
                    </div>
                    <span className="text-[11px] font-bold text-white truncate">{r.fullName}</span>
                  </div>
                  <p className="text-[11px] text-stone-400 italic leading-relaxed line-clamp-2">
                    "{r.prayerRequest}"
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </div>
      )}

      {activeTab === 'registrations' && (
      <>
      {/* Filter & Search Bar */}
      <div className="bg-[#130306] border border-white/10 rounded-2xl p-4 mb-6 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-3 text-stone-400" />
            <input
              type="text"
              placeholder="Search by name, phone, ticket code, area, or prayer request..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="Overcomers Member">Overcomers Member</option>
              <option value="Visitor / Guest">Visitor / Guest</option>
            </select>

            <select
              value={firstTimerFilter}
              onChange={e => setFirstTimerFilter(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
            >
              <option value="ALL">All First-Timers</option>
              <option value="yes">First-Timers Only</option>
              <option value="no">Non-First-Timers</option>
            </select>

            <select
              value={transportFilter}
              onChange={e => setTransportFilter(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
            >
              <option value="ALL">All Transport</option>
              <option value="yes">Needs Transport</option>
              <option value="no">No Transport</option>
            </select>

            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
            >
              <option value="ALL">Adults & Children</option>
              <option value="Adult">Adults Only</option>
          </div>
        </div>

        <div className="text-xs text-stone-400">
          Showing <strong className="text-white">{filtered.length}</strong> of {registrations.length} registered delegates
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-[#130306] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/40 text-stone-400 uppercase text-[10px] tracking-wider border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Delegate</th>
                <th className="py-3 px-4">Ticket</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">1st Timer</th>
                <th className="py-3 px-4">Transport</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-stone-500 italic">
                    No delegates found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((reg) => (
                  <tr key={reg.ticketCode} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">
                        {reg.title ? `${reg.title} ` : ''}{reg.fullName}
                      </div>
                      {reg.email && <div className="text-[10px] text-stone-400">{reg.email}</div>}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                        {reg.ticketCode}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-300 font-mono">
                      {reg.phone}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[11px] text-stone-300 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                        {reg.memberStatus || 'Delegate'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {reg.firstTimer === 'yes' ? (
                        <span className="px-2 py-0.5 bg-red-500/20 border border-red-500/40 text-red-300 rounded text-[10px] font-bold">
                          1st Timer
                        </span>
                      ) : (
                        <span className="text-stone-500 text-[10px]">No</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {reg.needsTransport === 'yes' ? (
                        <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded text-[10px] font-bold flex items-center gap-1 w-fit">
                          <Car size={10} /> Yes
                        </span>
                      ) : (
                        <span className="text-stone-500 text-[10px]">No</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-stone-400">
                      {reg.location || '-'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedAttendee(reg)}
                          className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-colors"
                          title="View & Download Pass"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(reg)}
                          className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
                          title="Delete Registration"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}

      {/* Delegate Badge Modal */}
      {selectedAttendee && (
        <BadgeModal
          attendee={selectedAttendee}
          onClose={() => setSelectedAttendee(null)}
        />
      )}

      {/* Prayer Request Full-View Modal */}
      {selectedPrayer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setSelectedPrayer(null)}
        >
          <div
            className="w-full max-w-md bg-[#160408] border border-pink-500/30 rounded-3xl p-6 shadow-2xl relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPrayer(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full bg-pink-500/20 text-pink-200 flex items-center justify-center font-black text-sm shrink-0">
                {(selectedPrayer.fullName || '??').split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-white text-sm">
                  {selectedPrayer.title ? `${selectedPrayer.title} ` : ''}{selectedPrayer.fullName}
                </p>
                <p className="text-xs text-stone-400 font-mono">{selectedPrayer.phone}</p>
              </div>
            </div>

            <div className="bg-black/30 border border-pink-500/20 rounded-xl p-4">
              <p className="text-sm text-stone-200 leading-relaxed italic whitespace-pre-wrap">
                "{selectedPrayer.prayerRequest}"
              </p>
            </div>

            <button
              onClick={() => setSelectedPrayer(null)}
              className="mt-4 w-full py-2.5 rounded-xl bg-pink-500/10 border border-pink-500/30 hover:bg-pink-500/20 text-pink-200 text-xs font-bold uppercase tracking-wider"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
