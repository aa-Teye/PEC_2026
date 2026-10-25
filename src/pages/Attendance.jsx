import { useState, useEffect } from 'react';
import {
  UserCheck, Search, CheckCircle2, AlertCircle, Clock,
  Calendar, RefreshCw, Phone, User, ArrowRight
} from 'lucide-react';
import { DAYS_OF_CONVENTION, checkInAttendee } from '../data/programData';

export default function Attendance() {
  const [selectedDay, setSelectedDay] = useState(DAYS_OF_CONVENTION[0]?.id || 'Day 1: 23 Oct');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [stats, setStats] = useState({ totalChecked: 0, dayChecked: 0 });

  const loadData = async () => {
    try {
      const res = await fetch(`/api/attendance?day=${encodeURIComponent(selectedDay)}`);
      if (res.ok) {
        const json = await res.json();
        setRecentLogs(json.logs || []);
        const totalChecked = json.summary?.reduce((acc, curr) => acc + Number(curr.count), 0) || 0;
        const dayItem = json.summary?.find(s => s.day_label === selectedDay);
        setStats({
          totalChecked,
          dayChecked: Number(dayItem?.count || (json.logs?.length || 0))
        });
      }
    } catch {
      const localLogs = JSON.parse(localStorage.getItem('PEC_ATTENDANCE_DATA') || '[]');
      const dayLogs = localLogs.filter(l => l.day_label === selectedDay);
      setRecentLogs(dayLogs);
      setStats({
        totalChecked: localLogs.length,
        dayChecked: dayLogs.length
      });
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedDay]);

  const handleCheckIn = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    setLoading(true);
    setResult(null);

    const term = searchInput.trim();
    const isCode = term.toUpperCase().startsWith('PEC-');

    try {
      const payload = isCode
        ? { ticketCode: term.toUpperCase(), dayLabel: selectedDay }
        : { phone: term, dayLabel: selectedDay };

      const res = await checkInAttendee(payload);
      setResult(res);

      if (res.success) {
        setSearchInput('');
        loadData();
      }
    } catch (err) {
      setResult({ success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 pb-24 text-white">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 bg-gradient-to-b from-[#25050b] to-[#0e0205] border-b border-amber-500/20 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <UserCheck size={12} className="text-amber-400" />
          <span>Live Check-In Terminal</span>
        </div>
        <h1 className="font-cinzel font-black text-2xl tracking-wide gold-gradient-text uppercase">
          ATTENDANCE VERIFICATION
        </h1>
        <p className="text-xs text-stone-300 max-w-xs mx-auto mt-1">
          Scan QR codes or search by phone/ticket code for instant admission.
        </p>
      </div>

      <div className="p-4 space-y-4">
        {/* Day Selector */}
        <div className="bg-[#150407] border border-amber-500/20 rounded-2xl p-3.5">
          <label className="block text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Calendar size={13} /> Active Conference Day
          </label>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {DAYS_OF_CONVENTION.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => { setSelectedDay(d.id); setResult(null); }}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedDay === d.id
                    ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/30'
                    : 'bg-black/40 text-stone-300 border-white/10 hover:border-amber-500/30'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#150407] border border-white/10 rounded-2xl p-3.5 text-center">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              Checked In ({selectedDay.split(':')[0]})
            </span>
            <span className="text-2xl font-mono font-black text-amber-300 mt-0.5 block">
              {stats.dayChecked}
            </span>
          </div>

          <div className="bg-[#150407] border border-white/10 rounded-2xl p-3.5 text-center">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              Total Check-Ins
            </span>
            <span className="text-2xl font-mono font-black text-white mt-0.5 block">
              {stats.totalChecked}
            </span>
          </div>
        </div>

        {/* Search / Scan Box */}
        <div className="bg-gradient-to-br from-[#1c050a] to-[#120306] border border-amber-500/30 rounded-2xl p-4 shadow-xl">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Search size={14} className="text-amber-400" /> Enter Ticket Code or Phone Number
          </h2>

          <form onSubmit={handleCheckIn} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. PEC-123456 or 0244123456"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                autoFocus
                className="w-full bg-black/60 border border-amber-500/40 rounded-xl px-4 py-3.5 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 font-mono tracking-wider"
              />
              <button
                type="submit"
                disabled={loading || !searchInput.trim()}
                className="absolute right-2 top-2 bottom-2 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-bold text-xs flex items-center gap-1 transition-all"
              >
                {loading ? <RefreshCw size={14} className="animate-spin" /> : <span>CHECK IN</span>}
              </button>
            </div>
          </form>

          {/* Feedback Result Card */}
          {result && (
            <div className={`mt-4 p-4 rounded-xl border text-left transition-all ${
              result.success
                ? result.alreadyCheckedIn
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                  : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                : 'bg-red-500/15 border-red-500/40 text-red-200'
            }`}>
              <div className="flex items-start gap-2.5">
                {result.success ? (
                  result.alreadyCheckedIn ? (
                    <Clock size={20} className="text-amber-400 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 size={20} className="text-emerald-400 shrink-0 mt-0.5" />
                  )
                ) : (
                  <AlertCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
                )}

                <div className="flex-1">
                  <h3 className="font-bold text-sm">
                    {result.success
                      ? result.alreadyCheckedIn
                        ? 'Already Checked In!'
                        : 'Check-In Successful!'
                      : 'Check-In Failed'}
                  </h3>
                  <p className="text-xs mt-0.5 opacity-90">
                    {result.message || result.error}
                  </p>

                  {result.attendee && (
                    <div className="mt-2.5 pt-2 border-t border-white/10 text-xs text-white space-y-0.5">
                      <p><strong>Name:</strong> {result.attendee.title} {result.attendee.fullName || result.attendee.full_name}</p>
                      <p><strong>Ticket:</strong> <span className="font-mono text-amber-300 font-bold">{result.attendee.ticketCode || result.attendee.ticket_code}</span></p>
                      <p><strong>Status:</strong> {result.attendee.memberStatus || result.attendee.member_status}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recent Check-Ins List */}
        <div className="bg-[#150407] border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-stone-200 uppercase tracking-wider flex items-center gap-1.5">
              <Clock size={13} className="text-amber-400" /> Recent Check-Ins ({selectedDay.split(':')[0]})
            </h3>
            <button
              onClick={loadData}
              className="text-stone-400 hover:text-stone-200 p-1 rounded-md"
              title="Refresh"
            >
              <RefreshCw size={13} />
            </button>
          </div>

          {recentLogs.length === 0 ? (
            <p className="text-xs text-stone-500 py-6 text-center italic">
              No check-ins recorded yet for {selectedDay}.
            </p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {recentLogs.map((log, idx) => (
                <div
                  key={idx}
                  className="bg-black/30 border border-white/5 rounded-xl p-2.5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-[10px]">
                      {(log.full_name || 'D')[0]}
                    </div>
                    <div>
                      <p className="font-bold text-white leading-tight">{log.full_name || 'Registered Delegate'}</p>
                      <p className="text-[10px] font-mono text-amber-400">{log.ticket_code}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-stone-400">
                    {new Date(log.checkin_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
